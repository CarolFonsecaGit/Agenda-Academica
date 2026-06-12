const http = require("http");
const fs = require("fs");
const path = require("path");

const DEFAULT_PORT = 5500;
const HOST = "127.0.0.1";
const FRONT_DIR = path.join(__dirname, "front");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((request, response) => {
  const requestedPath = decodeURIComponent(request.url.split("?")[0]);
  const safePath = requestedPath === "/" ? "/index.html" : requestedPath;
  const filePath = path.normalize(path.join(FRONT_DIR, safePath));

  if (!filePath.startsWith(FRONT_DIR)) {
    response.writeHead(403);
    response.end("Acesso negado");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Arquivo não encontrado");
      return;
    }

    const ext = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(content);
  });
});

function startServer(port) {
  server.listen(port, HOST, () => {
    console.log(`Frontend rodando em http://${HOST}:${port}`);
    console.log("Pressione Ctrl+C para parar.");
  });
}

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    const currentPort = Number(server.address()?.port || DEFAULT_PORT);
    const nextPort = currentPort + 1;
    console.log(`Porta ${currentPort} em uso. Tentando http://${HOST}:${nextPort}`);
    startServer(nextPort);
    return;
  }

  console.error("Erro ao iniciar o servidor:", error.message);
});

startServer(DEFAULT_PORT);
