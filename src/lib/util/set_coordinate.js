"use strict";

import { edgeInformationParser } from './edge_information_parser';


function setCoordinate(nodes, edges,canvas){
    for(let i = 0; i < edges.length; i++){
        edges[i].parentNode.xCood = parseInt(edges[i].parentNode.xCood);
        edges[i].parentNode.yCood = parseInt(edges[i].parentNode.yCood);
        edges[i].childNode.xCood = parseInt(edges[i].childNode.xCood);
        edges[i].childNode.yCood = parseInt(edges[i].childNode.yCood);
    }

    let rootNode = edges[0].parentNode;
    for(let i = 1; i < edges.length; i++){
        if(rootNode.xCood < edges[i].parentNode.xCood){
            rootNode = edges[i].parentNode;
        }
    }
    for(let i = 0; i < edges.length; i++){
        edges[i].parentNode.xCood = 0;
        edges[i].parentNode.yCood = 0;
        edges[i].childNode.xCood = 0;
        edges[i].childNode.yCood = 0;
    }
    for(let i = 0; i < nodes.length; i++){
        for(let j = 0; j < edges.length; j++){
            if(nodes[i] === edges[j].parentNode){
                nodes[i].childNode.push(edges[j].childNode);
            }
        }
    }
    // let xDistance = 80;
    // let yDistance = 50;
    let xDistance = 100;
    let yDistance = 50;
    recursiveComputeCoordinate(rootNode, nodes, edges, xDistance, yDistance, canvas);
}

function recursiveComputeCoordinate(rootNode, nodes, edges, xDistance, yDistance, canvas){
    recursiveSetCoordinate(rootNode, edges, xDistance, yDistance);
    let midCody = middleCoordinate(nodes);
    relativeCoordinate(midCody[0], midCody[1], nodes);
    setRelativeCoordinate(nodes, canvas);
    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].xCood < 10 || nodes[i].xCood > canvas.width - 10 || nodes[i].yCood < 10 || nodes[i].yCood > canvas.height - 10){
            if(xDistance === 20 || yDistance < 10){
                return;
            }
            return recursiveComputeCoordinate(rootNode, nodes, xDistance-10, yDistance-5, canvas);
        }
    }
}

function setRelativeCoordinate(nodes, canvas){
    let midX = canvas.width/2;
    let midY = canvas.height/2;
    for(let i = 0; i < nodes.length; i++){
        nodes[i].xCood = midX + nodes[i].xCood;
        nodes[i].yCood = midY + nodes[i].yCood;
    }


}

function relativeCoordinate(midX, midY, nodes){
    for(let i = 0; i < nodes.length; i++){
        nodes[i].xCood = nodes[i].xCood - midX;
        nodes[i].yCood = nodes[i].yCood - midY;
    }
}



function recursiveSetCoordinate(parentNode, edges, xDistance, yDistance) {
    //TODO: 結合位置で子供のNodeの位置を判断する。
    // let parentEdgePoint = null;
    // let counter = 0;
    // for(let i = 0; i < parentNode.childNode.length; i++){
    //     for(let j = 0; j < edges.length; j++){
    //         counter++;
    //         if(parentNode === edges[j].parentNode && parentNode.childNode[i] === edges[j].childNode){
    //             parentEdgePoint = edgeInformationParser(edges[j]);
    //             break;
    //         }
    //     }
    //     if(counter === edges.length) continue;
    //     if(parseInt(parentEdgePoint[1]) === 2){
    //         parentNode.childNode[i].xCood = parentNode.xCood;
    //         parentNode.childNode[i].yCood = parentNode.yCood + yDistance;
    //         recursiveSetCoordinate(parentNode.childNode[i], edges, xDistance, yDistance);
    //         continue;
    //     }
    //     else if(parseInt(parentEdgePoint[1]) === 3){
    //         parentNode.childNode[i].xCood = parentNode.xCood - xDistance;
    //         parentNode.childNode[i].yCood = parentNode.yCood + yDistance + 40;
    //         recursiveSetCoordinate(parentNode.childNode[i], edges, xDistance, yDistance);
    //         continue;
    //     }
    //     else if(parseInt(parentEdgePoint[1]) === 4){
    //         parentNode.childNode[i].xCood = parentNode.xCood - xDistance;
    //         parentNode.childNode[i].yCood = parentNode.yCood;
    //         recursiveSetCoordinate(parentNode.childNode[i], edges, xDistance, yDistance);
    //         continue;
    //     }
    //     else if(parseInt(parentEdgePoint[1]) === 6){
    //         parentNode.childNode[i].xCood = parentNode.xCood;
    //         parentNode.childNode[i].yCood = parentNode.yCood - yDistance;
    //         recursiveSetCoordinate(parentNode.childNode[i], edges, xDistance, yDistance);
    //         continue;
    //     }
    //     else{
    //         parentNode.childNode[i].xCood = parentNode.xCood - xDistance;
    //         parentNode.childNode[i].yCood = parentNode.yCood - yDistance - 40;
    //         recursiveSetCoordinate(parentNode.childNode[i], edges, xDistance, yDistance);
    //         continue;
    //     }
    // }

    if (parentNode.childNode.length === 0) {
        return;
    }
    else if (parentNode.childNode.length === 1) {
        parentNode.childNode[0].xCood = parentNode.xCood - xDistance;
        parentNode.childNode[0].yCood = parentNode.yCood;
        recursiveSetCoordinate(parentNode.childNode[0], edges, xDistance, yDistance);
        return;
    }
    else if (parentNode.childNode.length === 2) {
        for (let i = 0; i < 2; i++) {
            parentNode.childNode[i].xCood = parentNode.xCood - xDistance;
        }
        parentNode.childNode[0].yCood = parentNode.yCood - yDistance;
        recursiveSetCoordinate(parentNode.childNode[0], edges, xDistance, yDistance);
        parentNode.childNode[1].yCood = parentNode.yCood + yDistance;
        recursiveSetCoordinate(parentNode.childNode[1], edges, xDistance, yDistance);
        return;
    }
    else if (parentNode.childNode.length === 3) {
        for (let i = 0; i < 3; i++) {
            parentNode.childNode[i].xCood = parentNode.xCood - xDistance;
        }
        parentNode.childNode[0].yCood = parentNode.yCood - yDistance;
        recursiveSetCoordinate(parentNode.childNode[0], edges, xDistance, yDistance);
        parentNode.childNode[1].yCood = parentNode.yCood + yDistance;
        recursiveSetCoordinate(parentNode.childNode[1], edges, xDistance, yDistance);
        parentNode.childNode[2].yCood = parentNode.yCood;
        recursiveSetCoordinate(parentNode.childNode[2], edges, xDistance, yDistance);
        return;
    }
    else if(parentNode.childNode.length === 4){
        parentNode.childNode[0].xCood = parentNode.xCood;
        parentNode.childNode[0].yCood = parentNode.yCood - yDistance;
        recursiveSetCoordinate(parentNode.childNode[0], edges, xDistance, yDistance);
        parentNode.childNode[1].xCood = parentNode.xCood - xDistance;
        parentNode.childNode[1].yCood = parentNode.yCood - yDistance;
        recursiveSetCoordinate(parentNode.childNode[1], edges, xDistance, yDistance);
        parentNode.childNode[2].xCood = parentNode.xCood - xDistance;
        parentNode.childNode[2].yCood = parentNode.yCood + yDistance;
        recursiveSetCoordinate(parentNode.childNode[2], edges, xDistance, yDistance);
        parentNode.childNode[3].xCood = parentNode.xCood;
        parentNode.childNode[3].yCood = parentNode.yCood + yDistance;
        recursiveSetCoordinate(parentNode.childNode[3], edges, xDistance, yDistance);
    }
    else if(parentNode.childNode.length === 5){
        parentNode.childNode[0].xCood = parentNode.xCood;
        parentNode.childNode[0].yCood = parentNode.yCood - yDistance;
        recursiveSetCoordinate(parentNode.childNode[0], edges, xDistance, yDistance);
        parentNode.childNode[1].xCood = parentNode.xCood - xDistance;
        parentNode.childNode[1].yCood = parentNode.yCood - yDistance;
        recursiveSetCoordinate(parentNode.childNode[1], edges, xDistance, yDistance);
        parentNode.childNode[2].xCood = parentNode.xCood - xDistance;
        parentNode.childNode[2].yCood = parentNode.yCood;
        recursiveSetCoordinate(parentNode.childNode[2], edges, xDistance, yDistance);
        parentNode.childNode[3].xCood = parentNode.xCood - xDistance;
        parentNode.childNode[3].yCood = parentNode.yCood + yDistance;
        recursiveSetCoordinate(parentNode.childNode[3], edges, xDistance, yDistance);
        parentNode.childNode[4].xCood = parentNode.xCood;
        parentNode.childNode[4].yCood = parentNode.yCood + yDistance;
        recursiveSetCoordinate(parentNode.childNode[4], edges, xDistance, yDistance);
    }
}

function middleCoordinate(nodes){
    let mostRightNode = nodes[0].xCood;
    let mostLeftNode =  nodes[0].xCood;
    let mostTopNode =  nodes[0].yCood;
    let mostBttomNode =  nodes[0].yCood;
    for(let i = 1; i < nodes.length; i++){
        if(mostLeftNode > nodes[i].xCood){
            mostLeftNode = nodes[i].xCood;
        }
        else if(mostRightNode < nodes[i].xCood){
            mostRightNode = nodes[i].xCood;
        }
        if(mostTopNode > nodes[i].yCood){
            mostTopNode = nodes[i].yCood;
        }
        else if(mostBttomNode < nodes[i].yCood){
            mostBttomNode = nodes[i].yCood;
        }
    }

    let averageCoordinateX = mostLeftNode + (mostRightNode - mostLeftNode)/2;
    let averageCoordinateY = mostTopNode + (mostBttomNode - mostTopNode)/2;

    return [averageCoordinateX, averageCoordinateY];
}

export { setCoordinate };
