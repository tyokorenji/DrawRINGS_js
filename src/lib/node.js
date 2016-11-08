import * as createjs from 'EaselJS';

class Node extends createjs.Shape {
    constructor(nodeId, nodeName) {
        super();
        this.param = {
            id: nodeId,
            monosaccharide: nodeName,
            sortParamX: 0,
            sortParamY: 0
        };
    }
}

export default createjs.promote(Node, "Shape");

/*
var Node = function Node(nodeId, nodeName) {
    this.Shape_constructor();
    this.param = {
        id: nodeId,
        monosaccharide: nodeName,
        sortParamX: 0,
        sortParamY: 0,
    };
}
createjs.extend(Node, createjs.Shape);
createjs.promote(Node, "Shape");
*/
