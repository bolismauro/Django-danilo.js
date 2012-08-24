"use strict";
(function() {

  /*
  	TODO: find a method to modularize validation.
  	An idea could be create a folder called "validators".
  	Each file in this folder is a validator. Using requireJS this class load
  	the function used to validate values (we assume that the functions have the same signature).
  
  	Using this method (or a method to modularize in general) we could allow developers
  	to define easily their custom validators.
  
  	An alternative could be pass a function when define the model.
  
  	Eg:
  
  		username :
  			custom_validator : (attrValue) ->
  									return --complex operations--
  
  
  	Currently second method is implemented
  */

  define([], function() {
    var Validation;
    return Validation = (function() {

      function Validation() {}

      Validation.validate = function(validationName, validationParam, attributeValue) {
        if (typeof validationParam === "function") {
          return validationParam(attributeValue);
        } else {
          return this[validationName](attributeValue, validationParam);
        }
      };

      Validation.minLength = function(attributeValue, lenght) {
        return attributeValue.length >= lenght;
      };

      Validation.maxLength = function(attributeValue, lenght) {
        return attributeValue.length <= lenght;
      };

      return Validation;

    })();
  });

}).call(this);
