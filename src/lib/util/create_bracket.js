"use strict";

import * as createjs from '../../../bower_components/EaselJS';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR } from './monosaccharide_helper';
import * as stageEdit from './edit_stage';
import Braket  from './bracket.js';


function createRepeatBracket(moveStructureNodes, structures, stage){
    let bracketObj = new Braket();
    bracketObj.startBracket.numOfRepeatText = document.getElementById("repeatN").value;
    let n = new createjs.Text(bracketObj.startBracket.numOfRepeatText, "20px serif", getLineColor("black"));
    for(let i = 0; i < moveStructureNodes.length; i++){
        moveStructureNodes[i] = moveStructureNodes[i].parentNode;
    }
    let resultsFourCorner = searchFourCorner(moveStructureNodes);
    setBracket(resultsFourCorner, structures, bracketObj, n, stage);
    for(let i = 0; i < moveStructureNodes.length; i++){
        bracketObj.repeatNodes.push(moveStructureNodes[i]);
    }
    let rootNode = searchRootNode(structures);
    let repeatKey = [];
    sortRepeatNode(bracketObj, rootNode, repeatKey);
    bracketObj.repeatNodes = repeatKey;
    return bracketObj;

}

function sortRepeatNode(bracketObj, parentNode, repeatKey){
    for(let i = 0; i  < bracketObj.repeatNodes.length; i++){
        if(parentNode === bracketObj.repeatNodes[i]){
            repeatKey.push(parentNode);
        }
    }
    for(let i = 0; i < parentNode.childNode.length; i++){
        sortRepeatNode(bracketObj, parentNode.childNode[i], repeatKey);
    }
}

function searchRootNode(structures){
    let rootNode = structures[0].parentNode;
    for(let i = 1; i < structures.length; i++){
        if(rootNode.xCood < structures[i].parentNode.xCood){
            rootNode = structures[i].parentNode;
        }
    }
    return rootNode;
}

function setBracket(fourCorner, structures, bracketObj, n, stage){
    let counter= 0;
    let distance = 20;
    for(let i = 0; i < structures.length; i++){
        if(fourCorner[1] === structures[i].childNode){
            createStartBracket(fourCorner, structures[i], bracketObj, distance, stage);
            counter++;
            break;
        }
    }
    if(counter === 0){
        createRootStartBracket(fourCorner, bracketObj, distance, stage);
    }

    counter = 0;

    for(let i = 0; i < structures.length; i++){
        if(fourCorner[3] === structures[i].parentNode){
            createEndBracket(fourCorner, structures[i], bracketObj, distance, stage);
            counter++;
            break;
        }
    }
    if(counter === 0){
        createRootEndBracket(fourCorner, bracketObj, distance, stage);
    }

    setRepeat(fourCorner, n, bracketObj.startBracket.structure, distance);
    bracketObj.startBracket.numOfRepeatShape = n;
    upStage(n, stage);

    return bracketObj;
}

function setRepeat(fourCorner, n, startBracketStructure, distance){
    if(startBracketStructure === null){
        n.x = fourCorner[1].xCood + distance;
        n.y = fourCorner[2].yCood - 5;
    }
    else {
        n.x = (startBracketStructure.edge.graphics._activeInstructions[0].x + startBracketStructure.edge.graphics._activeInstructions[1].x) / 2 + distance;
        n.y = fourCorner[2].yCood + distance - 5;
    }

}

function createEndBracket(fourCorner, structure, bracketObj, distance, stage){
    bracketObj.endBracket.bracketShape = new createjs.Shape();
    bracketObj.endBracket.bracketShape.graphics.setStrokeStyle(5)
        .beginStroke(getLineColor("black"))
        .moveTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2 + distance, fourCorner[0].yCood - distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2, fourCorner[0].yCood - distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2, fourCorner[2].yCood + distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2 + distance, fourCorner[2].yCood + distance);
    bracketObj.endBracket.structure = structure;
    bracketObj.endBracket.node = fourCorner[3];
    fourCorner[3].bracket = bracketObj;
    upStage(bracketObj.endBracket.bracketShape, stage);
}

function createRootEndBracket(fourCorner, bracketObj, distance, stage){
    bracketObj.endBracket.bracketShape = new createjs.Shape();
    bracketObj.endBracket.bracketShape.graphics.setStrokeStyle(5)
        .beginStroke(getLineColor("black"))
        .moveTo(fourCorner[3].xCood, fourCorner[0].yCood - distance)
        .lineTo(fourCorner[3].xCood - distance, fourCorner[0].yCood - distance)
        .lineTo(fourCorner[3].xCood - distance, fourCorner[2].yCood + distance)
        .lineTo(fourCorner[3].xCood, fourCorner[2].yCood + distance);
    bracketObj.endBracket.node = fourCorner[3];
    fourCorner[3].bracket = bracketObj;
    upStage(bracketObj.endBracket.bracketShape, stage);
}

function createStartBracket(fourCorner, structure, bracketObj, distance, stage){
    bracketObj.startBracket.bracketShape = new createjs.Shape();
    bracketObj.startBracket.bracketShape.graphics.setStrokeStyle(5)
        .beginStroke(getLineColor("black"))
        .moveTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2 - distance, fourCorner[0].yCood - distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2, fourCorner[0].yCood - distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2, fourCorner[2].yCood + distance)
        .lineTo((structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2 - distance, fourCorner[2].yCood + distance);
    bracketObj.startBracket.structure = structure;
    bracketObj.startBracket.node = fourCorner[1];
    fourCorner[1].bracket = bracketObj;
    upStage(bracketObj.startBracket.bracketShape, stage);
}

function createRootStartBracket(fourCorner, bracketObj, distance, stage){
    bracketObj.startBracket.bracketShape = new createjs.Shape();
    bracketObj.startBracket.bracketShape.graphics.setStrokeStyle(5)
        .beginStroke(getLineColor("black"))
        .moveTo(fourCorner[1].xCood, fourCorner[0].yCood - distance)
        .lineTo(fourCorner[1].xCood + distance, fourCorner[0].yCood - distance)
        .lineTo(fourCorner[1].xCood + distance, fourCorner[2].yCood + distance)
        .lineTo(fourCorner[1].xCood, fourCorner[2].yCood + distance);
    bracketObj.startBracket.node = fourCorner[1];
    fourCorner[1].bracket = bracketObj;
    upStage(bracketObj.startBracket.bracketShape, stage);
}

function searchFourCorner(selectedNodes){
    let mostRightNode = selectedNodes[0];
    let mostLeftNode = selectedNodes[0];
    let mostTopNode = selectedNodes[0];
    let mostBottomNode = selectedNodes[0];

    for(let i = 1; i < selectedNodes.length; i++) {
        if (mostRightNode.xCood < selectedNodes[i].xCood) mostRightNode = selectedNodes[i];
        else if (mostLeftNode.xCood > selectedNodes[i].xCood) mostLeftNode = selectedNodes[i];
        if (mostTopNode.yCood > selectedNodes[i].yCood) mostTopNode = selectedNodes[i];
        else if (mostBottomNode.yCood < selectedNodes[i].yCood) mostBottomNode = selectedNodes[i];
    }

    return [mostTopNode, mostRightNode, mostBottomNode, mostLeftNode];
}



function upStage(bracket, stage){
    stageEdit.setStage(stage, bracket);
    stageEdit.stageUpdate(stage);
}

export { createRepeatBracket, setBracket, searchFourCorner};
