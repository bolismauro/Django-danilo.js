# Please, don't use Danilo.js (yet)
* * *

Danilo.js
=========
**Danilo.js** is a javascript framework and router for the browser. 

Danilo is developed mainly for *single-page* web applications.

Prerequisites
--------------
* Danilo.js is based on the MOVE pattern, so you should read this [introduction to MOVE][] first. 
* We use [RequireJS][] for module definitions.


Danilo.js and The MOVE pattern
------------------------------
ToDo.


Getting Started
---------------
The best way to start using Danilo.js is checking out the Demo application and then reading its [annotated source][].

### Run the demo application ###
You should have installed ```node``` (and npm) on your machine. If not [download and install Node.js][] now.


    # checkout this repo
    git clone https://github.com/PlasticPanda/danilo.js

    # compile .jade files and build danilo.min.js
    make

    # install demo dependencies
    cd demo && npm install

    # run the server
    node server

    # open your browser to http://localhost:8000/demo/demo.html
    open http://localhost:8000/demo/demo.html # (on Mac)

You may want to open Firebug / WebKit's inspector to see ```console.log``` messages.

In the demo there is a ```window.danilo``` object you can use to play with Danilo.js without the need to define
a RequireJS module.

Once you're familiar with the demo you should read its [annotated source][].



[introduction to MOVE]: http://cirw.in/blog/time-to-move-on
[RequireJS]: http://requirejs.org
[annotated source]: http://www.plasticpanda.com/projects/danilo.js/
[download and install Node.js]: http://nodejs.org/download/
