"use strict"

define [], () ->

    class Validation

        @minLength: (attributeValue, lenght) ->
        	return attributeValue.length >= lenght         

        @maxLength: (attributeValue, lenght) ->
        	return attributeValue.length <= lenght    