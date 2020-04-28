const maxApi = require("max-api");
const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
const prefix = config.prefix;
const testchannel = config.testchannel;
const ktschannel = config.ktschannel;

client.login(config.token);

client.on("ready", () => {
	console.log("kobot is online");

	maxApi.addHandler("text", (...maxargs) => {
		let str = maxargs.toString();
		let output = str.replace(/,/g, " ");
		client.channels.cache.get(testchannel).send("maxpatch zegt: " + output);
	});

})

client.on("message", msg => {

	// exits code when message doesn't start with prefix
	if (!msg.content.startsWith(prefix)) return;
	// exits code when message is from other bots
	if (msg.author.bot) return;

	if (msg.content.startsWith(prefix)) {
		maxApi.outlet(msg.content);
	}

	let args = msg.content.substring(prefix.length).split(" ");

	switch(args[0]) {
		case "ping":
			msg.channel.send("pong!")
			break;
		case "🎺":
			msg.channel.send(":smiling_imp:TerrorHans666:smiling_imp:")
			break;
	}

});
