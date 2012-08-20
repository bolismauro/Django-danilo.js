(function() {
  "use strict";

  define(['pubsub'], function(PubSub) {
    var Operation;
    return Operation = (function() {

      function Operation(options, handler) {
        var ev, _i, _len, _ref, _ref1;
        if ((options.receive != null) && ((_ref = options.receive) != null ? _ref.length : void 0)) {
          _ref1 = options.receive;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            ev = _ref1[_i];
            this.subscription = PubSub.subscribe(ev, handler);
          }
        }
      }

      Operation.prototype.remove = function() {
        return PubSub.unsubscribe(this.subscription);
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
