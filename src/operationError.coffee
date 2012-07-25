"use strict"

define ['pubsub', './operation'], (PubSub, Operation) ->

	class OperationError extends Operation

		constructor: (options,  handler) ->
			super  receive : ["error/#{options.model}"] , handler 