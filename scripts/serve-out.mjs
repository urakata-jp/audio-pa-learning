import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "out");
const port = Number(process.env.PORT ?? 3000);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const filePath = resolvePath(pathname);

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "content-type": types[extname(filePath)] ?? "application/octet-stream"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, "127.0.0.1");

function resolvePath(pathname) {
  const clean = normalize(pathname)
    .replace(/^(\.\.[/\\])+/, "")
    .replace(/^[/\\]+/, "");
  const direct = join(root, clean);

  if (existsSync(direct) && statSync(direct).isFile()) {
    return direct;
  }

  if (pathname.endsWith("/") || existsSync(direct)) {
    return join(root, clean, "index.html");
  }

  return join(root, clean, "index.html");
}
