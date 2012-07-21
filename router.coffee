"use strict"
###

  RouterJS - A framework-independent BrowserJS routing and m[vc] lib
  Dependencies: RequreJS for loading, Handlebars for templates, jQuery for ajax and selectors


  Part of Plee.co Frontend
  (c) 2012 PlasticPanda.com

  ~ relying solely on what’s been done in the past 
    is the death of progression ~

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.

  EXAMPLE USAGE:

        models =
            'User': User
            'Profile': Profile
            'Document': Document

        routes = [
                ['/profile/', view_my_profile]
                ['/login/', view_login]
                ['/logout/', ['User', 'logout']]
                ['/upload/', show_upload]
                ['/docs/', my_docs]
        ]

        router = new routerjs.Router()
        router.init(models, routes)

###

### BEGIN 2012/07/08 Review @ 21:10 by simone@plasticpanda.com ###
### - jQuery FREE :)  ###

## RouterJS module
define ['handlebars', 'pubsub', 'promise', 'jquery'], (Handlebars, PubSub, promise, $) ->

    class Router
        models: {}
        routes: {}
        error_handler: ->
            console.error "#{arguments}"

        # Router initialization
        init: (@models, @routes, @error_handler) ->
            old_handler = window.onhashchange
            window.onhashchange = =>
                @fixDOM()
                old_handler?()

            @fixDOM()


        # Updates all <a href=""> tags that points to local /-relative
        # paths. This links will be handled by the Router.
        # Links like <a data-route="false" ...>...</a>, with hashy href, without href or absolute href won't get routed.
        fixDOM: ->
            for item in document.getElementsByTagName('a')
                real_href = item.getAttribute('href')
                continue if not real_href or real_href[0] == "#" or item.getAttribute('data-route') == "false"

                if real_href[0] == '/'
                    item.href = '#!'+real_href
                    item.onclick = @_aclick_factory(real_href, item.onclick)

            for item in document.querySelectorAll('form[data-bind]')
                item.onsubmit = @_formsubmit_factory(item)

        # Handles the routing
        route: (loc, allow_reload) ->
            if allow_reload or loc isnt @_get_current_route()
                for path in @routes
                    # replacing :identifier with .+ for regexp matching
                    parts = RegExp(path[0].replace('.', '\\.').replace(/:[a-zA-Z\g]+/g, '(.+)'), 'g').exec(loc)

                    if parts
                        window.location?.hash = '!'+loc
                        parts.splice(0,1) # remove full path
                        
                        @view path[1], parts
                        return true

                @error_handler "404", "Route for `#{loc}` not found."
                return false


        # Calls the appropriate view:
        # 1. ['ModelName', 'model_method_name']
        # 2. (cb) -> 
        #        alert "I'm a function!"
        #        cb() -- always call the callback!
        #
        view: (v, args) ->
            callargs = [ => @fixDOM() ].concat args||[] # [] prevent concatenation of undefined and null

            if typeof v == 'object'
                # model and function name
                return @models[v[0]][v[1]].apply(undefined, callargs)
            
            else if typeof v == 'function'
                return v.apply(undefined, callargs)

            else
                console?.trace?()
                console?.warn 'No view to call: ', v
                throw Error "No view to call."

            return false


        # Internals
        _get_current_route: ->
            window.location.hash.replace('#!', '')

        _aclick_factory: (href, old_onclick) ->
            (e) =>
                old_onclick?()
                @route href

                e.preventDefault()
                return false            

        _formsubmit_factory: (form_tag) ->
            (e) => 
                attrs = {}

                for item in $(form_tag).find(':input:not([data-skip="true"])')
                    if not item.getAttribute('name')
                        console.log 'This field does not have a name', item
                    else
                        attrs[item.getAttribute('name')] = $(item).val()

                PubSub.publish "form/#{form_tag.getAttribute('data-bind')}", attrs

                e.preventDefault()
                return false


    ### END 2012/07/08 Review @ 21:10 by simone@plasticpanda.com ###


    """ 
    SyncModel base class
    -------------------------
    Defines a models that abstracts a remote REST API.

    """
    moduleKeywords = ['extended', 'included']

    class Model
        @extend: (obj) ->
            for key, value of obj when key not in moduleKeywords
                @[key] = value

            obj.extended?.apply(@)
            this

        @include: (obj) ->
            for key, value of obj when key not in moduleKeywords
                @::[key] = value

            obj.included?.apply(@)
            this


    ORM =
        _do_request: (url, method, data, callback) ->
            console.trace()
            alert 'DEPRECATION WARNING: Model._do_request is deprecated. Use Model.ajax instead.\nSee trace in debugger window.'            
            throw Error('DEPRECATION WARNING: Model._do_request is deprecated. Use Model.ajax instead.')
            return false

        ajax: (url, method, data) ->       #   jQuery, sorry :(
            p = new promise.Promise()

            $.ajax(
                url: (@url||'model-url-is-not-defined') + (url||'')
                type: method
                data: data
            ).success( (res) ->
                p.done false, res
            ).error( (xhr) ->
                try
                    p.done xhr.status, JSON.parse(xhr.responseText)
                catch e
                    console?.error 'JSON error in response from server: ', e
            )

            return p


        get: (_id) ->
            urlSuffix = _id || ''

            p = new promise.Promise()
            
            @ajax(urlSuffix, 'GET', {})
            .then (err, resp) =>
                if resp?.error
                    error_handler 'API server returned error code.', resp
                    p.done 'API Error', ''
                else
                    obj = new @()
                    for name, val of resp
                        obj.attrs[name] = val
                    p.done null, obj   
                    
            return p


        extended: ->
            @include
                attrs: {}

                renderTo: (to_element, template) ->
                    $(to_element).html render_template template, @attrs


                update: (attrs) ->
                    for k, v of attrs
                        @attrs[k] = v


                save: (_id) ->
                    p = new promise.Promise()

                    if not _id and @attrs._id
                        _id = @attrs._id

                    if not _id
                        callType = 'POST'   # create
                    else
                        callType = 'PUT'    # update

                    @constructor.ajax(_id || '', callType, @attrs)
                    .then (err, resp) ->
                        p.done err, resp

                    return p


                delete: (_id, callback) ->
                    @_do_request _id || '', 'DELETE', {}, (resp) ->
                        callback(resp) if callback?


    render_template = (template, ctx) ->
        ctx = {} unless ctx?
        Handlebars.compile(template)(ctx)


    refresh_view = ->
        alert 'DEBUG: refreshView() is not supported.' # DEBUG:
        #window.router.route window.location.hash.replace('#!', '')

    return {
        utils: 
            render_template: render_template
            refresh_view: refresh_view
        Router: Router
        Model: Model
        ORM: ORM
    }


