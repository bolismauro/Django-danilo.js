(function() {
  "use strict";

  define(['promise', 'superagent'], function(Promise, request_is_not_requirejs_compatible) {
    var Remote;
    return Remote = (function() {

      function Remote() {}

      Remote.prototype.get = function(Model, _id) {
        var p;
        p = new promise.Promise();
        request.get(Model.url + _id || '').end(function(res) {
          var obj;
          if (res.ok) {
            obj = new Model();
            Model.update(JSON.parse(res.body));
            return p.done(null, obj);
          } else {
            return p.done('API Error', 'API Request Error');
          }
        });
        return p;
      };

      Remote.prototype.save = function(obj, _id) {
        var p;
        p = new promise.Promise();
        if (!_id && obj.attrs._id) {
          _id = obj.attrs._id;
        }
        if (_id) {
          request.put(obj.url + _id || '').send(obj.attrs).end(function(res) {
            if (res.ok) {
              return p.done(null, 'Created');
            } else {
              return p.done('Save Error', res.body);
            }
          });
        } else {
          request.post(obj.url).send(obj.attrs).end(function(res) {
            if (res.ok) {
              return p.done(null, 'Updated');
            } else {
              return p.done('Save Error', res.body);
            }
          });
        }
        return p;
      };

      Remote.prototype.del = function(obj, _id) {
        var p;
        p = new promise.Promise();
        if (!_id && obj.attrs._id) {
          _id = obj.attrs._id;
        }
        return request.del(obj.url + _id || '').end(function(res) {
          if (res.ok) {
            return p.done(null, 'Deleted');
          } else {
            return p.done('Delete Error', res.body);
          }
        });
      };

      return Remote;

    })();
  });

}).call(this);
