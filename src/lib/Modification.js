"use strict";
import * as createjs from 'EaselJS';
import * as createSugar from './util/create_sugar';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR, MONOSACCHARIDES } from './util/monosaccharide_helper';
import * as drawEdgeModification from './util/edge_function';

// class Modification extends createjs.Shape {
/**
 * EaselJSのTextクラスを継承したクラス
 * 修飾やSNFGで未定義の単糖を文字で表す時に使用するクラス
 */
class Modification extends createjs.Text{
    constructor(mody) {
        super(mody,"24px serif", getLineColor("black"));
        this.parentNode = null;
        // this.nodeNext = null;
    }

    /**
     * Nodeとしてcanvas上に描画するためのメソッド
     * @param mody:修飾やSNFGで未定義の単糖のユーザに入力された文字列
     * @param x:Nodeを配置するX座標
     * @param y:Nodeを配置するY座標
     * @param stage:EaselJSのcanvas
     */
    nodeDraw(mody, x, y, stage) {
        let shape = new Modification(mody);
        return createSugar.createNodeText(mody, shape, x, y, stage);
    };

    /**
     * Modificationクラスを含むEdgeを描画するためのメソッド
     * @param edgeStart:"Edge"機能で選択した起点のNode
     * @param edgeCount:"Edge"機能でクリックしたNodeが1個目か2個目かを判別
     * @param edgeEnd:"Edge"機能で選択したもう片方のNode
     * @param stage:EaselJSのstage
     * @param structureId:StructureのID
     */
    edgeDraw(edgeStart, edgeCount, edgeEnd, stage, structureId){
        if(edgeCount === 0) {
            return drawEdgeModification.drawEdgeSugarStart(edgeStart);
        }
        else if(edgeCount === 1) {
            return drawEdgeModification.drawEdgeSugarEnd(edgeStart, edgeEnd, stage, structureId);
        }
    };

    /**
     * Modificationクラスを選択状態にするためのメソッド
     * @param shape;選択されたModificationクラスを持つNode
     */
    highlightShape(shape){
        shape.alpha = 0.5;
        shape.color = getLineColor("red");
    }

    /**
     * Modificationクラスの選択状態を、基に戻すためのメソッド
     * @param shape;選択された選択状態のModificationクラスを持つNode
     */
    returnShape(shape){
        shape.alpha = 1.0;
        shape.color = getLineColor("black");
    }

}


export default createjs.promote(Modification, "Text");