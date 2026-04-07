import path from "node:path";

function resolveWebAppRoot() {
  const cwd = process.cwd();
  const webSuffix = path.join("apps", "web");

  if (cwd.endsWith(webSuffix)) {
    return cwd;
  }

  return path.join(cwd, "apps", "web");
}

const isVercel = process.env.VERCEL === "1";
const tmpStorage = "/tmp/astral-letters";

export const webAppRoot = resolveWebAppRoot();
export const projectRoot = webAppRoot.endsWith(path.join("apps", "web")) ? path.resolve(webAppRoot, "..", "..") : process.cwd();

// En production sur Vercel, le disque est en lecture seule sauf dans /tmp
export const webPublicReportsRoot = isVercel 
  ? path.join(tmpStorage, "reports")
  : path.join(webAppRoot, "public", "generated", "reports");

export const webDataRoot = isVercel 
  ? tmpStorage
  : path.join(webAppRoot, ".data");
