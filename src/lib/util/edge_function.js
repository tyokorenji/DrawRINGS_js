"use strict";
import Structure from '../structure';
import * as determineParentChild from './determine_parent_child';
import * as stageEdit from './edit_stage';

/**
 * "Edge"機能の起点となるNodeを選択状態にする処理
 * @param edgeStart:起点となるNode
 * @returns :起点となるNode
 */
export let drawEdgeSugarStart = function(edgeStart){
        edgeStart.highlightShape(edgeStart);
        return edgeStart;
};
/**
 * "Edge"機能でももう片方のNodeに対する処理
 * 起点のNodeともう片方のNodeの間に線を引き、
 どちらのNodeが親Nodeか判別し、Structureクラスをインスタンス化している
 * @param edgeStart:起点となるNode
 * @param edgeEnd:もう片方のNode
 * @param stage:EaselJSのstage
 * @param structureId:StructureクラスのID
 * @returns :作成したStructureクラス
 */
export let drawEdgeSugarEnd = function(edgeStart, edgeEnd, stage, structureId){
    let line = new createjs.Shape();
    line.graphics.setStrokeStyle(3)
        .beginStroke("#000")
        .moveTo(edgeStart.x, edgeStart.y)
        .lineTo(edgeEnd.x, edgeEnd.y);
    let parentChild = determineParentChild.determineParentChild(edgeStart, edgeEnd);
    let structure = new Structure(structureId, parentChild[0].parentNode, parentChild[1].parentNode, null, line);
    stageEdit.stageEdge(structure, stage);
    stageEdit.stageUpdate(stage);
    edgeStart.returnShape(edgeStart);
    parentChild[0].parentNode.childNode.push(parentChild[1].parentNode);
    return structure;
};
