/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2023 iHorizon
*/

const fs = require('fs');
const path = require('path');
require("colors");
const logger = require("./logger");
const config = require(`${process.cwd()}/files/config`);

module.exports = (client) => {
  const eventFiles = fs.readdirSync(path.resolve(__dirname, '..', 'Events')).filter(file => file.endsWith('.js'));
  let i = 0;
  for (const file of eventFiles) {
    const event = require(path.resolve(__dirname, '..', 'Events', file));
    const eventName = file.split('.')[0];
    i++; client.on(eventName, event.bind(null, client));
  };
  logger.log(`${config.console.emojis.OK} >> Loaded ${i} events.`.green);
};