"use strict";

// ES2015 スタイルの読み込み
import $ from 'jquery';
import * as createjs from 'EaselJS';

// 特定のオブジェクトだけ読み込むなら以下のように記述
// import { Stage, Ticker } from 'EaselJS';

// Bootstrap 動作用 import
import * as bootstrap from 'bootstrap';

// 外部ファイルから読み込み
import animals from './submodule';

import CircleButton from './CircleButton';

import ResponsiveBootstrapToolkit from 'responsive-bootstrap-toolkit';
import * as ui from 'jquery-ui';

{
    console.log("Hello");
}

/*
class Test {
    constructor(say) {
        this.greet = say;
    }
    sayHello() {
        console.log(this.greet);
    }
}

let cats = require('./cats.js');
//let cats = require('./cats.js');
console.log(cats);

const test1 = new Test("Hello!!!");
test1.sayHello();

if (10 === 10) {
    let a = 10;
    console.log(a);
}
//console.log(a);

// ----- 

// CommonJS スタイルの読み込み (古い)
// var jQuery = require('jquery');

// ES2015 スタイルの読み込み
import $ from 'jquery';
import * as createjs from 'EaselJS';

// 特定のオブジェクトだけ読み込むなら以下のように記述
// import { Stage, Ticker } from 'EaselJS';


// Bootstrap 動作用 import
import * as bootstrap from 'bootstrap';

// 外部ファイルから読み込み
import animals from './submodule';

import CircleButton from './CircleButton';

import ResponsiveBootstrapToolkit from 'responsive-bootstrap-toolkit';
import * as ui from 'jquery-ui';


{
    // テストコード

    // - - - - -

    // jQuery の動作チェック
    console.log( $ );
    $(function() {
        $("#test").on("click", function(){
          console.log("CLICK");
        });
    });

    // - - - - -

    // CreateJS (EaselJS) の動作チェック
    console.log( createjs );

    const stage = new createjs.Stage(canvas);
    // const stage = new Stage(canvas);

    let circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    stage.update();

    let arrowFunc = (str) => {
        console.log(str);
    };

    arrowFunc("ES2015 style function call. (Arrow Function)");

    // 外部ファイルオブジェクト
    console.log(animals);

    // Bootstrap動作テスト
    console.log(bootstrap);

    // CreateJS 継承テスト
    const btn1 = new CircleButton('Hi');
    btn1.x = 50;
    btn1.y = 50;
    stage.addChild(btn1);

    const btn2 = new CircleButton('Hello', 'purple', 50);
    btn2.x = 200;
    btn2.y = 50;
    stage.addChild(btn2);
    stage.update();

    console.log("OK");

    // ----

    console.log(ResponsiveBootstrapToolkit);

    (function($, document, window, viewport){
        $(window).resize(
            viewport.changed(function(){
                console.log('Current breakpoint:', viewport.current());
            })
        );
    } ($, document, window, ResponsiveBootstrapToolkit));

    console.log(ui);
    $("#draggable").draggable();
}
*/

