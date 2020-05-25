const config = require("./config.json");
const maxApi = require("max-api");
const Discord = require("discord.js");

const client = new Discord.Client();
const prefix = config.prefix;

// text from maxpatch goes to this channel
const channel = config.ktschannel;;

client.on("ready", () => {

	console.log("kobot is online");

	// sends text from maxpatch to specified discord channel
	maxApi.addHandler("text", (...maxargs) => {
		let str = maxargs.toString();
		let output = str.replace(/,/g, " ");
		if (output == "" || output.startsWith("!") == true) {
			return;
		} else {
			client.channels.cache.get(channel).send("maxpatch says: " + output);
		}
	});

});

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
		case "info":
			if(args[1] == "test") {
				msg.reply("Test a question. You can specify the time to answer in seconds. Default is 5.");
				break;
			}
			else {
				msg.channel.send(msg.author.toString() +
				"```Type !info <command> for more information about that command!\n\nPossible commands:\ntest```");
				break;
			}
	}

});

client.on("message", async msg => {

	if (!msg.content.startsWith(prefix)) return;
	if (msg.author.bot) return;

	let args = msg.content.substring(prefix.length).split(" ");

	if (msg.content.startsWith("!test")) {

		if (args.length == 1) {
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
						return false;
					} else {
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

			const resultsEmbed = new Discord.MessageEmbed()
				.setColor("#ff007f")
				.setTitle("Results: " + item.question)
				.setDescription(`1️⃣ ${item.answer1}: **${optionOneResults}**\n\n 2️⃣ ${item.answer2}: **${optionTwoResults}**`);

			await msg.channel.send(resultsEmbed);
			maxApi.outlet(`results "${item.question}" "${item.answer1}" "${item.answer2}" "${optionOneResults}" "${optionTwoResults}"`);
			qmsg.delete({ timeout: 0 });

		} catch(err) {
			console.log(err);
		}

	}

});

client.login(config.token);
