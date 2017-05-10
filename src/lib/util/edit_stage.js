"use strict";
import * as createjs from '../../../bower_components/EaselJS';

/**
 * canvas上にあるstageに図形を置く関数
 * @param stage:EaselJSのstage
 * @param shape:対象となる図形
 */
export let setStage = function(stage, shape){
    stage.addChild(shape);
};

/**
 * canvas上にあるstageから図形を取り除く関数
 * @param stage:EaselJSのstage
 * @param shape:対象となる図形
 */
export let removeStage = function(stage, shape){
    stage.removeChild(shape);
    stageUpdate(stage);
};

/**
 * stage上にある図形をcanvas上で可視化する。canvasを更新する関数
 * @param stage:対象となる図形
 */
export let stageUpdate = function(stage){
    stage.update();
};

/**
 * Edgeをstageに置く場合、Nodeより層がうえになる場合が有るため。それを防ぐ関数
 * @param structure:対象となるEdgeを含むStructureクラス
 * @param stage:EaselJSのstage
 */
export let stageEdge = function(structure, stage){
    setStage(stage, structure.edge);
    removeStage(stage, structure.parentNode.sprite);
    removeStage(stage, structure.childNode.sprite);
    stageUpdate(stage);
    setStage(stage, structure.parentNode.sprite);
    setStage(stage, structure.childNode.sprite);
};

