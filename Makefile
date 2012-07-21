
all:
	coffee -c danilo.coffee
	uglifyjs danilo.js > danilo.min.js


