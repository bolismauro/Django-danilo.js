"use strict"

define ['pubsub', 'promise', 'validation'], (PubSub, Promise, Validation) ->

    class Model
        constructor: (values) ->
            
            @attributeValues = []

            for attr, attrInfo of @attrs
                #FIX ME, ugly code
                @attributeValues[attr] = ''
                @attributeValues[attr] = attrInfo.defaultValue if attrInfo?.defaultValue?
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
            for validationType, validationValue of attribute
                if validationType isnt 'defaultValue'
                    res = Validation[validationType](@attributeValues[attrName], validationValue)

                    # TODO: fix this.
                    # In accord to MOVE pattern this function should generate an event.
                    # But intercepted by who? With what name? 
                    if not res
                        console.log "validation #{validationType} not passed by #{@attributeValues[attrName]}"
                
