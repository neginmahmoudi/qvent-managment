exports.up = async (sql) => {
  await sql`CREATE TABLE followers(
     id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer REFERENCES users(id),
  event_id integer REFERENCES events(id)
  );`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE followers`;
};
