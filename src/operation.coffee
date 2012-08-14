"use strict"

define ['pubsub'], (PubSub) ->

    class Operation

        constructor: (options, handler) ->
            if options.receive? and options.receive?.length
                for ev in options.receive
                    @subscription = PubSub.subscribe ev, handler

        remove: ->
            PubSub.unsubscribe @subscription

        @trigger: (eventName, params) ->
            PubSub.publish "custom #{eventName}", params

        @bind: (eventSelector, triggerName) ->
            ev = eventSelector.split ' '
            document.getElementById(ev[1])["on#{ev[0]}"] = (e) ->
                Operation.trigger triggerName, e.target    

