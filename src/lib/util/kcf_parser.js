"use strict";

import Node from '../node';
import Structure from '../structure';
import * as stageEdit from './edit_stage';
import * as createjs from '../../../bower_components/EaselJS';
import { setCoordinate }  from './set_coordinate';


class KCFParser {
    constructor(text) {
        this.text = text;
    }
    parse(canvas, stage) {
        let lines = removeNullLines(generateLines(this.text));

        if (checkSyntax(lines) === false) {
            // TODO: 読み込みエラー. 文法にエラーがある.
            return null;
        }

        let result = analyzeLines(lines);

        return connectStructures(result[0], result[1], canvas, stage);
        //return result;

        // DrawKCF(this.text);
    }
}

// i オプションをつけることで、大文字・小文字を区別しないでマッチングさせる.
const FLAGS = {
    ENTRY_FLAG: /^ENTRY/i,
    ENTRY_GLYCAN_FLAG: /Glycan/i,

    NODE_FLAG: /^NODE/i,
    EDGE_FLAG: /^EDGE/i,
    TERMINAL_FLAG: /^\/\/\/$/
};
const SPACE_SEPARATOR = /\s+/;
const TOKEN_SEPARATOR = /:/;
const ALPHA_BETA_CHECK = /a|b/i;

/**
 * KCFファイルから読み込んだ文字列情報を行頭/行末から空白文字が除去された形で行ごとに配列化する.
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
 * @returns {boolean} 文法エラーがなければ true、文法エラーがあるならば false.
 */
function checkSyntax(lines) {
    "use strict";
    let hasEntry = false;
    let hasNode = false;
    let hasEdge = false;
    let hasTerminal = false;

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

function analyzeLines(lines) {
    let nodeLines = [];
    let edgeLines = [];

    for (let i=0; i<lines.length; i++) {
        let line = lines[i];
        if (FLAGS.NODE_FLAG.test(line)) {
            let nodeHeader = line.split(SPACE_SEPARATOR);
            let nodeSize = Number.parseInt(nodeHeader[nodeHeader.length - 1]);
            for (let j=0; j<nodeSize; j++) {
                nodeLines.push(lines[i + j + 1]);
            }
            i += nodeSize;

        } else if (FLAGS.EDGE_FLAG.test(line)) {
            let edgeHeader = line.split(SPACE_SEPARATOR);
            let edgeSize = Number.parseInt(edgeHeader[edgeHeader.length - 1]);
            for (let j=0; j<edgeSize; j++) {
                edgeLines.push(lines[i + j + 1]);
            }
            i += edgeSize;

        }
    }
    let nodesObj = parseNodes(nodeLines);
    let edgesObj = parseEdges(edgeLines, nodesObj);
    /*
    let structures = null;
    if (nodes && edges) {
        structures = connectStructures(nodes, edges);
    }
    return structures;
    */
    let nodesAry = [];
    let edgesAry = [];
    for(let i = 0; i < Object.keys(nodesObj).length; i++){
        nodesAry.push(nodesObj[Object.keys(nodesObj)[i]]);
    }
    for(let i = 0; i < Object.keys(edgesObj).length; i++){
        edgesAry.push(edgesObj[Object.keys(edgesObj)[i]]);
    }
    return [nodesAry, edgesAry];
}

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



function connectStructures(nodes, edges, canvas, stage) {
    setCoordinate(nodes, edges, canvas);
    upStage(edges, stage);
    for(let i = 0; i < nodes.length; i++){
        nodes[i].sprite.parentNode = nodes[i];
    }
    return [nodes, edges]


}


function upStage(edges, stage){
    let line = null;
    let text = null;
    let addedNodes = [];
    let parentCounter = 0;
    let childCounter = 0;
    for(let i = 0; i < edges.length; i++){
        line = new createjs.Shape();
        line.graphics.setStrokeStyle(3)
            .beginStroke("#000")
            .moveTo(edges[i].parentNode.xCood, edges[i].parentNode.yCood)
            .lineTo(edges[i].childNode.xCood, edges[i].childNode.yCood);
        edges[i].edge = line;
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
}



export { KCFParser, connectStructures };