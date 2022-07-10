const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invite {botname} to your server!",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Thanks for wanting to invite me!")
          .setDescription("Click on one of the buttons below to invite me!")
          .setColor(client.config.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("LINK")
            .setEmoji("994433630816448563")
            .setLabel("Regular Invite")
            .setURL(
              `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=4298468440`
            ),
          new MessageButton()
            .setStyle("LINK")
            .setEmoji("994435066518319114")
            .setLabel("Admin Invite")
            .setURL(
              `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8`
            ),
          new MessageButton()
            .setStyle("LINK")
            .setEmoji("994435068363821117")
            .setLabel("Support Server")
            .setURL(`https://discord.gg/nhdsVmWygc`)
        ),
      ],
    });
  },
};
