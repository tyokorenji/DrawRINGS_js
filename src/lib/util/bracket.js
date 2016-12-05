"use strict";
import * as createjs from '../../../bower_components/EaselJS';

class Bracket {
    constructor(){
        this.startBracket = {
            bracketShape: null,
            structure: null,
            numOfRepeatShape: null,
            numOfRepeatText: null,
            node: null
        };
        this.endBracket = {
            bracketShape: null,
            structure: null,
            node: null
        };
        this.repeatNodes = [];
    }
}

module.exports = Bracket;