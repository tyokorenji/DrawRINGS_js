"use strict";

import * as createjs from '../../../bower_components/EaselJS';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR, MONOSACCHARIDES } from './monosaccharide_helper';
import * as stageEdit from './edit_stage';

function rectMove(startX, startY, endX, endY, stage){
    let rect = new createjs.Shape();
    rect.graphics.beginStroke(getLineColor("black"));
    rect.graphics.beginFill(MONOSACCHARIDE_COLOR.WHITE);
    if(startX < endX || startY < endY) {
        rect.graphics.drawRect( startX, startY,endX - startX, endY - startY);
    }
    else if(startX > endX && startY > endY){
        rect.graphics.drawRect(endX, endY, startX - endX, startY - endY);
    }

    rect.alpha = 0.3;
    stageEdit.setStage(stage, rect);
    stageEdit.stageUpdate(stage);

    return rect;
}

function rectUp(selectRange, startX, startY, endX, endY, nodes, moveStructureNodes, stage){
    for(let i = 0; i < nodes.length; i++){
        if(startX < endX || startY < endY) {
            if (startX < nodes[i].sprite.x && endX > nodes[i].sprite.x && startY < nodes[i].sprite.y && endY > nodes[i].sprite.y) {
                nodes[i].sprite.highlightShape(nodes[i].sprite);
                moveStructureNodes.push(nodes[i].sprite);
            }
        }
        else if(startX > endX && startY > endY) {
            if(endX < nodes[i].sprite.x && startX > nodes[i].sprite.x && endY < nodes[i].sprite.y && startY > nodes[i].sprite.y){
                nodes[i].sprite.highlightShape(nodes[i].sprite);
                moveStructureNodes.push(nodes[i].sprite);
            }
        }
    }
    stageEdit.removeStage(stage, selectRange);
    stageEdit.stageUpdate(stage);

    return moveStructureNodes;
}

function selectedStructureDelete(moveStructureNodes, nodes, structures, stage){
    let res = confirm("Do you delete Selected structure?");
    if(res == true) {
        for(let i = 0; i < moveStructureNodes.length; i++) {
            for (let j = 0; j < nodes.length; j++) {
                if (moveStructureNodes[i] === nodes[j].sprite) {
                    stageEdit.removeStage(stage, moveStructureNodes[i]);
                    nodes.splice(j, 1);
                }
            }
            for (let j = 0; j < structures.length; j++) {
                if (moveStructureNodes[i] === structures[j].parentNode.sprite || moveStructureNodes[i] === structures[j].childNode.sprite) {
                    stageEdit.removeStage(stage, structures[j].edge);
                    stageEdit.removeStage(stage, structures[j].edgeInformation);
                    structures.splice(j, 1);
                    j--;
                }
            }
        }
        return [nodes, structures, res];
    }
}

function selectedMoveStructureDown(moveStructureNodes, structures, stage){
    let moveStructureXPoints = [];
    let moveStructureYPoints = [];
    let targetStructures = [];
    for(let i = 0; i < moveStructureNodes.length; i++){
        moveStructureXPoints.push(stage.mouseX - moveStructureNodes[i].x);
        moveStructureYPoints.push(stage.mouseY - moveStructureNodes[i].y);
    }
    for(let i = 0; i < moveStructureNodes.length; i++){
        for(let j = 0; j < structures.length; j++) {
            if (moveStructureNodes[i] === structures[j].parentNode.sprite || moveStructureNodes[i] === structures[j].childNode.sprite) {
                targetStructures.push(structures[j]);
            }
        }
    }

    return {
        moveStructurePoints : [moveStructureXPoints, moveStructureYPoints],
        targetStructures : targetStructures
    }

}

function selectedMoveStructureMove(pointObj, moveStructureNodes, stage, canvas){
    let movePointX = null;
    let movePointY = null;
    let usedStructure = [];
    for(let i = 0; i < moveStructureNodes.length; i++) {
        movePointX = stage.mouseX - pointObj.moveStructurePoints[0][i];
        movePointY = stage.mouseY - pointObj.moveStructurePoints[1][i];

        if (movePointX > 0 + 10 && movePointX < canvas.width - 10) {
            moveStructureNodes[i].x = stage.mouseX - pointObj.moveStructurePoints[0][i];
            moveStructureNodes[i].parentNode.xCood = stage.mouseX - pointObj.moveStructurePoints[0][i];
        }
        if (movePointY > 0 + 10 && movePointY < canvas.height - 10) {
            moveStructureNodes[i].y = stage.mouseY - pointObj.moveStructurePoints[1][i];
            moveStructureNodes[i].parentNode.yCood = stage.mouseY - pointObj.moveStructurePoints[1][i];
        }
    }
    for(let i = 0; i < pointObj.targetStructures.length; i++){
        let counter = 0;
        for(let j = 0; j < usedStructure.length; j++){
            if(pointObj.targetStructures[i] === usedStructure[j]) counter++;
        }
        if(counter === 0) {
            stageEdit.removeStage(stage, pointObj.targetStructures[i].edge);
            let line = new createjs.Shape();
            line.graphics.setStrokeStyle(3)
                .beginStroke("#000")
                .moveTo(pointObj.targetStructures[i].parentNode.sprite.x, pointObj.targetStructures[i].parentNode.sprite.y)
                .lineTo(pointObj.targetStructures[i].childNode.sprite.x, pointObj.targetStructures[i].childNode.sprite.y);
            pointObj.targetStructures[i].edge = line;
            stageEdit.stageEdge(pointObj.targetStructures[i], stage);
            if (pointObj.targetStructures[i].edgeInformation != null) {
                pointObj.targetStructures[i].edgeInformation.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
                pointObj.targetStructures[i].edgeInformation.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2;
            }
            if(pointObj.targetStructures[i].parentNode.bracket != null || pointObj.targetStructures[i].childNode.bracket != null){
                if(pointObj.targetStructures[i].parentNode.bracket != null) {
                    if (pointObj.targetStructures[i].parentNode.bracket.startBracket.structure === pointObj.targetStructures[i]) {
                        pointObj.targetStructures[i].parentNode.bracket.startBracket.bracketShape.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
                        pointObj.targetStructures[i].parentNode.bracket.startBracket.bracketShape.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2 - 30;
                        pointObj.targetStructures[i].parentNode.bracket.startBracket.numOfRepeatShape.x = pointObj.targetStructures[i].parentNode.bracket.startBracket.bracketShape.x + 10;
                        pointObj.targetStructures[i].parentNode.bracket.startBracket.numOfRepeatShape.y = pointObj.targetStructures[i].parentNode.bracket.startBracket.bracketShape.y + 40;
                    }
                    else if (pointObj.targetStructures[i].parentNode.bracket.endBracket.structure === pointObj.targetStructures[i]) {
                        pointObj.targetStructures[i].parentNode.bracket.endBracket.bracketShape.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
                        pointObj.targetStructures[i].parentNode.bracket.endBracket.bracketShape.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2 - 30;
                    }
                }
                else if(pointObj.targetStructures[i].childNode.bracket != null) {
                    if (pointObj.targetStructures[i].childNode.bracket.startBracket.structure === pointObj.targetStructures[i]) {
                        pointObj.targetStructures[i].childNode.bracket.startBracket.bracketShape.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
                        pointObj.targetStructures[i].childNode.bracket.startBracket.bracketShape.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2 - 30;
                        pointObj.targetStructures[i].childNode.bracket.startBracket.numOfRepeatShape.x = pointObj.targetStructures[i].childNode.bracket.startBracket.bracketShape.x + 10;
                        pointObj.targetStructures[i].childNode.bracket.startBracket.numOfRepeatShape.y = pointObj.targetStructures[i].childNode.bracket.startBracket.bracketShape.y + 40;
                    }
                    else if (pointObj.targetStructures[i].childNode.bracket.endBracket.structure === pointObj.targetStructures[i]) {
                        pointObj.targetStructures[i].childNode.bracket.endBracket.bracketShape.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
                        pointObj.targetStructures[i].childNode.bracket.endBracket.bracketShape.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2 - 30;
                    }
                }
            }

            // if (pointObj.targetStructures[i].parentNode.bracket != null || pointObj.targetStructures[i].childNode.bracket != null) {
            //     if (pointObj.targetStructures[i].parentNode.bracket != null) {
            //         pointObj.targetStructures[i].parentNode.bracket.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
            //         pointObj.targetStructures[i].parentNode.bracket.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2 - 30;
            //         if(pointObj.targetStructures[i].parentNode.numberOfRepeatShape != null){
            //             pointObj.targetStructures[i].parentNode.numberOfRepeatShape.x = pointObj.targetStructures[i].parentNode.bracket.x + 10;
            //             pointObj.targetStructures[i].parentNode.numberOfRepeatShape.y = pointObj.targetStructures[i].parentNode.bracket.y + 40;
            //         }
            //     }
            //     else if(pointObj.targetStructures[i].childNode.bracket != null){
            //         pointObj.targetStructures[i].childNode.bracket.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
            //         pointObj.targetStructures[i].childNode.bracket.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2 -30;
            //     }
            // }
            //
            // if(pointObj.targetStructures[i].parentNode.numberOfRepeatShape != null || pointObj.targetStructures[i].childNode.numberOfRepeatShape != null){
            //
            //     else if(pointObj.targetStructures[i].childNode.numberOfRepeatShape != null){
            //         pointObj.targetStructures[i].childNode.numberOfRepeatShape.x = pointObj.targetStructures[i].bracket.x + 10;
            //         pointObj.targetStructures[i].childNode.numberOfRepeatShape.y = pointObj.targetStructures[i].bracket.y + 40;
            //     }
            // }
            usedStructure.push(pointObj.targetStructures[i]);
            stageEdit.stageUpdate(stage);
        }
    }
}

function selectedMoveStructureUp(moveStructureNodes){
    for(let i = 0; i < moveStructureNodes.length; i++){
        moveStructureNodes[i].returnShape(moveStructureNodes[i]);
    }
}

export { rectMove, rectUp, selectedStructureDelete, selectedMoveStructureDown, selectedMoveStructureMove, selectedMoveStructureUp };