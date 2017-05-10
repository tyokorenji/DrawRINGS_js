"use strict";

import { edgeInformationParser } from './edge_information_parser';
import { createRepeatBracket, setBracket ,searchFourCorner } from './create_bracket';
import Modification from '../Modification';
import Sugar from '../sugar';
/**
 * 使用する定数の宣言
 */
const ANOMER = /a|b/;
const N_ACETYL_LOWWER = /nac/g;
const N_ACETYL_UPPER = "NAc";
const DOUBLE_SLASH = "//";
const SPACE_SEPARATOR = /\s+/;
const UNKNOWN = "?";
/**
 * "IUPACTextOut"機能で使用する関数。メインとなる関数
 * @param nodes:canvas上にあるNodeクラスの配列
 * @param structures:canvas上にあるStructureクラスの配列
 * @param brackets:canvas上にあるBracketクラスの配列
 */
function createIUPAC(nodes, structures, brackets) {
    let textArea = document.getElementById("kcf_format");
    textArea.value = "";
    let IUPACFormat = [];
    let rootNode = nodes[0];
    let usedNodes = [];
    let rootBracket = 0;
    let bracket = null;

    // for(let i = 0; i < brackets.length; i++){
    //     parsedBracket(brackets[i]);
    // }

    //糖鎖構造のルートNodeの検索
    for(let i = 0; i < structures.length; i++) {
        if (rootNode.xCood < structures[i].parentNode.xCood) {
            rootNode = structures[i].parentNode;
        }
    }
    let counter = 0;

    // for(let i = 0; i < brackets.length; i++){
    //     bracket = brackets[i];
    //     for(let j = 0; j < bracket.repeatSugar.length; j++){
    //         if(rootNode === bracket.repeatSugar[j]){
    //             setStartBracket(IUPACFormat, bracket);
    //             rootBracket++;
    //         }
    //     }
    // }

    //IUPACFormatという配列にIUOAC形式を作っていくが、
    // DrawRINGSではルートNodeのアノマー位置など不明のため、"(?1-"と固定にしておく
    IUPACFormat.push("(?1-");
    let childModification = [];
    //ルートNodeクラスの子NodeでModificationのものを検索し、配列に入れている
    for(let i = 0; i < rootNode.childNode.length; i++){
        if (rootNode.childNode[i].sprite.constructor === Modification){
            childModification.push(rootNode.childNode[i]);
        }
    }
    //Structureクラスと照らし合わせて、Modificationクラスの子Nodeと、
    // ルートNodeの結合位置を検索し、IUPAC形式となるよう配列にpushしている。
    // また、その際「GlcNAc」などN-アセチル化している場合、「
    // NA」を大文字に変換している。
    for(let i = 0; i < childModification.length; i++){
        for(let j = 0; j < structures.length; j++){
            if(rootNode === structures[j].parentNode && childModification[i] === structures[j].childNode){
                let parsedEdgeInformations = edgeInformationParser(structures[j]);
                let childParsed = parsedEdgeInformations[1];
                let name = childModification[i].name.charAt(0).toUpperCase() + childModification[i].name.slice(1);
                if(N_ACETYL_LOWWER.test(name)){
                    name = name.replace(N_ACETYL_LOWWER, N_ACETYL_UPPER);
                }
                IUPACFormat.push(name);
                IUPACFormat.push(childParsed);
            }
        }
    }
    //ルートNodeの名前を配列に入れる
    let name = rootNode.name.charAt(0).toUpperCase() + rootNode.name.slice(1);
    if(N_ACETYL_LOWWER.test(name)){
        name = name.replace(N_ACETYL_LOWWER, N_ACETYL_UPPER);
    }
    IUPACFormat.push(name);
    usedNodes.push(rootNode);

    // if(rootBracket != 0){
    //     counter = setRecursiveRepeat(bracket,
    // IUPACFormat, structures, counter, rootNode, "?", usedNodes);
    //     rootBracket = null;
    // }
    // let parentNode = null;
    // for(let i = 0; i < usedNodes.length; i++){
    //     if(rootNode === usedNodes[i]){
    //
    //     }
    // }

    //再帰的に子NodeをたどってIUPAC形式を作成する
    recursiveSearchStructure(rootNode, structures, brackets, IUPACFormat, counter, usedNodes);

    // if(IUPACFormat[IUPACFormat.length - 1] === "["){
    //     IUPACFormat.splice(IUPACFormat.length - 1,1);
    // }

    //textareaに作成したIUPAC形式を表示する
    while(IUPACFormat.length != 0){
        textArea.value += IUPACFormat.pop();
    }
}

// function setRecursiveRepeat(bracket, IUPACFormat,
// structures, counter, parentNode, repeatHed, usedNodes){
//     let childSugars = [];
//     let childSugar = null;
//     let check = 0;
//     let childNodeModification = [];
//     // if(bracket.repeatSugar[bracket.repeatSugar.length - 1]
// === parentNode){
//     //     setEndBracket(IUPACFormat, repeatHed);
//     //     return counter;
//     // }
//     // else {
//         for(let i = 0; i < parentNode.childNode.length; i++) {
//             if (parentNode.childNode[i].sprite.constructor === Sugar) {
//                 childSugars.push(parentNode.childNode[i]);
//             }
//         }
//         let branchCounter = childSugars.length;
//
//         for (let i = 0; i < childSugars.length; i++) {
//             if (branchCounter >= 2) {
//                 IUPACFormat.push("]");
//                 branchCounter--;
//                 counter++;
//             }
//            for(let j = 0; j < bracket.repeatSugar.length; j++){
//                if(childSugars[i] === bracket.repeatSugar[j]){
//                    childSugar = childSugars[i];
//                    check++;
//                }
//            }
//            if(check === 0){
//                continue;
//            }
//             for(let j = 0; j < structures.length; j++){
//                 if(parentNode === structures[j].parentNode && childSugar ===
// structures[j].childNode){
//                     let parsedEdgeInformations = edgeInformationParser(structures[j]);
//                     let parentParsed = parsedEdgeInformations[0];
//                     let childParsed = parsedEdgeInformations[1];
//                     let anomerPosition = parentParsed.match(ANOMER);
//
//                     IUPACFormat.push(")");
//                     IUPACFormat.push(childParsed);
//
//                     IUPACFormat.push("-");
//                     if(anomerPosition === null){
//                         IUPACFormat.push(parentParsed);
//                         IUPACFormat.push(UNKNOWN);
//                     }
//                     else {
//                         IUPACFormat.push(parentParsed);
//                     }
//                     IUPACFormat.push("(");
//                 }
//             }
//             for(let j = 0; j < childSugar.childNode.length; j++){
//                 if(childSugar.childNode[j].sprite.constructor === Modification){
//                     childNodeModification.push(childSugar.childNode[j]);
//                 }
//             }
//             for(let j = 0; j < childNodeModification.length; j++){
//                 for(let l = 0; l < structures.length; l++){
//                     if(childSugar === structures[l].parentNode
// && childNodeModification[j] === structures[l].childNode){
//                         let parsedEdgeInformations =
// edgeInformationParser(structures[l]);
//                         let childParsed = parsedEdgeInformations[1];
//                         let name = childNodeModification[j].name.charAt(0).toUpperCase()
// + childNodeModification[j].name.slice(1);
//                         if(N_ACETYL_LOWWER.test(name)){
//                             name = name.replace(N_ACETYL_LOWWER, N_ACETYL_UPPER);
//                         }
//                         IUPACFormat.push(name);
//                         IUPACFormat.push(childParsed);
//                     }
//                 }
//             }
//             let name = childSugar.name.charAt(0).toUpperCase()
// + childSugar.name.slice(1);
//             if(N_ACETYL_LOWWER.test(name)){
//                 name = name.replace(N_ACETYL_LOWWER, N_ACETYL_UPPER);
//             }
//             IUPACFormat.push(name);
//             usedNodes.push(childSugar);
//             counter = setRecursiveRepeat(bracket, IUPACFormat,
// structures, counter, childSugar, repeatHed, usedNodes);
//             check++;
//         }
//         if(childSugars.length === 0){
//             if(counter > 0){
//                 IUPACFormat.push("[");
//                 counter--;
//                 return counter;
//             }
//         }
//     // }
//
// }

/**
 * 再帰的にIUPAC形式を作成する関数
 * @param parentNode:親Node
 * @param structures:canvas上にあるStructureクラスの配列
 * @param brackets:canvas上にあるBracketクラスの配列
 * @param IUPACFormat:IUPAC形式を作成している配列
 * @param counter:分岐の回数を表す
 * @param usedNodes:IUPACにすでに入れてしまったNode
 */
function recursiveSearchStructure(parentNode, structures, brackets, IUPACFormat, counter, usedNodes){
    let childSugars = [];
    let childNodeModification = [];
    let check = 0;

    // let bracketCounter = 0;
    // let bracketHeader = 0;
    // let spareBox = null;
    // let repeatHed = "";
    // let bracket = null;

    //親Nodeが持つ子NodeのうちSugarクラスのものを検索し、配列に入れている
    for(let i = 0; i < parentNode.childNode.length; i++){
        if(parentNode.childNode[i].sprite.constructor === Sugar){
            childSugars.push(parentNode.childNode[i]);
        }
    }

    //分岐があるか確認するための変数
    let branchCounter = childSugars.length;

    for(let i = 0; i < childSugars.length; i++){
        //分岐がある場合"]"を入れる
        if(branchCounter >= 2){
            IUPACFormat.push("]");
            branchCounter--;
            counter++;
        }
        let childSugar = childSugars[i];
        //これから見ていく子NodeがすでにIUPAC形式にしていないか確認している
        for(let j = 0; j < usedNodes.length; j++){
            if(childSugar === usedNodes[j]){
                check++;
            }
        }
        if(check != 0){
            check = 0;
            continue;
        }

        // for(let j = 0; j < brackets.length; j++){
        //     bracket = brackets[i];
        //     if(childSugar === bracket.repeatSugar[0]){
        //         setStartBracket(IUPACFormat, bracket);
        //         bracketCounter++;
        //         bracketHeader++;
        //     }
        // }

        //Structureクラスと照らし合わせて、結合位置を検索し、
        // IUPAC形式に成るよう配列に入れている
        for(let j = 0; j < structures.length; j++){
            if(parentNode === structures[j].parentNode && childSugar === structures[j].childNode){
                let parsedEdgeInformations = edgeInformationParser(structures[j]);
                let parentParsed = parsedEdgeInformations[0];
                let childParsed = parsedEdgeInformations[1];
                let anomerPosition = parentParsed.match(ANOMER);

                IUPACFormat.push(")");
                IUPACFormat.push(childParsed);

                IUPACFormat.push("-");
                if(anomerPosition === null){
                    IUPACFormat.push(parentParsed);
                    IUPACFormat.push(UNKNOWN);
                }
                else {
                    IUPACFormat.push(parentParsed);
                }
                IUPACFormat.push("(");
            }
        }
        //ルートNodeで行ったときと同様、Modificationクラスを検索し、
        // IUPAC形式に成るように配列に入れている
        for(let j = 0; j < childSugar.childNode.length; j++){
            if(childSugar.childNode[j].sprite.constructor === Modification){
                childNodeModification.push(childSugar.childNode[j]);
            }
        }
        for(let j = 0; j < childNodeModification.length; j++){
            for(let l = 0; l < structures.length; l++){
                if(childSugar === structures[l].parentNode && childNodeModification[j] === structures[l].childNode){
                    let parsedEdgeInformations = edgeInformationParser(structures[l]);
                    let childParsed = parsedEdgeInformations[1];
                    let name = childNodeModification[j].name.charAt(0).toUpperCase() + childNodeModification[j].name.slice(1);
                    if(N_ACETYL_LOWWER.test(name)){
                        name = name.replace(N_ACETYL_LOWWER, N_ACETYL_UPPER);
                    }
                    IUPACFormat.push(name);
                    IUPACFormat.push(childParsed);
                }
            }
        }
        //注目していた子Nodeを配列に入れる
        let name = childSugar.name.charAt(0).toUpperCase() + childSugar.name.slice(1);
        if(N_ACETYL_LOWWER.test(name)){
            name = name.replace(N_ACETYL_LOWWER, N_ACETYL_UPPER);
        }
        IUPACFormat.push(name);

        //注目していた子Nodeを親Nodeとして再帰的に呼び出す。
        counter = recursiveSearchStructure(childSugar, structures, brackets, IUPACFormat, counter, usedNodes);
    }
    //分岐の終わりを確認している
    if(childSugars.length === 0){
        if(counter > 0){
            IUPACFormat.push("[");
            counter--;
            return counter;
        }
    }
    // else {
    //     counter = recursiveSearchStructure(childSugar,
    // structures, brackets, IUPACFormat, counter, usedNodes);
    // }
}

/**
 * Bracketクラスの繰り返しNodeクラスの中で、
 * SugarクラスかModificationクラスか判別し配列に格納している。
 * @param bracket:Bracketクラス
 */
// function parsedBracket(bracket){
//     for(let i = 0; i < bracket.repeatNodes.length; i++){
//         if(bracket.repeatNodes[i].sprite.constructor === Sugar){
//             bracket.repeatSugar.push(bracket.repeatNodes[i]);
//         }
//         else {
//             bracket.repeatModification.push(bracket.repeatNodes[i]);
//         }
//     }
// }
//
// function setStartBracket(IUPACFormat, bracket){
//     IUPACFormat.push(bracket.startBracket.numOfRepeatText);
//     IUPACFormat.push("]");
// }
//
// function setEndBracket(IUPACFormat, childEdge){
//     IUPACFormat.push(")");
//     IUPACFormat.push(childEdge);
//     IUPACFormat.push("[");
// }

export { createIUPAC };