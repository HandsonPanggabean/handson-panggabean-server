const geoip = require("geoip-lite");
const moment = require("moment");

// Helpers
const { getCountryName } = require("../helpers/get_country_name");

function getClientIp(req) {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "";

  // Convert IPv6-mapped IPv4 to IPv4
  if (ip.startsWith("::ffff:")) {
    ip = ip.slice(7);
  }

  return ip;
}

function isPublicIp(ip) {
  return (
    ip &&
    ip !== "127.0.0.1" &&
    ip !== "::1" &&
    !ip.startsWith("10.") &&
    !ip.startsWith("192.168.") &&
    !/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

module.exports = function geoLocation(req, res, next) {
  const ip = req.ip;
  //   const ip = getClientIp(req);

  const geo = isPublicIp(ip) ? geoip.lookup(ip) : null;

  const timestamp = new Date();

  res.on("finish", () => {
    console.log(
      `[${moment(timestamp).format("YYYY-MM-DD HH:mm:ss")}] ${req.method} ${
        req.originalUrl
      } - Status: ${res.statusCode} ${
        geo?.country
          ? `- H: ${getCountryName(geo.country) || ""}, P: ${geo.city || ""}, ${
              geo.ll ? `C: (${geo.ll.join(", ")})` : ""
            } - IP: ${ip}`
          : `- IPv6 / VPN / Unknown`
      }`
    );
  });

  next();
};
