"use strict"

define ['pubsub', 'promise'], (PubSub, Promise) ->

    class Model

    Model::get = (_id) ->
            urlSuffix = _id || ''

            p = new promise.Promise()
            
            @ajax(urlSuffix, 'GET', {})
            .then (err, resp) =>
                if resp?.error
                    error_handler 'API server returned error code.', resp
                    p.done 'API Error', ''
                else
                    obj = new @()
                    for name, val of resp
                        obj.attrs[name] = val
                    p.done null, obj   
                    
            return p


    Model::renderTo = (to_element, template) ->
        to_element.innerHTML = render_template template, @attrs


    Model::update = (attrs) ->
        for k, v of attrs
            @attrs[k] = v


    Model::save = (_id) ->
        p = new promise.Promise()

        if not _id and @attrs._id
            _id = @attrs._id

        if not _id
            callType = 'POST'   # create
        else
            callType = 'PUT'    # update

        @constructor.ajax(_id || '', callType, @attrs)
        .then (err, resp) ->
            p.done err, resp

        return p


    Model::delete = (_id, callback) ->
        @_do_request _id || '', 'DELETE', {}, (resp) ->
            callback(resp) if callback?

