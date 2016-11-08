class Structure {
    constructor(structureId, node1, node2, edgeInformation) {
        this.structureId = structureId;
        this.Node1 = node1;
        this.Node2 = node2;
        this.edgeInformation = edgeInformation;
        this.edge = null;
    }
}

module.exports = Structure;

/*
 var Structure = function(structureId,Node1, Node2, edgeInformamtion) {
 this.structureId = structureId;
 this.Node1 = Node1;
 this.Node2 = Node2;
 this.edgeInformamtion = edgeInformamtion;
 this.edge = null;
 };
 */
