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
            obj.update(JSON.parse(res.text));
            return p.done(null, obj);
          } else {
            return p.done('API Error', res.text);
          }
        });
        return p;
      };

      remote.save = function(obj, _id) {
        var p;
        p = new promise.Promise();
        if (!_id && obj.get('_id')) {
          _id = obj.get('_id');
        }
        if (_id) {
          request.put(obj.url + _id || '').send(obj.toObject()).end(function(res) {
            if (res.ok) {
              return p.done(null, 'Updated');
            } else {
              return p.done('Save Error', res.body);
            }
          });
        } else {
          request.post(obj.url).send(obj.toObject()).end(function(res) {
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
        return request.del(obj.url + _id || '').end(function(res) {
          if (res.ok) {
            return p.done(null, 'Deleted');
          } else {
            return p.done('Delete Error', res.body);
          }
        });
      };


      remote.getAll = function(Model) {
        var p;
        p = new promise.Promise();
        request.get(Model.prototype.url).end(function(res) {
          var objs = [];
          if (res.ok) {
            
            var items = JSON.parse(res.text);

            for (var i in items){
              var item = items[i];
              var obj = new Model();
              obj.update(item);
              objs.push(obj)
            }

            return p.done(null, objs);

          } else {
            return p.done('API Error', res.text);
          }
        });
        return p;        
      }

      return remote;

    })();
  });

}).call(this);
