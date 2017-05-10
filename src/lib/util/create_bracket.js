"use strict";

import * as createjs from '../../../bower_components/EaselJS';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR } from './monosaccharide_helper';
import * as stageEdit from './edit_stage';
import Braket  from './bracket.js';

/**
 * 繰り返し構造のためBracketクラスを作成する関数で、各処理のメインの関数と成る
 * @param moveStructureNodes:繰り返しするSugarクラスかModificationクラス
 * @param structures:canvas上にあるStructureクラスの配列
 * @param stage:EaselJSのstage
 */
function createRepeatBracket(moveStructureNodes, structures, stage){
    let bracketObj = new Braket();
    //ユーザが入力した繰り返し回数を拾得
    bracketObj.startBracket.numOfRepeatText = document.getElementById("repeatN").value;
    //EaselJSのTextクラスを使用して、canvas上に表す文字にする
    let n = new createjs.Text(bracketObj.startBracket.numOfRepeatText, "20px serif", getLineColor("black"));
    //繰り返しするSugarクラスかModificationクラスをそれぞれに対応したNodeクラスにする
    for(let i = 0; i < moveStructureNodes.length; i++){
        moveStructureNodes[i] = moveStructureNodes[i].parentNode;
    }
    //繰り返しするNodeクラスで形成される四角の４つの頂点を検索する
    let resultsFourCorner = searchFourCorner(moveStructureNodes);
    //各Bracketと繰り返し回数を作成する
    setBracket(resultsFourCorner, structures, bracketObj, n, stage);
    //bracketクラスの繰り返しNodeを入れる配列に繰り返しNodeクラスを入れていっている
    for(let i = 0; i < moveStructureNodes.length; i++){
        bracketObj.repeatNodes.push(moveStructureNodes[i]);
    }
    //糖鎖構造のルートNodeを検索する
    let rootNode = searchRootNode(structures);
    let repeatKey = [];
    //検索したルートNodeより、繰り返しNodeの配列をソートする
    sortRepeatNode(bracketObj, rootNode, repeatKey);
    bracketObj.repeatNodes = repeatKey;
    return bracketObj;

}

/**
 * 再帰的に繰り返しNodeクラスをソートする関数
 * @param bracketObj:作成するインスタンス化されたBracketクラス
 * @param parentNode:親Node
 * @param repeatKey:ソートし終わったNodeクラスを入れていく配列
 */
function sortRepeatNode(bracketObj, parentNode, repeatKey){
    for(let i = 0; i  < bracketObj.repeatNodes.length; i++){
        if(parentNode === bracketObj.repeatNodes[i]){
            repeatKey.push(parentNode);
        }
    }
    for(let i = 0; i < parentNode.childNode.length; i++){
        sortRepeatNode(bracketObj, parentNode.childNode[i], repeatKey);
    }
}

function searchRootNode(structures){
    let rootNode = structures[0].parentNode;
    for(let i = 1; i < structures.length; i++){
        if(rootNode.xCood < structures[i].parentNode.xCood){
            rootNode = structures[i].parentNode;
        }
    }
    return rootNode;
}

/**
 * Bracketをcanvas上に描画するための関数
 * @param fourCorner:繰り返しNodeクラスの４つの角
 * @param structures:canvas上にあるStructureクラスの配列
 * @param bracketObj:作成するインスタンス化されたBracketクラス
 * @param n:EaselJSのTextクラスで作成した繰り返し回数のオブジェクト
 * @param stage:EaselJSのstage
 * @returns :作成したBRacketクラス
 */
function setBracket(fourCorner, structures, bracketObj, n, stage){
    let counter= 0;
    let distance = 20;
    //繰り返し開始となる最初のかっこ"]"を作成する
    for(let i = 0; i < structures.length; i++){
        if(fourCorner[1] === structures[i].childNode){
            createStartBracket(fourCorner, structures[i], bracketObj, distance, stage);
            counter++;
            break;
        }
    }
    //ルートNodeが繰り返しの開始地点の場合
    if(counter === 0){
        createRootStartBracket(fourCorner, bracketObj, distance, stage);
    }

    counter = 0;

    //繰り返し終了のかっこ"["を作成する
    for(let i = 0; i < structures.length; i++){
        if(fourCorner[3] === structures[i].parentNode){
            createEndBracket(fourCorner, structures[i], bracketObj, distance, stage);
            counter++;
            break;
        }
    }
    //繰り返石終了のかっこが、非還元末端の場合
    if(counter === 0){
        createRootEndBracket(fourCorner, bracketObj, distance, stage);
    }

    //繰り返し回数を"]"の右下に配置する関数
    setRepeat(fourCorner, n, bracketObj.startBracket.structure, distance);
    bracketObj.startBracket.numOfRepeatShape = n;
    upStage(n, stage);

    return bracketObj;
}

/**
 * 繰り返し回数を"]"の右下に配置する関数
 * @param fourCorner:繰り返しNodeクラスの４つの角
 * @param n:EaselJSのTextクラスで作成した繰り返し回数のオブジェクト
 * @param startBracketStructure:繰り返し開始のBracketを作成する起点となったStructureクラス
 * @param distance:作成した繰返し回ががBracket上に来ないように少しずらすための距離
 */
function setRepeat(fourCorner, n, startBracketStructure, distance){
    if(startBracketStructure === null){
        n.x = fourCorner[1].xCood + distance;
        n.y = fourCorner[2].yCood - 5;
    }
    else {
        n.x = (startBracketStructure.edge.graphics._activeInstructions[0].x + startBracketStructure.edge.graphics._activeInstructions[1].x) / 2 + distance;
        n.y = fourCorner[2].yCood + distance - 5;
    }

}

/**
 * 繰り返し終了となるBracketを扠せくせする関数
 * @param fourCorner:繰り返しNodeクラスの４つの角
 * @param structure:canvas上にあるStructureクラスの配列
 * @param bracketObj:作成するインスタンス化されたBracketクラス
 * @param distance:作成したBracketがNode上に来ないように少しずらすための距離
 * @param stage:EaselJSのstage
 */
function createEndBracket(fourCorner, structure, bracketObj, distance, stage){
    bracketObj.endBracket.bracketShape = new createjs.Shape();
    bracketObj.endBracket.bracketShape.graphics.setStrokeStyle(5)
        .beginStroke(getLineColor("black"))
        .moveTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2 + distance, fourCorner[0].yCood - distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2, fourCorner[0].yCood - distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2, fourCorner[2].yCood + distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2 + distance, fourCorner[2].yCood + distance);
    bracketObj.endBracket.structure = structure;
    bracketObj.endBracket.node = fourCorner[3];
    fourCorner[3].bracket = bracketObj;
    upStage(bracketObj.endBracket.bracketShape, stage);
}

/**
 * 繰り返し終了とが、非還元末端となる場合
 * @param fourCorner:繰り返しNodeクラスの４つの角
 * @param bracketObj:作成するインスタンス化されたBracketクラス
 * @param distance:作成したBracketがNode上に来ないように少しずらすための距離
 * @param stage:EaselJSのstage
 */
function createRootEndBracket(fourCorner, bracketObj, distance, stage){
    bracketObj.endBracket.bracketShape = new createjs.Shape();
    bracketObj.endBracket.bracketShape.graphics.setStrokeStyle(5)
        .beginStroke(getLineColor("black"))
        .moveTo(fourCorner[3].xCood, fourCorner[0].yCood - distance)
        .lineTo(fourCorner[3].xCood - distance, fourCorner[0].yCood - distance)
        .lineTo(fourCorner[3].xCood - distance, fourCorner[2].yCood + distance)
        .lineTo(fourCorner[3].xCood, fourCorner[2].yCood + distance);
    bracketObj.endBracket.node = fourCorner[3];
    fourCorner[3].bracket = bracketObj;
    upStage(bracketObj.endBracket.bracketShape, stage);
}

/**
 * 繰り返し開始となるBracketを作成する関数
 * @param fourCorner:繰り返しNodeクラスの４つの角
 * @param structure:canvas上にあるStructureクラスの配列
 * @param bracketObj:作成するインスタンス化されたBracketクラス
 * @param distance:作成したBracketがNode上に来ないように少しずらすための距離
 * @param stage:EaselJSのstage
 */
function createStartBracket(fourCorner, structure, bracketObj, distance, stage){
    bracketObj.startBracket.bracketShape = new createjs.Shape();
    bracketObj.startBracket.bracketShape.graphics.setStrokeStyle(5)
        .beginStroke(getLineColor("black"))
        .moveTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2 - distance, fourCorner[0].yCood - distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2, fourCorner[0].yCood - distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2, fourCorner[2].yCood + distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2 - distance, fourCorner[2].yCood + distance);
    bracketObj.startBracket.structure = structure;
    bracketObj.startBracket.node = fourCorner[1];
    fourCorner[1].bracket = bracketObj;
    upStage(bracketObj.startBracket.bracketShape, stage);
}

/**
 * ルートNodeが繰り返し開始地点の場合の関数
 * @param fourCorner:繰り返しNodeクラスの４つの角
 * @param bracketObj:作成するインスタンス化されたBracketクラス
 * @param distance:作成したBracketがNode上に来ないように少しずらすための距離
 * @param stage:EaselJSのstage
 */
function createRootStartBracket(fourCorner, bracketObj, distance, stage){
    bracketObj.startBracket.bracketShape = new createjs.Shape();
    bracketObj.startBracket.bracketShape.graphics.setStrokeStyle(5)
        .beginStroke(getLineColor("black"))
        .moveTo(fourCorner[1].xCood, fourCorner[0].yCood - distance)
        .lineTo(fourCorner[1].xCood + distance, fourCorner[0].yCood - distance)
        .lineTo(fourCorner[1].xCood + distance, fourCorner[2].yCood + distance)
        .lineTo(fourCorner[1].xCood, fourCorner[2].yCood + distance);
    bracketObj.startBracket.node = fourCorner[1];
    fourCorner[1].bracket = bracketObj;
    upStage(bracketObj.startBracket.bracketShape, stage);
}

/**
 * 繰り返すNodeクラスから、４つの頂点を検索する関数
 * @param selectedNodes:繰り返すNodeクラスの配列
 * @returns :配列[右上、右下、左下、左上]
 */
function searchFourCorner(selectedNodes){
    let mostRightNode = selectedNodes[0];
    let mostLeftNode = selectedNodes[0];
    let mostTopNode = selectedNodes[0];
    let mostBottomNode = selectedNodes[0];

    for(let i = 1; i < selectedNodes.length; i++) {
        if (mostRightNode.xCood < selectedNodes[i].xCood) mostRightNode = selectedNodes[i];
        else if (mostLeftNode.xCood > selectedNodes[i].xCood) mostLeftNode = selectedNodes[i];
        if (mostTopNode.yCood > selectedNodes[i].yCood) mostTopNode = selectedNodes[i];
        else if (mostBottomNode.yCood < selectedNodes[i].yCood) mostBottomNode = selectedNodes[i];
    }

    return [mostTopNode, mostRightNode, mostBottomNode, mostLeftNode];
}


/**
 * canvas上に表示する関数
 * ./edit_stageから参照している
 * @param bracket:Bracketのかっこ
 * @param stage:EaselJSのstage
 */
function upStage(bracket, stage){
    stageEdit.setStage(stage, bracket);
    stageEdit.stageUpdate(stage);
}

export { createRepeatBracket, setBracket, searchFourCorner};
