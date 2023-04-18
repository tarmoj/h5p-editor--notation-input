import '../styles/h5peditor-notationInput.css';
import React from "react";
import * as ReactDOM from "react-dom";
import {EditorNotationInput} from "./components/EditorNotationInput";

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

    console.log("Editor constructor: params, values:", params, self.oldValues);


    // Callbacks to call when parameters change
    this.changes = [];

    // Let parent handle ready callbacks of children
    this.passReadies = true;

    // translations

    this.l10n = H5PEditor.language["H5PEditor.NotationInput"].libraryStrings;
    console.log("Translations: ", this.l10n);

    // DOM
    this.$container = H5P.jQuery('<div>', {
      class: 'h5peditor-inputNotation'
    });

    // Instantiate original field (or create your own and call setValue)
    this.fieldInstance = new H5PEditor.widgets[this.field.type](this.parent, this.field, this.params, this.setValue);
    this.fieldInstance.appendTo(this.$container);

    // Create render root
    this.root = document.createElement("div");
    this.$container.append(this.root);

    // lilypondInput
    this.lyString = "";

    this.setLyString = lyString => { console.log("reported lyString: ", lyString); this.lyString=lyString;}

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

    // this.root is the container for React content
    ReactDOM.render(
      <div>
        <EditorNotationInput setLyString={this.setLyString}  t={  this.l10n }  />

      </div>,
      this.root
    );

    //add some widgets to test with:
    H5P.jQuery('<button>', {
      id: "validateButton",
      class: "button",
      text: "Press me",
      click: () => { console.log("A button") }
    }).appendTo(this.$container);

    this.$container.appendTo($wrapper);
  }

  /**
   * Validate current values. Invoked by H5P core.
   *
   * @returns {boolean} True, if current value is valid, else false.
   */
  validate() {
    //return this.fieldInstance.validate();

    // this gets fired every time any of the inputs is changed

    this.$errors.html('');
    // TODO: add condition for optional parameter



    // somehow mark error -  class wongInput see degreeInput


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
    this.params = this.fieldInstance.params;
    this.changes.forEach((change) => {
      console.log("Parameter change", change);
      change(this.params);
    });
  }
}
