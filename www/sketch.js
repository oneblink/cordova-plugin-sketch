var Sketch = function () {
    var sketch = {};

    var getSketch =  function (successCallback, errorCallback, options) {
        var argsCheck = require('cordova/argscheck');
        var opts = options || {};

        argsCheck.checkArgs('fFO', 'Sketch.getSketch', arguments);
        if (typeof opts.destinationType === 'undefined' || opts.destinationType === null) {
            opts.destinationType = DestinationType.DATA_URL;
        }

        if (typeof opts.encodingType === 'undefined' || opts.encodingType === null) {
            opts.encodingType = EncodingType.PNG;
        }

        if (typeof opts.inputType === 'undefined' || opts.inputType === null) {
            opts.inputType = InputType.NO_INPUT;
        }

        cordova.exec(successCallback, errorCallback, "SketchPlugin", "getSketch", [opts]);
    };

    var InputType =  {
        NO_INPUT: 0,         // no input as background image, use as signature plugin
        DATA_URL: 1,         // base64 encoded string stream
        FILE_URI: 2          // file uri (content://media/external/images/media/2 for Android)
    };

    var DestinationType = {
        DATA_URL: 0,         // Return base64 encoded string
        FILE_URI: 1          // Return file uri (content://media/external/images/media/2 for Android)
    };

    var EncodingType = {
        JPEG: 0,             // Return JPEG encoded image
        PNG: 1               // Return PNG encoded image
    };

    sketch.getSketch = getSketch;
    sketch.InputType = InputType;
    sketch.DestinationType = DestinationType;
    sketch.EncodingType = EncodingType;

    return sketch;
};

module.exports = Sketch();
