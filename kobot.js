const config = require("./config.json");
const maxApi = require("max-api");
const Discord = require("discord.js");

const prefix = config.prefix;
const testchannel = config.testchannel;
const ktschannel = config.ktschannel;

const client = new Discord.Client();

client.login(config.token);

client.on("ready", () => {
	console.log("kobot is online");

	maxApi.addHandler("text", (...maxargs) => {
		let str = maxargs.toString();
		let output = str.replace(/,/g, " ");
		client.channels.cache.get(testchannel).send("maxpatch says: " + output);
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
		case "info":
			if(args[1] == "hz") {
				msg.reply("hiermee kan je de toonhoogte aanpassen!");
			} else {
				msg.channel.send(msg.author.toString() + "```Typ !info command voor info over dat command!\n\nMogelijke commands:\nhz```")
			}
		break;
	}

});
