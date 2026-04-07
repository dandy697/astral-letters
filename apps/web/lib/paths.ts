import path from "node:path";

function resolveWebAppRoot() {
  const cwd = process.cwd();
  const webSuffix = path.join("apps", "web");

  if (cwd.endsWith(webSuffix)) {
    return cwd;
  }

  return path.join(cwd, "apps", "web");
}

export const webAppRoot = resolveWebAppRoot();
export const projectRoot = webAppRoot.endsWith(path.join("apps", "web")) ? path.resolve(webAppRoot, "..", "..") : process.cwd();
export const webPublicReportsRoot = path.join(webAppRoot, "public", "generated", "reports");
export const webDataRoot = path.join(webAppRoot, ".data");
