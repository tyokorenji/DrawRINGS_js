/**
 * 各色の設定を定数オブジェクトで宣言している
 * @type {{WHITE: string, BLUE: string, GREEN: string, YELLOW: string, ORANGE: string, PINK: string, PURPLE: string, LIGHT_BLUE: string, BROWN: string, RED: string}}
 */
const MONOSACCHARIDE_COLOR = {
    WHITE:      'rgb(255, 255, 255)',
    BLUE:       'rgb(0, 144, 188)',
    GREEN:      'rgb(0, 166, 81)',
    YELLOW:     'rgb(255, 212, 0)',
    ORANGE:     'rgb(244, 121, 32)',
    PINK:       'rgb(246, 158, 161)',
    PURPLE:     'rgb(165, 67, 153)',
    LIGHT_BLUE: 'rgb(143, 204, 233)',
    BROWN:      'rgb(161, 122, 77)',
    RED:        'rgb(237, 28, 36)'
};

 const NULL = "null";

/**
 * SNFGで定義されている単糖を色と形で表を作成
 * @type {{WHITE: string[], BLUE: string[], GREEN: string[], YELLOW: string[], ORANGE: string[], PINK: string[], PURPLE: *[], LIGHT_BLUE: *[], BROWN: *[], RED: *[]}}
 */
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

//しようする色の宣言
const LINE_COLOR_BLACK = 'rgb(0, 0, 0)';
const LINE_COLOR_RED = ' rgb(255, 0, 0) ';

/**
 * 単糖の名前から、SNFGで定義された色を検索する関数
 * @param sugarName:検索対象の単糖の色
 * @returns 検索結果の色のRGB値
 */
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

/**
 * Edgeや、単糖シンボルのふちの色など、色を習得するための関数
 * @param color:欲しい色の文字列
 * @returns 習得した色のRGB値
 */
let getLineColor = function(color) {
    "use strict";
    if(color === "black") return LINE_COLOR_BLACK;
    else if(color === "red") return LINE_COLOR_RED;
};

export {getMonosaccharideColor, getLineColor, MONOSACCHARIDE_COLOR, MONOSACCHARIDES};