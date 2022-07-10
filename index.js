// Bot client

const { getTime } = require("./utils/functions");
const { Client, Collection } = require("discord.js");
const Enmap = require("enmap");
var colors = require("colors");
require("dotenv/config");
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
  restTimeOffset: 0,
  allowedMentions: {
    parse: [],
    repliedUser: false,
  },
});
module.exports = client;

client.config = require("./botconfig/config.json");
client.emotes = require("./botconfig/emojis.json");

client.commands = new Collection();
client.slashCommands = new Collection();
client.categories = require("fs").readdirSync(`./commands`);
client.cooldowns = new Collection();

client.settings = new Enmap({
  name: "settings",
  dataDir: "./databases/settings",
});
client.maps = new Map();

console.log(`${getTime()} Loading the bot...`.brightRed);

["commands", "events"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.login(process.env.TOKEN || client.config.token);

// DisTube client

const { DisTube } = require("distube");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp");

client.distube = new DisTube(client, {
  leaveOnEmpty: true,
  leaveOnFinish: false,
  leaveOnStop: false,
  youtubeDL: false,
  updateYouTubeDL: false,
  plugins: [
    new SoundCloudPlugin(),
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new YtDlpPlugin(),
  ],
  savePreviousSongs: true,
});

["distubeEvents"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});
