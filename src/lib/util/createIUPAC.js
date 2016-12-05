"use strict";

import { edgeInformationParser } from './edge_information_parser';

const ANOMER = /a|b/;
const N_ACETYL_LOWWER = /nac/g;
const N_ACETYL_UPPER = "NAc";

function createIUPAC(nodes, structures) {
    let textArea = document.getElementById("kcf_format");
    textArea.value = "";
    let IUPACFormat = [];
    let rootNode = nodes[0];
    for(let i = 0; i < structures.length; i++) {
        if (rootNode.xCood < structures[i].parentNode.xCood) {
            rootNode = structures[i].parentNode;
        }
    }
    let counter = rootNode.childNode.length - 1;
    IUPACFormat.push("?-");
    recursiveSearchStructure(rootNode, structures, IUPACFormat, counter);
    if(IUPACFormat[IUPACFormat.length - 1] === "("){
        IUPACFormat.splice(IUPACFormat.length - 1,1);
    }
    while(IUPACFormat.length != 0){
        textArea.value += IUPACFormat.pop()
    }
    // for(let i = 0; i < IUPACFormat.length; i++){
    //     textArea.value += IUPACFormat[i];
    // }

}

function recursiveSearchStructure(parentNode, structures, IUPACFormat, counter){
    let name = parentNode.name.charAt(0).toUpperCase() + parentNode.name.slice(1);
    if(N_ACETYL_LOWWER.test(name)){
        name = name.replace(N_ACETYL_LOWWER, N_ACETYL_UPPER);
    }
    IUPACFormat.push(name);
    let parentParsed = null;
    let childParsed = null;
    // counter = parentNode.childNode.length - 1;
    if(parentNode.childNode.length === 0){
        if(counter != 0){
            IUPACFormat.push("(");
        }
        return;
    }
    for(let i = 0; i < parentNode.childNode.length; i++){
        if(parentNode.childNode.length > 1){
            if(counter > 0) {
                IUPACFormat.push(")");
                counter--;
            }
        }

        for(let j = 0; j < structures.length; j++){
            if(parentNode === structures[j].parentNode && parentNode.childNode[i] === structures[j].childNode){
                let parsedEdgeInformations = edgeInformationParser(structures[j]);
                parentParsed = parsedEdgeInformations[0];
                childParsed = parsedEdgeInformations[1];
                let anomerPosition = parentParsed.match(ANOMER);
                if(anomerPosition === null){
                    anomerPosition = "?";
                }
                IUPACFormat.push(childParsed);
                IUPACFormat.push(anomerPosition);
                recursiveSearchStructure(parentNode.childNode[i], structures, IUPACFormat, parentNode.childNode[i].childNode.length - 1);
                break;
            }
        }
    }
}
export { createIUPAC };