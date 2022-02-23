const moment = require("moment");

exports.isExpireSoon = ({ expireDate }) => {
  const today = moment().add("7", "day").format("YYYY-MM-D");
  const expire = moment(
    expireDate
  ).format("YYYY-MM-D");

  const isExpire = today < expire;

  return !isExpire;
};
