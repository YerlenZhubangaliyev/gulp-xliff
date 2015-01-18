
var
    through     = require('through2'),
    fs          = require('fs'),
    xml2js      = require('xml2js'),
    gutil       = require('gulp-util'),
    ext         = gutil.replaceExtension,
    PluginError = gutil.PluginError,
    xmlParser   = new xml2js.Parser(),
    pluginName  = "gulp-xliff2json";


function parseXliff (xliff, cb) {
    "use strict";

    xmlParser.parseString(xliff, function (err, json) {
        cb(json);
    });
};

function handleOutput(output, file, cb) {
    file.path = ext(file.path, '.json');
    file.contents = new Buffer(output);
    cb(null, file);
}

module.exports = function () {
    function xliffToJson (file, encoding, cb) {
        parseXliff(String(file.contents), function (xliffJson) {
            handleOutput(JSON.stringify(xliffJson, null, 4), file, cb);
        });

    }

    return through.obj(xliffToJson);
};