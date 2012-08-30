"use strict";
(function() {

  define([], function() {
    var View;
    
    return View = (function() {

      function View(viewUrl) {
        View.prototype.url = viewUrl;
        View.prototype.load = function(){};
        View.prototype.unload = function(){};
      }

      View.prototype.onLoad = function(callback) {
        this.load = callback;
        return this;
      };

      View.prototype.onUnload = function(callback) {
        this.unload = callback;
        return this;
      };


      return View;

    })();
  });
}).call(this);
