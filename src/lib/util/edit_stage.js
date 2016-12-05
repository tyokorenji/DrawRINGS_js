"use strict";
import * as createjs from '../../../bower_components/EaselJS';


export let setStage = function(stage, shape){
    stage.addChild(shape);
};

export let removeStage = function(stage, shape){
    stage.removeChild(shape);
    stageUpdate(stage);
};

export let stageUpdate = function(stage){
    stage.update();
};

export let stageEdge = function(structure, stage){
    setStage(stage, structure.edge);
    removeStage(stage, structure.parentNode.sprite);
    removeStage(stage, structure.childNode.sprite);
    stageUpdate(stage);
    setStage(stage, structure.parentNode.sprite);
    setStage(stage, structure.childNode.sprite);
};

