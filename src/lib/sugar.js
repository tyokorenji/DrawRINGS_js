"use strict";
import * as createjs from '../../bower_components/EaselJS';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR, MONOSACCHARIDES } from './util/monosaccharide_helper';
import * as createSugar from './util/create_sugar';
import * as drawEdgeSugar from './util/edge_function';

/**
 * EaselJSのShapeクラスを継承したクラス
 * SNFG定義された単糖を描画する時にしようするクラス
 */
class Sugar extends createjs.Shape {
    constructor() {
        super();
        this.parentNode = null;
    }

    /**
     * Nodeとしてcanvas上に描画するためのメソッド
     * ./util/monosaccharide_helperの
     オブジェクトを使用して検索し、一致した単糖の引数により描画する形を決定している
     * @param sugar:SNFGで定義されたNodeの名前
     * @param x:Nodeを配置するX座標
     * @param y:Nodeを配置するY座標
     * @param stage:EaselJSのcanvas
     * @returns {Sugarクラス}
     */
    nodeDraw(sugar, x, y, stage){
        // let sugar = sugar;
        let MONOSACCHRIDESKeys = Object.keys(MONOSACCHARIDES);
        //sugarの種類で関数を分ける
        for(let i=0; i < MONOSACCHRIDESKeys.length; i++){
            for(let j=0; j <= 10; j++){
                if(MONOSACCHARIDES[ MONOSACCHRIDESKeys[i] ][j] === sugar.toLowerCase()){
                    let shape = new Sugar();
                    //一致した引数より、描画する単糖の形を決定している。各関数は./util/create_sugar.jsにある
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

    /**
     * Sugarクラスを含むEdgeを描画するためのメソッド
     * @param edgeStart:"Edge"機能で選択した起点のNode
     * @param edgeCount:"Edge"機能でクリックしたNodeが1個目か2個目かを判別
     * @param edgeEnd:"Edge"機能で選択したもう片方のNode
     * @param stage:EaselJSのstage
     * @param structureId:StructureのID
     */
    edgeDraw(edgeStart, edgeCount, edgeEnd, stage, structureId){
        if(edgeCount === 0) {
            return drawEdgeSugar.drawEdgeSugarStart(edgeStart);
        }
        else if(edgeCount === 1) {
            return drawEdgeSugar.drawEdgeSugarEnd(edgeStart, edgeEnd, stage, structureId);
        }
    };

    /**
     * Sugarクラスを選択状態にするためのメソッド
     * @param shape:選択されたSugarクラスを持つNode
     */
    highlightShape(shape){
        shape.alpha = 0.5;
        shape.graphics._stroke.style = getLineColor("red");
    }

    /**
     * Sugarクラスの選択状態を、基に戻すためのメソッド
     * @param shape:選択された選択状態のSugarクラスを持つNode
     */
    returnShape(shape){
        shape.alpha = 1.0;
        shape.graphics._stroke.style = getLineColor("black");
    }
}

export default createjs.promote(Sugar, "Shape");

