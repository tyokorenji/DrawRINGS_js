/**
 * ２つのNodeとその間を結ぶEdgeで１つの構造とするためのクラス
 */
class Structure {
    constructor(structureId, parent, child, edgeInformation, edge) {
        this.structureId = structureId;
        this.parentNode = parent;
        this.childNode = child;
        this.edgeInformation = null;
        this.edgeInformationText = edgeInformation;
        this.edge = edge;
        // this.bracket = null;
    }
}

module.exports = Structure;
