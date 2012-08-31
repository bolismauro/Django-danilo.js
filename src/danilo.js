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

    init = (function(router) {
      
      _formsubmit_factory = function(form_tag) {
        var _this = this;
        return function(e) {
          var attrs, item, _i, _len, _ref;
          attrs = {};
          _ref = form_tag.getElementsByTagName('input');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (item.getAttribute('data-skip') !== 'true') {
              if (!item.getAttribute('name')) {
                if (typeof console !== "undefined" && console !== null) {
                  console.log('[debug-router] this field does not have a name', item);
                }
              } else {
                attrs[item.getAttribute('name')] = item.value;
              }
            }
          }
          PubSub.publish("submit " + (form_tag.getAttribute('data-bind')), {
            form: form_tag,
            attrs: attrs
          });
          e.preventDefault();
          return false;
        };
      };
      
      _formchange_add_handlers = function(form_tag) {
        var item, _i, _len, _ref;
        _ref = form_tag.getElementsByTagName('input');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.getAttribute('data-skip') !== 'true') {
            if (item.getAttribute('name')) {
              item.onchange = (function(item) {
                return function() {
                  return PubSub.publish("change " + (form_tag.getAttribute('data-bind')), {
                    form: form_tag,
                    input: item
                  });
                };
              })(item);
            }
          }
        }
      };
      _fixDOM = function() {
        var item, real_href, _i, _j, _len, _len1, _ref, _ref1, _results;
        _ref1 = document.querySelectorAll('form[data-bind]');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          item = _ref1[_j];
          item.onsubmit = _formsubmit_factory(item);
          _results.push(_formchange_add_handlers(item));
        }
        return _results;
      };
      
      init = function() {
        var old_handler,
          _this = this;
        old_handler = window.onhashchange;
        window.onhashchange = function() {
          _fixDOM();
          return typeof old_handler === "function" ? old_handler() : void 0;
        };
        return _fixDOM();
      };
      
      return init;
      
    })(router);

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
