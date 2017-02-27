var fs = require('fs');
//path模块，可以生产相对和绝对路径
var path = require("path");
var sizeOf = require('image-size');
//获取当前目录绝对路径，这里resolve()不传入参数
var filePath = path.resolve();
//读取文件存储数组
var fileArr = [];
var RemotePath = 'D:/gulpCode/src';
filePath = RemotePath;
//读取文件目录
fs.readdir(filePath, function(err, files) {
    if (err) {
        console.log(err);
        return;
    }
    var count = files.length;
    files.forEach(function(filename) {
        //filePath+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
        fs.stat(path.join(filePath, filename), function(err, stats) {
            if (err) throw err;

            if (filename == 'images') {
                //var readurl = filePath+'/'+filename;
                //filePath+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
                //    console.log(path.join(filePath,filename));
                var name = filename;
                readFile(path.join(filePath, filename), name);
            }

        });
    });
});
//获取后缀名
function getdir(url) {
    var arr = url.split('.');
    var len = arr.length;
    return arr[len - 1];
}
//获取图片名字
function getName(url) {
    var arr = url.split('.');
    var str = '';
    for (var i = 0; i < arr.length - 1; i++) {
        str += arr[i];
    }
    return str;
}
//获取文件数组
function readFile(readurl, name) {
    var name = name;
    fs.readdir(readurl, function(err, files) {
        if (err) {
            console.log(err);
            return;
        }
        files.forEach(function(filename) {
            fs.stat(path.join(readurl, filename), function(err, stats) {
                if (err) throw err;
                //是文件
                if (stats.isFile()) {
                    //读本地images里面的图片
                    // var newUrl = name + '/' + filename;
                    var newUrl = filePath + '/' + name + '/' + filename;
                    fileArr.push({ url: newUrl, name: filename });
                    writeFile(fileArr);
                }
            });
        });
    });
}
// 写入到filelisttxt文件
function writeFile(data) {
    // console.log(data);
    var startline = '@import "reset";\n@import "myfn";\n';
    var linecss = [];
    for (var i = 0; i < data.length; i++) {
        var dimensions = sizeOf(data[i].url);
        var nameChoose = getName(data[i].name);
        linecss.push("." + nameChoose + "{@include whbg(" + dimensions.width + "," + dimensions.height + ",'" + data[i].name + "')}");

    }
    var linecss = startline + linecss.join("\n");

    fs.writeFile(filePath + "/css/" + "style.scss", linecss + '\n', function(err) {
        if (err) throw err;
        console.log("写入成功");
    });
}
