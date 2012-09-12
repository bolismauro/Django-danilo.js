"use strict";
(function() {

  define(['promise', 'superagent'], function(promise, request_is_not_requirejs_compatible) {
    var remote;
    return remote = (function() {

      var remote = {};

      remote.get = function(Model, _id) {
        var p;
        p = new promise.Promise();
        request.get(Model.prototype.url + _id || '').end(function(res) {
          var obj;
          if (res.ok) {
            obj = new Model();
            obj.update(JSON.parse(res.body));
            return p.done(null, obj);
          } else {
            return p.done('API Error', res.body);
          }
        });
        return p;
      };

      remote.save = function(obj, _id) {
        
        console.log("****BUG in remote.js***** obj.attrs is deprecated");
        
        var p;
        p = new promise.Promise();
        if (!_id && obj.get('_id')) {
          _id = obj.get('_id');
        }
        if (_id) {
          request.put(obj.prototype.url + _id || '').send(obj.attrs).end(function(res) {
            if (res.ok) {
              return p.done(null, 'Updated');
            } else {
              return p.done('Save Error', res.body);
            }
          });
        } else {
          request.post(obj.prototype.url).send(obj.attrs).end(function(res) {
            if (res.ok) {
              return p.done(null, 'Created');
            } else {
              return p.done('Save Error', res.body);
            }
          });
        }
        return p;
      };

      remote.del = function(obj, _id) {
        var p;
        p = new promise.Promise();
        if (!_id && obj.get('_id')) {
          _id = obj.get('_id');
        }
        return request.del(obj.prototype.url + _id || '').end(function(res) {
          if (res.ok) {
            return p.done(null, 'Deleted');
          } else {
            return p.done('Delete Error', res.body);
          }
        });
      };

      return remote;

    })();
  });

}).call(this);
