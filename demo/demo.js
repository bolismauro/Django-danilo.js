//
// **Danilo.js** is a lightweight javascript framework and router for the browser.
// Danilo.js is based on the MOVE pattern, so you should read [this post](http://cirw.in/blog/time-to-move-on) first.
// Danilo.js use [RequireJS](http://requirejs.org) for module definitions.
//
// *Please note that Events and Operations are asynchronous.*


// Demo application
// ----------------

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };


  // Require the library
  require(["danilo"], function(danilo) {
    var Document, User, pippo, pluto;

    // You should **initialize the router** at the top of the document.
    // This parses the DOM and attacch Danilo.js events.
    danilo.router();


    // Defining Models
    // ---------------

    // We define a User class which extends danilo.Model
    User = (function(_super) {
      __extends(User, _super);

      function User() {
        return User.__super__.constructor.apply(this, arguments);
      }

      // The url for remote CRUD operations. Can be an absolute url, but keep in mind the *same origin policy*.
      User.prototype.url = '/user/';
      
      // This tells Danilo.js to autovalidate each attribute as soon as you call the setter.
      // If ```false```, validation only occurs by manually calling the ```validate()``` instance method.
      User.prototype.autoValidate = true;

      
      // ### Defining Model attributes ###


      // We define instance attributes in an ```attr``` object.
      User.prototype.attrs = {

        // There are **two kinds of attribute definition**:

        // Simple **one-line definition**, by providing the attribute name as the key and its default value as the value
        password: 'password',
        lengthOfMyUsername: -1,

        // or **extended definition** by providing an object whith some properties for this attribute:
        username: {
          // * The default value.
          defaultValue: 'Default username',

          // * A ```reactive``` property: ```true``` if the attribute should trigger a 
          // **Reactive Operation** when changed (see the following paragraphs).
          // Defaults to ```false```.
          reactive: true,

          // * An object containing validators.
          validators: {
            // we provide some default validators...
            minLength: 5,
            maxLength: 100,

            // ...and you can define your own validators as a function taking 
            // the attribute value as parameter and returning ```true``` if the validation succeded; ```false``` otherwise.
            firstLetterIsCapital: function(attributeValue) {
              return attributeValue[0].toUpperCase() === attributeValue[0];
            }

            // More on valiadtors in the following paragraphs.

          }
        }
      };

      return User;
    })(danilo.Model);


    // ### Model usage example ###

    // Create a new User with "Pippo" as username.
    // Pippo's password will be the ```defaultValue``` defined in the Model
    pippo = new User({
      username: 'Pippo'
    });
    // Now we set Pippo's password...
    pippo.set('password', '123');
    // ...and print some information
    console.log('pippo username is ', pippo.get('username'));
    console.log('pippo password is ', pippo.get('password'));

    // We create another User, just for fun
    pluto = new User({
      password: 'my_custom_password'
    });
    // Here we set Pluto's username
    pluto.set('username', 'Pluto');
    console.log('pluto username is ', pluto.get('username'));
    console.log('pluto password is ', pluto.get('password'));


    // Defining Operations
    // -------------------

    // The **Operation** constructor takes two arguments:
    //
    //  * a *list of triggering events*
    //  * and the function to call when one of the events is triggered


    new danilo.Operation({
      // This tells Danilo.js to execute this operation 
      // when the **change** event of the DOMElement with a data-bind="*try_login*" attribute,
      // which is a form element in this example (see demo.html).

      //> **NOTE:** HTML does not provide a change event for form elements, *danilo.router()* will 
      //> fix this.

      receive: ['change try_login']

    }, 
    // As the second parameter we provide an anonymous function to be executed when one of the
    // previous element is triggered.
    function(data) {
      // Since we bound this operation to a form element the *data* object has two properties: 
      //
      // * data.input is the HTMLInputElement which triggered the change event
      // * data.form is the form which contains that input

      console.log('form is being validated...');
      console.log('you have changed ', data.input, 'value, inside form', data.form);
      data.form.setAttribute('data-valid', 'true');
    });


    // Now we define an operation that will be executed when the *try_login* form is submitted.
    new danilo.Operation({
      receive: ['submit try_login']
    }, function(data) {
      console.log('got data', data.attrs);
      alert('triggered event');
    });


    // ### Binding Operations to standard DOM Events ###


    // Danilo.js provides a static ```bind``` function that connects
    // standard DOM Events (click, change, mouseover, ...) to Danilo.js Events

    // This will trigger the *test_button_pressed* custom event when the 
    // ```document.getElementById('custom-event-button')```
    // click event is fired
    danilo.Operation.bind('click custom-event-button', 'test_button_pressed');

    // Custom-bound events are fired with a ```custom``` prefix:
    new danilo.Operation({
      receive: ['custom test_button_pressed']
    }, function(data) {
      // ```data``` is the DOMElement the event is attached to
      alert("Custom event triggered from button with id: '" + data.id + "'");
    });




    // Handling validation errors
    // --------------------------

    // The async way
    new danilo.Operation({
      receive: ['validationError User']
    }, function(data) {
      console.log("Validation Error: the attribute " + data.attribute + " violates the validator " + data.validationName + ".");
    });







    // Validation demo
    pluto.set('username', 'this is illegal (not capitalized)');
    console.log('pluto username is now', pluto.get('username'));
    pluto.set('username', 'Shrt');
    console.log('pluto username is now', pluto.get('username'));


    // Reactive operations
    // -------------------
    
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


    // Reactive operation bound to a model attribute
    new danilo.Operation({
      receive: ['reactive User.username']
    }, function(value, obj) {
      obj.set('lengthOfMyUsername', value.length);
      console.log('My new name is '+obj.get('lengthOfMyUsername')+' characters long');
    });

    pippo.set('username', 'MyReallyReallyReallyCoolNewUsername')


  });

}).call(this);
