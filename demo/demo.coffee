
require ["danilo"], (danilo) ->

    danilo.router()
    
    # Defining models
    class User extends danilo.Model
        url: '/user/'
        validate:
            'username': (username) ->
                return username.length > 3

        attrs:
            username: 'pino'
            password: 'giano'


    class Document extends danilo.Model
        url: '/document/'

        attrs: 
            title: 'Untitled'
            pub: false

        get_title: ->
            return @attrs.title

        is_public: ->
            return @attrs.pub



    pippo = new User()
    console.log pippo
    console.log pippo.attrs
    console.log 'setting pippo abc'
    pippo.attr('abc', '123')
    console.log 'value of abc is', pippo.attr('abc')


    pluto = new User()
    console.log pluto
    console.log 'setting pluto abc'
    pluto.attr('abc', '789')
    console.log 'value of pluto abc is', pluto.attr('abc')
    console.log 'value of pippo abc is', pippo.attr('abc')



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

