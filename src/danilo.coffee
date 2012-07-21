"use strict"

define ['./router', './model', './operation', 'handlebars'], (Router, Model, Operation, Handlebars) ->

    render_template = (template, ctx) ->
        ctx = {} unless ctx?
        Handlebars.compile(template)(ctx)


    return {
        render_template: render_template
        router: router

        Operation: Operation
    }
