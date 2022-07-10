const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

module.exports = {
  name: "help",
  description:
    "Returns all commands, or some information about a specific command.",
  aliases: ["h", "halp"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (args[0]) {
      const command =
        client.commands.get(args[0]) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(args[0])
        );
      if (!command)
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`${client.emotes.x} That command doesn't exist.`)
              .setColor("RED")
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              }),
          ],
        });

      const embed = new MessageEmbed().setColor(client.config.color).setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

      if (command.name) {
        embed.setTitle(`Information about \`${command.name}\``);
        embed.addField(
          "Command",
          "```" + message.prefix + command.name + "```"
        );
      }

      if (command.description)
        embed.addField(
          "Description",
          "```" +
            command.description.replace("{botname}", client.user.username) +
            "```"
        );
      else embed.addField("Description", "```No description available.```");

      if (command.userPerms)
        embed.addField(
          "Permissions",
          "```" + command.userPerms.join(", ") + "```"
        );

      if (command.aliases)
        embed.addField("Aliases", "```" + command.aliases.join(", ") + "```");

      if (command.usage) {
        embed.addField(
          "Usage",
          `\`\`\`${message.prefix}${command.name} ${command.usage}\`\`\``
        );
        embed.setFooter({
          text: "<> = required, [] = optional",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });
      } else {
        embed.setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });
      }

      message.reply({
        embeds: [embed],
      });
    } else {
      const pages = [];
      let cur = 0;
      const commands = (category) => {
        return client.commands
          .filter((cmd) => cmd.directory === category)
          .map((cmd) => `\`${cmd.name}\``);
      };
      for (let i = 0; i < client.categories.length; i += 1) {
        const current = client.categories[i];
        if (current === "owner") continue;
        const items = commands(current);
        const embed = new MessageEmbed()
          .setColor(client.config.color)
          .setTitle(
            `HELP MENU 🔰 Page ${i + 1}/${
              client.categories.filter((c) => c !== "owner").length
            }`
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setFooter({
            text: `To see more information for a specific command, type: ${client.config.prefix}help [command]`,
          })
          .addField(
            `${current.toUpperCase()} [${items.length}]`,
            `> ${items.sort((a, b) => a.localeCompare(b)).join(", ")}`
          );
        pages.push(embed);
      }

      const msg = await message.channel.send({
        embeds: [pages[cur]],
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("previous")
              .setEmoji("994438542077984768")
              .setStyle("SECONDARY"),
            new MessageButton()
              .setCustomId("next")
              .setEmoji("994438540429643806")
              .setStyle("SECONDARY")
          ),
        ],
      });

      const filter = (i) => i.user.id === message.author.id;
      let Col = msg.createMessageComponentCollector({
        filter,
        componentType: "BUTTON",
      });

      Col.on("collect", (i) => {
        if (i.customId === "previous") {
          if (cur !== 0) {
            cur -= 1;
            i.update({
              embeds: [pages[cur]],
            });
          } else if (cur > pages.length) {
            cur = 0;
            i.update({
              embeds: [pages[cur]],
            });
          } else {
            cur = pages.length - 1;
            i.update({
              embeds: [pages[cur]],
            });
          }
        } else if (i.customId === "next") {
          if (cur < pages.length - 1) {
            cur += 1;
            i.update({
              embeds: [pages[cur]],
            });
          } else {
            cur = 0;
            i.update({
              embeds: [pages[cur]],
            });
          }
        }
      });
    }
  },
};
