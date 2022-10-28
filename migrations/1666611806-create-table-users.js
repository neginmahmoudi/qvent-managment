exports.up = async (sql) => {
  await sql`CREATE TABLE users(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username varchar(70) NOT NULL UNIQUE,
    password_hash varchar(70) NOT NULL UNIQUE
    -- email varchar(90)
  );
  `;
};

exports.down = async (sql) => {
  await sql`DROP TABLE users
  `;
};
