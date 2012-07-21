
all:
	coffee -c router.coffee
	uglifyjs router.js > router.min.js


