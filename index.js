const MigrationProvider = require('./migration-provider');
const createMigrationCommand = require('./commands/create-migration-command');
const runMigrationsCommand = require('./commands/run-migrations-command');

const LOGGER = console;

function migrate(config, adapter) {
	const migrationProvider = MigrationProvider(config);
	return runMigrationsCommand(migrationProvider, adapter, config.minMigrationTime, LOGGER).then(function () {
		return adapter.dispose();
	}, function (error) {
		function rethrowOriginalError() {
			throw error;
		}
		return adapter.dispose().then(rethrowOriginalError, rethrowOriginalError);
	});
}

module.exports = {
	setLogger: function (logger) {
		LOGGER = logger;
	},
	migrate: migrate,
	run: function (config) {
		config.adapter = config.adapter || 'pg';

		const Adapter = require('./adapters/' + config.adapter);
		const adapter = Adapter(config, LOGGER);
		const args = process.argv.slice(2);

		switch (args[0]) {
			case 'create':
				createMigrationCommand(config, LOGGER, args[1]);
				break;
			case 'migrate':
				migrate(config, adapter).then(onCliSuccess, onCliError);
				break;
			default:
				LOGGER.log('command not found');
		}

		function onCliSuccess() {
			LOGGER.log('done');
			process.exit();
		}

		function onCliError(error) {
			LOGGER.error('ERROR:', error);
			process.exit(1);
		}
	}
};
