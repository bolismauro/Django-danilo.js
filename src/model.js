(function() {
  "use strict";

  define(['pubsub', 'promise', 'validation'], function(PubSub, Promise, Validation) {
    var Model;
    return Model = (function() {
      var getObjectClass;

      function Model(values) {
        var attr, attrInfo, _ref;
        this.attributeValues = [];
        _ref = this.attrs;
        for (attr in _ref) {
          attrInfo = _ref[attr];
          if (typeof attrInfo !== "object") {
            this.attributeValues[attr] = attrInfo;
          } else {
            this.attributeValues[attr] = '';
            if (attrInfo.defaultValue != null) {
              this.attributeValues[attr] = attrInfo.defaultValue;
            }
          }
          if ((values != null ? values[attr] : void 0) != null) {
            this.attributeValues[attr] = values[attr];
          }
        }
      }

      Model.prototype.update = function(attrs) {
        var k, v, _results;
        _results = [];
        for (k in attrs) {
          v = attrs[k];
          _results.push(this.attributeValues[k] = v);
        }
        return _results;
      };

      Model.prototype.get = function(attribute) {
        return this.attributeValues[attribute];
      };

      Model.prototype.set = function(attribute, value) {
        if (this.autoValidate) {
          if (this.validate(attribute, value)) {
            return this.attributeValues[attribute] = value;
          }
        } else {
          return this.attributeValues[attribute] = value;
        }
      };

      Model.prototype.validate = function(attributeName, attributeValue) {
        var attribute, modelName, validationName, validationParam, _ref;
        if (!(attributeValue != null)) {
          attributeValue = this.attributeValues[attribute];
        }
        attribute = this.attrs[attributeName];
        _ref = attribute.validators;
        for (validationName in _ref) {
          validationParam = _ref[validationName];
          if (!Validation.validate(validationName, validationParam, attributeValue)) {
            modelName = getObjectClass(this);
            PubSub.publish("validationError " + modelName, {
              modelName: modelName,
              modelInstance: this,
              attribute: attributeName,
              validationName: validationName
            });
            return false;
          }
        }
        return true;
      };

      getObjectClass = function(obj) {
        var arr;
        if (obj && obj.constructor && obj.constructor.toString) {
          arr = obj.constructor.toString().match(/function\s*(\w+)/);
          if (arr && arr.length === 2) {
            return arr[1];
          }
        }
        return "undefined";
      };

      return Model;

    })();
  });

}).call(this);
