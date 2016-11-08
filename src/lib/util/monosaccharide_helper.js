
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

const MONOSACCHARIDES = {
    WHITE:      ["hexose", "hexnac", "hexosamine", "hexuronate", "deoxyhexose", "deoxyhexnac", "di_deoxyhexose", "pentose", "nonuloosonate", "unknown", "assigned"],
    BLUE:       ["glc", "glcnac",  "glcn", "glca", "qui", "quinac", "oli", "bac", "api"],
    GREEN:      ["man", "mannac",  "mann", "mana", "rha", "rhanac", "tyv", "ara", "kdn", "ldmanhep", "fru"],
    YELLOW:     ["gal", "galnac",  "galn", "gala", "lyx", "kdo", "tag"],
    ORANGE:     ["gul", "gulnac",  "guln", "gula", "abe", "xyl", "dha", "sor"],
    PINK:       ["alt", "altnac",  "altn", "alta", "6dalt", "par", "rib", "ddmanhep", "psi"],
    PURPLE:     ["all", "allnac",  "alln", "alla", "dig", "neu5ac", "murnac"],
    LIGHT_BLUE: ["tal", "talnac",  "taln", "tala", "6dtal", "col", "neu5gc", "murngc"],
    BROWN:      ["ido", "idonac",  "idon", "idoa", "neu", "mur"],
    RED:        ["fuc", "fucnac"]
};

const LINE_COLOR = 'rgb(0, 0, 0)';

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


let getLineColor = function() {
    "use strict";
    return LINE_COLOR;
};

export {getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR};