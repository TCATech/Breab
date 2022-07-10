const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "search",
  description: "Searches for a song on YouTube.",
  usage: "<search query>",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const query = args.join(" ");
    if (!query)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`${client.emotes.x} You need to specify a search query!`)
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });

    const res = await message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`🔎 Searching for: \`${query}\``)
          .setColor(client.config.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
    });

    const searchResults = await client.distube.search(query);

    if (!searchResults)
      return res.edit({
        embeds: [
          new MessageEmbed()
            .setTitle(`${client.emotes.x} No results for: \`${query}\``)
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });

    let i = 0;
    res.edit({
      embeds: [
        new MessageEmbed()
          .setTitle(`🔎 Results for: \`${query}\``)
          .setDescription(
            searchResults
              .map(
                (song) =>
                  `**${++i}**. [\`${song.name}\`](${song.url}) - \`${
                    song.formattedDuration
                  }\``
              )
              .join("\n")
              .substr(0, 2000)
          )
          .setColor(client.config.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
    });
  },
};
