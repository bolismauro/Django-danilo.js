"use strict"

define ['pubsub', 'promise', 'superagent'], (PubSub, Promise, request_is_not_requirejs_compatible) ->
    
    class Operation

        constructor: (options, handler) ->
            if options.receive? and options.receive?.length > 0
                for ev in options.receive
                    PubSub.subscribe ev, handler

        @trigger: (eventName, params) ->
            PubSub.publish "custom/#{eventName}", params



        # Operation helpers
        get = (Model, _id) ->
            p = new promise.Promise()
            
            request
                .get(Model.url + _id||'')
                .end (res) ->
                    if res.ok
                        obj = new Model()
                        Model.update JSON.parse res.body
                        p.done null, obj  
                    else
                        p.done 'API Error', 'API Request Error' 
                    
            return p


        save = (Model, _id) ->
            p = new promise.Promise()

            if not _id and Model.attrs._id
                _id = Model.attrs._id

            if _id  # Update (PUT)
                request
                    .put(Model.url + _id||'')
                    .send(Model.attrs)
                    .end (res) ->
                        if res.ok
                            p.done null, 'Created'
                        else
                            p.done 'Save Error', res.body
            else    # Create (POST)
                request
                    .post(Model.url)
                    .send(Model.attrs)
                    .end (res) ->
                        if res.ok
                            p.done null, 'Updated'
                        else
                            p.done 'Save Error', res.body
            return p


        del = (Model, _id) ->
            p = new promise.Promise()

            if not _id and Model.attrs._id
                _id = Model.attrs._id

            request
                .del(Model.url + _id||'')
                .end (res) ->
                    if res.ok
                        p.done null, 'Deleted'
                    else
                        p.done 'Delete Error', res.body







