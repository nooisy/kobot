// kobot performance edish(tm)
//
// changes:
// - bot now asks questions in order, which is more performance friendly
// - questions now get triggered in the maxpatch
// - results messages now get removed as well, this is more chat friendly
// - maxpatch will now receive every message instead of only the ones with prefix
const config = require("./config.json");
const maxApi = require("max-api");
const Discord = require("discord.js");

const client = new Discord.Client();
const prefix = config.prefix;

// current quiz channel
const channel = config.livechannel;

// question no.
let i = 0;
// time to anwser in seconds
let qTime = 30;
// time till results message gets removed in seconds
let rTime = 30;

// quiz function
async function askQuestion() {
	const quiz = require("./quiz.json");
	const item = quiz[i];

	if (i < quiz.length) {
		i++;
	} else {
		i = 0;
	}

	maxApi.outlet(`question "${item.question}"`);

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

		let qmsg = await client.channels.cache.get(channel).send(quizEmbed);
		await qmsg.react("1️⃣");
		await qmsg.react("2️⃣");
		quizMap.set(qmsg.id, userMap);

		let results = await qmsg.awaitReactions(filter, { time: (qTime * 1000) });

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

		qmsg.delete({ timeout: 0 });
		let rmsg = await client.channels.cache.get(channel).send(resultsEmbed);
		maxApi.outlet(`results "${item.question}" "${item.answer1}" "${item.answer2}" "${optionOneResults}" "${optionTwoResults}"`);
		rmsg.delete({ timeout: (rTime * 1000) });
	} catch(err) {
		console.log(err);
	}
}

client.on("ready", () => {

	console.log("kobot is online");

	// quiz and reset command
	maxApi.addHandler("text", (...maxargs) => {
		let str = maxargs.toString();
		let output = str.replace(/,/g, " ");
		if (output == "") {
			return;
		} else {
			if (output == "ask") {
				askQuestion();
			}
			if (output == "reset") {
				i = 0;
			}
		}
	});

});

client.on("message", msg => {

	// sends every message to maxpatch
	if (msg.channel.id == (channel)) {
		newMessage = msg.content;
		maxApi.outlet(newMessage);
	}

});

client.login(config.token);
