const axios = require('axios');
const ical = require('node-ical');
const chan = require('./channels.js');

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
];

const colors = {
    'B. D.  avancées': '0x81ff73',
    'Prog WEB Javascript': '0xffe83d',
    'E-Business JS 1er partie': '0xffe83d',
    'E-Business JS 2ème partie': '0xffe83d',
    'Réseaux et sécurité': '0xff4ad5',
    'Prog. objet Java & J2E': '0xff4f61',
    'Archi. Logicielle': '0xff96fa'
};

exports.next = function () {
    axios.post(process.env.ICAL_TOKEN).then((res) => {
        const directEvents = ical.sync.parseICS(res.data);

        const keys = Object.keys(directEvents);
        const events = [];

        // const alreadySeen = [];

        keys.forEach((key) => {
            events.push(directEvents[key]);
            // if (!alreadySeen.includes(directEvents[key].summary)) {
            //     alreadySeen.push(directEvents[key].summary);
            // }
        });

        // console.table(alreadySeen);

        let nearest;
        const now = new Date().getTime();

        events.forEach((event) => {
            const start = event.start.getTime();
            if (start >= now) {
                if (nearest) {
                    if (start < nearest.start.getTime()) {
                        nearest = event;
                    }
                } else {
                    nearest = event;
                }
            }
        });

        let salles = nearest.location.split(',');
        const nbSalles = salles.length;
        salles = salles.join('\n');

        const start = nearest.start;
        const end = nearest.end;

        console.log(start);
        console.log(end);

        const profRegex = /[A-Z]+\s{3}[A-Z]+/gm;
        const matches = nearest.description.match(profRegex);
        const prof = matches[0].split('   ').join(' ');

        const title = nearest.summary;

        const embed = {
            title: title,
            color: colors[title] || '0x0000ff',
            fields: [
                {
                    name: 'Date',
                    value: `${days[start.getDay() - 1]} ${start.getDate()} ${
                        months[start.getMonth()]
                    } ${start.getFullYear()}`
                },
                {
                    name: 'Début',
                    value: `${start.getHours()} : ${start.getMinutes()}`
                },
                {
                    name: 'Fin',
                    value: `${end.getHours()} : ${end.getMinutes()}`
                },
                {
                    name: 'Professeur',
                    value: prof
                },
                {
                    name: nbSalles === 1 ? 'Salle' : 'Salles',
                    value: salles
                }
            ]
        };

        chan.edt.send({ embed });
    });
};

exports.date = (params) => {
    axios.post(process.env.ICAL_TOKEN).then((res) => {
        const directEvents = ical.sync.parseICS(res.data);

        const keys = Object.keys(directEvents);
        const events = [];

        let date;

        if (params) {
            const dateTokens = params.split('/');
            date = new Date(Date.UTC(dateTokens[2], dateTokens[1] - 1, dateTokens[0]));
        } else {
            date = new Date();
        }

        keys.forEach((key) => {
            const event = directEvents[key];

            if (event.start.toLocaleDateString() === date.toLocaleDateString()) {
                events.push(event);
            }
        });

        if (events.length !== 0) {
            events.forEach((event) => {
                let salles = event.location.split(',');
                const nbSalles = salles.length;
                salles = salles.join('\n');

                const profRegex = /[A-Z]+\s{3}[A-Z]+/gm;
                const matches = event.description.match(profRegex);
                const prof = matches[0].split('   ').join(' ');

                const title = event.summary;

                const start = event.start;
                const end = event.end;

                const embed = {
                    title: title,
                    color: colors[title] || '0x0000ff',
                    fields: [
                        {
                            name: 'Date',
                            value: `${days[start.getDay() - 1]} ${start.getDate()} ${
                                months[start.getMonth()]
                            } ${start.getFullYear()}`
                        },
                        {
                            name: 'Début',
                            value: `${start.getHours()} : ${start.getMinutes()}`
                        },
                        {
                            name: 'Fin',
                            value: `${end.getHours()} : ${end.getMinutes()}`
                        },
                        {
                            name: 'Professeur',
                            value: prof
                        },
                        {
                            name: nbSalles === 1 ? 'Salle' : 'Salles',
                            value: salles
                        }
                    ]
                };
                chan.edt.send({ embed });
            });
        } else {
            const embed = {
                title: `Pas de cours le ${days[date.getDay() - 1]} ${date.getDate()} ${
                    months[date.getMonth()]
                } ${date.getFullYear()}`,
                color: '0xff0000'
            };
            chan.edt.send({ embed });
        }
    });
};
