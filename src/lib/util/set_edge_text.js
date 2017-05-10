"use strict";
import * as createjs from '../../../bower_components/EaselJS';
import * as stageEdit from './edit_stage';
/**
 * canvas状に結合情報を描画する時の関数
 * @param edge:描画する対象の結合
 * @param text:描画する結合情報
 * @param structures:Structureクラスの入った配列
 * @param stage:EaselJSのstage
 * @returns structures
 */
function setEdgeText(edge, text, structures, stage){
    //すでに稀有号情報が存在する場合、canvas上から削除する
    for(let i = 0; i < structures.length; i++){
        if(structures[i].edge === edge && structures[i].edgeInformation != null){
            stageEdit.removeStage(stage, structures[i].edgeInformation);
        }
    }
    //EaselJSのTextクラスをインスタンスし、canvas上で可視化する
    let edgeText = new createjs.Text(text,"12px serif", "rgb(255,0,0)");
    //対象のEdgeの起点と終点の座標の半分を取っている
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

