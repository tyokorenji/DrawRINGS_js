"use strict";

import * as createjs from '../../../bower_components/EaselJS';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR, MONOSACCHARIDES } from './monosaccharide_helper';
import * as stageEdit from './edit_stage';
import { createRepeatBracket, setBracket, searchFourCorner } from './create_bracket';

/**
 * "Select" ドラッグして四角を書いて行く処理を行う
 * 呼び出し: ../draw_app.js selectMove
 * @param startX: mousedownしたときのXの相対座標
 * @param startY: mousedownしたときのYの相対座標
 * @param endX: ドラッグして動いているmouseのXの相対座標
 * @param endY: ドラッグして動いているmouseのYの相対座標
 * @param stage: EaselJSのstage
 * @returns rect: 四角のshapeの
 */
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

/**
 * "Select" 選択範囲内のNodeを選択状態にし、そのNodeだけの配列を作る。また四角を削除する
 * 呼び出し: ../draw_app.js selectUp
 * @param selectRange: 四角のshape
 * @param startX: mousedownしたときのXの相対座標
 * @param startY: mousedownしたときのYの相対座標
 * @param endX: ドラッグ終わった後の最終Xの相対座標
 * @param endY: ドラッグ終わった後の最終Yの相対座標
 * @param nodes: canvas上に描画されているNode全てを格納している配列
 * @param stage: EaselJSのstage
 * @returns moveStructureNodes: 選択範囲内のNodeをまとめた配列
 */

function rectUp(selectRange, startX, startY, endX, endY, nodes, stage){
    let moveStructureNodes = [];
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

/**
 * "Select" 選択された範囲を削除する処理を行う
 * 呼び出し: ../draw_app.js selectStructureDelete
 * @param moveStructureNodes: 選択範囲内のNodeをまとめた配列
 * @param nodes: canvas上に描画されているNode全てを格納している配列
 * @param structures: canvas上に描画されているStructure全てを格納している配列
 * @param stage: EaselJSのstage
 * @returns [Array, Array, Boolean]: nodes: canvasに残っているNodeの全てをまとめた配列。structures: canvas方に残ったStructureを全てまとめた配列。 res: ユーザーへ問いかけへの返答
 */
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

/**
 * "Select" 選択した構造を移動するときの処理
 * 呼び出し: ../draw_app.js selectMoveStructureDown
 * @param moveStructureNodes: 選択範囲内のNodeをまとめた配列
 * @param structures: canvas上に描画されているStructure全てを格納している配列
 * @param stage: EaselJSのstage
 * @returns {{moveStructurePoints: [Array, Array], targetStructures: Array}} moveStructurePoints: 起点となる座標　targetStructure: 選択範囲内のStructureオブジェクト
 */
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

/**
 * "Select" 選択された構造をドラッグしていると時の処理
 * 呼び出し: ../draw_app.js selectMoveStructureMove
 * @param pointObj:　{{moveStructurePoints: [Array, Array], targetStructures: Array}} moveStructurePoints: 起点となる座標　targetStructure: 選択範囲内のStructureオブジェクト
 * @param moveStructureNodes: 選択範囲内のNode
 * @param structures: canvas上に描画されているStructure全てを格納している配列
 * @param stage: EaselJSのstage
 * @param canvas: HTML5のcanvas
 */

function selectedMoveStructureMove(pointObj, moveStructureNodes, structures, stage, canvas){
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
            if(pointObj.targetStructures[i].parentNode.bracket != null){
                stageEdit.removeStage(stage, pointObj.targetStructures[i].parentNode.bracket.startBracket.bracketShape);
                stageEdit.removeStage(stage, pointObj.targetStructures[i].parentNode.bracket.startBracket.numOfRepeatShape);
                stageEdit.removeStage(stage, pointObj.targetStructures[i].parentNode.bracket.endBracket.bracketShape);
                let resultsFourCorner = searchFourCorner(pointObj.targetStructures[i].parentNode.bracket.repeatNodes);
                setBracket(resultsFourCorner, structures, pointObj.targetStructures[i].parentNode.bracket, pointObj.targetStructures[i].parentNode.bracket.startBracket.numOfRepeatShape, stage);
            }
            if(pointObj.targetStructures[i].childNode.bracket != null){
                stageEdit.removeStage(stage, pointObj.targetStructures[i].childNode.bracket.startBracket.bracketShape);
                stageEdit.removeStage(stage, pointObj.targetStructures[i].childNode.bracket.startBracket.numOfRepeatShape);
                stageEdit.removeStage(stage, pointObj.targetStructures[i].childNode.bracket.endBracket.bracketShape);
                let resultsFourCorner = searchFourCorner(pointObj.targetStructures[i].childNode.bracket.repeatNodes);
                setBracket(resultsFourCorner, structures, pointObj.targetStructures[i].childNode.bracket, pointObj.targetStructures[i].childNode.bracket.startBracket.numOfRepeatShape, stage);
            }
            usedStructure.push(pointObj.targetStructures[i]);
            stageEdit.stageUpdate(stage);
        }

    }
}

/**
 * "Select" 選択した構造の移動が終了したときの処理
 * 呼び出し: ../draw_app.js selectMoveStructureUp
 * @param moveStructureNodes: 選択されているNodeの配列
 */
function selectedMoveStructureUp(moveStructureNodes){
    for(let i = 0; i < moveStructureNodes.length; i++){
        moveStructureNodes[i].returnShape(moveStructureNodes[i]);
    }
}

export { rectMove, rectUp, selectedStructureDelete, selectedMoveStructureDown, selectedMoveStructureMove, selectedMoveStructureUp };