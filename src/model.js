"use strict";
(function() {

  define(['./storage', 'pubsub', 'promise', 'validation'], function(storage, PubSub, Promise, Validation) {
    var Model;
    return Model = (function() {

      var __hasProp = {}.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };



      var getObjectClass;

      function Model(values) {
        var that = this;
        this.attributeValues = [];
        
        Object.keys(this.attrs).forEach(function(attr) {
            var attrInfo;
            
            if (typeof values != "undefined" && typeof values[attr] != "undefined") {
              that.set(attr, values[attr]);
              
            } else {
              attrInfo = that.attrs[attr];
              if (typeof attrInfo == "object") {
                that.set(attr, attrInfo.defaultValue);
              } else {
                that.set(attr, attrInfo);
              }
            }

        });
      };
      

      Model.extends = function(modelName, params){
        // @TODO: modelName should be avoided/optional
        /*if ('undefined' === typeof params) {
          params = modelName;
          modelName = 'Unnamed Model';
        }*/
      
        var newModel = function() {
          return newModel.__super__.constructor.apply(this, arguments);
        }
        __extends(newModel, Model);
      
        for(var name in params){
          newModel.prototype[name] = params[name];
        }

        newModel.prototype['modelName'] = modelName;

        return newModel;
      }

      Model.prototype.form = function(formElement, sync_validate) {
        var attributes = []
          , validation_result = true
          , that = this;
          
        attributes = formElement.querySelectorAll('[data-bind]');
        attributes = Array.prototype.slice.apply(attributes); // Convert NodeList to Array
        
        if (sync_validate === true) {
          var global_validation_result = true;
          // Perform a dry-run before changing the model instance
          attributes.forEach(function (attr, i) {
            validation_result = that.set(attr.getAttribute('data-bind'), attr.value, true); // true=dry_run
            
            if (validation_result === false) {
              global_validation_result = false;
            }
          });

          if (global_validation_result === false) {
            return false;
          }
        }
        
        // We should use .update(), but we need a dictionary instead of the attributes Array
        attributes.forEach(function (attr, i) {
          that.set(attr.getAttribute('data-bind'), attr.value);
        });
        
        return true;
      }

      Model.prototype.update = function(attrs) {
        var that = this;
        
        Object.keys(attrs).forEach(function(attrName) {
          that.set(attrName, attrs[attrName]);
        });
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
        return obj.modelName;
      };

      return Model;

    })();
  });

}).call(this);
