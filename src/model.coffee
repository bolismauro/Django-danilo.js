"use strict"

define ['pubsub', 'promise'], (PubSub, Promise) ->

    class Model
        constructor: ->
            console.log 'validate in model constructor is equal to', @validate
            console.log 'default value for username is', @attrs.username
            
            # defining method .attr
            ###@attr = (name, value) =>
                console.log 'this',@
                console.log 'validate',@
                if value?
                    @attrs.name = value
                else
                    return @attrs.name###


        update: (attrs) ->
            for k, v of attrs
                @attrs[k] = v
