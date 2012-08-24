"use strict";
(function(){
    // Reactive storage for danilo.js

    define(['pubsub'], function(PubSub) {

        var storage = (function(){

            var storage
              , store = {};

            storage = {}
            storage.get = function(name) {
                return store[name];
            }
            storage.set = function(name, val) {
                store[name] = val;
                storage._reactive_publish(name, val);
            }
            storage._reactive_publish = function(name, val, theObject) {
                PubSub.publish('reactive '+name, val, theObject); // Trigger event
            }

            return storage;

        })();

        return storage;
    });

}).call(this);