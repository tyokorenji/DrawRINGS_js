"use strict";
import * as stageEdit from  './edit_stage';
import { createRepeatBracket, setBracket, searchFourCorner } from './create_bracket';

function eraseNode(target, nodes, structures, brackets, stage){
    let rootNode = nodes[0];
    let nodes_id = 1;
    let structure_id = 1;
    for(let i = 0; i < structures.length; i++){
        if(rootNode.xCood < structures[i].parentNode.xCood){
            rootNode = structures[i].parentNode;
        }
    }
    recursiveSearchChildNode(rootNode, target);
    for(let i = 0; i < nodes.length; i++){
        if(target === nodes[i].sprite){
            stageEdit.removeStage(stage, target);
            nodes.splice(i, 1);
        }
    }
    for(let i = 0; i < structures.length; i++){
        if(target === structures[i].parentNode.sprite || target === structures[i].childNode.sprite){
            stageEdit.removeStage(stage, structures[i].edgeInformation);
            stageEdit.removeStage(stage, structures[i].edge);
            structures.splice(i, 1);
            i--;
        }
    }
    for(let i = 0; i < nodes.length; i++){
        nodes[i].id = nodes_id;
        nodes_id++;
    }
    for(let i = 0; i < structures.length; i++){
        structures[i].structureId = structure_id;
        structure_id++;
    }
    for(let i = 0; i < brackets.length; i++){
        let repeatNodes = brackets[i];
        for (let j = 0; j < repeatNodes.repeatNodes.length; j++) {
            if (target.parentNode === repeatNodes.repeatNodes[j]) {
                stageEdit.removeStage(stage, repeatNodes.startBracket.bracketShape);
                stageEdit.removeStage(stage, repeatNodes.endBracket.bracketShape);
                stageEdit.removeStage(stage, repeatNodes.startBracket.numOfRepeatShape);
                stageEdit.stageUpdate(stage);
                let resultsFourCorner = searchFourCorner(repeatNodes.repeatNodes);
                if (target.parentNode === resultsFourCorner[1]) {
                    resultsFourCorner[3].bracket = null;
                }
                else if (target.parentNode === resultsFourCorner[3]) {
                    resultsFourCorner[i].bracket = null;
                }
                else {
                    resultsFourCorner[3].bracket = null;
                    resultsFourCorner[1].bracket = null;
                }
            }
        }
        brackets.splice(i, 1);
        i--;
    }
    return [nodes, structures, brackets];
}

function recursiveSearchChildNode(parentNode, target){
    if(parentNode.childNode.length === 0){
        return;
    }
    else {
        for (let i = 0; i < parentNode.childNode.length; i++) {
            if (parentNode.childNode[i].sprite === target) {
                parentNode.childNode.splice(i, 1);
                i--;
            }
        }
        if (parentNode.childNode.length === 0) {
            return;
        }
        else {
            for (let i = 0; i < parentNode.childNode.length; i++) {
                recursiveSearchChildNode(parentNode.childNode[i], target);
            }
        }
    }
}

export { eraseNode };