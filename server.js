const express = require('express');
const app = express();
const chan = require('./channels.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Discord = require('discord.js');
const commands = require('./commands.js');
const client = new Discord.Client();

require('dotenv').config();

app.listen(process.env.PORT || 3000, () => {
    console.log('running on Port 3000');
});

client.login(process.env.BOT_TOKEN);
client.on('ready', () => {
    console.log('BOT READY');

    const channels = client.channels.cache.array();

    channels.forEach((channel) => {
        if (channel.name === 'edt') {
            chan.edt = channel;
        }
    });

    client.on('message', onMessage);
});

const onMessage = (msg) => {
    if (msg.author.id !== process.env.BOT_ID && msg.channel.name === 'edt') {
        const content = msg.content;
        const splited = content.split(' ');
        if (typeof commands[splited[0]] === 'function') {
            if (splited.length === 1) {
                commands[splited[0]]();
            } else {
                commands[splited[0]](splited[1]);
            }
        }
    }
};
