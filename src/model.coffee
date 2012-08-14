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
            if @autoValidate
                if @validate attribute, value
                    @attributeValues[attribute] = value

        validate: (attributeName, attributeValue) ->
            if not attributeValue?
                attributeValue = @attributeValues[attribute]

            attribute = @attrs[attributeName]
            for validationName, validationParam of attribute.validators
                if not Validation.validate validationName, validationParam, attributeValue
                    modelName = getObjectClass @
                    PubSub.publish "validationError #{modelName}", 
                        modelName: modelName
                        modelInstance: @
                        attribute: attributeName
                        validationName: validationName
                    return false

            return true
                        

        # TODO: Move this function?
        getObjectClass = (obj) ->
            if obj and obj.constructor and obj.constructor.toString
                arr = obj.constructor.toString().match(/function\s*(\w+)/)
                return arr[1]  if arr and arr.length is 2
            "undefined"
                
