const { MessageEmbed } = require("discord.js");
const client = require("../index");
const { escapeRegex } = require("../utils/functions");
const { check_dj, onCoolDown } = require("../utils/functions");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  client.settings.ensure(message.guild.id, {
    prefix: client.config.prefix,
    defaultVolume: 50,
    defaultFilters: ["clear", "bassboost6"],
    djRoles: [],
  });

  message.prefix = client.settings.get(message.guild.id, "prefix");

  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(message.prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;

  const [, mPrefix] = message.content.match(prefixRegex);

  const [cmd, ...args] = message.content
    .slice(mPrefix.length)
    .trim()
    .split(/ +/);

  if (cmd.length === 0) {
    if (mPrefix.includes(client.user.id)) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("👋 Hey there!")
            .setDescription(
              "My prefix in this server is `" +
                message.prefix +
                "`.\nUse `" +
                message.prefix +
                "help` to see all my commands!"
            )
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    }
  }

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command) return;

  try {
    if (
      command.userPerms &&
      !message.member.permissions.has(command.userPerms)
    ) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`${client.emotes.x} You don't have enough permissions!`)
            .addField(
              "Permissions you need",
              `\`${command.userPerms
                .map(
                  (value) =>
                    `${
                      value[0].toUpperCase() +
                      value.toLowerCase().slice(1).replace(/_/gi, " ")
                    }`
                )
                .join(", ")}\``
            )
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    if (
      command.botPerms &&
      !message.guild.me.permissions.has(command.botPerms)
    ) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`${client.emotes.x} I don't have enough permissions!`)
            .addField(
              "Permissions I need",
              `\`${command.botPerms
                .map(
                  (value) =>
                    `${
                      value[0].toUpperCase() +
                      value.toLowerCase().slice(1).replace(/_/gi, " ")
                    }`
                )
                .join(", ")}\``
            )
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    const queue = client.distube.getQueue(message.guild.id);
    if (
      command.checkDJ &&
      queue &&
      queue.songs.length > 0 &&
      check_dj(client, message.member, queue.songs[0])
    )
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `${client.emotes.x} You are not a DJ, or the song requester!`
            )
            .setColor(client.config.color),
        ],
      });

    await command.run(client, message, args);
  } catch (err) {
    console.log(err);
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`${client.emotes.x} Whoops!`)
          .setDescription(`An error occured!`)
          .addField("Error", `\`\`\`${err}\`\`\``)
          .setColor("RED")
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
    });
  }
});
