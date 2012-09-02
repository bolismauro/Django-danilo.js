"use strict";

(function(window){
    // The Router of danilo.js
    define([], function() {
        var router = (function(){
            var router
              , views = {}
              , History = window.History
              , currentView = undefined;

            router = {}
            router.init = function(name) {
                if (typeof History !== "undefined" && History.enabled) {
                    History.Adapter.bind(window,'statechange',function(){ 
                        var State = History.getState()
                          , view_to_load = views[State.hash];

                        if("undefined" == typeof view_to_load){
                            // Usiamo questo pattern:
                            // undefined e null sono uguali tra loro e sono diversi da qualunque altro valore
                            // quindi confrontando con == otteniamo true se e solo se il valore è null o undefined.
                            // L'alternativa lunga è view_to_load === undefined || view_to_load === null
                            // oppure, in modo più pulito, usando typeof per controllare undefined.
                            console.log("[debug] view not found");
                            return;
                        } else {

                            if(currentView != null){
                                currentView.unload();
                            }

                            currentView = view_to_load;
                            view_to_load.load();
                        }
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
})(window);
