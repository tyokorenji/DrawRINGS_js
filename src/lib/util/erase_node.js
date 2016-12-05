"use strict";
import * as stageEdit from  './edit_stage';

function eraseNode(target, nodes, structures, brackets, stage){
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
    for(let i = 0; i < brackets.length; i++){
        if(target.parentNode === brackets[i].startBracket.node || target.parentNode === brackets[i].endBracket.node){
            stageEdit.removeStage(stage, brackets[i].startBracket.bracketShape);
            stageEdit.removeStage(stage, brackets[i].endBracket.bracketShape);
            stageEdit.removeStage(stage, brackets[i].startBracket.numOfRepeatShape);
            stageEdit.stageUpdate(stage);
            if(target.parentNode === brackets[i].startBracket.node){
                brackets[i].endBracket.node.bracket = null;
            }
            else if(target.parentNode === brackets[i].endBracket.node){
                brackets[i].startBracket.node.bracket = null;
            }
            brackets.splice(i, 1);
        }
    }
    return [nodes, structures, brackets];
}

export { eraseNode };