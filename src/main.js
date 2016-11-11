"use strict";

import { DrawApp } from './lib/draw_app';

const canvas = document.getElementById("canvas");
const app = new DrawApp(canvas);
app.run();