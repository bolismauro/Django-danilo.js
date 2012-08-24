"use strict";
(function() {

  define(['./router', './model', './operation', './remote', './storage', 'handlebars'], function(router, Model, Operation, Remote, storage, Handlebars) {
    var render_template
      , danilo;

    render_template = function(template, ctx) {
      if (ctx === undefined) {
        ctx = {};
      }
      return Handlebars.compile(template)(ctx);
    };

    danilo = {
      render_template: render_template,
      router: router,
      Model: Model,
      Operation: Operation,
      storage: storage,
      Remote: Remote
    };

    window.danilo = danilo;
    return danilo;
  });

}).call(this);
