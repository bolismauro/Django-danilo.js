
require ["danilo"], (danilo) ->

    danilo.router()
    
    # Defining models
    class User extends danilo.Model
        url: '/user/'
        autoValidate: true

        attrs:
            username: 
                defaultValue : 'Default username'
                validators:
                    minLength: 5
                    maxLength: 100
                    firstLetterIsCapital: (attributeValue) ->
                        return attributeValue[0].toUpperCase() == attributeValue[0]

            password: 'password'


    class Document extends danilo.Model
        url: '/document/'

        attrs: 
            title: 'Untitled'
            pub: false

        get_title: ->
            return @attrs.title

        is_public: ->
            return @attrs.pub


    # Defining event-triggered operations
    new danilo.Operation
        receive: ['change try_login']
    , (data) ->
        console.log 'form is being validated...'
        console.log 'you have changed ', data.input, 'value, inside form', data.form
        data.form.setAttribute 'data-valid', 'true'


    new danilo.Operation
        receive: ['submit try_login']
    , (data) ->
        console.log 'got data', data.attrs
        alert 'triggered event'



    ## Custom events
    danilo.Operation.bind 'click custom-event-button', 'test_button_pressed'
    new danilo.Operation
        receive: ['custom test_button_pressed']
    , (data) ->
        alert "Custom event triggered from button with id: '#{data.id}'"


    # Handler validation errors
    new danilo.Operation
        receive: ['validationError User']
    , (data) ->
        console.log "Error. The attribute #{data.attribute} violates the validator #{data.validationName} (value #{data.modelInstance.get(data.attribute)})"


    pippo = new User username: 'Pippo'
    pippo.set 'password', '123'
    console.log 'pippo username is ', pippo.get('username')
    console.log 'pippo password is ', pippo.get('password')

    pluto = new User password: 'custom_password'
    pluto.set 'username', 'Pluto'
    console.log 'pluto username is ', pluto.get('username')
    console.log 'pluto password is ', pluto.get('password')

    # testing validation
    pluto.set 'username', 'this is illegal (not capitalized)'
    console.log 'pluto username is now', pluto.get 'username'

    pluto.set 'username', 'Short'
    console.log 'pluto username is now', pluto.get 'username'


