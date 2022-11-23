exports.up = async (sql) => {
  await sql`CREATE TABLE comments(
   id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer REFERENCES users(id),
  event_id integer REFERENCES events(id) ON DELETE CASCADE,
  text varchar(400)
  );`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE comments`;
};
