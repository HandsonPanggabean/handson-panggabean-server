const maxmind = require("maxmind");
const moment = require("moment");
const path = require("path");

let cityReader;

// Load DB once (VERY IMPORTANT for performance)
(async () => {
  cityReader = await maxmind.open(
    path.join(process.cwd(), process.env.MAXMIND_PATH)
  );
})();

function getClientIp(req) {
  //   let ip =
  //     req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "";
  let ip = req.ip || "";

  if (ip.startsWith("::ffff:")) ip = ip.slice(7);

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

function maskIp(ip) {
  if (!ip) return "";
  return ip.replace(/\.\d+$/, ".0");
}

function getGoogleMapsUrl(lat, lng) {
  if (lat == null || lng == null) return null;
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

module.exports = function geoLocation(req, res, next) {
  const ip = getClientIp(req);
  const timestamp = new Date();

  let geo = null;

  if (cityReader && isPublicIp(ip)) {
    try {
      geo = cityReader.get(ip);
    } catch (err) {
      console.error("MaxMind error:", err);
    }
  }

  res.on("finish", () => {
    console.log(
      `[${moment(timestamp).format("YYYY-MM-DD HH:mm:ss")}] ${req.method} ${
        req.originalUrl
      } - Status: ${res.statusCode} ${
        geo
          ? `- IP: ${maskIp(ip)}, H: ${geo.country?.names?.en || ""}, P: ${
              geo.city?.names?.en || ""
            }, C: (${geo.location?.latitude}, ${
              geo.location?.longitude
            }), M: ${getGoogleMapsUrl(
              geo.location?.latitude,
              geo.location?.longitude
            )}`
          : `- (VPN / Proxy / Internal)`
      }`
    );
  });

  next();
};
