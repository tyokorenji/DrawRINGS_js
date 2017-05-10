"use strict";

import { edgeInformationParser } from './edge_information_parser';

/**
 * 配列にある情報から糖鎖構造を組み立てるための関数
 * @param nodes:Nodeクラスが入った配列
 * @param edges:Structureクラスが入った配列
 * @param canvas:HTMLのcanvas
 */
function setCoordinate(nodes, edges,canvas){
    //文字列の座標を数字にしている
    for(let i = 0; i < edges.length; i++){
        edges[i].parentNode.xCood = parseInt(edges[i].parentNode.xCood);
        edges[i].parentNode.yCood = parseInt(edges[i].parentNode.yCood);
        edges[i].childNode.xCood = parseInt(edges[i].childNode.xCood);
        edges[i].childNode.yCood = parseInt(edges[i].childNode.yCood);
    }
    //ルートNodeを検索
    let rootNode = edges[0].parentNode;
    for(let i = 1; i < edges.length; i++){
        if(rootNode.xCood < edges[i].parentNode.xCood){
            rootNode = edges[i].parentNode;
        }
    }
    //それぞれの座標を0にしている
    for(let i = 0; i < edges.length; i++){
        edges[i].parentNode.xCood = 0;
        edges[i].parentNode.yCood = 0;
        edges[i].childNode.xCood = 0;
        edges[i].childNode.yCood = 0;
    }
    //nodesとedgesを照らし合わせて、各Nodeクラスが持つ子Nodeクラスを配列に入れている
    for(let i = 0; i < nodes.length; i++){
        for(let j = 0; j < edges.length; j++){
            if(nodes[i] === edges[j].parentNode){
                nodes[i].childNode.push(edges[j].childNode);
            }
        }
    }
    // let xDistance = 80;
    // let yDistance = 50;
    //糖鎖構造のNodeとNode間の距離の設定
    let xDistance = 100;
    let yDistance = 50;
    //再帰的に各Nodeの座標を計算する
    recursiveComputeCoordinate(rootNode, nodes, edges, xDistance, yDistance, canvas);
}

// function sortChildNodes(parentNode){
//     edgeInformationParser();
// }

/**
 * 再帰的に各Node間の座標を計算する関数
 * @param rootNode:ルートNode
 * @param nodes:Nodeクラスが入った配列
 * @param edges:Structureクラスが入った配列
 * @param xDistance:糖鎖構造のNodeとNode間のX座標の距離の設定
 * @param yDistance:糖鎖構造のNodeとNode間のY座標の距離の設定
 * @param canvas:HTMLのcanvas
 */
function recursiveComputeCoordinate(rootNode, nodes, edges, xDistance, yDistance, canvas){
    //各Nodeクラスの親と子の距離を求めている
    recursiveSetCoordinate(rootNode, edges, xDistance, yDistance);
    //セットした糖鎖構造の中央値を求めている
    let midCody = middleCoordinate(nodes);
    //求めた中央値と、各Nodeの相対座標を求めている
    relativeCoordinate(midCody[0], midCody[1], nodes);
    //canvasの中央値を求めて、相対座標を基に各Nodeを再配置している
    setRelativeCoordinate(nodes, canvas);
    //再配置後、糖鎖構造がcanvas外に出てしまう場合、Distanceを小さくし、再度設定し直す
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

/**
 * 糖鎖構造の中央値と、各Nodeの相対座標を求める関数
 * @param midX:中央値のX座標
 * @param midY:中央値のY座標
 * @param nodes:Nodeクラスが入った配列
 */
function relativeCoordinate(midX, midY, nodes){
    for(let i = 0; i < nodes.length; i++){
        nodes[i].xCood = nodes[i].xCood - midX;
        nodes[i].yCood = nodes[i].yCood - midY;
    }
}


/**
 * 再帰的に各Nodeに座標をセットする関数
 * コメントアウトしている部分は結合位置でNodeの位置をセットしていった部分である。
 * @param parentNode:親Node
 * @param edges:Structureクラスが入った配列
 * @param xDistance:糖鎖構造のNodeとNode間のX座標の距離の設定
 * @param yDistance:糖鎖構造のNodeとNode間のY座標の距離の設定
 */
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

    //それぞれの子Nodeの数で、子Nodeの座標を決めている
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
/**
 * セットしたNodeクラスの座標から、糖鎖構造の中央値を求めている
 * @param nodes:Nodeクラスの入った配列
 * @returns :中央値の座標の配列
 */
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
