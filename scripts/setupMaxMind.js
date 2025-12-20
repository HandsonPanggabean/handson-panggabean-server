const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const geoipDir = path.join(__dirname, "../geoip");
const dbPath = path.join(__dirname, "../geoip/GeoLite2-City.mmdb");

if (!fs.existsSync(geoipDir)) {
  fs.mkdirSync(geoipDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  console.log("⬇️ Downloading GeoLite2-City database...");

  execSync(
    `curl -L -u ${process.env.MAXMIND_ACCOUNT_ID}:${process.env.MAXMIND_LICENSE_KEY} \
"https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${process.env.MAXMIND_LICENSE_KEY}&suffix=tar.gz" \
| tar -xz --strip-components=1 -C ${geoipDir}`,
    { stdio: "inherit" }
  );
} else {
  console.log("✅ GeoLite2 database already exists");
}
