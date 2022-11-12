const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

module.exports = function (config, logger, migrationName) {
  const ts = Date.now();
  let up;

  if (typeof config.migrationsDir !== 'string') {
    throw new Error('configuration "migrationsDir" is missing');
  }

  mkdirp.sync(config.migrationsDir);

  up = `${ts}_${migrationName}.sql`;
  up = path.resolve(config.migrationsDir, up);

  logger.log(up);

  fs.openSync(up, 'w');
};
