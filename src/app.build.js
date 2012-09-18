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
    Flow: "../libs/gowiththeflow",
	superagent: "../libs/superagent",
	handlebars: "../libs/handlebars",
	pubsub: "../libs/pubsub"
    }
})
