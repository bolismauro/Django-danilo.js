"use strict"

define ['./router', './model', './operation' , './operationError', './remote', 'handlebars'], (router, Model, Operation, OperationError, Remote, Handlebars) ->

    render_template = (template, ctx) ->
        ctx = {} unless ctx?
        Handlebars.compile(template)(ctx)

    return {
        render_template: render_template
        router: router

        Model: Model
        Operation: Operation
        OperationError: OperationError
        Remote: Remote
    }
