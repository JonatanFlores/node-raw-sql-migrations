node-raw-migrations
===================

raw SQL migrations library for Node.js

### Example

In your project
```js
// migrate.js
const path = require('path');

require('sql-migrations').run({
  // configuration here. See the Configuration section
});
```

### CLI
run `node ./migrate.js` with arguments

---

#### `node ./migrate create migration_name`
will create a migration file
```
./migrations/1415860098827_migration_name.sql
```

---

#### `node ./migrate migrate`
will run all pending migrations

### Programmatic API
#### Migrate
In your project
```js
require('sql-migrations').migrate({
  // configuration here. See the Configuration section
});
```
This returns a promise which resolves/rejects whenever the migration is complete.

### Configuration
Configuration should be specified as below:
```js
const configuration = {
  migrationsDir: path.resolve(__dirname, 'migrations'), // This is the directory that should contain your SQL migrations.
  host: 'localhost', // Database host
  port: 5432, // Database port
  db: 'sql_migrations', // Database name
  user: 'postgres', // Database username
  password: 'example', // Database password
  adapter: 'pg', // Database adapter: pg, mysql
  // Parameters are optional. If you provide them then any occurrences of the parameter (i.e. FOO) in the SQL scripts will be replaced by the value (i.e. bar).
  parameters: {
      "FOO": "bar"
  },
  minMigrationTime: new Date('2018-01-01').getTime() // Optional. Skip migrations before this before this time.
};
```

You can also swap out the default logger (the `console` object) for another one that supports the log and error methods. You should do this before running any other commands:
```js
require('sql-migrations').setLogger({
  log: function() {},
  error: function() {}
});
```
### Migration files
Write raw sql in your migrations. You can also include placeholders which will be substituted.
example
```sql
-- ./migrations/1415860098827_migration_name.sql
create table "test_table" (id bigint, name varchar(255));
