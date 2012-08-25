"use strict";
(function() {

  define(['pubsub'], function(PubSub) {
    var init, _aclick_factory, _fixDOM, _formchange_add_handlers, _formsubmit_factory, _get_current_route, _set_current_route;
    _get_current_route = function() {
      return window.location.hash.replace('#!', '');
    };
    _set_current_route = function(location) {
      var _ref;
      return (_ref = window.location) != null ? _ref.hash = '!' + location : void 0;
    };
    _aclick_factory = function(href, old_onclick) {
      var _this = this;
      return function(e) {
        if (typeof old_onclick === "function") {
          old_onclick();
        }
        PubSub.publish("navigate " + href, {
          url: href,
          post_route: function(err) {
            if (err) {
              throw "Routing error: " + err;
            } else {
              return _set_current_route(href);
            }
          }
        });
        e.preventDefault();
        return false;
      };
    };
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
      _ref = document.getElementsByTagName('a');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        real_href = item.getAttribute('href');
        if (!real_href || real_href[0] === "#" || item.getAttribute('data-route') === "false") {
          continue;
        }
        if (real_href[0] === '/') {
          item.href = '#!' + real_href;
          item.onclick = _aclick_factory(real_href, item.onclick);
        }
      }
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
    
    return {
      init: init
    };
  });

}).call(this);
