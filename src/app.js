require('dotenv').config()
const fs = require('fs')


var json = JSON.parse(fs.readFileSync('./src/data.json', 'utf8'))



//brain.js


var brain = require('brain.js')
var lstm = new brain.recurrent.LSTM()
var result = lstm.train(json, {
    iterations: 100,
    log: details => console.log(details),
    errorThresh: 0.011
    })



//load once and daily execute

var dayInMilliseconds = 86400000
setInterval(function () {
        result = lstm.train(json, {
        iterations: 100,
        log: details => console.log(details),
        errorThresh: 0.011
    })
}, dayInMilliseconds)

//discord

const { Client, Intents } = require('discord.js')
const { stringify } = require('querystring')
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING
    ]
});

//log in confirmation
client.on('ready', () => {
    console.log(`[${client.user.tag}] has logged in.`)
})

//message event discord
client.on('messageCreate', (message) => {
    text = message.content
    if (message.author.bot) return
    else if (text === "") return
    else if (text.charAt(0) === "-") return
    else if (text.charAt(0) === "$") return
    else if (text.charAt(0) === "?") return
    else if (text.charAt(0) === "/") return
    else if (text.charAt(0) === "!") return
    else {
        
        console.log(text)

        //write msg on json
        json[json.length] = text
        livetext = JSON.stringify(json, null, 2)
        fs.writeFile('./src/data.json', livetext, err => {
            if (err) {
                console.log(err)
            }})

        //reply predict
        botReply = lstm.run(text)
        if (botReply === "") return
        else {
            message.reply(botReply)
        }
    }})


client.login(process.env.BOT_TOKEN);
