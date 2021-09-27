const express = require('express');
const app = express();
const chan = require('./channels.js');
const wakeDyno = require('heroku-keep-awake');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Discord = require('discord.js');
const commands = require('./commands.js');
const client = new Discord.Client();

require('dotenv').config();

app.listen(process.env.PORT || 3000, () => {
    console.log('running on Port 3000');
    wakeDyno('https://bot-edt.herokuapp.com/', {
        interval: 29,
        logging: false,
        stopTimes: { start: '06:00', end: '18:30' }
    });
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
        switch (splited[0]) {
            case 'next':
                commands[splited[0]](splited[1], msg.author);
                break;
            case 'date':
                commands[splited[0]](splited[1], splited[2], msg.author);
                break;
            case 'cls':
                commands[splited[0]](msg, Number(splited[1]) + 1);
                break;
        }
    }
};
