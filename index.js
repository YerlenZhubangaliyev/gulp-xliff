'use strict';

/**
 *
 * @type {exports}
 */

var
through       = require('through2'),
fs            = require('fs'),
xml2js        = require('xml2js'),
jsonpath      = require('JSONPath'),
gutil         = require('gulp-util'),
ext           = gutil.replaceExtension,
PluginError   = gutil.PluginError,
xmlParser     = new xml2js.Parser(),
transUnitPath = "$..trans-unit",
pluginName    = "gulp-xliff2json";


function parseXliff (xliff, cb) {
    "use strict";

    xmlParser.parseString(xliff, function (err, json) {
        cb(json);
    });
};

function handleOutput (output, file, cb) {
    file.path = ext(file.path, '.json');
    file.contents = new Buffer(output);
    cb(null, file);
}

function findAllTransUnits (jsonObject) {
    jsonpath.eval(jsonObject, transUnitPath);
}

module.exports = function () {
    function xliff2Json (file, encoding, cb) {
        parseXliff(String(file.contents), function (xliffJson) {
            var json = findAllTransUnits(xliffJson);
            handleOutput(JSON.stringify(json, null, 4), file, cb);
        });

    }

    return through.obj(xliff2Json);
};