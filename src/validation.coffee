"use strict"

"""
	TODO: find a method to modularize validation.
	An idea could be create a folder called "validators".
	Each file in this folder is a validator. Using requireJS this class load
	the function used to validate values (we assume that the functions have the same signature).

	Using this method (or a method to modularize in general) we could allow developers
	to define easily their custom validators.

	An alternative could be pass a function when define the model.

	Eg:

		username :
			custom_validator : (attrValue) ->
									return --complex operations--

"""

define [], () ->

    class Validation

        @minLength: (attributeValue, lenght) ->
        	return attributeValue.length >= lenght         

        @maxLength: (attributeValue, lenght) ->
        	return attributeValue.length <= lenght    