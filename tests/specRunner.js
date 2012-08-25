
(function(exports){
  
  exports.__hasProp = {}.hasOwnProperty
  exports.__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  
  require(['danilo'], function(danilo) {
    danilo.init();
       
    exports.specs.forEach(function(spec) {
      spec(danilo);
    });
   
 });

})(window);
