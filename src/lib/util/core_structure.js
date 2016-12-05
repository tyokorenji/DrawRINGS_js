"use strict";
import * as structuresJson from 'json-loader!../../resource/structures.json';

let getCoreStructure = function(coreStructureName) {
    for (let i = 0; i<structuresJson.children.length; i++) {
        let child = structuresJson.children[i];
        if(coreStructureName === child.file){
            return child.fileData;
        }
    }
};

export { getCoreStructure }