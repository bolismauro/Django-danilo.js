"use strict"

define ['pubsub', 'promise', 'validation'], (PubSub, Promise, Validation) ->

    class Model
        constructor: (values) ->
            
            @attributeValues = []

            for attr, attrInfo of @attrs
                
                #FIX ME, ugly code
                if typeof attrInfo isnt "object"
                    #fast init
                    @attributeValues[attr] = attrInfo
                else
                    #complex attr
                    @attributeValues[attr] = ''
                    @attributeValues[attr] = attrInfo.defaultValue if attrInfo.defaultValue?
                
                @attributeValues[attr] = values[attr] if values?[attr]?

        update: (attrs) ->
            for k, v of attrs
                @attributeValues[k] = v

        get: (attribute) ->
            @attributeValues[attribute]

        set: (attribute, value) ->
            @attributeValues[attribute] = value


        validate: (attrName) ->
            attribute = @attrs[attrName]
            for validationName, validationParam of attribute
                if validationName isnt 'defaultValue'
                    res = Validation.validate validationName, validationParam, @attributeValues[attrName]

                    # TODO: fix this.
                    # In accord to MOVE pattern this function should generate an event.
                    # But intercepted by who? With what name? 
                    if not res
                        console.log "validation #{validationName} not passed by #{@attributeValues[attrName]}"
                
