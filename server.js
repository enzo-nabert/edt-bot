const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Discord = require('discord.js');
const client = new Discord.Client();

require("dotenv").config();

app.listen(3000, () => {
    console.log("running on Port 3000");
});


const chan = require('./channels.js');

client.login(process.env.BOT_TOKEN);
client.on('ready', () => {
    console.log("BOT READY");
    const channels = client.channels.cache.array();

    channels.forEach((channel) => {
        if (channel.name === 'edt') {
            chan.edt_channel = channel
        }
    });
});