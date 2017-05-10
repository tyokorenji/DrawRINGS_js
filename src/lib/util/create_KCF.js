"use strict";

import { createRepeatBracket, setBracket, searchFourCorner } from './create_bracket';

/**
 * 使用する定数を宣言
 * @type {string}
 */
const TAB = "    ";
const NEW_LINE = "\n";
const COLON = ":";
const SLASH = "///";
const URL_TAB = "%20";
const URL_NEW_LINE = "%30";
const WAVE = "~";

const SEPERATOR = new RegExp("-");

/**
 * "KCFTextOut"機能、"Run Query"機能で作成するKCF形式処理のメインと成る関数
 * @param mode:ユーザが選択した機能のモード。modeが8の場合"KCFTextOut"。
 modeが9の場合"Run Query"
 * @param nodes:canvas上にあるNodeクラスの配列
 * @param structures:canvas上にあるStructureクラスの配列
 * @param brackets:canvas上にあるBracketクラスの配列
 * @param kindRunQuery:Run Query時、ユーザが選択したもの。"Similarity"か"Matched"
 * @param database:Run Query時、ユーザが選択した検索をかけるデータベース
 * @param scoreMatrix:Run Query時、ユーザが選択したスコア行列の種類
 */
function createKCF(mode, nodes, structures, brackets, kindRunQuery, database, scoreMatrix){
    //canvas上に構造がなかった場合、エラー警告
    if(nodes.length < 1){
        alert("Please build glycan.");
        return;
    }

    let rootNode = null;
    //ルートNodeの検索
    for(let i = 0; i < nodes.length; i++){
        let counter = 0;
        for(let j = 0; j < structures.length; j++){
            if(nodes[i] === structures[j].childNode){
                counter++;
            }
        }
        if(counter === 0){
            rootNode = nodes[i];
        }
    }

    rootNode.id = 1;
    let nodeId = 2;
    nodeId = initNodeId(nodeId, rootNode);
    //KCF形式のNode部分を入れていく配列
    let nodeFormat = [];
    if(mode === 8) nodeFormat.push(TAB +  rootNode.id + "" +  TAB + rootNode.name + TAB + "0" + TAB + "0" +  NEW_LINE);
    else if(mode === 9) nodeFormat.push(URL_TAB + rootNode.id + "" + URL_TAB + rootNode.name + URL_TAB + "0" +  URL_TAB + "0" + URL_NEW_LINE);
    //再帰的に呼び出し、Nodeの項目を作成している
    nodeFormat = recursiveSetNode(rootNode, rootNode, nodeFormat, mode);

    //KCF形式のEdgeを入れる配列
    let edgeFormat = [];
    let childEdge = null;
    let parentEdge = null;
    //Structureクラスの結合情報からハイフンをさかいに右か左か、
    // 子Nodeか親Nodeか決めている
    for(let i = 0; i < structures.length; i++){
        if(structures[i].edgeInformationText.match(SEPERATOR)){
            childEdge = RegExp.leftContext;
            parentEdge = RegExp.rightContext;
        }
        if(mode === 8) edgeFormat.push(TAB + structures[i].structureId + "" + TAB + structures[i].childNode.id + "" + ":" + childEdge + TAB + structures[i].parentNode.id + "" + ":" + parentEdge + NEW_LINE);
        if(mode === 9) edgeFormat.push(URL_TAB + structures[i].structureId + "" + URL_TAB + structures[i].childNode.id + "" + ":" + childEdge + URL_TAB + structures[i].parentNode.id + "" + ":" + parentEdge + URL_NEW_LINE);
    }

    //KCF形式のBracketを入れる配列
    let bracketFormat = [];
    if(brackets.length != 0){
        for(let i = 0; i < brackets.length; i++){
            //繰り返しNodeの形成する四角の４つの角を検索している
            let resultsFourCorner = searchFourCorner(brackets[i].repeatNodes);
            let id = i + 1;
            //検索した4っつの角の座標を、ルートNodeからの相対座標で検出している
            let relativeCoodLeftX = parseInt(resultsFourCorner[3].xCood) - parseInt(rootNode.xCood);
            let relativeCoodRightX = parseInt(resultsFourCorner[1].xCood) - parseInt(rootNode.xCood);
            let relativeCoodTopY = parseInt(resultsFourCorner[0].yCood) - parseInt(rootNode.yCood);
            let relativeCoodBottomY = parseInt(resultsFourCorner[2].yCood) - parseInt(rootNode.yCood);
            bracketFormat.push(TAB + id + "" + TAB +  relativeCoodLeftX + "" + TAB + relativeCoodTopY + "" + TAB + relativeCoodLeftX + "" + TAB + relativeCoodBottomY + "" + NEW_LINE
                + TAB + id + "" + TAB + relativeCoodRightX + "" + TAB + relativeCoodBottomY + "" + TAB + relativeCoodRightX + "" + TAB + relativeCoodTopY + "" + NEW_LINE
                + TAB + id + "" + TAB + brackets[i].startBracket.numOfRepeatText + NEW_LINE);
        }
    }

    //KCFとして出力する
    KCFOut(nodeFormat, edgeFormat, bracketFormat, nodes, structures, kindRunQuery, database, scoreMatrix, mode);

    return nodeId;
}

/**
 * 再帰的にNodeオブジェクトに付加されたidを初期化し振り直す
 * @param nodeId:振り直すNdoeのid
 * @param parentNode:注目する親Node
 * @returns {*}
 */
function initNodeId(nodeId, parentNode){
    if(parentNode.childNode.length === 0) return nodeId;
    for(let i = 0; i < parentNode.childNode.length; i++){
        parentNode.childNode[i].id = nodeId;
        nodeId++;
        nodeId = initNodeId(nodeId, parentNode.childNode[i]);
    }
    return nodeId;

}

/**
 * 再帰的にKCF形式のNodeの項目を作成する関数
 * @param parentNode:親Node
 * @param rootNode:ルートNode
 * @param nodeFormat:KCF形式のNodeの項目を入れていく配列
 * @param mode:ユーザが選択したモード
 * @returns: nodeFormat
 */
function recursiveSetNode(parentNode, rootNode, nodeFormat, mode){
    for(let i = 0; i < parentNode.childNode.length; i++){
        nodeFormat = nodePush(parentNode.childNode[i], rootNode, nodeFormat, mode);
        recursiveSetNode(parentNode.childNode[i], rootNode, nodeFormat, mode);
    }
    return nodeFormat;
}

/**
 * 注目しているNodeクラスと、ルートNodeとの相対座標を起算し、
 nodeFormatにKCF形式に合わせて入れていく関数
 * @param childNode:注目しているNodeクラス
 * @param rootNode:ルートNode
 * @param nodeFormat:KCF形式のNodeの項目を入れていく配列
 * @param mode:ユーザが選択したモード
 * @returns: nodeFormat
 */
function nodePush(childNode, rootNode, nodeFormat, mode){
    let relativeCoodX = childNode.xCood - rootNode.xCood;
    let reletiveCoodY = childNode.yCood - rootNode.yCood;
    if(mode === 8) nodeFormat.push(TAB +  childNode.id + "" +  TAB + childNode.name + TAB + relativeCoodX + TAB + reletiveCoodY +  NEW_LINE);
    else if(mode === 9) nodeFormat.push(URL_TAB + childNode.id + "" + URL_TAB + childNode.name + URL_TAB + relativeCoodX +  URL_TAB + reletiveCoodY + URL_NEW_LINE);
    return nodeFormat;
}

/**
 * KCFとして出力するための関数
 * @param nodeFormat:KCF形式のNodeの項目を入れていく配列
 * @param edgeFormat:KCF形式のEdgeの項目を入れていく配列
 * @param bracketFormat:KCF形式のBracketの項目を入れていく配列
 * @param nodes:canvas上にあるNodeクラスの配列
 * @param structures:canvas上にあるStructureクラスの配列
 * @param kindRunQuery:Run Query時、ユーザが選択したもの。
 "Similarity"か"Matched"
 * @param database:Run Query時、ユーザが選択した検索をかけるデータベース
 * @param scoreMatrix:Run Query時、ユーザが選択したスコア行列の種類
 * @param mode:ユーザが選択したmiode
 */
function KCFOut(nodeFormat, edgeFormat, bracketFormat, nodes, structures, kindRunQuery, database, scoreMatrix, mode){
    let textArea = document.getElementById("kcf_format");
    let str;
    let str2;
    let str3 = "";
    let url;
    if(mode === 8){
        str = "ENTRY"+ TAB + TAB + TAB + "Glycan" + NEW_LINE + "NODE" + TAB + TAB + nodes.length + NEW_LINE;
        str2 = "EDGE" + TAB + TAB + structures.length + NEW_LINE;

    }
    //"Run Query"機能の場合、URLエンコーディングする
    else if(mode === 9){
        let date = new Date();
        url = "http://www.rings.t.soka.ac.jp/cgi-bin/runmatching.pl?DrawRINGS" + date.getTime() + ".txt~";
        str = "ENTRY" + URL_TAB + "Glycan" + URL_NEW_LINE + "NODE" + URL_TAB + nodes.length + URL_NEW_LINE;
        str2 = "EDGE" + URL_TAB + structures.length + URL_NEW_LINE;
    }

    for(let i = 0; i < nodeFormat.length; i++){
        str += nodeFormat[i];
    }

    for(let i = 0; i < edgeFormat.length; i++){
        str2 += edgeFormat[i];
    }

    if(bracketFormat.length != 0){
        str3 =  "BRACKET";
        for(let i = 0; i < bracketFormat.length; i++){
            str3 += bracketFormat[i];
        }
    }


    if(mode === 8) {
        textArea.value = str + str2 +  str3 + SLASH;
    }
    else if(mode === 9) {
        let runQueryUrl = url + str + str2 + SLASH + WAVE + scoreMatrix.value + WAVE;
        let kindRunQueryResultType;
        for (let i = 0; i < kindRunQuery.length; i++){
            if (kindRunQuery[i].checked == true) {
                kindRunQueryResultType = kindRunQuery[i].value;
            }
        }
        runQueryUrl += kindRunQueryResultType + WAVE + database.value;

        //ブラウザ上に新しいタブで開く形で検索を行う。
        window.open(runQueryUrl,"_blank");
    }
}

export { createKCF };
