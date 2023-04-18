import '../styles/h5peditor-notationInput.css';
import React from "react";
import * as ReactDOM from "react-dom";
import {EditorNotationInput} from "./components/EditorNotationInput";

const $ = H5P.jQuery;

// temporary -
const correct = `
    \\clef "treble" \\key c \\major \\time 2/4  
    c'4 c'8 d'8 | 
    e'4 e'8 f'8 | 
    g'8 a'8 g'8 f'8 | 
    g'4 g'4 \\bar "|."             
        `;

const start = ` \\clef "treble" \\key c \\major \\time 2/4  
    c'4 `;

/** Class for Boilerplate H5P widget */
export default class NotationWidget {

  /**
   * @class
   * @param {object} parent Parent element in semantics.
   * @param {object} field Semantics field properties.
   * @param {object} params Parameters entered in editor form.
   * @param {function} setValue Callback to set parameters.
   */
  constructor(parent, field, params, setValue) {
    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;

    console.log("Editor constructor: params, values:", params, field, setValue);


    // Callbacks to call when parameters change
    this.changes = [];

    // Let parent handle ready callbacks of children
    this.passReadies = true;

    // translations

    this.l10n = H5PEditor.language["H5PEditor.NotationInput"].libraryStrings;

    // DOM
    this.$container = $('<div>', {
      class: 'field h5peditor-inputNotation'
    });

    // Instantiate original field (or create your own and call setValue)
    // probably this creates the text field and I need to have something like createItem in degreeInput
    this.fieldInstance = new H5PEditor.widgets[this.field.type](this.parent, this.field, this.params, this.setValue);
    //this.fieldInstance.appendTo(this.$container);

    // lilypondInput
    this.lyString = "";

    this.setLyString = lyString => { console.log("reported lyString: ", lyString); this.lyString=lyString; this.setValue(this.field, lyString) }

    //const resize = () => { console.log("resize function called", this); this.trigger("resize"); } // to be forwarded to React components



    // Relay changes
    if (this.fieldInstance.changes) {
      this.fieldInstance.changes.push(() => {
        this.handleFieldChange();
      });
    }

    // Errors (or add your own)
    this.$errors = this.$container.find('.h5p-errors');

    // Use H5PEditor.t('H5PEditor.Boilerplate', 'foo'); to output translatable strings
  }





  /**
   * Append field to wrapper. Invoked by H5P core.
   *
   * @param {H5P.jQuery} $wrapper Wrapper.
   */
  appendTo($wrapper) {

    // Add header:
    $('<span>', {
      'class': 'h5peditor-label',
      html: this.field.label
    }).appendTo(this.$container);

    // Add description:
    $('<span>', {
      'class': 'h5peditor-field-description',
      html: this.field.description
    }).appendTo(this.$container)

    // Create render root
    this.root = document.createElement("div");
    this.$container.append(this.root);

    // this.root is the container for React content
    ReactDOM.render(
      <div>
        <EditorNotationInput setLyString={this.setLyString}  t={  this.l10n }  />

      </div>,
      this.root
    );

    $('<div>', {id: "errorsDiv", class:"h5p-errors"}).appendTo(this.$container);

    this.$container.appendTo($wrapper);
  }

  /**
   * Validate current values. Invoked by H5P core.
   *
   * @returns {boolean} True, if current value is valid, else false.
   */
  validate() {
    //return this.fieldInstance.validate();
    console.log("Validate called");
    // this gets fired every time any of the inputs is changed

    this.$errors.html('');


    //console.log("Result is: ", ok, valueArray);
    if (!this.lyString) {
      console.log("Something wrong in lilypond");
      this.$errors.append(H5PEditor.createError(this.l10n("wrong")));
      return false;
    } else {
      return this.lyString;
    }

  }



  /**
   * Remove self. Invoked by H5P core.
   */
  remove() {
    this.$container.remove();
  }

  /**
   * Handle change of field.
   */
  handleFieldChange() {
    console.log("Field change", this.changes);
    this.params = this.fieldInstance.params;
    this.changes.forEach((change) => {
      change(this.params);
    });
  }
}
