"use strict";

function textClear(){
    let res = confirm("Textarea clear all?");
    if(res === true){
        let textArea = document.getElementById("kcf_format");
        textArea.value = "KCF-Text";
    }
}

export { textClear };