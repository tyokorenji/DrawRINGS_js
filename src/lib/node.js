"use strict";

import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR, MONOSACCHARIDES } from './util/monosaccharide_helper';
import Sugar from './sugar';
import Modification from './Modification';

/**
 * 糖鎖構造のNodeの情報を表すクラス
 */
class Node{
    constructor(id, name, xCood, yCood){
        this.id = id;
        this.sprite = nodeClass(name);
        this.name = name;
        this.xCood = xCood;
        this.yCood = yCood;
        this.childNode = [];
        this.bracket = null;
    }
}

/**
 * NodeがSNFGされた単糖なのかそうでないかを判別する関数
 * ./util/monosaccharide_helperの
 オブジェクトを使用して検索し、一致したものがあったらSugarクラスで、なかったらModificationクラスをインスタンス化する
 * @param name:Nodeとして描画しようとしている単糖もしくhあ修飾の名前
 * return:SugarクラスかModificationクラス
 */
function nodeClass(name){
    "use strict";
    let MONOSACCHRIDESKeys = Object.keys(MONOSACCHARIDES);
    for(let i=0; i < MONOSACCHRIDESKeys.length; i++){
        for(let j=0; j <= 10; j++){
            if(MONOSACCHARIDES[ MONOSACCHRIDESKeys[i] ][j] === name.toLowerCase()){
                let shape = new Sugar(name);
                return shape;
            }
        }
    }
    return new Modification(name);
}

module.exports =  Node;
