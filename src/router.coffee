"use strict"

define ['pubsub'], (PubSub) ->

    _get_current_route = ->
        window.location.hash.replace('#!', '')

    _set_current_route = (location) ->
        window.location?.hash = '!'+location

    _aclick_factory = (href, old_onclick) ->
        return (e) =>
            old_onclick?()
            PubSub.publish "navigate #{href}",
                url: href
                post_route: (err) ->
                    if err
                        throw "Routing error: #{err}"
                    else
                        _set_current_route(href)

            e.preventDefault()
            return false            

    _formsubmit_factory = (form_tag) ->
        return (e) => 
            attrs = {}

            for item in form_tag.getElementsByTagName('input')
                if item.getAttribute('data-skip') isnt 'true'

                    if not item.getAttribute('name')
                        console?.log 'This field does not have a name', item
                    else
                        attrs[item.getAttribute('name')] = item.value

            PubSub.publish "submit #{form_tag.getAttribute('data-bind')}", {form: form_tag, attrs: attrs}

            e.preventDefault()
            return false


    _formchange_add_handlers = (form_tag) ->
        for item in form_tag.getElementsByTagName('input')
            if item.getAttribute('data-skip') isnt 'true'
                if item.getAttribute('name')
                    item.onchange = ((item)->
                        return ->
                            PubSub.publish "change #{form_tag.getAttribute('data-bind')}", {form: form_tag, input: item}
                    )(item)
        return



    # Updates all <a href=""> tags that points to local /-relative
    # paths. This links will be handled by the Router.
    # Links like <a data-route="false" ...>...</a>, with hashy href, without href or absolute href won't get routed.
    _fixDOM = ->
        for item in document.getElementsByTagName('a')
            real_href = item.getAttribute('href')
            continue if not real_href or real_href[0] == "#" or item.getAttribute('data-route') == "false"

            if real_href[0] == '/'
                item.href = '#!'+real_href
                item.onclick = _aclick_factory(real_href, item.onclick)

        for item in document.querySelectorAll('form[data-bind]')
            item.onsubmit = _formsubmit_factory(item)
            _formchange_add_handlers(item)


    # Router initialization
    init = ->
        old_handler = window.onhashchange
        window.onhashchange = =>
            _fixDOM()
            old_handler?()

        _fixDOM()

    return init

