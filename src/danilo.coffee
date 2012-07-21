"use strict"

define ['./router', './model', './operation', 'handlebars'], (router, Model, Operation, Handlebars) ->

    render_template = (template, ctx) ->
        ctx = {} unless ctx?
        Handlebars.compile(template)(ctx)

    return {
        render_template: render_template
        router: router

        Model: Model
        Operation: Operation
    }
