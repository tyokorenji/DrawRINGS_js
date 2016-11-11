#!/usr/bin/env node

// 参考：http://shimz.me/blog/node-js/2944

var fs = require("fs"),
    path = require("path"),
    dir = process.argv[2] || '.'; //引数が無いときはカレントディレクトリを対象とする

var walk = function(p, callback){
    var results = [];

    fs.readdir(p, function (err, files) {
        if (err) throw err;

        var pending = files.length;
        if (!pending) return callback(null, results); //全てのファイル取得が終わったらコールバックを呼び出す

        files.map(function (file) { //リスト取得
            return path.join(p, file);
        }).filter(function (file) {
            if(fs.statSync(file).isDirectory()) walk(file, function(err, res) { //ディレクトリだったら再帰
                results.push({name:path.basename(file), children:res}); //子ディレクトリをchildrenインデックス配下に保存
                if (!--pending) callback(null, results);
            });
            return fs.statSync(file).isFile();
        }).forEach(function (file) { //ファイル名を保存
            var matcher = /\.txt$/;
            if (matcher.test(file)) {
                results.push({file:path.basename(file), fileData:fs.readFileSync(dir + "/" + path.basename(file),'utf8')});
            }
            //var stat = fs.statSync(file);
            // results.push({file:path.basename(file), size:stat.size});
            if (!--pending) callback(null, results);
        });
    });
}

walk(dir, function(err, results) {
    if (err) throw err;
    var data = {name:'root', children:results};
    console.log(JSON.stringify(data)); //一覧出力
});
