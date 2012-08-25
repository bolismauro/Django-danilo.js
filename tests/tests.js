"use strict";

var expect = require('expect.js')
  , Browser = require('zombie')
  , browser = new Browser();


describe('navigator', function() {
    
    it('should visit', function(done){
        browser.visit("http://localhost:8000/tests/specRunner.html", function(){
            
            expect(browser.success).to.be(true);
            
            var modelSpec = require('./specs/model');
            modelSpec.runSpec(browser.window);
            
            done();
        });
    });

});