"use strict";

// Handy.js: super-simple DOM selector library

(function(exports) {
    
    exports.findInput = function(name) {
        return document.querySelector('input[name="'+name+'"]');
    }
    
    exports.findSubmit = function(value) {
        return document.querySelector('input[value="'+value+'"]');
    }
    
})(window);