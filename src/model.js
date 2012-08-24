(function() {
  "use strict";

  define(['./storage', 'pubsub', 'promise', 'validation'], function(storage, PubSub, Promise, Validation) {
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
              this.set(attr, attrInfo.defaultValue);
            }
          }
          if ((values != null ? values[attr] : void 0) != null) {
            this.attributeValues[attr] = values[attr];
          }
        }
      };
      
      Model.prototype.form = function(formElement, sync_validate) {
        var attributes = formElement.querySelectorAll('[data-bind]')
          , validation_result = true;
        
        // @TODO: sync_validate method should be cleaned up...
        if (typeof sync_validate != "undefined" && sync_validate === true) {
          // .forEach is required instead of for..in because .lenght property is enumerable (oh my God...)
          attributes.forEach(function (attr, i) {
            validation_result = this.set(attr.getAttribute('data-bind'), attr.value, true);
            
            if (validation_result === false) {
              return false;
            }
          });    
        }
        // /TODO
        
        attributes.forEach(function (attr, i) {
          // @FIXME @BUG: .value probably does not correctly handle textareas and radio elements
          this.set(attr.getAttribute('data-bind'), attr.value);
        });
        
        return true;
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

      Model.prototype.set = function(attribute, value, dry_run) {
        var validationResult = true;
        
        if (typeof dry_run == "undefined") {
          dry_run = false;
        }

        if (this.autoValidate === true) {
          validationResult = this.validate(attribute, value)

          if (validationResult && dry_run === false) {
            this.attributeValues[attribute] = value;
          }
        } else {
          if (dry_run === false) {
            this.attributeValues[attribute] = value;
          }
        }

        if (this.attrs[attribute].reactive === true && dry_run === false) {
          storage._reactive_publish(getObjectClass(this)+'.'+attribute, value, this);
        }

        return validationResult;

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
