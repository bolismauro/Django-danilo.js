
require ["danilo"], (danilo) ->

    danilo.router()
    
    # Defining models
    class User extends danilo.Model
        url = '/user/'

        username = ''
        password = ''

        validate_username = (username) ->
            return username.length > 3

    class Document extends danilo.Model
        url = '/document/'

        title = 'Untitled'
        pub = false

        get_title = ->
            return @title

        is_public = ->
            return @pub


    user_login = new danilo.Operation
        receive: ['form/submit/try_login']
    , (data) ->
        console.log 'got data', data
        alert 'triggered event'


