const config = require("./config.json");
const maxApi = require("max-api");
const Discord = require("discord.js");
const client = new Discord.Client();

const prefix = config.prefix;
const testchannel = config.testchannel;
const ktschannel = config.ktschannel;
const channel = ktschannel; // text from maxpatch goes to this channel

client.on("ready", () => {

	console.log("kobot is online");

	// sends text from maxpatch to specified discord channel
	maxApi.addHandler("text", (...maxargs) => {
		let str = maxargs.toString();
		let output = str.replace(/,/g, " ");
		if (output == "") {
			return;
		} else {
			client.channels.cache.get(channel).send("maxpatch says: " + output);
		}
	});

})

client.on("message", msg => {

	// exits code if msg doesn't start with prefix
	if (!msg.content.startsWith(prefix)) return;
	// exits code if msg is from other bots
	if (msg.author.bot) return;

	// sends messages that start with the specified prefix to maxpatch without prefix
	if (msg.content.startsWith(prefix)) {
		maxApi.outlet(msg.content.slice(1));
	}

	// splits incoming commands so they can be parsed and used as command flags
	let args = msg.content.substring(prefix.length).split(" ");

	switch(args[0]) {
		case "ping":
			msg.channel.send("pong!")
			break;
		case "🎺":
			msg.channel.send(":smiling_imp:TerrorHans666:smiling_imp:")
			break;
		case "info":
			if(args[1] == "testvraag") {
				msg.reply("hiermee test je een eenmalige vraag. De tijd waarin kan worden geantwoord kan worden ingesteld door het aantal secondes op te geven: `!testvraag <tijd>`. Geef je geen tijd op, dan heb je 5 seconden om de vraag te antwoorden.");
				break;
			}
			else {
				msg.channel.send(msg.author.toString() +
				"```Typ !info <command> voor info over dat command!\n\nMogelijke commands:\ntestvraag```");
				break;
			}
	}

});

client.on("message", async msg => {

	if (msg.author.bot) return;

	let args = msg.content.substring(prefix.length).split(" ");

	if (msg.content.startsWith("!testvraag")) {

		if (args.length === 1) {
			args.push("5");
		}

		// loads questions from quiz.json and randomly selects one
		const quiz = require("./quiz.json");
		const item = quiz[Math.floor(Math.random() * quiz.length)];

		let quizEmbed = new Discord.MessageEmbed()
			.setColor("#ff007f")
			.setTitle(item.question)
			.setDescription("1️⃣ " + item.answer1 + "\n\n 2️⃣ " + item.answer2);

		try {

			const quizMap = new Map();
			const userMap = new Map();

			let filter = (reaction, user) => {
				if(user.bot) return false;
				if(["1️⃣", "2️⃣"].includes(reaction.emoji.name)) {
					if(quizMap.get(reaction.message.id).get(user.id)) {
						// console.log("User already voted.");
						return false;
					} else {
						// console.log("User voted.");
						userMap.set(user.id, reaction.emoji.name);
						return true;
					}
				}
			}

			let qmsg = await msg.channel.send(quizEmbed);
			await qmsg.react("1️⃣");
			await qmsg.react("2️⃣");
			quizMap.set(qmsg.id, userMap);

			let results = await qmsg.awaitReactions(filter, { time: (args[1] * 1000) });

			let optionOne = results.get("1️⃣");
			let optionTwo = results.get("2️⃣");
			let optionOneResults = 0, optionTwoResults = 0;
			if (optionOne) {
				optionOneResults = optionOne.users.cache.filter(u => !u.bot).size;
			}
			if (optionTwo) {
				optionTwoResults = optionTwo.users.cache.filter(u => !u.bot).size;
			}

			// console.log(`${item.answer1}: ${optionOneResults} \n${item.answer2}: ${optionTwoResults}`);

			const resultsEmbed = new Discord.MessageEmbed()
				.setColor("#ff007f")
				.setTitle("Results: " + item.question)
				.setDescription(`1️⃣ ${item.answer1}: **${optionOneResults}**\n\n 2️⃣ ${item.answer2}: **${optionTwoResults}**`);

			await msg.channel.send(resultsEmbed);
			maxApi.outlet(`results ${optionOneResults} ${optionTwoResults}`);
			qmsg.delete({ timeout: 0 });

		} catch(err) {
			console.log(err);
		}

	}

});

client.login(config.token);
