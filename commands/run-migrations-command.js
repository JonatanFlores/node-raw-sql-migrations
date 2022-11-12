const chalk = require('chalk');

module.exports = function (migrationProvider, adapter, minMigrationTime, logger) {
  return adapter.appliedMigrations()
    .then(function (appliedMigrationIds) {
      const migrationsList = migrationProvider.getMigrationsList();
      const pending = getPending(migrationsList, appliedMigrationIds, minMigrationTime);

      if (pending.length === 0) {
        logger.log('No pending migrations');
        return;
      }

      logger.log('Pending migrations:');
      pending.forEach(function (m) {
        logger.log(chalk.green('>>'), m);
      });

      let migration;
      let migrationProgress = Promise.resolve();
      while (migration = pending.shift()) {
        (function (migration) {
          migrationProgress = migrationProgress.then(function () {
            const sql = migrationProvider.getSql(migration);
            return adapter.applyMigration(migration, sql);
          });
        })(migration);
      }
      return migrationProgress;
    });
};

function getPending(migrationsList, appliedMigrationIds, minMigrationTime) {
  const pending = [];
  migrationsList.forEach(function (migration) {
    const id = migration.match(/^(\d+)/)[0];
    if ((!minMigrationTime || id >= minMigrationTime) && !~appliedMigrationIds.indexOf(id) && migration.match(/^\d+\_.*$/)) {
      pending.push(migration);
    }
  });
  return pending;
}
