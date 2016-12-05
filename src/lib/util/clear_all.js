"used strict";
import * as stageEdit from './edit_stage';


function clearAll(nodes, structures, brackets, stage){
        for(let i = 0; i < structures.length; i++){
            stageEdit.removeStage(stage, structures[i].edge);
            stageEdit.removeStage(stage, structures[i].edgeInformation);
        }
        for(let j = 0; j < nodes.length; j++){
            stageEdit.removeStage(stage, nodes[j].sprite);
            stageEdit.stageUpdate(stage);
        }
        for(let k = 0; k < brackets.length; k++){
            stageEdit.removeStage(stage, brackets[k].startBracket.bracketShape);
            stageEdit.removeStage(stage, brackets[k].startBracket.numOfRepeatShape);
            stageEdit.removeStage(stage, brackets[k].endBracket.bracketShape);
            stageEdit.stageUpdate(stage);
        }
        stageEdit.stageUpdate(stage);
}
export { clearAll };