"use strict";
(function(exports) {

  define(['./router', './model', './operation', './remote', './storage', 'handlebars'], function(router, Model, Operation, Remote, storage, Handlebars) {
    var render_template
      , danilo;

    render_template = function(template, ctx) {
      if (ctx == null) {
        ctx = {};
      }
      return Handlebars.compile(template)(ctx);
    };

    exports.danilo = danilo = {
      render_template: render_template,
      router: router,
      Model: Model,
      Operation: Operation,
      storage: storage,
      Remote: Remote
    };

    return danilo;
  });

})(window);
