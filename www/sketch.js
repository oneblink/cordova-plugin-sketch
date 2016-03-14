var Sketch = {
    getSketch:function(successCallback, errorCallback, options) {
        cordova.exec(successCallback, errorCallback, options, "SketchPlugin", "getSketch");
    }
}

module.exports = Sketch;
