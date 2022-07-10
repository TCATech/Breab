module.exports = {
  escapeRegex: function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  },
  check_dj: function check_dj(client, member, song) {
    if (!client) return false;
    const roleId = client.settings.get(member.guild.id, "djRoles");
    if (String(roleId) === "") return false;

    var isDJ = false;

    for (let i = 0; i < roleId.length; i++) {
      if (!member.guild.roles.cache.get(roleId[i])) continue;
      if (member.roles.cache.has(roleId[i])) isDJ = true;
    }

    if (
      !isDJ &&
      !member.permissions.has("ADMINISTRATOR") &&
      song.user.id !== member.id
    )
      return roleId.map((i) => `<@&${i}>`).join(", ");
  },
  getTime: function getTime() {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds} ::`;
  },
};
