
require ["danilo"], (danilo) ->

    danilo.router()
    
    # Defining models
    class User extends danilo.Model
        url: '/user/'

        attrs:
            username: 
                defaultValue : 'username'
                minLength: 6
                maxLength: 7
                firstLetterCapital : (attributeValue) ->
                    return attributeValue[0].toUpperCase() == attributeValue[0]

            password: 'password'


    class Document extends danilo.Model
        url: '/document/'

        attrs: 
            title: 
                defaultValue : 'Untitled'
            pub: 
                defaultValue : false

        get_title: ->
            return @attrs.title

        is_public: ->
            return @attrs.pub



    pippo = new User username: 'Pippo'
    console.log pippo
    console.log 'setting pippo abc'
    pippo.set('abc', '123')
    console.log 'value of abc is', pippo.get('abc')
    console.log 'pippo username is ', pippo.get('username')
    console.log 'pippo password is ', pippo.get('password')
    pippo.validate 'username'

    pluto = new User password: 'custom_password'
    console.log pluto
    console.log 'setting pluto abc'
    pluto.set('abc', '789')
    console.log 'value of pluto abc is', pluto.get('abc')
    console.log 'value of pippo abc is', pippo.get('abc')
    console.log 'pluto username is ', pluto.get('username')
    console.log 'pluto password is ', pluto.get('password')
    pluto.validate 'username'

    # Defining event-triggered operations
    validate_login_form = new danilo.Operation
        receive: ['form/change/try_login']
    , (data) ->
        console.log 'form is being validated...'
        console.log 'you have changed ', data.input, 'value, inside form', data.form
        data.form.setAttribute 'data-valid', 'true'


    user_login = new danilo.Operation
        receive: ['form/submit/try_login']
    , (data) ->
        console.log 'got data', data.attrs
        alert 'triggered event'



    ## Custom Event DEMO ##
    document.getElementById('custom-event-button').onclick = (e) ->
        danilo.Operation.trigger 'test_button_pressed', e.target

    custom_event = new danilo.Operation
        receive: ['custom/test_button_pressed']
    , (data) ->
        alert "Custom event triggered from button with id: '#{data.id}'"

