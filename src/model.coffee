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

                    if not res
                        modelName = getObjectClass @
                        data = {}
                        data.modelName = modelName
                        data.modelInstance = @
                        data.attribute = attrName
                        data.validationName = validationName
                        PubSub.publish "error/#{modelName}", data
                        
        # TODO: Move this function?
        getObjectClass = (obj) ->
            if obj and obj.constructor and obj.constructor.toString
                arr = obj.constructor.toString().match(/function\s*(\w+)/)
                return arr[1]  if arr and arr.length is 2
            "undefined"
                
