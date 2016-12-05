"use strict";
import * as createjs from '../../bower_components/EaselJS';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR, MONOSACCHARIDES } from './util/monosaccharide_helper';
import * as createSugar from './util/create_sugar';
import * as drawEdgeSugar from './util/edge_function';

class Sugar extends createjs.Shape {
    constructor() {
        super();
        this.parentNode = null;
    }

    nodeDraw(sugar, x, y, stage){
        // let sugar = sugar;
        let MONOSACCHRIDESKeys = Object.keys(MONOSACCHARIDES);
        //sugarの種類で関数を分ける
        for(let i=0; i < MONOSACCHRIDESKeys.length; i++){
            for(let j=0; j <= 10; j++){
                if(MONOSACCHARIDES[ MONOSACCHRIDESKeys[i] ][j] === sugar.toLowerCase()){
                    let shape = new Sugar();
                    if(j === 0) shape = createSugar.createHexose(sugar, shape, x, y, stage);
                    else if(j === 1) shape = createSugar.createHexnac(sugar, shape, x, y, stage);
                    else if(j === 2) shape = createSugar.createHexosamine(sugar, shape, x, y, stage);
                    else if(j === 3) shape = createSugar.createHexuronate(sugar, shape, x, y, stage);
                    else if(j === 4) shape = createSugar.createDeoxyhexose(sugar, shape, x, y, stage);
                    else if(j === 5) shape = createSugar.createDeoxyhexnac(sugar, shape, x, y, stage);
                    else if(j === 6) shape = createSugar.createDi_deoxyhexose(sugar, shape, x, y, stage);
                    else if(j === 7) shape = createSugar.createPentose(sugar, shape, x, y, stage);
                    else if(j === 8) shape = createSugar.createNouloosonate(sugar, shape, x, y, stage);
                    else if(j === 9) shape = createSugar.createUnknown(sugar, shape, x, y, stage);
                    else if(j === 10) shape = createSugar.createAssigned(sugar, shape, x, y, stage);

                    return shape;
                }
            }
        }
    };

    edgeDraw(edgeStart, edgeCount, edgeEnd, stage, structureId){
        if(edgeCount === 0) {
            return drawEdgeSugar.drawEdgeSugarStart(edgeStart);
        }
        else if(edgeCount === 1) {
            return drawEdgeSugar.drawEdgeSugarEnd(edgeStart, edgeEnd, stage, structureId);
        }
    };

    highlightShape(shape){
        shape.alpha = 0.5;
        shape.graphics._stroke.style = getLineColor("red");
    }

    returnShape(shape){
        shape.alpha = 1.0;
        shape.graphics._stroke.style = getLineColor("black");
    }
}

export default createjs.promote(Sugar, "Shape");

