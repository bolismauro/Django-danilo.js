(function() {
  "use strict";

  define(['./router', './model', './operation', './operationError', './remote', 'handlebars'], function(router, Model, Operation, OperationError, Remote, Handlebars) {
    var render_template;
    render_template = function(template, ctx) {
      if (ctx == null) {
        ctx = {};
      }
      return Handlebars.compile(template)(ctx);
    };
    return {
      render_template: render_template,
      router: router,
      Model: Model,
      Operation: Operation,
      OperationError: OperationError,
      Remote: Remote
    };
  });

}).call(this);
