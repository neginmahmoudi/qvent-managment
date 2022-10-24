exports.up = async (sql) => {
  await sql`CREATE TABLE users(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_name varchar(30) NOT NULL,
    pass_hash varchar(100) NOT NULL UNIQUE
  );
  `;
};

exports.down = async (sql) => {
  await sql`DROP TABLE users`;
};
