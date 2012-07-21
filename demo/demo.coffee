
require ["danilo"], (danilo) ->

    danilo.router()
    
    # Defining models
    class User
        url = '/user/'

        username = ''
        password = ''

        validate_username = (username) ->
            return username.length > 3

    class Document
        url = '/document/'

        title = 'Untitled'
        pub = false

        get_title = ->
            return @title

        is_public = ->
            return @pub


    user_login = new danilo.Operation
        receives: ['form/submit/try_login']
    , (sender) ->
        console.log sender
        alert 'triggered event'


