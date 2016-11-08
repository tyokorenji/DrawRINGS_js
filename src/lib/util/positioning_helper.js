/**
 * TODO: 処理内容をリファクタリングで整理する.
 * @param stage
 * @param structureKey
 * @param structures
 */
function adjustPosition(stage, structureKey, structures){
    let outOfLeftCanvas = 0;
    let outOfRightCanvas = 0;
    let outOfTopCanvas = 0;
    let outOfBottomCanvas = 0;

    if(structureKey != 0) {
        for (let i = 0; i < structures.length; i++) {
            if (structures[i].Node1.x < 0 || structures[i].Node2.x < 0) {
                outOfLeftCanvas++;
            }
            if (structures[i].Node1.x > canvas.width || structures[i].Node2.x > canvas.width) {
                outOfRightCanvas++;
            }
            if (structures[i].Node1.y < 0 || structures[i].Node2.y < 0) {
                outOfTopCanvas++;
            }
            if (structures[i].Node1.y > canvas.height || structures[i].Node2.y > canvas.height) {
                outOfBottomCanvas++;
            }
        }
        if (outOfRightCanvas != 0 || outOfLeftCanvas != 0 || outOfTopCanvas != 0 || outOfBottomCanvas != 0) {
            let sortMinX = structures[0].Node1.x;
            let sortMinY = structures[0].Node1.y;
            let sortMaxX = structures[0].Node1.x;
            let sortMaxY = structures[0].Node1.y;
            let paramPlusX = new Array();
            let paramMinusX = new Array();
            let paramPlusY = new Array();
            let paramMinusY = new Array();
            let paramPlusXKey = 0;
            let paramMinusXKey = 0;
            let paramPlusYKey = 0;
            let paramMinusYKey = 0;
            let i;
            let j;
            for (i = 0; i < structures.length; i++) {
                if (sortMinX > structures[i].Node1.x) {
                    sortMinX = structures[i].Node1.x;
                }
                else if (sortMaxX < structures[i].Node1.x) {
                    sortMaxX = structures[i].Node1.x;
                }
                if (sortMinY > structures[i].Node1.y) {
                    sortMinY = structures[i].Node1.y;
                }
                else if (sortMaxY < structures[i].Node1.y) {
                    sortMaxY = structures[i].Node1.y;
                }
                if (sortMinX > structures[i].Node2.x) {
                    sortMinX = structures[i].Node2.x;
                }
                else if (sortMaxX < structures[i].Node2.x) {
                    sortMaxX = structures[i].Node2.x;
                }
                if (sortMinY > structures[i].Node2.y) {
                    sortMinY = structures[i].Node2.y;
                }
                else if (sortMaxY < structures[i].Node2.y) {
                    sortMaxY = structures[i].Node2.y;
                }
            }
            let sortAverageX = (sortMaxX - sortMinX) / 2 + sortMinX;
            let sortAverageY = (sortMaxY - sortMinY) / 2 + sortMinY;
            for (i = 0; i < structures.length; i++) {
                structures[i].Node1.param.sortParamX = structures[i].Node1.x - sortAverageX;
                structures[i].Node1.param.sortParamY = structures[i].Node1.y - sortAverageY;
                structures[i].Node2.param.sortParamX = structures[i].Node2.x - sortAverageX;
                structures[i].Node2.param.sortParamY = structures[i].Node2.y - sortAverageY;
            }
            sortAverageX = canvas.width / 2;
            sortAverageY = canvas.height / 2;
            let calculationNodes = new Array();
            let calcureationsKey = 1;
            calculationNodes[0] = structures[0].Node1;
            structures[0].Node1.param.sortParamX = sortAverageX + structures[0].Node1.param.sortParamX;
            structures[0].Node1.param.sortParamY = sortAverageY + structures[0].Node1.param.sortParamY;
            for (i = 0; i < structures.length; i++) {
                let usedNode1 = 0;
                let usedNode2 = 0
                for (j = 0; j < calculationNodes.length; j++) {
                    if (calculationNodes[j] === structures[i].Node1) {
                        usedNode1++;
                    }
                    else if (calculationNodes[j] === structures[i].Node2) {
                        usedNode2++;
                    }
                }
                if (usedNode1 === 0) {
                    structures[i].Node1.param.sortParamX = sortAverageX + structures[i].Node1.param.sortParamX;
                    structures[i].Node1.param.sortParamY = sortAverageY + structures[i].Node1.param.sortParamY;
                    calculationNodes[calcureationsKey] = structures[i].Node1;
                    calcureationsKey++;
                }
                if (usedNode2 === 0) {
                    structures[i].Node2.param.sortParamX = sortAverageX + structures[i].Node2.param.sortParamX;
                    structures[i].Node2.param.sortParamY = sortAverageY + structures[i].Node2.param.sortParamY;
                    calculationNodes[calcureationsKey] = structures[i].Node2;
                    calcureationsKey++;
                }
            }
            for(i = 0; i < structures.length; i++){
                if (structures[i].Node1.param.sortParamX - sortAverageX > 0) {
                    paramPlusX[paramPlusXKey] = structures[i].Node1;
                    paramPlusXKey++;
                }
                else if (structures[i].Node1.param.sortParamX - sortAverageX <= 0) {
                    paramMinusX[paramMinusXKey] = structures[i].Node1;
                    paramMinusXKey++;
                }
                if (structures[i].Node2.param.sortParamX - sortAverageX > 0) {
                    paramPlusX[paramPlusXKey] = structures[i].Node2;
                    paramPlusXKey++;
                }
                else if (structures[i].Node2.param.sortParamX - sortAverageX <= 0) {
                    paramMinusX[paramMinusXKey] = structures[i].Node2;
                    paramMinusXKey++;
                }
                if (structures[i].Node1.param.sortParamY - sortAverageY > 0) {
                    paramPlusY[paramPlusYKey] = structures[i].Node1;
                    paramPlusYKey++;
                }
                else if (structures[i].Node1.param.sortParamY - sortAverageY <= 0) {
                    paramMinusY[paramMinusYKey] = structures[i].Node1;
                    paramMinusYKey++;
                }
                if (structures[i].Node2.param.sortParamY - sortAverageY > 0) {
                    paramPlusY[paramPlusYKey] = structures[i].Node2;
                    paramPlusYKey++;
                }
                else if (structures[i].Node2.param.sortParamY - sortAverageY <= 0) {
                    paramMinusY[paramMinusYKey] = structures[i].Node2;
                    paramMinusYKey++;
                }
            }
            if (paramPlusXKey >= 1) {
                paramPlusX = selectionSort(paramPlusX, 'sortParamX');
                // paramPlusX = selectionSortX(paramPlusX);
            }
            if (paramMinusXKey >= 1) {
                paramMinusX = selectionSort(paramMinusX, 'sortParamX');
                // paramMinusX = selectionSortX(paramMinusX);
            }
            if (paramPlusYKey >= 1) {
                paramPlusY = selectionSort(paramPlusY, 'sortParamY');
                /// paramPlusY = selectionSortY(paramPlusY);
            }
            if (paramMinusYKey >= 1) {
                paramMinusY = selectionSort(paramMinusY, 'sortParamY');
                // paramMinusY = selectionSortY(paramMinusY);
            }
            let distance = 50;
            let counter = 100;
            recursionSetCoordinateX(paramPlusX, paramMinusX, distance, sortAverageX, counter);
            distance = 0;
            counter = 50;
            recursionSetCoordinateY(paramPlusY, paramMinusY, distance, sortAverageY, counter);
            for (i = 0; i < structures.length; i++) {
                stage.removeChild(structures[i].edge);
                let line = new createjs.Shape();
                line.graphics.setStrokeStyle(3);
                line.graphics.beginStroke("#000");
                line.graphics.moveTo(structures[i].Node1.x, structures[i].Node1.y);
                line.graphics.lineTo(structures[i].Node2.x, structures[i].Node2.y);
                structures[i].edge = line;
                structures[i].edgeInformamtion.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
                structures[i].edgeInformamtion.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2;
                stage.removeChild(structures[i].edgeInformamtion);
            }
            let usedNodes = new Array();
            let usedNodesKey = 2;
            for (i = 0; i < structures.length; i++) {
                let countNode1 = 0;
                let countNode2 = 0;
                if (i === 0) {
                    stage.removeChild(structures[i].Node1);
                    stage.removeChild(structures[i].Node2);
                    usedNodes[0] = structures[i].Node1;
                    usedNodes[1] = structures[i].Node2;
                }
                for (j = 0; j < usedNodes.length; j++) {
                    if (structures[i].Node1 === usedNodes[j]) {
                        countNode1++;
                    }
                    else if (structures[i].Node2 === usedNodes[j]) {
                        countNode2++;
                    }
                }
                if (countNode1 != 1 && countNode2 === 1) {
                    stage.removeChild(structures[i].Node1);
                    usedNodes[usedNodesKey] = structures[i].Node1;
                    usedNodesKey++;
                }
                else if (countNode1 === 1 && countNode2 != 1) {
                    stage.removeChild(structures[i].Node2);
                    usedNodes[usedNodesKey] = structures[i].Node2
                    usedNodesKey++;

                }
                else if(countNode1 != 1 && countNode2 != 1){
                    stage.removeChild(structures[i].Node1);
                    stage.removeChild(structures[i].Node2);
                    usedNodes[usedNodesKey] = structures[i].Node1;
                    usedNodesKey++;
                    usedNodes[usedNodesKey] = structures[i].Node2
                    usedNodesKey++;
                }
                stage.addChild(structures[i].edge);
                stage.addChild(structures[i].edgeInformamtion);
            }
            for (i = 0; i < usedNodes.length; i++) {
                stage.addChild(usedNodes[i]);
            }
            stage.update();
        }
    }
}

function selectionSort(sortValues, paramType){
    for(let i = 0; i < sortValues.length - 1; i++){
        let min = i;
        for(let j = i + 1; j < sortValues.length; j++){
            if(sortValues[j].param[paramType] < sortValues[min].param[paramType]){
                let t = sortValues[min];
                sortValues[min] = sortValues[j];
                sortValues[j] = t;
            }
        }
    }
    return sortValues;
}

/*
function selectionSortX(sortValues){
    for(let i = 0; i < sortValues.length - 1; i++){
        let min = i;
        for(let j = i + 1; j < sortValues.length; j++){
            if(sortValues[j].param.sortParamX < sortValues[min].param.sortParamX){
                let t = sortValues[min];
                sortValues[min] = sortValues[j];
                sortValues[j] = t;
            }
        }
    }
    return sortValues;
}

function selectionSortY(sortValues){
    for(let i = 0; i < sortValues.length - 1; i++){
        let min = i;
        for(let j = i + 1; j < sortValues.length; j++){
            if(sortValues[j].param.sortParamY < sortValues[min].param.sortParamY){
                let t = sortValues[min];
                sortValues[min] = sortValues[j];
                sortValues[j] = t;
            }
        }
    }
    return sortValues;
}
*/

function recursionSetCoordinateX(paramPlusX, paramMinusX, distance, sortAverageX, counter){
    let originalDistance = distance;
    paramPlusX[0].x = sortAverageX + distance;
    paramMinusX[paramMinusX.length - 1].x = sortAverageX - distance;
    let setedNode = new Array();
    let setedNodeKey = 1;
    let sameNode = 0;
    setedNode[0] = paramPlusX[0];

    let i;
    let j;

    for(i = 1; i < paramPlusX.length; i++) {
        sameNode = 0;
        for (j = 0; j < setedNode.length; j++) {
            if (paramPlusX[i] === setedNode[j]) {
                sameNode++;
            }
        }
        if (sameNode === 0) {
            let different = 0;
            for (j = 0; j < i; j++) {
                if (paramPlusX[i] != paramPlusX[j]) {
                    if (paramPlusX[i].param.sortParamX === paramPlusX[j].param.sortParamX) {
                        different++;
                    }
                }
            }
            if (different === 0) {
                distance = distance + counter;
            }
            paramPlusX[i].x = sortAverageX + distance;
            setedNode[setedNodeKey] = paramPlusX[i];
            setedNodeKey++;
            sameNode = 0;
        }
    }
    setedNode.splice(0, setedNode.length);
    setedNode[0] = paramMinusX[paramMinusX.length - 1];
    setedNodeKey = 1;
    distance = originalDistance;

    for(i = paramMinusX.length - 2; i >= 0; i--) {
        sameNode = 0;
        for (j = 0; j < setedNode.length; j++) {
            if (paramMinusX[i] === setedNode[j]) {
                sameNode++;
            }
        }
        if (sameNode === 0) {
            let different = 0;
            for (let j = paramMinusX.length - 1; j > i; j--) {
                if (paramMinusX[i] != paramMinusX[j]) {
                    if (paramMinusX[i].param.sortParamX === paramMinusX[j].param.sortParamX) {
                        different++;
                    }
                }
            }
            if (different === 0) {
                distance = distance + counter;
            }
            paramMinusX[i].x = sortAverageX - distance;
            setedNode[setedNodeKey] = paramMinusX[i];
            setedNodeKey++;
        }
    }
    if(counter === 20){
        return;
    }
    else{
        for(i = 0; i < paramPlusX.length; i++){
            if(paramPlusX[i].x + 10  > canvas.width) {
                recursionSetCoordinateX(paramPlusX, paramMinusX, originalDistance-10, sortAverageX, counter-10)
            }
        }
        for(i = 0; i < paramMinusX.length; i++){
            if(paramMinusX[i].x - 10 < 0){
                recursionSetCoordinateX(paramPlusX, paramMinusX, originalDistance-10, sortAverageX, counter-10)
            }
        }
    }
}

function recursionSetCoordinateY(paramPlusY, paramMinusY, distance, sortAverageY, counter){
    let originalDistance = distance;
    let setedNode = new Array();
    let setedNodeKey = 0;
    let i;
    let j;
    for(i = 0; i < paramPlusY.length; i++){
        let sameNode = 0;
        if(setedNodeKey != 0) {
            for (j = 0; j < setedNode.length; j++) {
                if(paramPlusY[i] === setedNode[j]){
                    sameNode++;
                }
            }
        }
        if(sameNode === 0) {
            let different = 0;
            for (j = 0; j < i; j++) {
                if (paramPlusY[i] != paramPlusY[j]) {
                    if (paramPlusY[i].param.sortParamY === paramPlusY[j].param.sortParamY) {
                        different++;
                    }
                }
            }
            if (different === 0) {
                distance = distance + counter;
            }
            paramPlusY[i].y = sortAverageY + distance;
            setedNode[setedNodeKey] = paramPlusY[i];
            setedNodeKey++;
        }
    }
    distance = originalDistance;
    setedNode.splice(0, setedNode.length);
    setedNodeKey = 0;
    for(i = paramMinusY.length - 1; i >= 0 ; i--){
        if(paramMinusY[i].param.sortParamY >= sortAverageY){
            paramMinusY[i].y = paramMinusY[i].param.sortParamY;
            continue;
        }
        let sameNode = 0;
        if(setedNodeKey != 0) {
            for (j = 0; j < setedNode.length; j++) {
                if(paramPlusY[i] === setedNode[j]){
                    sameNode++;
                }
            }
        }

        if(sameNode === 0) {
            let different = 0;
            for (j = paramMinusY.length - 1; j >i ; j--) {
                if (paramMinusY[i] != paramMinusY[j]) {
                    if (paramMinusY[i].param.sortParamY === paramMinusY[j].param.sortParamY) {
                        different++;
                    }
                }
            }
            if (different === 0) {
                distance = distance + counter;
            }
            paramMinusY[i].y = sortAverageY - distance;
            setedNode[setedNodeKey] = paramMinusY[i];
            setedNodeKey++;
        }
    }
    if(counter === 20){
        return;
    }
    else{
        for(i = 0; i < paramPlusY.length; i++){
            if(paramPlusY[i].y + 10  > canvas.height) {
                recursionSetCoordinateY(paramPlusY, paramMinusY, originalDistance, sortAverageY, counter-10)
            }
        }
        for(i = 0; i < paramMinusY.length; i++){
            if(paramMinusY[i].y - 10 < 0){
                recursionSetCoordinateY(paramPlusY, paramMinusY, originalDistance, sortAverageY, counter-10)
            }
        }
    }
}

export { adjustPosition };