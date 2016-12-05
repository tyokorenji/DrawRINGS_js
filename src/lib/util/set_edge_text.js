"use strict";
import * as createjs from '../../../bower_components/EaselJS';
import * as stageEdit from './edit_stage';

function setEdgeText(edge, text, structures, stage){
    for(let i = 0; i < structures.length; i++){
        if(structures[i].edge === edge && structures[i].edgeInformation != null){
            stageEdit.removeStage(stage, structures[i].edgeInformamtion);
        }
    }
    let edgeText = new createjs.Text(text,"12px serif", "rgb(255,0,0)");
    edgeText.x = (edge.graphics._activeInstructions[0].x + edge.graphics._activeInstructions[1].x)/2;
    edgeText.y = (edge.graphics._activeInstructions[0].y + edge.graphics._activeInstructions[1].y)/2;
    stageEdit.setStage(stage, edgeText);
    stageEdit.stageUpdate(stage);
    for(let i = 0; i < structures.length; i++){
        if(structures[i].edge === edge){
            structures[i].edgeInformation = edgeText;
            structures[i].edgeInformationText = text;
        }
    }

    return structures;
}

export { setEdgeText };

