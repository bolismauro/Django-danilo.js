/**
 * Danilo.js - MOVE framework and router for the browser. (c) 2012 PlasticPanda.com
 */
"use strict";
(function(exports) {

  define(['./router', './model', './operation', './remote', './storage', './view'], function(router, Model, Operation, remote, storage, View) {
    var render_template
      , danilo
      , dany;
    
    dany = (function(router) {
      // Init and update handlers
      
      var _formsubmit_factory
        , _formchange_add_handlers
        , _fixForms
        , update
        , init
        , _fixAnchors;
      
      _formsubmit_factory = function(form_tag) {
        return function(e) {
          var attrs = {}
            , inputs;
          
          inputs = form_tag.getElementsByTagName('input');
          inputs = Array.prototype.slice.apply(inputs); // Convert NodeList to Array
          
          inputs.forEach(function(item, k){
            if (item.getAttribute('data-skip') !== 'true') {
              if (item.getAttribute('name') == null) {
                if (console != null) {
                  console.log('[debug-router] this field does not have a name', item);
                }
              } else {
                attrs[item.getAttribute('name')] = item.value;
              }
            }
          });
          
          PubSub.publish("submit " + form_tag.getAttribute('data-bind'), {
            form: form_tag,
            attrs: attrs
          });
          
          e.preventDefault();
          return false;
        };
      };
      
      _formchange_add_handlers = function(form_tag) {
        var inputs;
        
        inputs = form_tag.getElementsByTagName('input');
        inputs = Array.prototype.slice.apply(inputs);
        
        inputs.forEach(function(item, k){
          if (item.getAttribute('data-skip') !== 'true') {
            if (item.getAttribute('name') != null) { 
              return function() {
                return PubSub.publish("change " + form_tag.getAttribute('data-bind'), {
                  form: form_tag,
                  input: this
                });
              };
            }
          }
        }); 
      };
      
      _fixForms = function() {
        var items;
        
        items = document.querySelectorAll('form[data-bind]');
        items = Array.prototype.slice.apply(items);
        
        items.forEach(function(item, k) {
          item.onsubmit = _formsubmit_factory(item);
          _formchange_add_handlers(item);
        });
      };

      _fixAnchors = function(){
        var items;
        
        items = document.querySelectorAll('a');
        items = Array.prototype.slice.apply(items);
        
        items.forEach(function(item, k) {
          if(item.getAttribute('data-skip') !== 'true'){
            item.onclick = function(e){
              router.goToUrl(item.href);
              e.preventDefault();
            }
          }
        });
      }
      
      update = function() {
        // Call this when you add or remove views
        _fixForms();
        _fixAnchors();
      }
      
      init = function() {
        router.init();
        update();
      };
      
      return {
        init: init,
        update: update
      };
      
    })(router);

    exports.danilo = danilo = {
      router: router,
      init: dany.init,
      update: dany.update,
      Model: Model,
      Operation: Operation,
      storage: storage,
      remote: remote,
      View: View
    };

    return danilo;
  });

})(window);
