"use strict"

define ['pubsub'], (PubSub) ->

    class Operation

        constructor: (options, handler) ->
            if options.receive? and options.receive?.length > 0
                for ev in options.receive
                    @subscription = PubSub.subscribe ev, handler

        remove: ->
            PubSub.unsubscribe @subscription

        @trigger: (eventName, params) ->
            PubSub.publish "custom/#{eventName}", params            

