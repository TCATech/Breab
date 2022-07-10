const client = require("../index");
const { getTime } = require("../utils/functions");

client.on("ready", () => {
  setInterval(() => {
    const list = [
      "epic music",
      "the ricrkoll",
      "NCS music",
      "Legends Never Die",
      `${client.config.prefix}help`,
    ];
    const randomStatus = list[Math.floor(Math.random() * list.length)];
    let statusType = "LISTENING";

    client.user.setActivity(randomStatus, { type: statusType });
  }, 10000);

  console.log(`${getTime()} Logged in as ${client.user.tag}.`.rainbow);
});
