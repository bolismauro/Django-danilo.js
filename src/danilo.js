"use strict";
(function(exports) {

  define(['./router', './model', './operation', './remote', './storage', 'handlebars', './view'], function(router, Model, Operation, Remote, storage, Handlebars, View) {
    var render_template
      , danilo
      , init;

    render_template = function(template, ctx) {
      if (ctx == null) {
        ctx = {};
      }
      return Handlebars.compile(template)(ctx);
    };

    init = function() {
      router.init();
    }

    exports.danilo = danilo = {
      render_template: render_template,
      router: router,
      init: init,
      Model: Model,
      Operation: Operation,
      storage: storage,
      Remote: Remote,
      View: View
    };

    return danilo;
  });

})(window);
