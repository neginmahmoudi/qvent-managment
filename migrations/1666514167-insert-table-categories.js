const categories = ['outdoor', 'party', 'performance', 'sport'];

exports.up = async (sql) => {
  await sql`INSERT INTO categories ${sql(categories, 'first_name')}`;
};

exports.down = async (sql) => {
  for (const category of categories) {
    await sql`
    DELETE FROM
    categories
    WHERE
    first_name=${category.first_name}`;
  }
};
