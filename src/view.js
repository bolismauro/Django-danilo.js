"use strict";
(function() {

  define(['handlebars', 'pubsub'], function(handlebars, PubSub) {
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


      View.prototype.render = function(template, selector, ctx) {
        if (ctx == null) {
          ctx = {};
        }

        var self = this;

        require(["text!"+template], function(template){
          var rendered_html = Handlebars.compile(template)(ctx);
          var destination = document.querySelector(selector);
          destination.innerHTML = rendered_html;
          //circular dependence..how fix this?
          require('./danilo').update();
          PubSub.publish("viewLoaded " + self.url , {});
          
        });
      };


      return View;

    })();
  });
}).call(this);
