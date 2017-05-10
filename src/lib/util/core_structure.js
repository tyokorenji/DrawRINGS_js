"use strict";
import * as structuresJson from 'json-loader!../../resource/structures.json';
/**
 * "Structure"機能で、選択された構造のKCF形式をJSONから検索するための関数
 * @param coreStructureName:選択された構造の名前
 * @returns child.fileData:coreStructureNameに対応したKCF形式
 */
let getCoreStructure = function(coreStructureName) {
    for (let i = 0; i<structuresJson.children.length; i++) {
        let child = structuresJson.children[i];
        if(coreStructureName === child.file){
            return child.fileData;
        }
    }
};

export { getCoreStructure }