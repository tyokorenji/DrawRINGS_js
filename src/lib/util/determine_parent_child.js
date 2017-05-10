"use strict";

/**
 * ２つのNode間で、どちらが親Nodeか、どちらが子Nodeかを算出する関数
 * @param node1:一つ目のNode
 * @param node2:二つ目のNode
 * @returns :親Nodeが0番目、子Nodeが1番目に入った配列
 */
export let determineParentChild = function(node1, node2){
    let parentNode = null;
    let childNode = null;
    if(node1.x > node2.x){
        parentNode = node1;
        childNode = node2;
    }
    else if(node1.x < node2.x){
        parentNode = node2;
        childNode = node1;
    }
    else{
        if(node1.y < node2.y){
            parentNode = node1;
            childNode = node2;
        }
        else{
            parentNode = node2;
            childNode = node1;
        }
    }

    return [parentNode, childNode];
};
