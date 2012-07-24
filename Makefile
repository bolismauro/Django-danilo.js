
all:
	coffee -c .
	jade demo/demo.jade
	#uglifyjs danilo.js > danilo.min.js


