"use strict"

define ['pubsub', 'promise'], (PubSub, Promise) ->

    class Model
        attrs = {}


    # ?????
    #Model::renderTo = (to_element, template) ->
    #    to_element.innerHTML = render_template template, @attrs

    Model::update = (attrs) ->
        for k, v of attrs
            @attrs[k] = v

    return Model


