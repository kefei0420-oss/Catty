const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 3000);
const publicDir = __dirname;

let totalFinds = 0;
let latestFind = null;

function getPhotoFiles() {
  const webDir = path.join(publicDir, "assets", "cats-web");
  const catsDir = path.join(publicDir, "assets", "cats");
  const photoDir = fs.existsSync(webDir)
    ? webDir
    : fs.existsSync(catsDir)
      ? catsDir
      : path.join(publicDir, "assets");
  const prefix = fs.existsSync(webDir)
    ? "assets/cats-web"
    : fs.existsSync(catsDir)
      ? "assets/cats"
      : "assets";

  return fs
    .readdirSync(photoDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
    .sort()
    .map((name) => `${prefix}/${name}`);
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(publicDir, safePath));

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const noStore = new Set([".html", ".css", ".js", ".json"]);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": noStore.has(ext) ? "no-store" : "public, max-age=3600",
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === "/api/stats" && req.method === "GET") {
    sendJson(res, 200, { totalFinds, latestFind });
    return;
  }

  if (req.url === "/api/photos" && req.method === "GET") {
    sendJson(res, 200, { photos: getPhotoFiles() });
    return;
  }

  if (req.url === "/api/find" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 4096) req.destroy();
    });
    req.on("end", () => {
      let payload = {};
      try {
        payload = body ? JSON.parse(body) : {};
      } catch {
        sendJson(res, 400, { error: "Invalid JSON" });
        return;
      }

      totalFinds += 1;
      latestFind = {
        level: String(payload.level || "未知关卡").slice(0, 24),
        at: new Date().toISOString(),
      };
      sendJson(res, 200, { totalFinds, latestFind });
    });
    return;
  }

  serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`Catty is running on port ${port}`);
});
