(function() {
  "use strict";

  define(['pubsub'], function(PubSub) {
    var Operation;
    return Operation = (function() {
      
      var subscriptions = []
        , receive = []
        , handler = [];

      function Operation(options, op_handler) {
        if (typeof options == "string") {
          receive = [options];
        } else {
          if (typeof options.receive != "undefined" && options.receive.length > 0) {
            receive = options.receive;
          }
        }
        
        if (typeof op_handler == "function") {
          handler = op_handler;
        } else {
          handler = function(){};
        }
      }

      Operation.prototype.register = function() {
        if (receive.length > 0) {
          for (var i in receive) {
            subscriptions.push(PubSub.subscribe(receive[i], handler));
          }
        }
      }

      Operation.prototype.unregister = function() {
        for (var i in subscriptions) {
          PubSub.unsubscribe(subscriptions[i]);
        }
      };

      // Statics
      Operation.trigger = function(eventName, params) {
        return PubSub.publish("custom " + eventName, params);
      };

      Operation.bind = function(eventSelector, triggerName) {
        var ev;
        ev = eventSelector.split(' ');
        return document.getElementById(ev[1])["on" + ev[0]] = function(e) {
          return Operation.trigger(triggerName, e.target);
        };
      };

      return Operation;

    })();
  });
}).call(this);
