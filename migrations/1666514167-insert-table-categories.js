const categories = [
  { category_name: 'outdoor' },
  { category_name: 'party' },
  { category_name: 'performance' },
  { category_name: 'sport' },
];

exports.up = async (sql) => {
  await sql`
   INSERT INTO categories ${sql(categories, 'category_name')}`;
};

exports.down = async (sql) => {
  for (const category of categories) {
    await sql`
    DELETE FROM
     categories
    WHERE
     category_name=${category.category_name}
     `;
  }
};
