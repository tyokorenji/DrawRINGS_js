"use strict";
import Structure from '../structure';
import * as determineParentChild from './determine_parent_child';
import * as stageEdit from './edit_stage';


export let drawEdgeSugarStart = function(edgeStart){
        edgeStart.highlightShape(edgeStart);
        return edgeStart;
};

export let drawEdgeSugarEnd = function(edgeStart, edgeEnd, stage, C){
    let line = new createjs.Shape();
    line.graphics.setStrokeStyle(3)
        .beginStroke("#000")
        .moveTo(edgeStart.x, edgeStart.y)
        .lineTo(edgeEnd.x, edgeEnd.y);
    let parentChild = determineParentChild.determineParentChild(edgeStart, edgeEnd);
    let structure = new Structure(0, parentChild[0].parentNode, parentChild[1].parentNode, null, line);
    stageEdit.stageEdge(structure, stage);
    stageEdit.stageUpdate(stage);
    edgeStart.returnShape(edgeStart);
    parentChild[0].parentNode.childNode.push(parentChild[1].parentNode);
    return structure;
};
