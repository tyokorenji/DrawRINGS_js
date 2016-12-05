"use strict";
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR, MONOSACCHARIDES } from './monosaccharide_helper';
import * as stageEdit from './edit_stage';
// import  handleDown  from "../draw_app";
import { handleDown } from "./set_edge_text";

export let createHexose = function(sugar, shape, x, y, stage){
    let r = 10;
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"))
                  .beginFill(getMonosaccharideColor(sugar))
                  .drawCircle(originPointX, originPointY, r);
    shape.x = x;
    shape.y = y;
    // shape.addEventListener("mousedown", handleDown);
    stageEdit.setStage(stage, shape);
    stageEdit.stageUpdate(stage);
    return shape;
};

export let createHexnac = function(sugar, shape, x, y, stage){
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"))
                  .beginFill(getMonosaccharideColor(sugar))
                  .drawRect(originPointX-10, originPointY-10, originPointX+20, originPointY+20);
    shape.x = x;
    shape.y = y;
    // shape.addEventListener("mousedown", handleDown);
    stageEdit.setStage(stage, shape);
    stageEdit.stageUpdate(stage);
    return shape;
};

export let createHexosamine = function(sugar, shape, x, y, stage){
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"))
                  .beginFill(getMonosaccharideColor(sugar))
                  .moveTo(originPointX, originPointY)
                  .lineTo(originPointX-10, originPointY-10)
                  .lineTo(originPointX+10, originPointY-10)
                  .lineTo(originPointX+10, originPointY+10)
                  .lineTo(originPointX, originPointY)
                  .endFill()
                  .beginStroke(getLineColor("black"))
                  .beginFill(MONOSACCHARIDE_COLOR.WHITE)
                  .moveTo(originPointX, originPointY)
                  .lineTo(originPointX-10, originPointY-10)
                  .lineTo(originPointX-10, originPointY+10)
                  .lineTo(originPointX+10, originPointY+10)
                  .lineTo(originPointX, originPointY)
                  .endFill();
    shape.x = x;
    shape.y = y;
    // // shape.addEventListener("mousedown", handleDown);
    stageEdit.setStage(stage, shape);
    stageEdit.stageUpdate(stage);
    return shape;
};

export let createHexuronate = function(sugar, shape, x, y, stage){
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"));
    if(sugar === "alta" || sugar === "idoa") shape.graphics.beginFill(MONOSACCHARIDE_COLOR.WHITE);
    else shape.graphics.beginFill(getMonosaccharideColor(sugar));
    shape.graphics.moveTo(originPointX, originPointY)
                  .lineTo(originPointX-10, originPointY)
                  .lineTo(originPointX, originPointY-10)
                  .lineTo(originPointX+10, originPointY)
                  .lineTo(originPointX, originPointY)
                  .endFill()
                  .beginStroke(getLineColor("black"));
    if(sugar === "alta" || sugar === "idoa") shape.graphics.beginFill(getMonosaccharideColor(sugar));
    else shape.graphics.beginFill(MONOSACCHARIDE_COLOR.WHITE);
    shape.graphics.moveTo(originPointX, originPointY)
                  .lineTo(originPointX-10, originPointY)
                  .lineTo(originPointX, originPointY+10)
                  .lineTo(originPointX+10, originPointY)
                  .lineTo(originPointX, originPointY)
                  .endFill();
    shape.x = x;
    shape.y = y;
    // shape.addEventListener("mousedown", handleDown);
    stageEdit.setStage(stage, shape);
    stageEdit.stageUpdate(stage);
    return shape;
};

export let createDeoxyhexose = function(sugar, shape, x, y, stage){
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"))
                  .beginFill(getMonosaccharideColor(sugar))
                  .moveTo(originPointX, 0+10)
                  .lineTo(originPointX+10, 0+10)
                  .lineTo(originPointX, 0-20)
                  .lineTo(originPointX-10, 0+10)
                  .lineTo(originPointX, 0+10)
                  .endFill();
    shape.x = x;
    shape.y = y;
    // shape.addEventListener("mousedown", handleDown);
    stageEdit.setStage(stage, shape);
    stageEdit.stageUpdate(stage);
    return shape;
};

export let createDeoxyhexnac = function(sugar, shape, x, y, stage){
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"))
                  .moveTo(originPointX, originPointY)
                  .lineTo(originPointX, originPointY-10)
                  .lineTo(originPointX+10, originPointY+10)
                  .lineTo(originPointX, originPointY+10)
                  .lineTo(originPointX, originPointY)
                  .endFill()
                  .beginStroke(getLineColor("black"))
                  .beginFill(MONOSACCHARIDE_COLOR.WHITE)
                  .moveTo(originPointX, originPointY)
                  .lineTo(originPointX, originPointY-10)
                  .lineTo(originPointX-10, originPointY+10)
                  .lineTo(originPointX, originPointY+10)
                  .lineTo(originPointX, originPointY)
                  .endFill();
    shape.x = x;
    shape.y = y;
    // shape.addEventListener("mousedown", handleDown);
    stageEdit.setStage(stage, shape);
    stageEdit. stageUpdate(stage);
    return shape;
};

export let createDi_deoxyhexose = function(sugar, shape, x, y, stage){
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"))
                  .beginFill(getMonosaccharideColor(sugar))
                  .drawRect(originPointX-10, originPointY-10, originPointX+20, originPointY+10)
                  .endFill();
    shape.x = x;
    shape.y = y;
    // shape.addEventListener("mousedown", handleDown);
    stageEdit.setStage(stage, shape);
    stageEdit.stageUpdate(stage);
    return shape;
};

export let createPentose = function(sugar, shape, x, y, stage){
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"))
                  .beginFill(getMonosaccharideColor(sugar))
                  .drawPolyStar(originPointX, originPointY, 10, 5, 0.6, -90);
    shape.x = x;
    shape.y = y;
    // shape.addEventListener("mousedown", handleDown);
    stageEdit. setStage(stage, shape);
    stageEdit. stageUpdate(stage);
    return shape;
};

export let createNouloosonate = function(sugar, shape, x, y, stage){
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"))
                  .beginFill(getMonosaccharideColor(sugar))
                  .moveTo(originPointX, originPointY-10)
                  .lineTo(originPointX-10, originPointY)
                  .lineTo(originPointX, originPointY+10)
                  .lineTo(originPointX+10, originPointY)
                  .lineTo(originPointX, originPointY-10)
                  .endFill();
    shape.x = x;
    shape.y = y;
    // shape.addEventListener("mousedown", handleDown);
    stageEdit. setStage(stage, shape);
    stageEdit. stageUpdate(stage);
    return shape;
};

export let createUnknown = function(sugar, shape, x, y, stage){
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"))
                  .beginFill(getMonosaccharideColor(sugar))
                  .moveTo(originPointX-8, originPointY-8)
                  .lineTo(originPointX-10, originPointY)
                  .lineTo(originPointX-8, originPointY+8)
                  .lineTo(originPointX+8, originPointY+8)
                  .lineTo(originPointX+10, originPointY)
                  .lineTo(originPointX+8, originPointY-8)
                  .lineTo(originPointX-8, originPointY-8)
                  .endFill();
    shape.x = x;
    shape.y = y;
    // shape.addEventListener("mousedown", handleDown);
    stageEdit. setStage(stage, shape);
    stageEdit. stageUpdate(stage);
    return shape;
};

export let createAssigned = function(sugar, shape, x, y, stage){
    let originPointX = 0;
    let originPointY = 0;
    shape.graphics.beginStroke(getLineColor("black"))
                  .beginFill(getMonosaccharideColor(sugar))
                  .drawPolyStar(originPointX, originPointY, 10, 5, 0, -90);
    shape.x = x;
    shape.y = y;
    // shape.addEventListener("mousedown", handleDown);
    stageEdit. setStage(stage, shape);
    stageEdit.stageUpdate(stage);
    return shape;
};

export let createNodeText = function(mody, shape, x, y, stage){
    // let nodeText = new createjs.Text(mody,"24px serif", getLineColor("black"));
    // nodeText.x = x;
    // nodeText.y = y;
    shape.x = x;
    shape.y = y;
    // stage.addEventListener("mousedown", handleDown);
    // shape.nodeText = nodeText;
    stageEdit.setStage(stage, shape);
    stageEdit. stageUpdate(stage);
    return shape;
};

