"use strict";
import * as createjs from 'EaselJS';
import * as createSugar from './util/create_sugar';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR, MONOSACCHARIDES } from './util/monosaccharide_helper';
import * as drawEdgeModification from './util/edge_function';

// class Modification extends createjs.Shape {
class Modification extends createjs.Text{
    constructor(mody) {
        super(mody,"24px serif", getLineColor("black"));
        this.parentNode = null;
        // this.nodeNext = null;
    }

    nodeDraw(mody, x, y, stage) {
        let shape = new Modification(mody);
        return createSugar.createNodeText(mody, shape, x, y, stage);
    };

    edgeDraw(edgeStart, edgeCount, edgeEnd, stage, structureId){
        if(edgeCount === 0) {
            return drawEdgeModification.drawEdgeSugarStart(edgeStart);
        }
        else if(edgeCount === 1) {
            return drawEdgeModification.drawEdgeSugarEnd(edgeStart, edgeEnd, stage, structureId);
        }
    };

    highlightShape(shape){
        shape.alpha = 1.0;
        shape.color = getLineColor("red");
    }
    returnShape(shape){
        shape.alpha = 1.0;
        shape.color = getLineColor("black");
    }

}


export default createjs.promote(Modification, "Text");