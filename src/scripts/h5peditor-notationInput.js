import '../styles/h5peditor-notationInput.css';
import React from "react";
import * as ReactDOM from "react-dom";
import Main from "./Main";
import {parseLilypondString, decodeHtml} from "./vexflow-react-components/notationUtils";

const $ = H5P.jQuery;


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

    this.oldLyString = decodeHtml(params);

    //console.log("Editor constructor: old LyString:", this.oldLyString);

    // translations

    this.l10n = H5PEditor.language["H5PEditor.NotationInput"].libraryStrings;

    // DOM
    this.$container = $('<div>', {
      class: 'field h5peditor-notationInput'
    });

    // lilypondInput
    this.lyString = "";

    this.setLyString = lyString => {
      //console.log("reported lyString: ", lyString);
      this.lyString=lyString;
      this.validate();
    }

    //const resize = () => { console.log("resize function called", this); this.trigger("resize"); } // to be forwarded to React components

    // Errors (or add your own)
    this.$errors = this.$container.find('.h5p-errors');

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
        <Main  lyString={this.oldLyString}  setLyString={this.setLyString}  t={  this.l10n }  />
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
    // this gets fired every time any of the inputs is changed
    const result = parseLilypondString(this.lyString);

    console.log("Validate called, result: ", result);

    this.$errors.html('');

    //console.log("Result is: ", ok, valueArray);
    if (!result) {
      console.log("Something wrong in lilypond");
      this.$errors.append(H5PEditor.createError(this.l10n.lilypondStringNotCorrect || "Error in lilypond input!"));
      return false;
    } else {
      this.setValue(this.field, this.lyString);
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
  // handleFieldChange() {
  //   console.log("Field change", this.changes);
  //   this.params = this.fieldInstance.params;
  //   this.changes.forEach((change) => {
  //     change(this.params);
  //   });
  // }
}
