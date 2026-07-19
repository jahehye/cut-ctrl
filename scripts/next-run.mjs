import {spawnSync} from "node:child_process";
import {createRequire} from "node:module";
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const nextBin = require.resolve("next/dist/bin/next");
const wasmDir = dirname(require.resolve("@next/swc-wasm-nodejs/package.json"));
const result = spawnSync(process.execPath, [nextBin, ...process.argv.slice(2)], {
  cwd: root,
  env: {...process.env, NEXT_TEST_WASM_DIR: wasmDir},
  stdio: "inherit",
});
process.exit(result.status ?? 1);
