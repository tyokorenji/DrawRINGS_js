
const MONOSACCHARIDE_COLOR = {
    WHITE:      'rgb(255, 255, 255)',
    BLUE:       'rgb(0, 128, 255)',
    GREEN:      'rgb(0, 255, 0)',
    YELLOW:     'rgb(255, 217, 0)',
    ORANGE:     'rgb(255, 128, 0)',
    PINK:       'rgb(255, 136, 194)',
    PURPLE:     'rgb(159, 31, 255)',
    LIGHT_BLUE: 'rgb(151, 243, 248)',
    BROWN:      'rgb(140, 116, 54)',
    RED:        'rgb(255, 0, 0)'
};

 const NULL = "null";

const MONOSACCHARIDES = {
    WHITE:      ["hexose", "hexnac", "hexosamine", "hexuronate", "deoxyhexose", "deoxyhexnac", "di_deoxyhexose", "pentose", "noulosonate", "unknown", "assigned"],
    BLUE:       ["glc", "glcnac",  "glcn", "glca", "qui", "quinac", "oli", NULL, NULL, "bac", "api"],
    GREEN:      ["man", "mannac",  "mann", "mana", "rha", "rhanac", "tyv", "ara", "kdn", "ldmanhep", "fru"],
    YELLOW:     ["gal", "galnac",  "galn", "gala", NULL, NULL, NULL, "lyx", NULL, "kdo", "tag"],
    ORANGE:     ["gul", "gulnac",  "guln", "gula", NULL, NULL, "abe", "xyl", NULL, "dha", "sor"],
    PINK:       ["alt", "altnac",  "altn", "alta", "6dalt", NULL, "par", "rib", NULL, "ddmanhep", "psi"],
    PURPLE:     ["all", "allnac",  "alln", "alla", NULL, NULL, "dig", NULL, "neu5ac", "murnac", NULL],
    LIGHT_BLUE: ["tal", "talnac",  "taln", "tala", "6dtal", NULL, "col", NULL, "neu5gc", "murngc", NULL],
    BROWN:      ["ido", "idonac",  "idon", "idoa", NULL, NULL, NULL, NULL, "neu", "mur", NULL],
    RED:        [ NULL, NULL, NULL, NULL,"fuc", "fucnac", NULL, NULL, NULL, NULL, NULL]
};

const LINE_COLOR_BLACK = 'rgb(0, 0, 0)';
const LINE_COLOR_RED = ' rgb(255, 0, 0) ';

let getMonosaccharideColor = function(sugarName) {
    "use strict";
    let lowerSugarName = sugarName.toLowerCase();

    let colors = Object.keys(MONOSACCHARIDES);
    for (let i=0; i<colors.length; i++) {
        let color = colors[i];

        if (MONOSACCHARIDES[color].indexOf(lowerSugarName) >= 0) {
            return MONOSACCHARIDE_COLOR[color];
        }
    }
    return null;
};


let getLineColor = function(color) {
    "use strict";
    if(color === "black") return LINE_COLOR_BLACK;
    else if(color === "red") return LINE_COLOR_RED;
};

export {getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR, MONOSACCHARIDES};