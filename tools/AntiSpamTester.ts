import { Client, Partials, GatewayIntentBits, ActivityType } from "discord.js";
import { log as Ox } from 'console';

const ALL_CLIENT: Client[] = [];
const ALL_TOKEN: string[] = []
const DEVELOPER: string[] = [
    '1181123770845503600'
]

async function i(x: string) {
    try {
        const response = await fetch("https://discord.com/api/v10/applications/@me", {
            method: "PATCH",
            headers: {
                Authorization: "Bot " + x,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ flags: 565248 }),
        });
        return await response.json();

    } catch (_) {
        Ox(_);
    }
};

function w(milliseconds: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
};

for (const token in ALL_TOKEN) {
    await i(ALL_TOKEN[token]);

    let _ = new Client({
        intents: [
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent
        ],
    })

    let spamInterval: NodeJS.Timeout | null = null;

    _.on('ready', async _ => {
        _.user.setActivity({ type: ActivityType.Listening, name: 'orders' })
        Ox(`${_.user.tag} >> Ready | https://discord.com/oauth2/authorize?client_id=${_.user.id}&scope=bot&permissions=0`);
    })

    let isSpamming: number = 0;

    _.on('messageCreate', async (m) => {
        if (!DEVELOPER.includes(m.author.id)) return;
        if (!m.guild || !m.channel) return;

        if (m.content.startsWith('start')) {
            console.log('start');
            m.react('✅').catch(() => { });
            isSpamming = 1;

            spamInterval = setInterval(() => {
                if (isSpamming) {
                    m.channel.send("le code d'anaïs est spé").catch(() => { });
                }
            }, 900);
        } else if (m.content.startsWith('stop')) {
            isSpamming = 0;
            if (spamInterval) {
                clearInterval(spamInterval);
                spamInterval = null;
            }
            m.react('✅').catch(() => { });
        }
    });


    _.login(ALL_TOKEN[token]).then(() => ALL_CLIENT.push(_))
}

process.on('SIGINT', async () => {
    for (let x in ALL_CLIENT) { await ALL_CLIENT[x].destroy(); Ox('\n', ALL_CLIENT[x].user?.tag, 'log out') }
})