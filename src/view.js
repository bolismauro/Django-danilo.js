"use strict";
(function() {

  define(['danilo', 'handlebars'], function(danilo, handlebars) {
    var View;
    
    return View = (function() {
      console.log(danilo);
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
          console.log(rendered_html);
          var destination = document.querySelector(selector);
          destination.innerHTML = rendered_html;
          //danilo.update();
          // maybe use a combination of event+operation is better?
          callback();
        });
      };


      return View;

    })();
  });
}).call(this);
