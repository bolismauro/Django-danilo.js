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
                    var view_to_load = views[State.hash];

                    if(view_to_load === undefined){
                        console.log("[debug] view not found");
                        return;
                    }
                    view_to_load.load();
                });
            }

            router.register = function(view){
                views[view.url] = view;
            }

            router.unRegister = function(view){
                if(typeof(view) === "object") {
                    delete views[view.url];
                }else{
                    delete views[view];
                }
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