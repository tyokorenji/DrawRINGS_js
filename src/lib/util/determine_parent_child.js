"use strict";

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
