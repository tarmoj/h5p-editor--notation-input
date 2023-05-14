import React, {useEffect, useRef, useState} from 'react';
import {NotationInput} from "./vexflow-react-components/NotationInput";
import {
    defaultNotationInfo,
    parseLilypondDictation,
    notationInfoToLyString
} from "./vexflow-react-components/notationUtils";


// temporary -  for testing with Preview.js:


const oldLyString = ` \\clef "treble" \\key c \\major \\time 4/4  
    `;

const translations =   {
    "explanation": "Kuulake ja noteerige",
    "euSupportText": "Projekti toetab Euroopa Sotsiaalfond",
    "correct": "Õige",
    "wrong": "Vale",
    "check": "Kontrolli",
    "showHide": "Näita/peida",
    "key": "Helistik", // Notation input
    "clef": "Võti",
    "treble": "viiulivõti",
    "bass": "bassivõti",
    "time": "Taktimõõt",
    "textInput": "Tekstiline sisestus",
    "lilypondNotationLabel" : "Lilypondi notatsioon (absoluutsed kõrgused, saksa süsteemi noodinimed (g, as, b, h))",
    "engrave": "Kuva",
    "keyboardShortcuts" : "Klahvikombinatsioonid", // shortcuts' dialog
    "youCanUseFollowingShortcuts" : "Võite kasutada järgmisi klahvikombinatsioone, et sisestada või muuta noote:",
    "clickSomewhereOnTheScreen" : "Et klahvikombinatsioonid aktiveerida, klõpsake esmalt ükskõik kuhu aknas!",
    "noteNameInfo" :"Noodid: klahvid c, d, e, f, g, a, b, h. Suurtähed (C, D, jne) annavad 2. oktavi, ctrl + noodinimi väikse oktavi.",
    "durationInfo":    "Vältused: 1 - täisnoot, 2 - poolnoot, 4 -  veerandnoot, 8 -  kaheksandik, 6 -  kuueteistkümnendik",
    "rest": "Paus",
    "dotInfo" : "Punkt (lisa või eemalda)",
    "tieInfo": "Pide (lisa või eemalda)",
    "raiseLowerInfo": "Noot üles/alla (enharmoonilised vasted k.a.): nool üles või alla",
    "navigationInfo": "Liikumine:  nool paremale/vasakule liigub järgmise/eelmise noodi peale, ctrl+nool järmisesse/eelmisesse takti.",
    "clickBetweenNotes": "Klõpsa nootide vahele, et lisada noote takti keskel.",
    "engraveInfo": "Näita notatsiooni (lilypond aknas): Ctrl + Enter",

    "emptyLilypondString": "Lilypondi teks on tühi!", // notationUtils
    "isNotRecognizedNote" : " pole teadaolev täht või vältus.",
    "durationNotKnown" : "Võõras vältus! ",
    "disclaimerText": "NB! See ei ole ametlik H5P.org sisutüüp. Kõigi probleemide korral pöörduge autori poole: tarmo.johannes@muba.edu.ee",
};


export default function Main( {lyString=oldLyString , setLyString, t= translations }) {

    const [notationInfo, setNotationInfo] =useState(defaultNotationInfo);
    const [ selectedNote, setSelectedNote] = useState({ measure: 0, note:-1, staff:0 } );


    useEffect( ()=> {
        //console.log("Start. Old lystring: ", lyString);
        const seedNotation =lyString ?  parseLilypondDictation(lyString) : defaultNotationInfo;
        setNotationInfo(seedNotation);
    }, [] ); // set the proper starting content for NotationInput


    useEffect(()=>{
        if (notationInfo) {
            const newLyString = notationInfoToLyString(notationInfo);
            if (setLyString && newLyString && newLyString !== oldLyString ) {
                setLyString(newLyString); // setLyString is not a function in Preview
                //console.log("new lyString: ", newLyString, setLyString);
            }
        }
    }, [notationInfo]);

    return (
        <div>
            <NotationInput lyStart={oldLyString}
                           setNotationInfo={setNotationInfo}
                           notationInfo = {notationInfo}
                           selectedNote={selectedNote} setSelectedNote={setSelectedNote}
                           t = {t}
                           resizeFunction={()=>console.log("No resize")  }
                           showTimeAndClefInput={true}
            />


        </div>
    );
}

