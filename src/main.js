"use strict";

// DrawAppの読み込み
import { DrawApp } from './lib/draw_app';

// canvasの初期化
const canvas = document.getElementById("canvas");
// DrawAppクラスのインスタンス化
const app = new DrawApp(canvas);
// DrawAppのrunメソッドを実行
app.run();