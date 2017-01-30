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
import Sugar  from './sugar.js';
import Modification  from './Modification';
import { NODE_HASH } from './util/node_hash';
import { getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR } from './util/monosaccharide_helper';
import { getCoreStructure } from './util/core_structure';
import { KCFParser, connectStructures } from './util/kcf_parser';
import { clearAll } from './util/clear_all';
import { createKCF } from './util/create_KCF';
import { setEdgeText } from './util/set_edge_text';
import { textClear } from './util/text_clear';
import { eraseNode } from './util/erase_node';
import * as stageEdit from './util/edit_stage';
import { rectMove, rectUp, selectedStructureDelete, selectedMoveStructureDown, selectedMoveStructureMove, selectedMoveStructureUp } from './util/select_function';
import { createIUPAC } from  './util/createIUPAC';
import { createRepeatBracket, setBracket, searchFourCorner } from './util/create_bracket';

console.log(Node);
console.log(Structure);
console.log(Sugar);
console.log(Modification);

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
    const stage = new createjs.Stage(canvas);

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

    /**
     *  Textareaの大きさを画面の大きさに対して変化させる
     */

    function setTextareaSize() {
        let canvas = $('#canvas');
        let w = parseInt(canvas.css('width'), 10);
        let h = parseInt(canvas.css('height'), 10);

        let textarea = $('#kcf_format');
        //textarea.css('width', w);
        textarea.css('height', h);
    }

    /**
     * RunQueryで出すダイアログボックスの設定
     */

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
    });

    /**
     * repeat構造の繰り返し回数を聞くときのダイアログボックスの設定
     */

    jQuery(function($){
        $("#numberOfRepeat").dialog({
            autoOpen: false,  // 自動的に開かないように設定
            width: 400,       // 横幅のサイズを設定
            modal: true,      // モーダルダイアログにする
            buttons: [        // ボタン名 : 処理 を設定
                {
                    text: 'OK',
                    click: function(){
                        repeatBracket();
                        $(this).dialog("close");
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
        $("#repeatBracketBuuton").click(function(){
            $("#numberOfRepeat").dialog("open");
        });
    });




    let mouseX = 0;
    let mouseY = 0;

// どの機能かの判別
    var mode = 0;
    let nodeId = 1;
    let structureId = 1;

    let nodeHashKey;
    let edgeKey;
    let nodes = [];
    let structures = [];
    let brackets = [];
    let nodeShape = 0;
// 機能のための変数
    var edgeCount = 0;
    let edgeStart = null;
    let selectX = 0;
    let selectY = 0;
    let selectRange = null;
    let moveStructureNodes = new Array();
    let pointObj = {};
    let moveStructure = [];



    let fileLoadId = document.getElementById("kcfFileLoad");
    let fileLoadTextareaId = document.getElementById("kcf_format");

    // リサイズイベントを検知してリサイズ処理を実行
    window.addEventListener("resize", handleResize);
    handleResize(); // 起動時にもリサイズしておく

    // リサイズ処理
    /**
     * TODO: GUI
     * Windowがリサイズしたときのcanvasの大きさをリサイズする処理
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
        // adjustPosition(stage, structureKey, structures);
        if(nodes.length != 0 && structures.length != 0) {
            for(let i = 0; i < nodes.length; i++) {
                if(nodes[i].xCood < 10 || nodes[i].xCood > canvas.width - 10 || nodes[i].yCood < 10 || nodes[i].yCood > canvas.height - 10) {
                    clearAll(nodes, structures, brackets, stage);
                    for(let l = 0; l < nodes.length; l++){
                        nodes[l].childNode = [];
                    }
                    let results = connectStructures(nodes, structures, brackets, canvas, stage);
                    for (let j = 0; j < nodes.length; j++) {
                        nodes[j] = results[0][j];
                        nodes[j].sprite.addEventListener("mousedown", handleDown);
                    }
                    for (let j = 0; j < structures.length; j++) {
                        structures[j] = results[1][j];
                        structures[j].edge.addEventListener("click", edgeClick);
                    }
                    for(let j = 0; j < brackets.length; j++){
                        brackets[j] = results[2][j];
                    }
                }

            }
        }
    }

    /**
     * fileをuploadする時の処理
     */
    fileLoadId.addEventListener("change", function(evt){
        let file = evt.target.files;
        let fileReader = new FileReader();
        fileReader.readAsText(file[0]);
        fileReader.onload = function(evt){
            fileLoadTextareaId.value = fileReader.result;
        };
        $("#kcfFileLoad").val("");
    }, false);

    /**
     * 選択されたNodeの種類を決めるハッシュ値を変数に格納するための関数
     * @param k: Nodeのハッシュ値
     */
    let nodeMenu = function(k){
        nodeHashKey = k;
        nodeShape = 0;
    };
    window.nodeMenu = nodeMenu;
    /**
     * 未定義のnodeや修飾を格納する関数
     */
    let nodeTextMenu = function(){
        nodeShape = 1;
        nodeHashKey = document.nodeForm.nodeText.value;
    };
    window.nodeTextMenu = nodeTextMenu;

    let edgeMenu = function(k){
        edgeKey = k;
    };
    window.edgeMenu = edgeMenu;

    let edgeTextMenu = function(){
        // if(!document.edgeForm.edgeText.value.match(/[ab][1-6][-][1-6]/g)){
        //     alert("Please write \nAnomer(a or b)" + 1 + "~" +6 + ' - ' + 1 + "~" + 6 + "\n example: a1-4");
        // }
        // else{
            edgeMenu(document.edgeForm.edgeText.value);
        // }
    };
    window.edgeTextMenu = edgeTextMenu;

    let structureMenu = function(k){
        if(mode != 4) return;
        let coreStructureData = getCoreStructure(k);
        console.log(coreStructureData);
        let parser = new KCFParser(coreStructureData);
        let results = parser.parse(canvas, stage);
        for(let i = 0; i < results[0].length; i++){
            results[0][i].sprite.addEventListener("mousedown", handleDown);
            nodes.push(results[0][i]);
        }
        for(let i = 0; i < results[1].length; i++){
            results[1][i].edge.addEventListener("click", edgeClick);
            structures.push(results[1][i]);
        }
        for(let i = 0; i < results[2].length; i++){
            brackets.push(results[2][i]);
        }
    };
    window.structureMenu = structureMenu;


    $(function(){
        $(".dropdown-menu li button").click(function(){
            $(this).parents('.btn-group').find('.dropdown-toggle').html($(this).text() + '<span class="caret"></span>');
            $(this).parents('.btn-group').find('input[name="dropdown-value"]').val($(this).attr("data-value"));
        });
    });


    $('#nodeMenu').addClass('hidden-menu');
    $('#edgeMenu').addClass('hidden-menu');
    $('#structureMenu').addClass('hidden-menu');
    $('#structureDelete').addClass('hidden-menu');

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
            let res = confirm("clear ALL?");
            if(res) {
                clearAll(nodes, structures, brackets, stage);
                nodes = [];
                structures = [];
                brackets =[];
                structureId = 1;
                nodeId = 1;
            }
        }
        if(mode === 8 || mode === 9){
            let kindRunQuery =  document.kindRnuQueryResult.type;
            let database = document.database.databaseSelect;
            let scoreMatrix = document.scoreMatrix.scoreSelect;
            createKCF(mode, nodes, structures, brackets, kindRunQuery, database, scoreMatrix);
        }
        if(mode === 10){
            let parser = new KCFParser(fileLoadTextareaId.value);
            let results = parser.parse(canvas, stage);
            for(let i = 0; i < results[0].length; i++){
                results[0][i].sprite.addEventListener("mousedown", handleDown);
                nodes.push(results[0][i]);
            }
            for(let i = 0; i < results[1].length; i++){
                results[1][i].edge.addEventListener("click", edgeClick);
                structures.push(results[1][i]);
            }
            for(let i = 0; i < results[2].length; i++){
                brackets.push(results[2][i]);
            }
        }
        if(mode === 11){
            textClear();
        }
        if(mode === 12){
            createIUPAC(nodes, structures, brackets);
        }
    };

    window.edits = edits;

    // window.addEventListener("click",WindowClick);
    function WindowClick() {
        if (moveStructureNodes.length != 0) {
            for (let i = 0; i < moveStructureNodes.length; i++) {
                moveStructureNodes[i].returnShape(moveStructureNodes[i]);
            }
            canvas.addEventListener("mousedown", canvasMouseDown);
            $('#structureDelete').addClass('hidden-menu');
            canvas.removeEventListener("mousedown", WindowClick);
        }

    }

    //Node
    /**
     * windowをロードしたときからcanvasに対してmousedownイベントを行うと"cavasMouseDown"関数の処理を行うと設定
     */
    canvas.addEventListener("mousedown", canvasMouseDown);
    /**
     * canvasをmousedownした時の処理
     * @param e：イベント
     */
    function canvasMouseDown(e){
        if(mode != 1 && mode != 2 && mode != 4) return;
        /**
         * "Select" の処理
         */
        if(mode === 1){
            // window.removeEventListener("click", WindowClick);
            XY(e);
            selectX = mouseX;
            selectY = mouseY;
            moveStructureNodes = [];
            canvas.addEventListener("mousemove", selectMove);
            canvas.addEventListener("mouseup", selectUp);
        }
        /**
         * "Node"の処理
         */
        else if(mode === 2){
            XY(e);
            let node = null;
            if(nodeShape === 1) {
                node = new Node(nodeId, nodeHashKey, mouseX, mouseY);
                nodeId++;
                // node.sprite = new Modification();
            }
            else {
                node = new Node(nodeId, NODE_HASH[nodeHashKey], mouseX, mouseY);
                nodeId++;
                // node.sprite = new  Sugar();
            }
            node.sprite = node.sprite.nodeDraw(node.name, node.xCood, node.yCood, stage);
            node.sprite.parentNode = node;
            node.sprite.addEventListener("mousedown", handleDown);
            nodes.push(node);
            nodeId++;
        }
    }

    /**
     *"Select"のドラッグ時の処理
     */
    function selectMove(){
        if(selectRange != null){
            stageEdit.removeStage(stage, selectRange);
            stageEdit.stageUpdate(stage);
        }
        XY(event);
        selectRange = rectMove(selectX, selectY, mouseX, mouseY, stage);
    }

    /**
     * "Select" ドラッグを終了した時の処理
     */
    function selectUp(){
        moveStructureNodes = rectUp(selectRange, selectX, selectY, mouseX, mouseY, nodes, stage);
        for(let i = 0; i < moveStructureNodes.length; i++){
            moveStructureNodes[i].addEventListener("mousedown", selectMoveStructureDown);
        }
        $('#structureDelete').removeClass('hidden-menu');
        canvas.addEventListener("mousedown", WindowClick);
        canvas.removeEventListener("mousemove", selectMove);
        canvas.removeEventListener("mouseup", selectUp);
        canvas.removeEventListener("mousedown", canvasMouseDown);
    }

    /**
     *"Select" structureDreleteのボタンを押した時の処理
     */

    function selectStructureDelete(){
        if(mode != 1) return;
        // canvas.removeEventListener("mousemove", selectMove);
        // canvas.removeEventListener("mouseup", selectUp);
        canvas.removeEventListener("mousedown", WindowClick);
        let results = selectedStructureDelete(moveStructureNodes, nodes, structures, stage);
        nodes = results[0];
        structures = results[1];
        if(results){
            moveStructureNodes = [];
            // document.removeEventListener("contextmenu", selectStructureDelete,false);
            // window.addEventListener("click",WindowClick);
            $('#structureDelete').addClass('hidden-menu');
            canvas.addEventListener("mousedown", canvasMouseDown);
        }
    }
    window.selectStructureDelete = selectStructureDelete;

    /**
     * "select" repeatBracketのボタンを押した時の処理
     * @returns {null}
     */
    function repeatBracket(){
        canvas.removeEventListener("mousedown", WindowClick);
        if (moveStructureNodes.length != 0) {
            let bracketObj = createRepeatBracket(moveStructureNodes, structures, stage);
            for (let i = 0; i < moveStructureNodes.length; i++) {
                moveStructureNodes[i].sprite.returnShape(moveStructureNodes[i].sprite);
            }
            canvas.addEventListener("mousedown", canvasMouseDown);
            $('#structureDelete').addClass('hidden-menu');
            brackets.push(bracketObj);
            moveStructureNodes = [];
        }
        else {
            return null;
        }
    }
    window.repeatBracket = repeatBracket;


    /**
     * "Select & MoveNode" 選択された構造をmousedownしたときの処理
     * @param event
     */
    function selectMoveStructureDown(event){
        canvas.removeEventListener("mousedown",WindowClick);
        canvas.removeEventListener("mousedown", canvasMouseDown);
        for(let i = 0; i < moveStructureNodes.length; i++){
            moveStructure.push(moveStructureNodes[i]);
        }
        pointObj = selectedMoveStructureDown(moveStructure, structures, stage);
        let target = event.target;
        target.addEventListener("pressmove", selectMoveStructureMove);
        target.addEventListener("pressup", selectMoveStructureUp);
    }

    /**
     *"Select & MoveNode" 選択範囲内のオブジェクトをドラッグしたときの処理
     */

    function selectMoveStructureMove(){
        if(mode != 1 && mode != 7) return;
        canvas.removeEventListener("mousemove", selectMove);
        canvas.removeEventListener("mouseup", selectUp);
        $('#structureDelete').addClass('hidden-menu');
        selectedMoveStructureMove(pointObj, moveStructure, structures, stage, canvas);
    }

    /**
     *"Select & MoveNode" 選択した構造を移動中にmouseUpした時の処理
     */
    function selectMoveStructureUp(event){
        if(mode != 1 && mode != 7) return;
        selectedMoveStructureUp(moveStructure);
        let target = event.target;
        for(let i = 0; i < moveStructure.length; i++){
            moveStructure[i].removeEventListener("mousedown", selectMoveStructureDown);
        }
        moveStructure = [];
        pointObj = {};
        target.removeEventListener("pressmove", selectMoveStructureMove);
        target.removeEventListener("pressup", selectMoveStructureUp);
        // window.addEventListener("click",WindowClick);
        canvas.addEventListener("mousedown", canvasMouseDown);
        $('#structureDelete').addClass('hidden-menu');
        nodes = nodes;
    }

// Edge Move Node
    function handleDown(event) {
        if (mode != 3 && mode != 6 && mode != 7) return;
        if (mode === 3) {
            if(edgeCount === 0){
                edgeStart = event.target.edgeDraw(event.target, edgeCount);
                edgeCount++;
            }
            else if(edgeCount === 1){
                let structure = event.target.edgeDraw(edgeStart, edgeCount, event.target, stage, structureId);
                structure.edge.addEventListener("click", edgeClick);
                structures.push(structure);
                structureId++;
                edgeCount =0;
                edgeStart =null;
            }
        }
        else if (mode === 6) {
            let results = eraseNode(event.target, nodes, structures, brackets, stage);
            nodes = results[0];
            structures = results[1];
            brackets = results[2];
        }

        else if (mode === 7) {
            canvas.removeEventListener("mousedown",WindowClick);
            let target = event.target;
            target.highlightShape(target);
            moveStructure.push(target);
            pointObj = selectedMoveStructureDown(moveStructure, structures, stage);
            target.addEventListener("pressmove", selectMoveStructureMove);
            target.addEventListener("pressup", selectMoveStructureUp);
        }
    }

// 結合情報
    let edgeClick = function(event){
        if(mode != 3) return;
        structures = setEdgeText(event.target, edgeKey, structures, stage);
    };

    function XY(e){
        let rect = e.target.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }




    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {
        stage.update(); // 画面更新
    }
};

export { DrawApp };