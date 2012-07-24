"use strict"

define ['promise', 'superagent'], (Promise, request_is_not_requirejs_compatible) ->

    class Remote
        get: (Model, _id) ->
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


        save: (obj, _id) ->
            p = new promise.Promise()

            if not _id and obj.attrs._id
                _id = obj.attrs._id

            if _id  # Update (PUT)
                request
                    .put(obj.url + _id||'')
                    .send(obj.attrs)
                    .end (res) ->
                        if res.ok
                            p.done null, 'Created'
                        else
                            p.done 'Save Error', res.body
            else    # Create (POST)
                request
                    .post(obj.url)
                    .send(obj.attrs)
                    .end (res) ->
                        if res.ok
                            p.done null, 'Updated'
                        else
                            p.done 'Save Error', res.body
            return p


        del: (obj, _id) ->
            p = new promise.Promise()

            if not _id and obj.attrs._id
                _id = obj.attrs._id

            request
                .del(obj.url + _id||'')
                .end (res) ->
                    if res.ok
                        p.done null, 'Deleted'
                    else
                        p.done 'Delete Error', res.body

