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

    this.oldLyString = params ? decodeHtml(params) : "";

    //console.log("editor params: ", params);
    //console.log("Editor constructor: old LyString:", this.oldLyString);

    // translations

    this.l10n = H5PEditor.language["H5PEditor.NotationInput"].libraryStrings || {
      "explanation": "Listen to the musical excerpt, write down the notation",
      "euSupportText": "The project is supported by European Social Fund",
      "correct": "Correct",
      "wrong": "Wrong",
      "check": "Check",
      "showHide": "Show/hide",
      "key": "Key",
      "clef": "Clef",
      "treble": "treble",
      "bass": "bass",
      "time": "Time",
      "textInput": "Text input",
      "lilypondNotationLabel" : "Lilypond notation (absolute pitches, german nomenclature)",
      "engrave": "Engrave",
      "keyboardShortcuts" : "Keyboard shortcuts",
      "youCanUseFollowingShortcuts" : "You can use the following sohrtcuts to enter or change the music:",
      "clickSomewhereOnTheScreen" : "Click somewhere on the screen first to activate the shortcuts!",
      "noteNameInfo" :"Note names: keys c, d, e, f, g, a, b, h. Uppercase (C, D, etc) stands for 2nd octave, ctrl + note name for the small octave.",
      "durationInfo":    "Durations: 1 - whole note, 2 - halfnote, 4 -  quarter, 8 -  eighths, 6 -  sixteenths",
      "rest": "Rest",
      "dotInfo" : "Dot (add or remove)",
      "tieInfo": "Tie (add or remove)",
      "raiseLowerInfo": "Raise or lower note (enharmonics included): arrow up or down",
      "navigationInfo": "Navigation:  left or right moves to the next note, ctrl+left/right to the next/previous bar.",
      "clickBetweenNotes": "Click between the notes to insert notes in the middle of the bar.",
      "engraveInfo": "show notation (engrave): Ctrl + Enter",

      "emptyLilypondString": "Empty Lilypond string!",
      "isNotRecognizedNote" : " is not a recognized note or keyword.",
      "durationNotKnown" : "Duration not known! ",
      "disclaimerText": "NB! This is not an official H5P.org content type. With any problems please turn to the author tarmo.johannes@muba.edu.ee",
      "lilypondStringNotCorrect": "Lilypond input is not correct!",
      "major": "major",
      "minor": "minor"
    };

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
