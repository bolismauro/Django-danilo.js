({
    appDir: ".",
    baseUrl: "src/",
    dir: "build/",
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
