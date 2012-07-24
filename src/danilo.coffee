"use strict"

define ['./router', './model', './operation' , './remote', 'handlebars'], (router, Model, Operation, Remote, Handlebars) ->

    render_template = (template, ctx) ->
        ctx = {} unless ctx?
        Handlebars.compile(template)(ctx)

    return {
        render_template: render_template
        router: router

        Model: Model
        Operation: Operation
        Remote: Remote
    }
