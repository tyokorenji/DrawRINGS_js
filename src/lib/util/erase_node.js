"use strict";
import * as stageEdit from  './edit_stage';
import { createRepeatBracket, setBracket, searchFourCorner } from './create_bracket';

/**
 * "EraseNode"機能の処理をする関数
 * @param target:削除する対象となるNodeクラス
 * @param nodes:Nodeクラスの入っている配列
 * @param structures:Structureクラスの入っている配列
 * @param brackets:Bracketクラスの入っている配列
 * @param stage:EaselJSのstage
 * @returns 各削除後の配列を配列にして返す
 */
function eraseNode(target, nodes, structures, brackets, stage){
    let rootNode = nodes[0];
    let nodes_id = 1;
    let structure_id = 1;
    //ルートNodeの検索
    for(let i = 0; i < structures.length; i++){
        if(rootNode.xCood < structures[i].parentNode.xCood){
            rootNode = structures[i].parentNode;
        }
    }
    //削除対象Nodeを子Nodeとして持つNodeクラスから、削除対象Nodeクラスを削除する
    recursiveSearchChildNode(rootNode, target);
    //削除の対象Nodeをnodesから削除する
    for(let i = 0; i < nodes.length; i++){
        if(target === nodes[i].sprite){
            stageEdit.removeStage(stage, target);
            nodes.splice(i, 1);
        }
    }
    //削除対象となるNodeが接しているEdgeと、結合情報を削除する
    for(let i = 0; i < structures.length; i++){
        if(target === structures[i].parentNode.sprite || target === structures[i].childNode.sprite){
            stageEdit.removeStage(stage, structures[i].edgeInformation);
            stageEdit.removeStage(stage, structures[i].edge);
            structures.splice(i, 1);
            i--;
        }
    }
    //nodesのNodeクラスのidを振り直す
    for(let i = 0; i < nodes.length; i++){
        nodes[i].id = nodes_id;
        nodes_id++;
    }
    //structuresのStructureクラスのidを振り直す
    for(let i = 0; i < structures.length; i++){
        structures[i].structureId = structure_id;
        structure_id++;
    }
    //削除対象Nodeが繰り返しNodeに含まれている場合、Bracketを削除する
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

/**
 * 削除する対象のNodeを子Nodeとして持つNodeクラスの子Nodeの配列から、
 対象となるNodeクラスを削除する関数
 * @param parentNode:親Node
 * @param target:削除の対象となるNodeクラス
 */
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