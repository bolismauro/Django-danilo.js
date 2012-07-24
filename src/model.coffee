"use strict"

define ['pubsub', 'promise'], (PubSub, Promise) ->

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
