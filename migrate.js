const path = require('path');

require('./').run({
	migrationsDir: path.resolve(process.cwd(), 'migrations'),
	adapter: 'pg',
	user: 'postgres',
	host: 'localhost',
	db: 'app',
	password: 'example',
	port: 5432
});
