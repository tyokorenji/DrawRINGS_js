/**
 * Created by Renji on 2016/11/09.
 */

// let path = "./core_structure";
//
// //「/」で区切って配列化
// let pathinfo = path.split('/');
//
// for(let i = 0; i < pathinfo)
// //最後の要素（ファイル名）だけ抜き出し
// var filename = pathinfo.pop();
// console.log(filename);

// let  FOLDER = fso.GetFolder("D:\\./core_structure");
// const FILE_LIST = FOLDER.getFiles();

    /*
let fs = require('fs') // fsモジュールを利用できるように
let path = require('path') // pathモジュールを利用できるように

// process.argv[2]には対象のディレクトリのパスが格納されています。
fs.readdir("./core_structure", function (err, list) {
    list.forEach(function (file) {
        // // process.argv[3]にはフィルタする拡張子が格納されています。
        // if (path.extname(file) === '.' + process.argv[3])
        //     console.log(file)
        console.log(list);
    })
})
*/

import * as structuresJson from 'json-loader!../../resource/structures.json';

console.log(structuresJson);
let getCoreStructure = function(coreStructureName) {
    for (let i = 0; i<structuresJson.children.length; i++) {
        let child = structuresJson.children[i];
        if(coreStructureName === child.file){
            return child.fileData;
        }
        // console.log(child.file);
    }
};

export { getCoreStructure }