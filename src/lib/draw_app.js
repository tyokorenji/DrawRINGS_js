"use strict";

// ES2015 スタイルの読み込み
import jQuery from 'jquery';
import $ from 'jquery';
import * as createjs from 'EaselJS';

// 特定のオブジェクトだけ読み込むなら以下のように記述
// import { Stage, Ticker } from 'EaselJS';

// Bootstrap 動作用 import
import * as bootstrap from 'bootstrap';
// jQueryUI 動作用 import
import * as jQueryUI from 'jquery-ui';

import ResponsiveBootstrapToolkit from 'responsive-bootstrap-toolkit';

import Structure from './structure';
import Node from './node';
import { NODE_HASH } from './util/node_hash';
import { adjustPosition } from './util/positioning_helper';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR } from './util/monosaccharide_helper';
import { getCoreStructure } from './util/core_structure';
import { KCFParser } from './util/kcf_parser';

class DrawApp {
    constructor(canvas) {
        this.canvas = canvas;
    }
    run() {
        __run(this.canvas);
    }
}

/**
 * TODO: __run メソッドはスリム化して DrawApp#run() として定義し直す.
 * TODO: DrawApp#run() では canvas として this.canvas を使用する.
 * @param canvas
 * @private
 */
function __run(canvas) {
    "use strict";

    //let canvas = this.canvas;
    let stage = new createjs.Stage(canvas);
    let structureKey = 0;
    let structures = new Array();

    // リサイズイベントを検知してリサイズ処理を実行
    window.addEventListener("resize", handleResize);
    handleResize(); // 起動時にもリサイズしておく

    // リサイズ処理
    /**
     * TODO: GUI
     */
    function handleResize(event) {
        // 画面幅・高さを取得
        let c = $(canvas);    //$('#canvas');
        let w = parseInt(c.css('width'), 10);
        let h = parseInt(c.css('height'), 10);

        // Canvas要素の大きさを画面幅・高さに合わせる
        stage.canvas.width = w;
        stage.canvas.height = h;

        // 画面更新する
        stage.update();
        adjustPosition(stage, structureKey, structures);
    }

    (function($){
        let viewport = ResponsiveBootstrapToolkit;
        // Execute only after document has fully loaded
        $(document).ready(function () {
            changeFooterStyle();
            setTextareaSize();
        });

        // Execute code each time window size changes
        $(window).resize(
            viewport.changed(function () {
                changeFooterStyle();
                setTextareaSize();
            })
        );
    })(jQuery);

    /**
     * TODO: GUI
     */
    function changeFooterStyle() {
        let viewport = ResponsiveBootstrapToolkit;

        // Executes only in XS breakpoint
        if( viewport.is('<=sm') ) {
            $('#footer').removeClass('lower-menu');
            $('#footer').addClass('lower-menu-sm');
        } else {
            $('#footer').removeClass('lower-menu-sm');
            $('#footer').addClass('lower-menu');
        }
    }

    function setTextareaSize() {
        let canvas = $('#canvas');
        let w = parseInt(canvas.css('width'), 10);
        let h = parseInt(canvas.css('height'), 10);

        let textarea = $('#kcf_format');
        //textarea.css('width', w);
        textarea.css('height', h);
    }

    jQuery(function($){
        $("#runQueryDialogBox").dialog({
            autoOpen: false,  // 自動的に開かないように設定
            width: 400,       // 横幅のサイズを設定
            modal: true,      // モーダルダイアログにする
            buttons: [        // ボタン名 : 処理 を設定
                {
                    text: 'OK',
                    click: function(){
                        edits(9);
                    }
                },
                {
                    text: 'Cancel',
                    click: function(){
                        $(this).dialog("close");
                    }
                }
            ]
        });
        $("#runQueryButton").click(function(){
            $("#runQueryDialogBox").dialog("open");
        });
    })

    let kindNode = {
        color : function(){
            return getMonosaccharideColor(NODE_HASH[nodeHashKey]);
        },

        draw : function (x,y){
            let shape = null;
            if(100 < nodeHashKey && nodeHashKey < 110){
                shape= new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                let r = 10;
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(kindNode.color());
                shape.graphics.drawCircle(0, 0, r);
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
                return shape;
            }
            else if(200 < nodeHashKey && nodeHashKey < 210){
                shape = new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(kindNode.color());
                shape.graphics.drawRect(-10, -10, 20, 20);
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
                return shape;
            }
            else if(300 < nodeHashKey && nodeHashKey < 310){
                shape = new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(kindNode.color());
                shape.graphics.moveTo(0, 0);
                shape.graphics.lineTo(0-10, 0-10);
                shape.graphics.lineTo(0+10, 0-10);
                shape.graphics.lineTo(0+10, 0+10);
                shape.graphics.lineTo(0, 0);
                shape.graphics.endFill();
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(MONOSACCHARIDE_COLOR.WHITE);
                shape.graphics.moveTo(0, 0);
                shape.graphics.lineTo(0-10, 0-10);
                shape.graphics.lineTo(0-10, 0+10);
                shape.graphics.lineTo(0+10, 0+10);
                shape.graphics.lineTo(0, 0);
                shape.graphics.endFill();
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
            }
            else if(400 < nodeHashKey && nodeHashKey < 410){
                shape = new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                shape.graphics.beginStroke(getLineColor());
                if(NODE_HASH[nodeHashKey] === "alta" || NODE_HASH[nodeHashKey] === "idoa") shape.graphics.beginFill(MONOSACCHARIDE_COLOR.WHITE);
                else shape.graphics.beginFill(kindNode.color());
                shape.graphics.moveTo(0, 0);
                shape.graphics.lineTo(0-10, 0);
                shape.graphics.lineTo(0, 0-10);
                shape.graphics.lineTo(0+10, 0);
                shape.graphics.lineTo(0, 0);
                shape.graphics.endFill();
                shape.graphics.beginStroke(getLineColor());
                if(NODE_HASH[nodeHashKey] === "alta" || NODE_HASH[nodeHashKey] === "idoa") shape.graphics.beginFill(kindNode.color());
                else shape.graphics.beginFill(MONOSACCHARIDE_COLOR.WHITE);
                shape.graphics.moveTo(0, 0);
                shape.graphics.lineTo(0-10, 0);
                shape.graphics.lineTo(0, 0+10);
                shape.graphics.lineTo(0+10, 0);
                shape.graphics.lineTo(0, 0);
                shape.graphics.endFill();
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
            }
            else if(500 < nodeHashKey && nodeHashKey < 510){
                shape = new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(kindNode.color());
                shape.graphics.moveTo(0, 0+10);
                shape.graphics.lineTo(0+10, 0+10);
                shape.graphics.lineTo(0, 0-20);
                shape.graphics.lineTo(0-10, 0+10);
                shape.graphics.lineTo(0, 0+10);
                shape.graphics.endFill();
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
            }
            else if(600 < nodeHashKey && nodeHashKey < 610){
                shape = new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(kindNode.color());
                shape.graphics.moveTo(0, 0);
                shape.graphics.lineTo(0, 0-10);
                shape.graphics.lineTo(0+10, 0+10);
                shape.graphics.lineTo(0, 0+10);
                shape.graphics.lineTo(0, 0);
                shape.graphics.endFill();
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(MONOSACCHARIDE_COLOR.WHITE);
                shape.graphics.moveTo(0, 0);
                shape.graphics.lineTo(0, 0-10);
                shape.graphics.lineTo(0-10, 0+10);
                shape.graphics.lineTo(0, 0+10);
                shape.graphics.lineTo(0, 0);
                shape.graphics.endFill();
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
            }
            else if(700 < nodeHashKey && nodeHashKey < 710){
                shape = new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(kindNode.color());
                shape.graphics.drawRect(0-10, 0-10, 20, 10);
                shape.graphics.endFill();
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
            }
            else if(800 < nodeHashKey && nodeHashKey < 810){
                shape = new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(kindNode.color());
                shape.graphics.drawPolyStar(0, 0, 10, 5, 0.6, -90);
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
            }
            else if(900 < nodeHashKey && nodeHashKey < 910){
                shape = new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(kindNode.color());
                shape.graphics.moveTo(0, 0-10);
                shape.graphics.lineTo(0-10, 0);
                shape.graphics.lineTo(0, 0+10);
                shape.graphics.lineTo(0+10, 0);
                shape.graphics.lineTo(0, 0-10);
                shape.graphics.endFill();
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
            }
            else if(1000 < nodeHashKey && nodeHashKey < 1010){
                shape = new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(kindNode.color());
                shape.graphics.moveTo(0-8, 0-8);
                shape.graphics.lineTo(0-10, 0);
                shape.graphics.lineTo(0-8, 0+8);
                shape.graphics.lineTo(0+8, 0+8);
                shape.graphics.lineTo(0+10, 0);
                shape.graphics.lineTo(0+8, 0-8);
                shape.graphics.lineTo(0-8, 0-8);
                shape.graphics.endFill();
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
            }
            else if(1100 < nodeHashKey && nodeHashKey < 1110){
                shape = new Node(node_id, NODE_HASH[nodeHashKey]);
                node_id++;
                shape.graphics.beginStroke(getLineColor());
                shape.graphics.beginFill(kindNode.color());
                shape.graphics.drawPolyStar(0, 0, 10, 5, 0, -90);
                shape.x = x;
                shape.y = y;
                shape.addEventListener("mousedown", handleDown);
                stage.addChild(shape);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
            }
            else{
                shape = new Node(node_id, nodeHashKey);
                // node_id++;
                // let r = 10;
                // shape.graphics.beginStroke(getLineColor());
                // shape.graphics.beginFill(MONOSACCHARIDE_COLOR.WHITE);
                // shape.graphics.drawCircle(0, 0, r);
                // shape.x = x;
                // shape.y = y;
                let nodeText = new createjs.Text(nodeHashKey,"24px serif", getLineColor());
                nodeText.x = x;
                nodeText.y = y;
                shape.param.otherNodeNameText = nodeText;
                shape.param.otherNodeNameText.addEventListener("mousedown", handleDown);
                // stage.addChild(shape);
                stage.addChild(nodeText);
                stage.update();
                nodes[nodeKey] = shape;
                nodeKey++;
                return shape;

            }
        }
    };




    let mouseX = 0;
    let mouseY = 0;
    let mouseX1 = 0;
    let mouseY1 = 0;

// どの機能かの判別
    let flag = 0;
    let mode = 0;
    let edit = 0;
    let node_id = 1;
    let structure_id = 1;

    let nodeHashKey;
    let edgeKey;
    let nodes = new Array();
    let nodeKey = 0;

// 機能のための変数
    let dragPointX;
    let dragPointY;
    let startX;
    let startY;
    let edgeCount = 0;
    let edgeStart;
    let targetMoveNode1 = new Array();
    let targetMoveKey1 = 0;
    let targetMoveNode2 = new Array();
    let targetMoveKey2 = 0;
    let selectX = 0;
    let selectY = 0;
    let selectRange = null;
    let moveStructureNodes = new Array();
    let moveStructuresNodesKey = 0;
    let drawStructureXPoints = new Array();
    let drawStructureYPoints = new Array();
    let targetMoveStructureNode1 = new Array();
    let targetMoveStructureNode2 = new Array();
    let targetMoveStructureKey1 = 0;
    let targetMoveStructureKey2 = 0;


    //KCFTextOut
    let usedStructures = new Array;
    let usedStructureKey = 0;
    let KCFTextOutId = 1;
    let glycoTrees = new Array();
    let glycoTreeKey = 0;
    let GlycoTree = function GlycoTree(){
        this.link = null;
        this.children = new Array();
        this.id = null;
        this.Node = null
        this.parentId = null;
    }
    const TAB = "    ";
    const NEW_LINE = "\n";
    const COLON = ":";
    const SLASH = "///";
    const URL_TAB = "%20";
    const URL_NEW_LINE = "%30";
    const WAVE = "~";


    let fileLoadId = document.getElementById("kcfFileLoad");
    let fileLoadTextareaId = document.getElementById("kcf_format");


    fileLoadId.addEventListener("change", function(evt){
        let file = evt.target.files;
        let fileReader = new FileReader();
        fileReader.readAsText(file[0]);
        fileReader.onload = function(evt){
            fileLoadTextareaId.value = fileReader.result;
        };
        $("#kcfFileLoad").val("");
    }, false);


    let nodeMenu = function(k){
        nodeHashKey = k;
    };
    window.nodeMenu = nodeMenu;

    let nodeTextMenu = function(){
        nodeMenu(document.nodeForm.nodeText.value);
    };
    window.nodeTextMenu = nodeTextMenu;

    let edgeMenu = function(k){
        edgeKey = k;
    };
    window.edgeMenu = edgeMenu;

    let edgeTextMenu = function(){
        if(!document.edgeForm.edgeText.value.match(/[ab][1-6][-][1-6]/g)){
            alert("Please write \nAnomer(a or b)" + 1 + "~" +6 + ' - ' + 1 + "~" + 6 + "\n example: a1-4");
        }
        else{
            edgeMenu(document.edgeForm.edgeText.value);
        }
    };
    window.edgeTextMenu = edgeTextMenu

    let kindStructure = null;
    let structureMenu = function(k){
        kindStructure = k;
    };
    window.structureMenu = structureMenu;

    function clearAll(){
        let res = confirm("clear ALL?");
        if(res === true){
            let i;
            for(i = 0; i < structures.length; i++){
                stage.removeChild(structures[i].edge);
                stage.removeChild(structures[i].edgeInformamtion);
            }
            for(i = 0; i < nodes.length; i++){
                stage.removeChild(nodes[i]);
            }
            stage.update();
            structures.splice( 0, structures.length );
            nodes.splice(0, nodes.length);
            structure_id = 1;
            structureKey = 0;
            node_id = 0;
            nodeKey = 0;
        }
    }

    $(function(){
        $(".dropdown-menu li button").click(function(){
            $(this).parents('.btn-group').find('.dropdown-toggle').html($(this).text() + '<span class="caret"></span>');
            $(this).parents('.btn-group').find('input[name="dropdown-value"]').val($(this).attr("data-value"));
        });
    });


    $('#nodeMenu').addClass('hidden-menu');
    $('#edgeMenu').addClass('hidden-menu');
    $('#structureMenu').addClass('hidden-menu');
    /*
     document.getElementById("nodemenu").style.visibility = "hidden";
     document.getElementById("edgeMenu").style.visibility = "hidden";
     document.getElementById("strucureMenu").style.visibility = "hidden";
     */

    let edits = function edits(edit){
        mode = edit;
        if(mode === 2){
            //document.getElementById("nodemenu").style.visibility = "visible";
            $('#nodeMenu').removeClass('hidden-menu');
        }
        else{
            //document.getElementById("nodemenu").style.visibility = "hidden";
            $('#nodeMenu').addClass('hidden-menu');
        }
        if(mode === 3){
            //document.getElementById("edgeMenu").style.visibility = "visible";
            $('#edgeMenu').removeClass('hidden-menu');
        }
        else{
            //document.getElementById("edgeMenu").style.visibility = "hidden";
            $('#edgeMenu').addClass('hidden-menu');
        }
        if(mode === 4){
            //document.getElementById("strucureMenu").style.visibility = "visible";
            $('#structureMenu').removeClass('hidden-menu');
        }
        else{
            //document.getElementById("strucureMenu").style.visibility = "hidden";
            $('#structureMenu').addClass('hidden-menu');
        }
        if(mode === 5){
            clearAll();
        }
        if(mode === 8 || mode === 9){
            CreateTree();
        }
        if(mode === 10){
            let parser = new KCFParser(fileLoadTextareaId.value);
            let result = parser.parse();
            // TODO: Canvas に result を描画する
        }
    };

    window.edits = edits;

    window.addEventListener("mousedown",WindowClick);
    function WindowClick() {
        if (moveStructureNodes[0] != null) {
            for (let i = 0; i < moveStructureNodes.length; i++) {
                if(moveStructureNodes[i].param.otherNodeNameText != null){
                    moveStructureNodes[i].param.otherNodeNameText.color = getLineColor();
                    moveStructureNodes[i].param.otherNodeNameText.alpha = 1.0;
                }
                else {
                    moveStructureNodes[i].graphics._stroke.style = getLineColor();
                    moveStructureNodes[i].alpha = 1.0;
                }
            }
            moveStructureNodes.splice(0, moveStructureNodes.length);
            moveStructuresNodesKey = 0;
        }
    }

    //Node
    canvas.addEventListener("mousedown", canvasMouseDown);
    function canvasMouseDown(e){
        if(mode != 1 && mode != 2 && mode != 4) return;
        /**
         * "Select" 始まり
         */
        if(mode === 1){
            XY(e);
            selectX = mouseX;
            selectY = mouseY;

            canvas.addEventListener("mousemove", SelectMove);
            canvas.addEventListener("mouseup", SelectUp);

        }
        else if(mode === 2){
            XY(e);
            kindNode.draw(mouseX, mouseY);
        }
        else if(mode === 4){
            if(mode != 4) return;
            let coreStructureData = getCoreStructure(kindStructure);
            console.log(coreStructureData);
            DrawKCF(coreStructureData);


            // if(kindStructure === "N-glycan_core"){
            //     nodeHashKey = 103;
            //     XY(e);
            //     let man1 = kindNode.draw(mouseX, mouseY);
            //     let man2 = kindNode.draw(mouseX-100, mouseY-50);
            //     let man3 = kindNode.draw(mouseX-100, mouseY+50);
            //     nodeHashKey = 202;
            //     let glcnac1 = kindNode.draw(mouseX+100, mouseY);
            //     let glcnac2 = kindNode.draw(mouseX+200, mouseY);
            //     let structure = new Structure(structure_id, man1, man2, null);
            //     let line = new createjs.Shape();
            //     line.graphics.setStrokeStyle(3);
            //     line.graphics.beginStroke("#000");
            //     line.graphics.moveTo(man1.x, man1.y);
            //     line.graphics.lineTo(man2.x, man2.y);
            //     stage.addChild(line);
            //     structure.edge = line;
            //     let edgeText = new createjs.Text("a1-6","12px serif", "rgb(255,0,0)");
            //     edgeText.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x)/2;
            //     edgeText.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y)/2;
            //     stage.addChild(edgeText);
            //     structure.edgeInformamtion = edgeText;
            //     structures[structureKey] = structure;
            //     structureKey++;
            //     structure_id++;
            //
            //     structure = new Structure(structure_id, man1, man3, null);
            //     line = new createjs.Shape();
            //     line.graphics.setStrokeStyle(3);
            //     line.graphics.beginStroke("#000");
            //     line.graphics.moveTo(man1.x, man1.y);
            //     line.graphics.lineTo(man3.x, man3.y);
            //     stage.addChild(line);
            //     structure.edge = line;
            //     edgeText = new createjs.Text("a1-3","12px serif", "rgb(255,0,0)");
            //     edgeText.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x)/2;
            //     edgeText.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y)/2;
            //     stage.addChild(edgeText);
            //     structure.edgeInformamtion = edgeText;
            //     structures[structureKey] = structure;
            //     structureKey++;
            //     structure_id++;
            //
            //     structure = new Structure(structure_id, man1, glcnac1, null);
            //     line = new createjs.Shape();
            //     line.graphics.setStrokeStyle(3);
            //     line.graphics.beginStroke("#000");
            //     line.graphics.moveTo(man1.x, man1.y);
            //     line.graphics.lineTo(glcnac1.x, glcnac1.y);
            //     stage.addChild(line);
            //     structure.edge = line;
            //     edgeText = new createjs.Text("b1-4","12px serif", "rgb(255,0,0)");
            //     edgeText.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x)/2;
            //     edgeText.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y)/2;
            //     stage.addChild(edgeText);
            //     structure.edgeInformamtion = edgeText;
            //     structures[structureKey] = structure;
            //     structureKey++;
            //     structure_id++;
            //
            //     structure = new Structure(structure_id, glcnac1, glcnac2, null);
            //     line = new createjs.Shape();
            //     line.graphics.setStrokeStyle(3);
            //     line.graphics.beginStroke("#000");
            //     line.graphics.moveTo(glcnac1.x, glcnac1.y);
            //     line.graphics.lineTo(glcnac2.x, glcnac2.y);
            //     stage.addChild(line);
            //     structure.edge = line;
            //     edgeText = new createjs.Text("b1-4","12px serif", "rgb(255,0,0)");
            //     edgeText.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x)/2;
            //     edgeText.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y)/2;
            //     stage.addChild(edgeText);
            //     structure.edgeInformamtion = edgeText;
            //     structures[structureKey] = structure;
            //     structureKey++;
            //     structure_id++;
            //     stage.removeChild(man1);
            //     stage.removeChild(man2);
            //     stage.removeChild(man3);
            //     stage.removeChild(glcnac1);
            //     stage.removeChild(glcnac2);
            //     stage.addChild(man1);
            //     stage.addChild(man2);
            //     stage.addChild(man3);
            //     stage.addChild(glcnac1);
            //     stage.addChild(glcnac2);
            //     stage.update();
            //     adjustPosition(stage, structureKey, structures);
            // }
        }
    };

    /**
     *"Select"ドラッグしたまま。四角を作る
     */
    function SelectMove(){
        if(selectRange != null){
            stage.removeChild(selectRange);
            stage.update();
        }
        XY(event);
        let shape = new createjs.Shape();
        shape.graphics.beginStroke(getLineColor());
        shape.graphics.beginFill(MONOSACCHARIDE_COLOR.WHITE);
        if(selectX < mouseX || selectY < mouseY) {
            shape.graphics.drawRect( selectX, selectY,mouseX - selectX, mouseY - selectY);
        }
        else if(selectX > mouseX && selectY > mouseY){
            shape.graphics.drawRect(mouseX, mouseY, selectX - mouseX, selectY - mouseY);
        }

        shape.alpha = 0.3;
        selectRange = shape;
        stage.addChild(shape);
        stage.update();
    }

    /**
     * "Select" 四角作り終わり。
     * 四角内のnodeを見つけ、枠線の色と透明度を変化している
     */
    function SelectUp(){
        let i;
        for(i = 0; i < nodes.length; i++){
            if(selectX < mouseX || selectY < mouseY) {
                if (selectX < nodes[i].x && mouseX > nodes[i].x && selectY < nodes[i].y && mouseY > nodes[i].y) {
                    nodes[i].graphics._stroke.style = "rgb(204, 0, 0)";
                    nodes[i].alpha = 0.5;
                    moveStructureNodes[moveStructuresNodesKey] = nodes[i];
                    moveStructuresNodesKey++;
                }
                if(selectX < nodes[i].param.otherNodeNameText.x && mouseX > nodes[i].param.otherNodeNameText.x && selectY < nodes[i].param.otherNodeNameText.y && mouseY > nodes[i].param.otherNodeNameText.y){
                    nodes[i].param.otherNodeNameText.color = "rgb(204, 0, 0)";
                    nodes[i].param.otherNodeNameText.alpha = 0.5;
                    moveStructureNodes[moveStructuresNodesKey] = nodes[i];
                    moveStructuresNodesKey++;
                }
            }
            else if(selectX > mouseX && selectY > mouseY) {
                if(mouseX < nodes[i].x && selectX > nodes[i].x && mouseY < nodes[i].y && selectY > nodes[i].y){
                    nodes[i].graphics._stroke.style = "rgb(204, 0, 0)";
                    nodes[i].alpha = 0.5;
                    moveStructureNodes[moveStructuresNodesKey] = nodes[i];
                    moveStructuresNodesKey++;
                }
                if(mouseX < nodes[i].param.otherNodeNameText.graphics.x && selectX > nodes[i].param.otherNodeNameText.graphics.x && mouseY < nodes[i].param.otherNodeNameText.graphics.y && selectY > nodes[i].param.otherNodeNameText.graphics.y){
                    nodes[i].param.otherNodeNameText.color = "rgb(204, 0, 0)";
                    nodes[i].param.otherNodeNameText.alpha = 0.5;
                    moveStructureNodes[moveStructuresNodesKey] = nodes[i];
                    moveStructuresNodesKey++;
                }
            }
        }
        for(i = 0; i < moveStructureNodes.length; i++){
            moveStructureNodes[i].addEventListener("mousedown", SelectMoveStructureDown);
        }
        stage.removeChild(selectRange);
        document.addEventListener("contextmenu", SelectStructureDelete,false);
        stage.update();
        canvas.removeEventListener("mousemove", SelectMove);
        canvas.removeEventListener("mouseup", SelectUp);
    }

    /**
     *"Select" 選択範囲を右クリックすることで削除する
     */

    function SelectStructureDelete(){
        if(mode != 1) return;
        canvas.removeEventListener("mousemove", SelectMove);
        canvas.removeEventListener("mouseup", SelectUp);
        window.removeEventListener("mousedown", WindowClick);
        let res = confirm("Do you delete Selected structure?");
        if(res == true){
            let i;
            let j;
            for(i = 0; i < moveStructureNodes.length; i++){
                for(j = 0; j < structures.length; j++){
                    if(moveStructureNodes[i].param.id === structures[j].Node1.param.id || moveStructureNodes[i].param.id === structures[j].Node2.param.id){
                        stage.removeChild(structures[j].edge);
                        stage.removeChild(structures[j].edgeInformamtion);
                        structures.splice(j, 1);
                    }
                    if(moveStructureNodes[i] ===  nodes[j]){
                        nodes.splice(j, 1);
                    }
                }
                if(moveStructureNodes[i].param.otherNodeNameText != null){
                    stage.removeChild(moveStructureNodes[i].param.otherNodeNameText);
                }
                else {
                    stage.removeChild(moveStructureNodes[i]);
                }
            }
            if(structures.length != 0) {
                for (i = 0; i < structures.length; i++) {
                    structures[i].structureId = structure_id;
                    structure_id++;
                }
            }
            if(nodes.length != 0) {
                for (i = 0; i < nodes.length; i++) {
                    nodes[i].param.id = node_id;
                    node_id++;
                }
            }
            for(i = 0; i < moveStructureNodes.length; i++){
                moveStructureNodes[i].removeEventListener("mousedown", SelectMoveStructureDown);
            }
            moveStructureNodes.splice(0, moveStructureNodes.length);
            moveStructuresNodesKey = 0;
            document.removeEventListener("contextmenu", SelectStructureDelete,false);
            window.addEventListener("mousedown",WindowClick);
        }
        structureKey = structures.length;
        nodeKey = nodes.length;
    }

    /**
     *"Select" 選択範囲内のオブジェクトをドラッグして移動
     */

    function SelectMoveStructureDown(event){
        window.removeEventListener("mousedown",WindowClick);
        let target = event.target;
        let i;
        for(i = 0; i < moveStructureNodes.length; i++) {
            drawStructureXPoints[i] = stage.mouseX - moveStructureNodes[i].x;
            drawStructureYPoints[i] = stage.mouseY - moveStructureNodes[i].y;
        }
        for(i = 0; i < moveStructureNodes.length; i++){
            for(let j = 0; j < structures.length; j++){
                if(moveStructureNodes[i].param.id === structures[j].Node1.param.id){
                    targetMoveStructureNode1[targetMoveStructureKey1] = structures[j];
                    targetMoveStructureKey1++;
                }
                else if(moveStructureNodes[i].param.id === structures[j].Node2.param.id){
                    targetMoveStructureNode2[targetMoveStructureKey2] = structures[j];
                    targetMoveStructureKey2++;
                }
            }
        }
        target.addEventListener("pressmove", SelectMoveStructureMove);
        target.addEventListener("pressup", SelectMoveStructureUp);
    }

    /**
     *"Select" 移動終了
     */

    function SelectMoveStructureMove(){
        if(mode != 1 && mode != 7) return;
        canvas.removeEventListener("mousemove", SelectMove);
        canvas.removeEventListener("mouseup", SelectUp);
        let i;
        let j;

        for(i = 0; i < moveStructureNodes.length; i++){
            let movePointX = stage.mouseX - drawStructureXPoints[i];
            let movePointY = stage.mouseY - drawStructureYPoints[i];
            if(movePointX > 0 + 10 && movePointX  < canvas.width - 10){
                moveStructureNodes[i].x = stage.mouseX - drawStructureXPoints[i];
            }
            if(movePointY > 0 + 10 && movePointY < canvas.height - 10) {
                moveStructureNodes[i].y = stage.mouseY - drawStructureYPoints[i];
            }
        }
        for(i = 0; i < moveStructureNodes.length; i++){
            for(j = 0; j < targetMoveStructureNode1.length; j++) {
                if (targetMoveStructureNode1.length != 0) {
                    if (moveStructureNodes[i] === targetMoveStructureNode1[j].Node1) {
                        stage.removeChild(targetMoveStructureNode1[j].edge);
                        let line = new createjs.Shape();
                        line.graphics.setStrokeStyle(3);
                        line.graphics.beginStroke("#000");
                        line.graphics.moveTo(targetMoveStructureNode1[j].Node2.x, targetMoveStructureNode1[j].Node2.y);
                        line.graphics.lineTo(moveStructureNodes[i].x, moveStructureNodes[i].y);
                        stage.addChild(line);
                        stage.removeChild(targetMoveStructureNode1[j].Node2);
                        stage.removeChild(moveStructureNodes[i]);
                        stage.addChild(targetMoveStructureNode1[j].Node2);
                        stage.addChild(moveStructureNodes[i]);
                        if (targetMoveStructureNode1[j] != null) {
                            stage.removeChild(targetMoveStructureNode1[j].edgeInformamtion);
                            targetMoveStructureNode1[j].edgeInformamtion.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
                            targetMoveStructureNode1[j].edgeInformamtion.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2;
                        }
                        stage.addChild(targetMoveStructureNode1[j].edgeInformamtion);
                        stage.update();
                        targetMoveStructureNode1[j].edge = line;
                    }
                }
            }
            for(j = 0; j < targetMoveStructureNode2.length; j++) {
                if (targetMoveStructureNode2.length != 0) {
                    if (moveStructureNodes[i] === targetMoveStructureNode2[j].Node2) {
                        stage.removeChild(targetMoveStructureNode2[j].edge);
                        let line = new createjs.Shape();
                        line.graphics.setStrokeStyle(3);
                        line.graphics.beginStroke("#000");
                        line.graphics.moveTo(targetMoveStructureNode2[j].Node1.x, targetMoveStructureNode2[j].Node1.y);
                        line.graphics.lineTo(moveStructureNodes[i].x, moveStructureNodes[i].y);
                        stage.addChild(line);
                        stage.removeChild(targetMoveStructureNode2[j].Node1);
                        stage.removeChild(moveStructureNodes[i]);
                        stage.addChild(targetMoveStructureNode2[j].Node1);
                        stage.addChild(moveStructureNodes[i]);
                        if (targetMoveStructureNode2[j] != null) {
                            stage.removeChild(targetMoveStructureNode2[j].edgeInformamtion);
                            targetMoveStructureNode2[j].edgeInformamtion.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x) / 2;
                            targetMoveStructureNode2[j].edgeInformamtion.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y) / 2;
                        }
                        stage.addChild(targetMoveStructureNode2[j].edgeInformamtion);
                        stage.update();
                        targetMoveStructureNode2[j].edge = line;
                    }
                }
            }
        }
    }

    function SelectMoveStructureUp(event){
        if(mode != 1 && mode != 7) return;
        let target = event.target;
        for(let i = 0; i < moveStructureNodes.length; i++){
            moveStructureNodes[i].graphics._stroke.style = getLineColor();
            moveStructureNodes[i].alpha = 1.0;
            moveStructureNodes[i].removeEventListener("mousedown", SelectMoveStructureDown);
            moveStructureNodes[i].removeEventListener("contextmenu", SelectStructureDelete);
        }
        moveStructureNodes.splice(0, moveStructureNodes.length);
        moveStructuresNodesKey = 0;
        targetMoveStructureNode1.splice(0, targetMoveStructureNode1.length);
        targetMoveStructureNode2.splice(0, targetMoveStructureNode2.length);
        targetMoveStructureKey1 = 0;
        targetMoveStructureKey2 = 0;
        drawStructureXPoints.splice(0,drawStructureXPoints.length);
        drawStructureYPoints.splice(0,drawStructureYPoints.length);
        target.removeEventListener("pressmove", SelectMoveStructureMove);
        target.removeEventListener("pressup", SelectMoveStructureUp);
        window.addEventListener("mousedown",WindowClick);
        document.removeEventListener("contextmenu", SelectStructureDelete,false);
    }

// Edge Move Node
    function handleDown(event) {
        if (mode != 3 && mode != 6 && mode != 7) return;
        if (mode === 3) {
            if (edgeCount === 0) {
                edgeStart = event.target;
                startX = edgeStart.x;
                startY = edgeStart.y;
                edgeStart.alpha = 0.5;
                edgeCount = 1;
            }
            else {
                let edgeEnd = event.target;
                let structure = new Structure(structure_id, edgeStart, edgeEnd, null);
                let line = new createjs.Shape();
                line.graphics.setStrokeStyle(3);
                line.graphics.beginStroke("#000");
                line.graphics.moveTo(startX, startY);
                line.graphics.lineTo(edgeEnd.x, edgeEnd.y);
                stage.addChild(line);
                stage.removeChild(edgeStart);
                stage.removeChild(edgeEnd);
                stage.addChild(edgeStart);
                stage.addChild(edgeEnd);
                stage.update();
                edgeStart.alpha = 1.0;
                edgeCount = 0;
                structure.edge = line;
                structures[structureKey] = structure;
                structure.edge.addEventListener("click", edgeClick);
                structureKey++;
                structure_id++;
            }
        }

        else if (mode === 6) {
            let target = event.target;
            let deleatStructures = new Array();
            let deleatKey = 0;
            let i;
            let j = 0;
            for (i = 0; i < structures.length; i++) {
                if (target.param.id === structures[i].Node1.param.id || target.param.id === structures[i].Node2.param.id) {
                    stage.removeChild(structures[i].edge);
                    if (structures[i].edgeInformamtion != null) {
                        stage.removeChild(structures[i].edgeInformamtion);
                    }
                    deleatStructures[deleatKey] = i;
                    deleatKey++;
                }
            }
            for (i = 0; i < deleatStructures.length; i++) {
                structures.splice(deleatStructures[i] - j, 1);
                j++;
            }
            for (i = 0; i < nodes.length; i++) {
                if (nodes[i].id === target.id) {
                    nodes.splice(i, 1);
                }
            }
            stage.removeChild(target);
            stage.update();
            structureKey = structures.length;
            nodeKey = nodes.length;
        }

        else if (mode === 7) {
            window.removeEventListener("mousedown",WindowClick);
            let target = event.target;
            target.graphics._stroke.style = "rgb(204, 0, 0)";
            target.alpha = 0.5;
            moveStructureNodes[moveStructuresNodesKey] = target;
            moveStructuresNodesKey++;
            let i;
            for(i = 0; i < moveStructureNodes.length; i++) {
                drawStructureXPoints[i] = stage.mouseX - moveStructureNodes[i].x;
                drawStructureYPoints[i] = stage.mouseY - moveStructureNodes[i].y;
            }
            for(i = 0; i < moveStructureNodes.length; i++){
                for(let j = 0; j < structures.length; j++){
                    if(moveStructureNodes[i].param.id === structures[j].Node1.param.id){
                        targetMoveStructureNode1[targetMoveStructureKey1] = structures[j];
                        targetMoveStructureKey1++;
                    }
                    else if(moveStructureNodes[i].param.id === structures[j].Node2.param.id){
                        targetMoveStructureNode2[targetMoveStructureKey2] = structures[j];
                        targetMoveStructureKey2++;
                    }
                }
            }
            target.addEventListener("pressmove", SelectMoveStructureMove);
            target.addEventListener("pressup", SelectMoveStructureUp);
        }
    }


    function edgeClick(event){
        let target = event.target;
        for(let i = 0; i < structures.length; i++){
            if(structures[i].edge === target){
                stage.removeChild(structures[i].edgeInformamtion);
            }
        }
        let edgeText = new createjs.Text(edgeKey,"12px serif", "rgb(255,0,0)");
        edgeText.x = (target.graphics._activeInstructions[0].x + target.graphics._activeInstructions[1].x)/2;
        edgeText.y = (target.graphics._activeInstructions[0].y + target.graphics._activeInstructions[1].y)/2;
        stage.addChild(edgeText);
        stage.update();
        for(let i = 0; i < structures.length; i++){
            if(structures[i].edge === target){
                structures[i].edgeInformamtion = edgeText;
            }
        }

    }
    function XY(e){
        let rect = e.target.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    };


    function CreateTree(){
        if(nodes.length < 1){
            alert("Please build glycan.");
            return;
        }
        let orderStructure = new Array();
        let i;
        for(i = 0; i < structures.length; i++){
            orderStructure[i] = structures[i];
        }
        let rootNode = orderStructure[0].Node1;
        let childKey = 0;

        KCFTextOutId = 0;
        glycoTreeKey = 0;
        usedStructureKey = 0;

        for(i = 0; i < orderStructure.length; i++){
            if(rootNode.x < orderStructure[i].Node1.x) rootNode = orderStructure[i].Node1;
            if(rootNode.x < orderStructure[i].Node2.x) rootNode = orderStructure[i].Node2;
        }
        let glycoTree = new GlycoTree();
        glycoTree.Node = rootNode;
        glycoTree.id = KCFTextOutId;
        KCFTextOutId++;
        glycoTrees[glycoTreeKey] = glycoTree;
        glycoTreeKey++;
        for(i = 0; i < orderStructure.length; i++){
            if(glycoTree.Node.param.id === orderStructure[i].Node1.param.id){
                usedStructures[usedStructureKey] = orderStructure[i];
                usedStructureKey++;
                glycoTree.children[childKey] = followTree(orderStructure, orderStructure[i].Node2,orderStructure[i].edgeInformamtion,glycoTree.id);
                childKey++;
            }
            else if(glycoTree.Node.param.id === orderStructure[i].Node2.param.id){
                usedStructures[usedStructureKey] = orderStructure[i];
                usedStructureKey++;
                glycoTree.children[childKey] = followTree(orderStructure, orderStructure[i].Node1, orderStructure[i].edgeInformamtion,glycoTree.id);
                childKey++;
            }
        }
        KCFTextOut();

    }

    function followTree(orderStructure, Node, linkage, parentId){
        let glycoTree = new GlycoTree();
        glycoTree.Node = Node;
        glycoTree.link = linkage;
        glycoTree.id = KCFTextOutId;
        glycoTree.parentId = parentId;
        KCFTextOutId++;
        glycoTrees[glycoTreeKey] = glycoTree;
        glycoTreeKey++;

        let childKey = 0;

        for(let i = 0; i < orderStructure.length; i++){
            for(let j = 0; j < usedStructures.length; j++){
                if(i >= orderStructure.length) break;
                else if(usedStructures[j].structureId === orderStructure[i].structureId){
                    i++;
                }
            }
            if(i >= orderStructure.length) break;
            if(glycoTree.Node.param.id === orderStructure[i].Node1.param.id){
                usedStructures[usedStructureKey] = orderStructure[i];
                usedStructureKey++;
                glycoTree.children[childKey] = followTree(orderStructure, orderStructure[i].Node2,orderStructure[i].edgeInformamtion, glycoTree.id);
                childKey++;
            }
            else if(glycoTree.Node.param.id === orderStructure[i].Node2.param.id){
                usedStructures[usedStructureKey] = orderStructure[i];
                usedStructureKey++;
                glycoTree.children[childKey] = followTree(orderStructure, orderStructure[i].Node1,orderStructure[i].edgeInformamtion, glycoTree.id);
                childKey++;
            }
        }
        return glycoTree;

    }

    function KCFTextOut(){
        let textArea = document.getElementById("kcf_format");
        let str;
        let str2;
        let url;
        if(mode === 8){
            str = "ENTRY"+ TAB + TAB + TAB + "Glycan" + NEW_LINE + "NODE" + TAB + TAB + glycoTrees.length + NEW_LINE;
            str2 = "EDGE" + TAB + TAB + structures.length + NEW_LINE;
        }
        else if(mode === 9){
            let date = new Date();
            url = "http://www.rings.t.soka.ac.jp/cgi-bin/runmatching.pl?DrawRINGS" + date.getTime() + ".txt~";
            str = "ENTRY" + URL_TAB + "Glycan" + URL_NEW_LINE + "NODE" + URL_TAB + glycoTrees.length + URL_NEW_LINE;
            str2 = "EDGE" + URL_TAB + structures.length + URL_NEW_LINE;
        }
        for(let i = 0; i < glycoTrees.length; i++){
            if(i != 0){
                glycoTrees[i].Node.param.sortParamX = glycoTrees[i].Node.x - glycoTrees[0].Node.x;
                glycoTrees[i].Node.param.sortParamY = glycoTrees[i].Node.y - glycoTrees[0].Node.y;
            }
            glycoTrees[i].id++;
            if(mode === 8) {
                str += TAB + glycoTrees[i].id + TAB + glycoTrees[i].Node.param.monosaccharide + TAB + glycoTrees[i].Node.param.sortParamX + TAB + glycoTrees[i].Node.param.sortParamY + NEW_LINE;
            }
            else if(mode === 9){
                str += URL_TAB + glycoTrees[i].id + URL_TAB + glycoTrees[i].Node.param.monosaccharide + URL_TAB + glycoTrees[i].Node.param.sortParamX + URL_TAB + glycoTrees[i].Node.param.sortParamY + URL_NEW_LINE;
            }
        }
        let KCFEdgeID = 0;
        str2 += KCFTextOutEdge(glycoTrees[0], KCFEdgeID+1, "");
        glycoTreeKey = 0;

        if(mode === 8) {
            textArea.value = str + str2 + SLASH;
        }
        else if(mode === 9) {
            let runQueryUrl = url + str + str2 + SLASH + WAVE + document.scoreMatrix.scoreSelect.value + WAVE;
            let kindRunQueryResultType;
            for (let i = 0; i < document.kindRnuQueryResult.type.length; i++){
                if (document.kindRnuQueryResult.type[i].checked == true) {
                    kindRunQueryResultType = document.kindRnuQueryResult.type[i].value;
                }
            }
            runQueryUrl += kindRunQueryResultType + WAVE + document.database.databaseSelect.value;

//                + "~none~0~All";
            window.open(runQueryUrl,"_blank");
            //console.log(textArea.value);
        }
        usedStructures.splice( 0, usedStructures.length );
        glycoTrees.splice(0, glycoTrees.length);
    }

    function KCFTextOutEdge(glycoTree, KCFEdgeID, str){
        let str2 = str;
        let anomer = "";
        let reduction = -1;
        let non_reduction = -1;
        for(let i = 0; i < glycoTree.children.length; i++){
            let child = glycoTree.children[i];
            if(child.link != null){
                if(child.link.text.match(/^[a]/)){
                    anomer = 'a';
                }
                else{
                    anomer = 'b';
                }
                for(let j = 1; j <= 6; j++){
                    for(let k = 1; k <= 6; k++){
                        if(child.link.text == anomer + j + "-" + k){
                            reduction = k;
                            non_reduction = j;
                        }
                    }
                }
                if(mode === 8) {
                    str2 += TAB + KCFEdgeID + TAB + child.id + COLON + anomer + non_reduction + TAB + glycoTree.id + COLON + reduction + NEW_LINE;
                }
                else if(mode === 9){
                    str2 += URL_TAB + KCFEdgeID + URL_TAB + child.id + COLON + anomer + non_reduction + URL_TAB + glycoTree.id + COLON + reduction + URL_NEW_LINE;
                }
                KCFEdgeID++;

            }
            str2 = KCFTextOutEdge(glycoTree.children[i], KCFEdgeID, str2);
        }
        return str2;
    }


    function buildGlycan(DrawKCFNodeObjects, DrawKCFEdgeObjects){
        //単糖の距離のsort
        let sortMinX = parseInt(DrawKCFNodeObjects[0].paramX,10);
        let sortMinY = parseInt(DrawKCFNodeObjects[0].paramY,10);
        let sortMaxX = parseInt(DrawKCFNodeObjects[0].paramX,10);
        let sortMaxY = parseInt(DrawKCFNodeObjects[0].paramY,10);
        let i;
        let j;
        for(i = 1; i < DrawKCFNodeObjects.length; i++){
            if(sortMinX > parseInt(DrawKCFNodeObjects[i].paramX,10)){
                sortMinX = parseInt(DrawKCFNodeObjects[i].paramX,10);
            }
            else if(sortMaxX < parseInt(DrawKCFNodeObjects[i].paramX,10)){
                sortMaxX = parseInt(DrawKCFNodeObjects[i].paramX,10);
            }
            if(sortMinY > parseInt(DrawKCFNodeObjects[i].paramY,10)){
                sortMinY = parseInt(DrawKCFNodeObjects[i].paramY,10);
            }
            else if(sortMaxY < parseInt(DrawKCFNodeObjects[i].paramY,10)){
                sortMaxY = parseInt(DrawKCFNodeObjects[i].paramY,10);
            }
        }
        let sortAverageX = sortMinX + (sortMaxX - sortMinX)/2;
        let sortAverageY = sortMinY + (sortMaxY - sortMinY)/2;
        for(i = 0; i < DrawKCFNodeObjects.length; i++){
            DrawKCFNodeObjects[i].paramX = parseInt(DrawKCFNodeObjects[i].paramX,10) - sortAverageX;
            DrawKCFNodeObjects[i].paramY = parseInt(DrawKCFNodeObjects[i].paramY,10) - sortAverageY;
        }
        sortAverageX =  canvas.width/2;
        sortAverageY = canvas.height/2;
        for(i = 0; i < DrawKCFNodeObjects.length; i++){
            DrawKCFNodeObjects[i].paramX = sortAverageX + DrawKCFNodeObjects[i].paramX;
            DrawKCFNodeObjects[i].paramY = sortAverageY + DrawKCFNodeObjects[i].paramY;
        }

        //Node
        for(i = 0; i < DrawKCFNodeObjects.length; i++){
            for(j = 100; j < 1107; j++){
                if(NODE_HASH[j] === DrawKCFNodeObjects[i].monosaccharide){
                    nodeHashKey = j;
                }
            }
            kindNode.draw(DrawKCFNodeObjects[i].paramX , DrawKCFNodeObjects[i].paramY  );
        }

        //Edge
        let childNode;
        let parentNode;
        let parentNodeObject;
        let childNodeObject;
        for(i = 0; i < DrawKCFEdgeObjects.length; i++) {
            for (j = 0; j < DrawKCFNodeObjects.length; j++) {
                if (DrawKCFEdgeObjects[i].childId === DrawKCFNodeObjects[j].nodeNumber) {
                    childNode = DrawKCFNodeObjects[j];
                }
                else if (DrawKCFEdgeObjects[i].parentId === DrawKCFNodeObjects[j].nodeNumber) {
                    parentNode = DrawKCFNodeObjects[j];
                }
            }
            for (j = 0; j < nodes.length; j++) {
                if(nodes[j].x === parentNode.paramX && nodes[j].y === parentNode.paramY){
                    parentNodeObject = nodes[j];
                }
                else if(nodes[j].x === childNode.paramX && nodes[j].y === childNode.paramY){
                    childNodeObject = nodes[j];
                }
            }

            let structure = new Structure(structure_id, parentNodeObject, childNodeObject, null);
            let line = new createjs.Shape();
            line.graphics.setStrokeStyle(3);
            line.graphics.beginStroke("#000");
            line.graphics.moveTo(parentNode.paramX, parentNode.paramY);
            line.graphics.lineTo(childNode.paramX, childNode.paramY);
            stage.addChild(line);
            structure.edge = line;
            let edgeText = new createjs.Text(DrawKCFEdgeObjects[i].anomer + DrawKCFEdgeObjects[i].childLinkagePsition + "-" + DrawKCFEdgeObjects[i].parentLinkagePosition,"12px serif", "rgb(255,0,0)");
            edgeText.x = (line.graphics._activeInstructions[0].x + line.graphics._activeInstructions[1].x)/2;
            edgeText.y = (line.graphics._activeInstructions[0].y + line.graphics._activeInstructions[1].y)/2;
            stage.addChild(edgeText);
            structure.edgeInformamtion = edgeText;
            structures[structureKey] = structure;
            structureKey++;
            structure_id++;
            stage.removeChild(parentNodeObject);
            stage.removeChild(childNodeObject);
            stage.addChild(parentNodeObject);
            stage.addChild(childNodeObject);
        }

        stage.update();
        DrawKCFNodeObjects.splice( 0, DrawKCFNodeObjects.length);
        DrawKCFEdgeObjects.splice(0, DrawKCFEdgeObjects.length);
        adjustPosition(stage, structureKey, structures);
    }

    function textClear(){
        let res = confirm("Textarea clear all?");
        if(res === true){
            let textArea = document.getElementById("kcf_format");
            textArea.value = "KCF-Text";
        }
    }

    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {
        stage.update(); // 画面更新
    }
};

export { DrawApp };