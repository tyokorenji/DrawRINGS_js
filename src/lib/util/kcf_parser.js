"use strict";

import Node from '../node';
import Structure from '../structure';

class KCFParser {
    constructor(text) {
        this.text = text;
    }
    parse() {
        let lines = removeNullLines(generateLines(this.text));

        if (checkSyntax(lines) === false) {
            // TODO: 読み込みエラー. 文法にエラーがある.
            return null;
        }

        let result = analyzeLines(lines);
        //return result;

        DrawKCF(this.text);
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
    return edgesObj;
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
        if (nodesObj[id] !== undefined) {
            return null;
        }
        // TODO: Node の constructor 側で name から Sugar/Modification の判定を行っておく.
        nodesObj[id] = new Node(id, name);
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

        edgesObj[id] = new Structure(id, child, parent, edgeInfo);
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



function connectStructures(nodes, edges) {

}

function DrawKCF(KCFtext) {
    let text = KCFtext.replace(/\s/g, "space");
    let splitKCFs = text.split("space");
    // if(mode === 4){
    //     splitKCFs =
    // }
    let DrawKCFNodeObject = function(number, monosaccharide, x, y){
        this.nodeNumber = number;
        this.monosaccharide = monosaccharide;
        this.paramX = x;
        this.paramY = y;
    }
    let DrawKCFEdgeObject = function(anomer, childId, childLinkagePosition, parentId, parentLinkagePosition){
        this.anomer = anomer;
        this.childId = childId;
        this.childLinkagePsition = childLinkagePosition;
        this.parentId = parentId;
        this.parentLinkagePosition = parentLinkagePosition;
    }
    let DrawKCFNodeObjects = new Array();
    let DrawKCFNodeObjectsKey = 0;
    let DrawKCFEdgeObjects = new Array;
    let DrawKCFEdgeObjectKey = 0;
    let i;
    for(i = 0; i < splitKCFs.length; i++){
        if(splitKCFs[i] === ""){
            splitKCFs.splice(i,1);
            i--;
        }
    }
    if(splitKCFs[0] != "ENTRY"){
        alert("please write KCF format.\n for exsample \" ENTRY    Glycan...\"");
        return;
    }
    else if(splitKCFs[2] != "NODE"){
        return;
    }
    else{
        for(i = 4; i < splitKCFs.length; i = i + 4) {
            if(splitKCFs[i] === "EDGE"){
                break;
            }
            else {
                let DrawKCFNode = new DrawKCFNodeObject(splitKCFs[i],splitKCFs[i + 1], splitKCFs[i + 2], splitKCFs[i + 3]);
                DrawKCFNodeObjects[DrawKCFNodeObjectsKey] = DrawKCFNode;
                DrawKCFNodeObjectsKey++;
            }
        }
        i = i + 2;
        for( i; i < splitKCFs.length; i = i + 3 ){
            if(splitKCFs[i] === SLASH){
                break;
            }
            let childNodeInformations = splitKCFs[i+1].split("");
            let parentNodeInformations = splitKCFs[i+2].split("");
            let DrawKCFEdge = new DrawKCFEdgeObject(childNodeInformations[2], childNodeInformations[0], childNodeInformations[3], parentNodeInformations[0], parentNodeInformations[2]);
            DrawKCFEdgeObjects[DrawKCFEdgeObjectKey] = DrawKCFEdge;
            DrawKCFEdgeObjectKey++;
        }
    }
    buildGlycan(DrawKCFNodeObjects, DrawKCFEdgeObjects);
    console.log(splitKCFs);
};

export { KCFParser };