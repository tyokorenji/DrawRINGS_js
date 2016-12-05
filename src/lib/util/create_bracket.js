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
    return bracketObj;

    // let mostRightNode = moveStructureNodes[0].parentNode;
    // let mostLeftNode = moveStructureNodes[0].parentNode;
    // let childStructures = [];
    // let yDistance = -30;
    // let rightCounter = 0;
    // let bracketObj = new Braket();
    //
    // for(let i = 1; i < moveStructureNodes.length; i++){
    //     if(mostRightNode.xCood < moveStructureNodes[i].parentNode.xCood){
    //         mostRightNode = moveStructureNodes[i].parentNode;
    //     }
    //     if(mostLeftNode.xCood > moveStructureNodes[i].parentNode.xCood){
    //         mostLeftNode = moveStructureNodes[i].parentNode;
    //     }
    // }
    //
    // for(let i = 0; i < structures.length; i++){
    //     if(mostRightNode === structures[i].childNode){
    //         createRightBracket(mostRightNode, structures[i], yDistance, stage, bracketObj);
    //         rightCounter++;
    //     }
    //     if(mostLeftNode === structures[i].parentNode){
    //         childStructures.push(structures[i]);
    //     }
    // }
    //
    // if(rightCounter === 0){
    //     createRightBracket(mostRightNode, null, yDistance, stage, bracketObj);
    // }
    // if(childStructures.length === 0){
    //     createLeftBracket(mostLeftNode, null, yDistance, stage, bracketObj);
    // }
    //
    // let leftChildNode = childStructures[0].childNode;
    // for(let i = 1; i < childStructures.length; i++){
    //     if(leftChildNode.xCood > childStructures[i].childNode.xCood){
    //         leftChildNode = childStructures[i].childNode;
    //     }
    //     else if(leftChildNode.xCood === childStructures[i].childNode.xCood) {
    //         if (leftChildNode.yCood > childStructures[i].childNode.yCood) {
    //             leftChildNode = childStructures[i].childNode;
    //         }
    //
    //     }
    // }
    //
    // for(let i = 0; i < structures.length; i++){
    //     if(leftChildNode === structures[i].childNode && mostLeftNode === structures[i].parentNode){
    //         createLeftBracket(mostLeftNode, structures[i], yDistance, stage, bracketObj)
    //     }
    // }
    // for(let i = 0; i < moveStructureNodes.length; i++){
    //     bracketObj.repeatNodes.push(moveStructureNodes[i].parentNode);
    // }
    //
    // return bracketObj;
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
    n.x = (startBracketStructure.edge.graphics._activeInstructions[0].x + startBracketStructure.edge.graphics._activeInstructions[1].x) / 2 + distance;
    n.y = fourCorner[2].yCood + distance - 5;

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

function createRightBracket(mostRightNode ,structure, yDistance, stage, bracketObj){
//     let bracket = new createjs.Text("]", "50px serif", getLineColor("black"));
//     if(structure === null){
//         bracket.x = mostRightNode.xCood + 50;
//         bracket.y = mostRightNode.yCood + yDistance;
//     }
//     else {
//         bracket.x = (structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2;
//         bracket.y = (structure.edge.graphics._activeInstructions[0].y + structure.edge.graphics._activeInstructions[1].y) / 2 + yDistance;
//         bracketObj.startBracket.structure = structure;
//         structure.bracket = true;
//     }
//     bracketObj.startBracket.bracketShape = bracket;
//     mostRightNode.bracket = bracketObj;
//     bracketObj.startBracket.node = mostRightNode;
//     numberOfRepeat(bracket, mostRightNode, stage, bracketObj);
//     upStage(bracket, stage);
// }
//
// function createLeftBracket(mostLeftNode ,structure, yDistance, stage, bracketObj){
//     let bracket = new createjs.Text("[", "50px serif", getLineColor("black"));
//     if(structure === null){
//         bracket.x = mostLeftNode.xCood - 50;
//         bracket.y = mostLeftNode.yCood + yDistance;
//     }
//     else {
//         bracket.x = (structure.edge.graphics._activeInstructions[0].x + structure.edge.graphics._activeInstructions[1].x) / 2;
//         bracket.y = (structure.edge.graphics._activeInstructions[0].y + structure.edge.graphics._activeInstructions[1].y) / 2 + yDistance;
//         bracketObj.endBracket.structure = structure;
//         structure.bracket = true;
//     }
//     bracketObj.endBracket.bracketShape = bracket;
//     mostLeftNode.bracket = bracketObj;
//     bracketObj.endBracket.node = mostLeftNode;
//     upStage(bracket, stage);

}

function numberOfRepeat(bracket, mostRightNode, stage, bracketObj){
    // let xDistance = 10;
    // let yDistance = 40;
    // let n = document.getElementById("repeatN").value;
    // let repeat = new createjs.Text(n, "20px serif", getLineColor("black"));
    // repeat.x = bracket.x + xDistance;
    // repeat.y = bracket.y + yDistance;
    // bracketObj.startBracket.numOfRepeatShape = repeat;
    // bracketObj.startBracket.numOfRepeatText = n;
    // upStage(repeat, stage);
}

function upStage(bracket, stage){
    stageEdit.setStage(stage, bracket);
    stageEdit.stageUpdate(stage);
}

export { createRepeatBracket };
