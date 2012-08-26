"use strict";

var expect = require('expect.js')
  , Browser = require('zombie')
  , browser = new Browser({
        debug: true,
        maxWait: 20
    });


describe('navigator', function() {
    
    it('should visit', function(done){
        browser.visit("http://localhost:8000/tests/specRunner.html", function(e, b){
            
            expect(browser.success).to.be(true);
            
            console.log("Browser:", browser);
            console.log("-----");
            console.log(browser.dump());
            
            var modelSpec = require('./specs/model');
            modelSpec.runSpec(browser.window);
            
            done();
        });
    });

});