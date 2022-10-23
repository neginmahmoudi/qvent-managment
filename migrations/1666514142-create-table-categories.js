exports.up = async (sql) => {
  await sql`CREATE TABLE categories(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name varchar(30) NOT NULL
  );`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE categories`;
};
