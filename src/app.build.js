({
    optimize: "none",
    appDir: ".",
    baseUrl: "./",
    dir: "../build/",
    modules: [
        {
            name: "danilo"
        }
    ],
    paths: {
	danilo: "./danilo",
	promise: "../libs/promise",
	superagent: "../libs/superagent",
	handlebars: "../libs/handlebars",
	pubsub: "../libs/pubsub"
    }
})
