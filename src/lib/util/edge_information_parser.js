"use strict";

const SEPERATOR = new RegExp("-");

function edgeInformationParser(structure){
    structure.edgeInformationText.match(SEPERATOR);
    return [RegExp.leftContext, RegExp.rightContext];
}

export { edgeInformationParser };　