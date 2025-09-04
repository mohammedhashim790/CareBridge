
import {writeFileSync, readFileSync} from 'fs';
import {join} from 'path';
import * as fs from "node:fs";

const BUILD_VERSION_PATH = join('./AppConfig.json');

let appConfig = JSON.parse(fs.readFileSync(BUILD_VERSION_PATH));

function getTimestampBasedVersion() {
  return parseInt(new Date().getTime() / 1000);
}

const buildResult = {
  version:appConfig.version,
  versionNumber:appConfig.versionNumber+1,
  timeOfBuild: getTimestampBasedVersion()
};

console.log(appConfig);
appConfig = {
  ...appConfig,
  ...buildResult
}

console.log(appConfig);

writeFileSync(BUILD_VERSION_PATH, JSON.stringify(appConfig, null, 2));
