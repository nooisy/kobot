# kobot
[short demo vid](https://vimeo.com/818711859)<br><br>
kobot exchanges information between Discord and Max/MSP. its goal is to provide an interactive connection between live performers and their audience. kobot asks yes or no questions on which can be voted, the outcomes influence the performance and its live performers.

### quick setup(tm)
#### get discord bot token
if you follow [this guide](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) you'll have one in 5 minutes. pick the permissions you need and invite your newborn bot to your server (kobot needs at least Send/Manage Messages, Read Message History and Add Reactions permissions).

#### ghost in the shell
`kobot.js` is configured to read some values from a `config.json` file. here's an example:
```
{
  "prefix": "whatever you want to use",
  "token": "put token here",
  "testchannel": "channel id"
}
```
also make sure to [install](https://discordjs.guide/preparations/#installing-node-js) the `discord.js` node module.
if you configured everything correctly the bot should start after pressing the (script start) message in the maxpatch.

#### further reading
https://discordjs.guide/<br>
https://discord.js.org/<br>
https://docs.cycling74.com/nodeformax/api/

#### extra
https://audiomovers.com/ (audio over internet)

kobot was part of the 2020 online hku klankontwerp performance
