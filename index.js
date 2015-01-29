'use strict';

/**
 *
 * @type {exports}
 */

var
through       = require('through2'),
fs            = require('fs'),
xml2js        = require('xml2js'),
_             = require('lodash'),
jsonpath      = require('JSONPath'),
gutil         = require('gulp-util'),
ext           = gutil.replaceExtension,
PluginError   = gutil.PluginError,
xmlParser     = new xml2js.Parser(),
transUnitPath = "$..trans-unit",
pluginName    = "gulp-xliff2json";


function parseXliff (xliff, cb) {
    xmlParser.parseString(xliff, function (err, json) {
        cb(json);
    });
};

function handleOutput (inputJson, file, cb) {
    var stringifiedJson = findAllTransUnits(inputJson);

    file.path     = ext(file.path, '.json');
    file.contents = new Buffer(stringifiedJson);
    cb(null, file);
}

function findAllTransUnits (jsonObject) {
    var
        result         = {},
        identifiers    = jsonpath.eval(jsonObject, "$..trans-unit..$.id"),
        sources        = jsonpath.eval(jsonObject, "$..trans-unit..source[0]"),
        sourceLanguage = jsonpath.eval(jsonObject, "$..source-language");

    _.each(identifiers, function (identifierValue, index) {
        result[identifierValue] = sources[index];
    });

    return JSON.stringify(result, null, 4);
}

module.exports = function () {
    function xliff2Json (file, encoding, cb) {
        parseXliff(String(file.contents), function (xliffJson) {
            handleOutput(xliffJson, file, cb);
        });

    }

    return through.obj(xliff2Json);
};