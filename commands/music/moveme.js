const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "moveme",
  description: "Moves you to my voice channel.",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const { member, guild, guildId } = message;
    const { channel } = member.voice;
    if (!channel)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`${client.emotes.x} You aren't in a voice channel!`)
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });

    let botChannel = guild.me.voice.channel;

    if (!botChannel)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `${client.emotes.x} I'm not in a voice channel right now!`
            )
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });

    if (botChannel.userLimit >= botChannel.members.length)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `${client.emotes.x} My voice channel is full, so you can't join!`
            )
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });

    if (botChannel.id === channel.id)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`${client.emotes.x} You're already in my voice channel!`)
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });

    member.voice.setChannel(botChannel);

    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`👋 Moved you to my voice channel!`)
          .setColor(client.config.color),
      ],
    });
  },
};
