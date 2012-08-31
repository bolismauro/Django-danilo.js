"use strict";

//
// **Danilo.js** is a lightweight javascript framework and router for the browser.
// Danilo.js is based on the MOVE pattern, so you should read [this post](http://cirw.in/blog/time-to-move-on) first.
// Danilo.js uses [RequireJS](http://requirejs.org) for module definitions.
//
// You should **really** look at the 
// [**README**](https://github.com/lusentis/danilo.js/blob/coffee-is-evil/README.md) 
// in this repo for a quick introduction to Danilo.js.
//
// > *Please remember that Events and Operations are asynchronous.*
//

// Demo application
// ----------------

(function(exports) {
  
  // Require the library
  require(["danilo"], function(danilo) {
    var Document, User, pippo, pluto;

    // You should **initialize the router** at the top of the document.
    // This parses the DOM and attacch Danilo.js events.
    danilo.init();


    // Defining Models
    // ---------------

    User = (function() {

      // We define a User class, which extends danilo.Model, using extends function 
      var User = danilo.Model.extends({
        // The url for remote CRUD operations. Can be an absolute url, but keep in mind the *same origin policy*.
        url : '/user/',
        // This tells Danilo.js to autovalidate each attribute as soon as you call the setter.
        // If ```false```, validation only occurs by manually calling the ```validate()``` instance method.
        autoValidate: true,

        // ### Defining Model attributes ###

        attrs : {

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
            firstLetterIsUppercase: function(attributeValue) {
              return attributeValue[0].toUpperCase() === attributeValue[0];
            }

            // More on valiadtors in the following paragraphs.

          }
        }
      }
      });

      return User;
    })();


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
    
    // **Modified**: you need to call ```.register()``` on your Operation instance to add its event listeners.

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
    }).register();


    // Now we define an operation that will be executed when the *try_login* form is submitted.
    new danilo.Operation({
      receive: ['submit try_login']
    }, function(data) {
      console.log('got data', data.attrs);
      alert('triggered event');
    }).register();


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
    }).register();


    // ### NEW: Populating Model instances form HTML forms
    new danilo.Operation('submit my_user_form', function (data) {
      
      var myself = new User();
      // Parses ```data.form``` element end sets the corresponding attributes.
      // Validators will be honored and if the second parameter is ```true``` 
      // the function will validate all the attributes **before** changing the model
      // and returns ```false``` if any of them did not validate.
      // Failing validators will **always** trigger validationError events.
      if (myself.form(data.form, true)) { 
        alert("Form saved! Check the console for details.");
        console.log("This User has been retreived from an HTML Form:",
          "username=", myself.get('username'),
          "password=", myself.get('password'));
      } else {
        alert("Your form did not validate. Please correct them and retry!");
      }
      
    }).register();



    // Handling validation errors
    // --------------------------
    // Validation will occur when you call ```modelInstance.validate()``` method 
    // or when you set an attribute via ```modelInstance.set(attrName, attrValue)``` if ```model.autoValidate === true```.
    //
    // If the validation fails:
    //
    //  - The setter (or the validate function) returns ```false```.
    //  - An Event will be fired with a ```validationError``` prefix - **asynchronous!**

    // This Operation will catch validation errors for the model ```User```:
    new danilo.Operation({
      receive: ['validationError User']
    }, function(data) {
      // The handler function's first parameter is an object containing 
      // the name of the attribute and the name of the validator that failed.
      console.log("Validation Error: the attribute " + data.attribute + " violates the validator " + data.validationName + ".");
    }).register();

    // Here the username does not start with an uppercase letter, 
    // violating ```firstLetterIsUppercase``` custom validator:
    pluto.set('username', 'this is illegal (first letter is lowercased)'); // -> false + triggers validationError User
    console.log('pluto username is now', pluto.get('username'));

    // and here the username is too short:
    pluto.set('username', 'Shrt');  // -> false + triggers validationError User
    console.log('pluto username is now', pluto.get('username'));

    // and this is ok:
    pluto.set('username', 'Pluta'); // -> true


    // Reactive Operations
    // -------------------
    // **Reactive Operations** will be executed every time *something changes*.
    //

    // ### a) Reactive Operations bound to *danilo.storage* ###

    // Danilo.js has a ```storage``` object: 
    // it's a place where you can store objects in a dictionary-like fashion;
    // when you set the value of a stored object an Event will be fired, containing
    // data on what happened.

    var s = danilo.storage; // this is only a shortcut for the storage
    // Set the value for ```weather```:
    s.set('weather', 'cloudy');
    // Set the value for ```bring sunglasses```:
    s.set('bring sunglasses', false);


    // Then, we define an Operation that *reacts* to changes of the ```weather```.
    new danilo.Operation({
      // Events fired by the storage will have the ```reactive``` prefix.
      receive: ['reactive weather']
    }, function(value) {
      console.log('Hey, the weather is changing!');

      // When the weather changes we decide whether to bring sunglasses or not.
      if (value === 'sunny') {
        s.set('bring sunglasses', true);
      } else {
        s.set('bring sunglasses', false);
      }
    }).register();

    // Remember that **everything is asynchronous**.
    s.set('weather', 'sunny');
    setTimeout(function(){
      console.log('Weather is '+s.get('weather')+' then I '+((s.get('bring sunglasses')?'should':'should not'))+' bring sunglasses');
    },0);
    s.set('weather', 'cloudy');


    // ### b) Reactive operation bound to a model attribute ###
    // If you set the [reactive option](#section-15) in an attribute definition,
    // an Event will be fired when that attribute is initialized or modified.

    new danilo.Operation({
      // The Event name is prefixed by ```reactive``` and 
      // contains the Model name plus the attribute name.
      receive: ['reactive User.username']
    }, function(value, obj) {
      // The handler function is called with two parameters: the new value of the field and the object that has been updated.
      obj.set('lengthOfMyUsername', value.length); // Updates another field
      console.log('My new name is '+obj.get('lengthOfMyUsername')+' characters long');
    }).register();

    // This will trigger **asynchronously** the above operation (because ```username.reactive===true```):
    pippo.set('username', 'MyReallyReallyReallyCoolNewUsername')

    // The Router
    // ----------

    // The Router?
    /* Ehm,... @TODO */
    var login_view = new danilo.View('/demo/login')
    
    .onLoad(function(){
      alert('view loaded');
      this.render('../demo/templates/hello_again.html', 'body', {}, function(){
        alert('Template loaded');
      });
    })

    .onUnload(function(){
      alert('view unload');
    });

    danilo.router.register(login_view);


  });

})(window);
