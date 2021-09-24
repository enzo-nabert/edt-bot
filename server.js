const express = require('express');
const app = express();
const axios = require('axios');
const ical = require('node-ical');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

app.listen(3000, () => {
    console.log('running on Port 3000');
});

client.login(process.env.BOT_TOKEN);
client.on('ready', () => {
    console.log('BOT READY');

    const channels = client.channels.cache.array();

    let chan;

    channels.forEach((channel) => {
        if (channel.name === 'edt') {
            chan = channel;
        }
    });

    axios
        .post(
            'https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c4a5f10b982f9b914f8b3df9a16d82f493dc5c094f7d1a811b903031bde802c7f56c5ce5d7b8d9b880fb6990772f87c6e42988e4003796ffd7b370c710463ddfaeffe549117e5ce57de0959ce04492b6546e4d079e8e99acc4e6ed63ca8089ad01,1'
        )
        .then((res) => {
            const directEvents = ical.sync.parseICS(res.data);
            // log the ids of these events
            console.log(Object.keys(directEvents));
        });
});
