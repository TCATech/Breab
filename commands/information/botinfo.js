const {
  Client,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} = require("discord.js");

module.exports = {
  name: "botinfo",
  description: "Tells you some info about {botname}.",
  aliases: ["bi", "bot"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    const embed = new MessageEmbed()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .addField(
        "Servers watching",
        `${client.guilds.cache.size.toLocaleString()} server${
          client.guilds.cache.size > 1 ? "s" : ""
        }`,
        true
      )
      .addField(
        "Channels watching",
        client.channels.cache.size.toLocaleString(),
        true
      )
      .addField("Users watching", client.users.cache.size.toString(), true)
      .addField("Commands", client.commands.size.toLocaleString(), true)
      .addField("Prefix", `\`${message.prefix}\``, true)
      .addField(
        "Made with",
        `[discord.js](https://github.com/discordjs/discord.js)`,
        true
      )
      .addField("Version", client.config.version, true)
      .addField(
        "Created",
        `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`,
        true
      )
      .addField("Developer", "Not TCA#7797", true)
      .setColor(client.config.color);

    message.reply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("LINK")
            .setLabel("Invite")
            .setEmoji("994433630816448563")
            .setURL(
              `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=4298468440`
            )
        ),
      ],
    });
  },
};
