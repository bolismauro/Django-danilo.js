(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require(["danilo"], function(danilo) {
    var Document, User, pippo, pluto;
    danilo.router();
    User = (function(_super) {

      __extends(User, _super);

      function User() {
        return User.__super__.constructor.apply(this, arguments);
      }

      User.prototype.url = '/user/';

      User.prototype.autoValidate = true;

      User.prototype.attrs = {
        username: {
          defaultValue: 'Default username',
          validators: {
            minLength: 5,
            maxLength: 100,
            firstLetterIsCapital: function(attributeValue) {
              return attributeValue[0].toUpperCase() === attributeValue[0];
            }
          }
        },
        password: 'password'
      };

      return User;

    })(danilo.Model);
    Document = (function(_super) {

      __extends(Document, _super);

      function Document() {
        return Document.__super__.constructor.apply(this, arguments);
      }

      Document.prototype.url = '/document/';

      Document.prototype.attrs = {
        title: 'Untitled',
        pub: false
      };

      Document.prototype.get_title = function() {
        return this.attrs.title;
      };

      Document.prototype.is_public = function() {
        return this.attrs.pub;
      };

      return Document;

    })(danilo.Model);
    new danilo.Operation({
      receive: ['change try_login']
    }, function(data) {
      console.log('form is being validated...');
      console.log('you have changed ', data.input, 'value, inside form', data.form);
      return data.form.setAttribute('data-valid', 'true');
    });
    new danilo.Operation({
      receive: ['submit try_login']
    }, function(data) {
      console.log('got data', data.attrs);
      return alert('triggered event');
    });
    danilo.Operation.bind('click custom-event-button', 'test_button_pressed');
    new danilo.Operation({
      receive: ['custom test_button_pressed']
    }, function(data) {
      return alert("Custom event triggered from button with id: '" + data.id + "'");
    });
    new danilo.Operation({
      receive: ['validationError User']
    }, function(data) {
      return console.log("Validation Error: the attribute " + data.attribute + " violates the validator " + data.validationName + ".");
    });
    pippo = new User({
      username: 'Pippo'
    });
    pippo.set('password', '123');
    console.log('pippo username is ', pippo.get('username'));
    console.log('pippo password is ', pippo.get('password'));
    pluto = new User({
      password: 'custom_password'
    });
    pluto.set('username', 'Pluto');
    console.log('pluto username is ', pluto.get('username'));
    console.log('pluto password is ', pluto.get('password'));
    pluto.set('username', 'this is illegal (not capitalized)');
    console.log('pluto username is now', pluto.get('username'));
    pluto.set('username', 'Shrt');
    return console.log('pluto username is now', pluto.get('username'));
  });

}).call(this);
