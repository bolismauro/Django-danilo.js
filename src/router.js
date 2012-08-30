"use strict";
(function(){
    // Reactive storage for danilo.js

    define([], function() {

        var router = (function(){

            var router
              , views = {}
              , History = window.History;

            router = {}
            
            router.init = function(name) {
                if ( !History.enabled ) {
                    console.log("Danilo.js Routing is not supported by this browser");
                }

                History.Adapter.bind(window,'statechange',function(){ 
                    var State = History.getState(); 
                    console.log(State);
                });
            }

            router.goToUrl = function(url, title, data) {
                title = title || '';
                data = data || {};
                History.pushState(data, title, url);
            }
            

            return router;

        })();

        return router;
    });

}).call(this);