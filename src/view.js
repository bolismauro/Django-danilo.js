"use strict";
(function() {

  define(['handlebars'], function(handlebars) {
    var View;
  
    return View = (function() {
      
      function View(viewUrl) {
        // TODO: add a template param?
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


      View.prototype.render = function(template, selector, ctx, callback) {
        if (ctx == null) {
          ctx = {};
        }
        require(["text!"+template], function(template){
          var rendered_html = Handlebars.compile(template)(ctx);
          var destination = document.querySelector(selector);
          destination.innerHTML = rendered_html;
          //circular dependence..how fix this?
          require('./danilo').update();
          // maybe use a combination of event+operation is better?
          callback();
        });
      };


      return View;

    })();
  });
}).call(this);
