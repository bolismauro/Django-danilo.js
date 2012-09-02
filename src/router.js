"use strict";
(function(){
    // The Router of danilo.js
    define([], function() {
        var router = (function(){
            var router
              , views = {}
              , History = window.History
              , actualView = undefined;

            router = {}
            router.init = function(name) {
                if (typeof History !== "undefined" && History.enabled) {
                    History.Adapter.bind(window,'statechange',function(){ 


                        var State = History.getState(); 
                        
                        var view_to_load = views[State.hash];

                        if(view_to_load === undefined){
                            console.log("[debug] view not found");
                            return;
                        }

                        if(actualView !== undefined ){
                            actualView.unload();
                        }

                        actualView = view_to_load;

                        view_to_load.load();
                    });
                } else {
                    console.log("Danilo.js Routing is not supported by this browser");
                    return;
                }
            }

            router.register = function(view){
                views[view.url] = view;
            }

            router.unRegister = function(view){
                if (typeof view === "object"){
                    delete views[view.url];
                } else {
                    delete views[view];
                }
            }

            router.goToUrl = function(url) {
                History.pushState(null, null, url);
            }
            
            return router;
        })();
        return router;
    });
}).call(this);