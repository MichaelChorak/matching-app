//get a reference to the file system module
var fs = require('fs');

//get a reference to the uglify-js module
var UglifyJS = require('uglify-js');

var result = UglifyJS.minify(fs.readFileSync('script.js', 'utf8'))


fs.writeFile("output.min.js", result.code, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("File was successfully saved.");
    }
});