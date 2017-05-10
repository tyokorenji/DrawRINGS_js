"use strict";

import Node from '../node';
import Structure from '../structure';
import * as stageEdit from './edit_stage';
import * as createjs from '../../../bower_components/EaselJS';
import { setCoordinate }  from './set_coordinate';
import Bracket from './bracket';
import { createRepeatBracket, setBracket, searchFourCorner} from './create_bracket';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR } from './monosaccharide_helper';

/**
 * "Draw KCF"機能のためのクラス
 */
class KCFParser {
    constructor(text) {
        this.text = text;
    }
    parse(canvas, stage) {
        let lines = removeNullLines(generateLines(this.text));

        //KCF形式の文法にエラーがあるかの確認をする
        if (checkSyntax(lines) === false) {
            // TODO: 読み込みエラー. 文法にエラーがある.
            return null;
        }

        let result = analyzeLines(lines);
        let brackets = [];
        //Bracketクラスを作成
        if(result[2].length != 0) {
            brackets = analyzeBrackets(result[0], result[2]);
        }

        //それぞれの情報からcanvas上に構造を描画していく
        return connectStructures(result[0], result[1], brackets, canvas, stage);

    }
}

/**
 * Bracketを作成するために一時的に情報を保存しておくクラス
 */
class parsedBrackets {
    constructor(top_left, bottom_left, bottom_right, top_right, nText){
        this.top_left = top_left;
        this.bottom_left = bottom_left;
        this.bottom_right = bottom_right;
        this.top_right = top_right;
        this.nText = nText;
    }
}

// i オプションをつけることで、大文字・小文字を区別しないでマッチングさせる.
const FLAGS = {
    ENTRY_FLAG: /^ENTRY/i,
    ENTRY_GLYCAN_FLAG: /Glycan/i,

    NODE_FLAG: /^NODE/i,
    EDGE_FLAG: /^EDGE/i,
    BRACKET_FLAG: /^BRACKET/i,
    TERMINAL_FLAG: /^\/\/\/$/
};
const SPACE_SEPARATOR = /\s+/;
const TOKEN_SEPARATOR = /:/;
const ALPHA_BETA_CHECK = /a|b/i;

/**
 * KCFファイルから読み込んだ文字列情報を行頭/行末から
 空白文字が除去された形で行ごとに配列化する.
 * @param text KCFファイル文字列.
 * @returns {Array|*} 行単位に分割されたKCFファイル情報配列
 * .
 */
function generateLines(text) {
    "use strict";
    const LINE_SEPARATOR = /\r\n|\r|\n/;
    let lines = text.split(LINE_SEPARATOR);
    for (let i=0; i<lines.length; i++) {
        lines[i] = lines[i].trim();
    }
    return lines;
}

/**
 * KCFファイル情報を含む配列中から、空白文字 "" だけの要素を除去する.
 * @param lines 行単位に分割されたKCFファイル情報配列.
 * @returns {Array} 空白文字要素が除去されたKCFファイル情報配列.
 */
function removeNullLines(lines) {
    "use strict";
    let result = [];
    for (let i=0; i<lines.length; i++) {
        if (lines[i]) {
            result.push(lines[i]);
        }
    }
    return result;
}

/**
 * KCFファイルの文法をチェックする.
 * @param lines KCFファイル情報配列.
 * @returns {boolean} 文法エラーがなければ
 true、文法エラーがあるならば false.
 */
function checkSyntax(lines) {
    "use strict";
    let hasEntry = false;
    let hasNode = false;
    let hasEdge = false;
    let hasTerminal = false;

    if (!Number.parseInt) {
        Number.parseInt = parseInt;
    }

    //"ENTRY"、"NODE"、"EDGGE"、"///"が有るか確認。ないとエラーとしてKCF出力をしない。
    for (let i=0; i<lines.length; i++) {
        let line = lines[i];
        if (FLAGS.ENTRY_FLAG.test(line)) {
            let entryHeader = line.split(SPACE_SEPARATOR);
            if (FLAGS.ENTRY_GLYCAN_FLAG.test(entryHeader[entryHeader.length - 1])) {
                hasEntry = true;
            }

        } else if (FLAGS.NODE_FLAG.test(line)) {
            let nodeHeader = line.split(SPACE_SEPARATOR);
            let nodeSize = Number.parseInt(nodeHeader[nodeHeader.length - 1]);
            hasNode = true;
            i += nodeSize;

        } else if (FLAGS.EDGE_FLAG.test(line)) {
            let edgeHeader = line.split(SPACE_SEPARATOR);
            let edgeSize = Number.parseInt(edgeHeader[edgeHeader.length - 1]);
            hasEdge = true;
            i += edgeSize;

        } else if (FLAGS.TERMINAL_FLAG.test(line)) {
            hasTerminal = true;
        }
    }

    return hasEntry && hasNode && hasEdge && hasTerminal;
}

/**
 * KCF形式をそれぞれの項目ごとに分ける関数
 * @param lines: textareaのKCF形式を一行ごとにわけた配列
 */
function analyzeLines(lines) {
    let nodeLines = [];
    let edgeLines = [];
    let bracketLines = [];

    if (!Number.parseInt) {
        Number.parseInt = parseInt;
    }

    for (let i=0; i<lines.length; i++) {
        let line = lines[i];
        //NODEの項目の処理
        if (FLAGS.NODE_FLAG.test(line)) {
            let nodeHeader = line.split(SPACE_SEPARATOR);
            let nodeSize = Number.parseInt(nodeHeader[nodeHeader.length - 1]);
            for (let j=0; j<nodeSize; j++) {
                nodeLines.push(lines[i + j + 1]);
            }
            i += nodeSize;
        //EDGEの項目の処理
        } else if (FLAGS.EDGE_FLAG.test(line)) {
            let edgeHeader = line.split(SPACE_SEPARATOR);
            let edgeSize = Number.parseInt(edgeHeader[edgeHeader.length - 1]);
            for (let j=0; j<edgeSize; j++) {
                edgeLines.push(lines[i + j + 1]);
            }
            i += edgeSize;
        // BRACKETの項目の処理
        } else if(FLAGS.BRACKET_FLAG.test(line)){
            for(let j = i; ;j++){
                line = lines[j];
                if(FLAGS.TERMINAL_FLAG.test(line)){
                    i = j - 1;
                    break;
                }
                else {
                    bracketLines.push(line);
                }
            }
        }
    }
    //それぞれ処理した項目ごとにオブジェクトを作成する
    let nodesObj = parseNodes(nodeLines);
    let edgesObj = parseEdges(edgeLines, nodesObj);
    let bracketObj = {};
    if(bracketLines.length != 0) {
        bracketObj = parseBracket(bracketLines);
    }
    let nodesAry = [];
    let edgesAry = [];
    let bracketAry = [];
    //得られたそれぞれのオブジェクトを、処理しやすいように配列に変換
    for(let i = 0; i < Object.keys(nodesObj).length; i++){
        nodesAry.push(nodesObj[Object.keys(nodesObj)[i]]);
    }
    for(let i = 0; i < Object.keys(edgesObj).length; i++){
        edgesAry.push(edgesObj[Object.keys(edgesObj)[i]]);
    }
    if(bracketObj != null) {
        for (let i = 0; i < Object.keys(bracketObj).length; i++) {
            bracketAry.push(bracketObj[Object.keys(bracketObj)[i]]);
        }
    }
    return [nodesAry, edgesAry, bracketAry];
}

/**
 *NODEの項目から得られた情報からNodeクラスを作成し、
 それを１つのオブジェクトに格納する関数
 * @param lines:NODEの項目から得られた情報
 * @returns :Nodeクラスを複数もつオブジェクト
 */
function parseNodes(lines) {
    let nodesObj = {};
    for (let i=0; i<lines.length; i++) {
        let line = lines[i];
        let tokens = line.split(SPACE_SEPARATOR);
        // Node は各行ごとに 2 個以上のトークンが必要とする.
        if (tokens.length < 2) {
            return null;
        }

        let id = tokens[0];
        let name = tokens[1];
        let xCood = tokens[2];
        let yCood = tokens[3];
        if (nodesObj[id] !== undefined) {
            return null;
        }
        // TODO: Node の constructor 側で name から Sugar/Modification の判定を行っておく.
        // name = name.toLowerCase();
        nodesObj[id] = new Node(id, name, xCood, yCood);
    }
    return nodesObj;
}

/**
 * EDGEの項目から得られた情報からStructureクラスを作成し、
 それを１つのオブジェクトに格納する関数
 * @param lines:EDGEの項目から得られた情報
 * @param nodeObj:parseNodesで作成した
 Nodeクラスを複数持つオブジェクト
 * @returns :Structureクラスを複数もつオブジェクト
 */
function parseEdges(lines, nodesObj) {
    let edgesObj = {};
    for (let i=0; i<lines.length; i++) {
        let line = lines[i];
        let tokens = line.split(SPACE_SEPARATOR);
        // Edge は各行ごとに 3 個のトークンが必要とする.
        if (tokens.length !== 3) {
            return null;
        }

        let id = tokens[0];
        let lToken = tokens[1];
        let rToken = tokens[2];
        if (edgesObj[id] !== undefined) {
            return null;
        }

        let genObj = generateConnection(lToken, rToken, nodesObj);
        let child = genObj.child;
        let parent = genObj.parent;
        let edgeInfo = genObj.edgeInfo;

        edgesObj[id] = new Structure(id, parent, child, edgeInfo);
    }
    return edgesObj;
}
/**
* BRACKETの項目から得られた情報からparsedBracketsクラスを作成し、
 それを１つのオブジェクトに格納する関数
* @param lines:BRACKETの項目から得られた情報
* @returns :parsedBracketsクラスを複数もつオブジェクト
*/
function parseBracket(lines){
    let bracketObj = {};
    for(let i = 0; i < lines.length; i++){
        let line = lines[i];
        let line2 = lines[i+1];
        let line3 = lines[i+2];
        let tokens = line.split(SPACE_SEPARATOR);
        let tokens2 = line2.split(SPACE_SEPARATOR);
        let tokens3 = line3.split(SPACE_SEPARATOR);
        if(i === 0){
            tokens.splice(0, 1);
        }
        tokens2.splice(0, 1);
        tokens3.splice(0, 1);
        let id = tokens[0];
        let top_left = [parseInt(tokens[1]), parseInt(tokens[2])];
        let bottom_left = [parseInt(tokens[3]), parseInt(tokens[4])];
        let bottom_right = [parseInt(tokens2[0]), parseInt(tokens2[1])];
        let top_right = [parseInt(tokens2[2]), parseInt(tokens2[3])];
        let nText = tokens3[0];

        bracketObj[id] = new parsedBrackets(top_left, bottom_left, bottom_right, top_right, nText);
        i = i + 2;
    }
    return bracketObj;
}

/**
 * 作成した配列からBracketクラスを生成する関数
 * @param nodes: NODEの項目から得られたNodeクラスの配列
 * @param parseBrackets:BRACKETの項目から得られた一時的に
 情報を保存するparseBracketクラスの配列
 * @returns :作成したBracketクラスの配列
 */
function analyzeBrackets(nodes, parseBrackets){
    let brackets = [];
    for(let i = 0; i < nodes.length; i++){
        nodes[i].xCood = parseInt(nodes[i].xCood);
        nodes[i].yCood = parseInt(nodes[i].yCood);
    }
    for(let i = 0; i < parseBrackets.length; i++) {
        let bracketsObj = new Bracket();
        bracketsObj.startBracket.numOfRepeatText = parseBrackets[i].nText;
        for (let j = 0; j < nodes.length; j++) {
            let targetBracket = parseBrackets[i];
            if(targetBracket.top_left[0] <= nodes[j].xCood && targetBracket.top_left[1] <= nodes[j].yCood &&
                targetBracket.bottom_right[0] >= nodes[j].xCood && targetBracket.bottom_right[1] >= nodes[j].yCood){
                    bracketsObj.repeatNodes.push(nodes[j]);
            }
        }
        brackets.push(bracketsObj);
    }
    return brackets;
}

/**
 * KCF形式の、EDGEの項目で、どの値が親か子かを　判別する関数
 * @param lToken:EDGEの項目の、結合情報を書いている場所の左側にある項目
 * @param rToken:EDGEの項目の、結合情報を書いている場所の右側にある項目
 * @param nodesObj:NODEの項目から得られたオブジェクト
 * @returns {{child: 子Node, parent: 親Node, edgeInfo: 結合情報}}
 */
function generateConnection(lToken, rToken, nodesObj) {
    let lTokens = lToken.split(TOKEN_SEPARATOR);
    let rTokens = rToken.split(TOKEN_SEPARATOR);

    let child = null;
    let parent = null;
    let edgeInfo = "";

    if (lTokens.length === 1 && rTokens.length === 1) {
        // 左も右も結合情報皆無 ---> 左を子として優先.
        child = nodesObj[lTokens[0]];
        parent = nodesObj[rTokens[0]];
        edgeInfo = "";

    } else if (rTokens.length === 1) {
        // 右には結合情報皆無, 左には結合情報あり ("a1", "4")
        if (ALPHA_BETA_CHECK.test(lTokens[1])) {
            // 左側が非還元末端 (子側)
            child = nodesObj[lTokens[0]];
            parent = nodesObj[rTokens[0]];
        } else {
            // 右側が非還元末端 (子側)
            child = nodesObj[rTokens[0]];
            parent = nodesObj[lTokens[0]];
        }
        edgeInfo = lTokens[1] + "-";

    } else if (lTokens.length === 1) {
        // 左には結合情報皆無, 右には結合情報あり ("a1", "4")
        if (ALPHA_BETA_CHECK.test(rTokens[1])) {
            // 右側が非還元末端 (子側)
            child = nodesObj[rTokens[0]];
            parent = nodesObj[lTokens[0]];
        } else {
            // 左側が非還元末端 (子側)
            child = nodesObj[lTokens[0]];
            parent = nodesObj[rTokens[0]];
        }
        edgeInfo = "-" + rTokens[1];

    } else {
        // lTokens.length === rTokens.length === 2 ---> 通常の単糖
        if (ALPHA_BETA_CHECK.test(rTokens[1])) {
            // 右側が非還元末端 (子側)
            child = nodesObj[rTokens[0]];
            parent = nodesObj[lTokens[0]];
        } else {
            // 左側が非還元末端 (子側)
            child = nodesObj[lTokens[0]];
            parent = nodesObj[rTokens[0]];
        }
        edgeInfo = lTokens[1] + "-" + rTokens[1];
    }

    return {
        child: child,
        parent: parent,
        edgeInfo: edgeInfo
    };
}


/**
 * 得られたそれぞれの情報が入った配列から構造をcanvas上に描画していく関数
 * @param nodes:Nodeクラスの配列
 * @param edges:Structureクラスの配列
 * @param brackets:Bracketクラスの配列
 * @param canvas:HTMLのcanvas
 * @param stage:EaselJDのstage
 * @returns :それぞれのクラスの入った配列
 */
function connectStructures(nodes, edges, brackets, canvas, stage) {
    setCoordinate(nodes, edges, canvas);
    //設定した座標を基にそれぞれのNodeやEdgeをcanvas上に可視化する
    upStage(edges, brackets, stage);
    for(let i = 0; i < nodes.length; i++){
        nodes[i].sprite.parentNode = nodes[i];
    }
    return [nodes, edges, brackets]


}

/**
 * 算出した座標をもとに、各Nodeや、Edgeをcanvas状に可視化する
 * @param edges:Structureクラスの入った配列
 * @param brackets:Bracketクラスの入った配列
 * @param stage:EaselJSのstage
 */
function upStage(edges, brackets, stage){
    let line = null;
    let text = null;
    let addedNodes = [];
    let parentCounter = 0;
    let childCounter = 0;
    //Edgeを描画
    for(let i = 0; i < edges.length; i++){
        line = new createjs.Shape();
        line.graphics.setStrokeStyle(3)
            .beginStroke("#000")
            .moveTo(edges[i].parentNode.xCood, edges[i].parentNode.yCood)
            .lineTo(edges[i].childNode.xCood, edges[i].childNode.yCood);
        edges[i].edge = line;
        //Nodeの描画。すでに描画されていないか確認後描画している
        for(let j = 0; j < addedNodes.length; j++) {
            if (addedNodes[j] === edges[i].parentNode) {
                parentCounter++;
            }
            else if(addedNodes[j] === edges[i].childNode){
                childCounter++;
            }
        }
        if(parentCounter === 0) {
            edges[i].parentNode.sprite = edges[i].parentNode.sprite.nodeDraw(edges[i].parentNode.name, edges[i].parentNode.xCood, edges[i].parentNode.yCood, stage);
            addedNodes.push(edges[i].parentNode);
        }
        if(childCounter === 0) {
            edges[i].childNode.sprite = edges[i].childNode.sprite.nodeDraw(edges[i].childNode.name, edges[i].childNode.xCood, edges[i].childNode.yCood, stage);
            addedNodes.push(edges[i].childNode);
        }
        stageEdit.stageEdge(edges[i], stage);
        //結合情報の描画
        text = new createjs.Text(edges[i].edgeInformationText, "12px serif", "rgb(255,0,0)");
        text.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
        text.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2;
        edges[i].edgeInformation = text;
        stageEdit.setStage(stage, text);
        stageEdit.stageUpdate(stage);
        parentCounter = 0;
        childCounter = 0;
        // addedNodes.push(edges[i].childNode);
    }
    //Bracketの描画
    for(let i = 0; i < brackets.length; i++) {
        let resultsFourCorner = searchFourCorner(brackets[i].repeatNodes);
        let n = new createjs.Text(brackets[i].startBracket.numOfRepeatText, "20px serif", getLineColor("black"));
        setBracket(resultsFourCorner, edges, brackets[i], n, stage);
    }
}



export { KCFParser, connectStructures };