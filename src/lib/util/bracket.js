"use strict";
import * as createjs from '../../../bower_components/EaselJS';
/**
 * 繰り返しを意味するBracketを描画するための関数
 */
class Bracket {
    constructor(){
        //canvas上で右側に来るBracketの情報を格納するオブジェクト
        this.startBracket = {
            bracketShape: null,
            structure: null,
            numOfRepeatShape: null,
            numOfRepeatText: null,
            node: null
        };
        //canvas上で左側に来るBracketの情報を格納するオブジェクト
        this.endBracket = {
            bracketShape: null,
            structure: null,
            node: null
        };
        //繰り返し構造に含まれるNodeの配列
        this.repeatNodes = [];
        //繰り返し構造に含まれるSugarクラスの配列
        this.repeatSugar = [];
        //繰り返し構造に含まれるModificationクラスの配列
        this.repeatModification = [];
    }
}

module.exports = Bracket;