(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require(["danilo"], function(danilo) {
    var Document, User, pippo, pluto;
    danilo.router();

    // Model definition
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
          reactive: true,
          validators: {
            minLength: 5,
            maxLength: 100,
            firstLetterIsCapital: function(attributeValue) {
              return attributeValue[0].toUpperCase() === attributeValue[0];
            }
          }
        },
        password: 'password',
        lengthOfMyUsername: -1
      };

      return User;
    })(danilo.Model);


    // Operations
    new danilo.Operation({
      receive: ['change try_login']
    }, function(data) {
      console.log('form is being validated...');
      console.log('you have changed ', data.input, 'value, inside form', data.form);
      data.form.setAttribute('data-valid', 'true');
    });

    new danilo.Operation({
      receive: ['submit try_login']
    }, function(data) {
      console.log('got data', data.attrs);
      alert('triggered event');
    });


    // Binding custom events to DOM element
    danilo.Operation.bind('click custom-event-button', 'test_button_pressed');
    new danilo.Operation({
      receive: ['custom test_button_pressed']
    }, function(data) {
      alert("Custom event triggered from button with id: '" + data.id + "'");
    });


    // Handling validation errors (the async way)
    new danilo.Operation({
      receive: ['validationError User']
    }, function(data) {
      console.log("Validation Error: the attribute " + data.attribute + " violates the validator " + data.validationName + ".");
    });


    /* ** Demo ** */

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

    // Validation demo
    pluto.set('username', 'this is illegal (not capitalized)');
    console.log('pluto username is now', pluto.get('username'));
    pluto.set('username', 'Shrt');
    console.log('pluto username is now', pluto.get('username'));


    // Reactive operation
    var s = danilo.storage;
    s.set('weather', 'cloudy');
    s.set('bring sunglasses', false);

    new danilo.Operation({
      receive: ['reactive weather']
    }, function(value) {
      console.log('Hey, the weather is changing!');

      if (value === 'sunny') {
        s.set('bring sunglasses', true);
      } else {
        s.set('bring sunglasses', false);
      }
    });

    s.set('weather', 'sunny');
    setTimeout(function(){ // Reactive event loop is finished
      console.log('Weather is '+s.get('weather')+' then I '+((s.get('bring sunglasses')?'should':'should not'))+' bring sunglasses');
    },0);
    s.set('weather', 'cloudy');


    // Reactive operation binded to a model attribute
    new danilo.Operation({
      receive: ['reactive User.username']
    }, function(value, obj) {
      obj.set('lengthOfMyUsername', value.length);
      console.log('My new name is '+obj.get('lengthOfMyUsername')+' characters long');
    });

    pippo.set('username', 'MyReallyReallyReallyCoolNewUsername')


  });

}).call(this);
