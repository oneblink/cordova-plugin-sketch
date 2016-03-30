exports.defineAutoTests = function () {
  describe('Sketch (navigator.sketch)', function () {
    it('should exist', function () {
      expect(navigator.sketch).toBeDefined();
    });

    it('should contain a getSketch method', function () {
      expect(navigator.sketch.getSketch).toBeDefined();
      expect(typeof navigator.sketch.getSketch === 'function').toBe(true);
    });

    it('should contain a DestinationType enum', function () {
      expect(navigator.sketch.DestinationType).toBeDefined();
      expect(typeof navigator.sketch.DestinationType === 'object').toBe(true);
    });

    it('should contain a EncodingType enum', function () {
      expect(navigator.sketch.EncodingType ).toBeDefined();
      expect(typeof navigator.sketch.EncodingType === 'object').toBe(true);
    });

    it('should contain a InputType enum', function () {
      expect(navigator.sketch.InputType).toBeDefined();
      expect(typeof navigator.sketch.InputType === 'object').toBe(true);
    });
  });

  describe('DestinationType enum', function () {
    it('DestinationType should contain a DATA_URL field', function () {
      expect(navigator.sketch.DestinationType.DATA_URL).toBeDefined();
    });

    it('DestinationType should contain a FILE_URI field', function () {
      expect(navigator.sketch.DestinationType.FILE_URI).toBeDefined();
    });
  });

  describe('EncodingType enum', function () {
    it('should contain a JPEG field', function () {
      expect(navigator.sketch.EncodingType.JPEG).toBeDefined();
    });

    it('should contain a PNG field', function () {
      expect(navigator.sketch.EncodingType.PNG).toBeDefined();
    });
  });

  describe('InputType enum', function () {
    it('should contain a NO_INPUT field', function () {
      expect(navigator.sketch.InputType.NO_INPUT).toBeDefined();
    });

    it('should contain a DATA_URL field', function () {
      expect(navigator.sketch.InputType.DATA_URL).toBeDefined();
    });

    it('should contain a FILE_URI field', function () {
      expect(navigator.sketch.InputType.FILE_URI).toBeDefined();
    });
  });

  describe('getSketch method', function () {

    beforeEach(function(done) {
      setTimeout(function() {
        done();
      }, 1);
    });

    describe('default options.', function () {
      var callback = function () {};

      beforeEach(function () {
        spyOn(cordova, 'exec');
      });

      it('should pass DATA_URL when the destinationType option is not given', function () {
        var options;

        navigator.sketch.getSketch(callback, callback);
        expect(cordova.exec).toHaveBeenCalled();

        options = cordova.exec.calls.argsFor(0)[4];
        if (typeof options !== 'undefined') {
          expect(options[0].destinationType).toEqual(navigator.sketch.DestinationType.DATA_URL);
        } else {
          expect(options).toBeDefined(); // Fail the test
        }
      });

      it('should pass PNG when the encodingType option is not given', function () {
        var options;

        navigator.sketch.getSketch(callback, callback);
        expect(cordova.exec).toHaveBeenCalled();

        options = cordova.exec.calls.argsFor(0)[4];
        if (typeof options !== 'undefined') {
          expect(options[0].encodingType).toEqual(navigator.sketch.EncodingType.PNG);
        } else {
          expect(options).toBeDefined(); // Fail the test
        }
      });

      it('should pass NO_INPUT when the inputType option is not given', function () {
        var options;

        navigator.sketch.getSketch(callback, callback);
        expect(cordova.exec).toHaveBeenCalled();

        options = cordova.exec.calls.argsFor(0)[4];
        if (typeof options !== 'undefined') {
          expect(options[0].inputType).toEqual(navigator.sketch.InputType.NO_INPUT);
        } else {
          expect(options).toBeDefined(); // Fail the test
        }
      });
    });

    describe("long asynchronous specs", function() {
      var successCallback = null;
      var originalTimeout;
      var errorCallback = null;
      var inputData;
      beforeEach(function() {
        successCallback = jasmine.createSpy('successCallback');
        errorCallback = jasmine.createSpy('errorCallback');
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
      });

      it('should be called with a JPEG file URI when destinationType is FILE_URI, encoding type is JPEG', function (done) {
        var filetype = '.JPEG';
        navigator.sketch.getSketch(successCallback, errorCallback, {
          destinationType: navigator.sketch.DestinationType.FILE_URI,
          encodingType: navigator.sketch.EncodingType.JPEG
        });
        setTimeout(function() {
          expect(successCallback).toHaveBeenCalled();
          if (successCallback.calls != null && successCallback.calls.mostRecent() != undefined) {
            expect(successCallback.calls.mostRecent().args[0].toUpperCase().indexOf(filetype)).toBeGreaterThan(0);
          }
          done();
        }, 19000);
      });

      it('should be called with a PNG file URI when destinationType is FILE_URI, encoding type is PNG', function (done) {
        var filetype = '.PNG';
        navigator.sketch.getSketch(successCallback, errorCallback, {
          destinationType: navigator.sketch.DestinationType.FILE_URI,
          encodingType: navigator.sketch.EncodingType.PNG
        });
        setTimeout(function() {
          expect(successCallback).toHaveBeenCalled();
          if (successCallback.calls != null && successCallback.calls.mostRecent() != undefined) {
            expect(successCallback.calls.mostRecent().args[0].toUpperCase().indexOf(filetype)).toBeGreaterThan(0);
          }
          done();
        }, 19000);
      });


      it('should be called with a JPEG encoded data stream when destinationType is DATA_URL, encoding type is JPEG', function (done) {
        navigator.sketch.getSketch(successCallback, errorCallback , {
          destinationType: navigator.sketch.DestinationType.DATA_URL,
          encodingType: navigator.sketch.EncodingType.JPEG
        });
        setTimeout(function() {
          expect(successCallback).toHaveBeenCalled();
          if (successCallback.calls != null && successCallback.calls.mostRecent() != undefined) {
            expect(successCallback.calls.mostRecent().args[0].indexOf('data:image/jpeg')).toBe(0);
          }
          done();
        }, 19000);
      });

      it('should be called with a PNG encoded data stream when destinationType is DATA_URL, encoding type is PNG', function (done) {
        navigator.sketch.getSketch(successCallback, errorCallback , {
          destinationType: navigator.sketch.DestinationType.DATA_URL,
          encodingType: navigator.sketch.EncodingType.PNG
        });
        setTimeout(function() {
          expect(successCallback).toHaveBeenCalled();
          if (successCallback.calls != null && successCallback.calls.mostRecent() != undefined) {
            expect(successCallback.calls.mostRecent().args[0].indexOf('data:image/png')).toBe(0);
            inputData = successCallback.calls.mostRecent().args[0];
          }
          done();
        }, 19000);
      });

      it('should be called with a PNG encoded data stream when destinationType is DATA_URL, encoding type is PNG, inputType is DATA_URL', function (done) {
        navigator.sketch.getSketch(successCallback, errorCallback , {
          destinationType: navigator.sketch.DestinationType.DATA_URL,
          encodingType: navigator.sketch.EncodingType.PNG,
          inputType : navigator.sketch.InputType.DATA_URL,
          inputData : inputData
        });
        setTimeout(function() {
          expect(successCallback).toHaveBeenCalled();
          if (successCallback.calls != null && successCallback.calls.mostRecent() != undefined) {
            expect(successCallback.calls.mostRecent().args[0].indexOf('data:image/png')).toBe(0);
          }
          inputData = null;
          done();
        }, 19000);
      });

      afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      });
    });
  });
};
