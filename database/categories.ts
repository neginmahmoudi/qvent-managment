import { sql } from './connect';

export type Category = {
  id: number;
  firstName: string;
};

export async function getCategories() {
  const categories = await sql<Category[]>`
SELECT * FROM categories;
`;
  return categories;
}
export async function getCategoriesById(id: number) {
  const [category] = await sql<Category[]>`
  SELECT * FROM categories WHERE id=${id}`;

  return category;
}
