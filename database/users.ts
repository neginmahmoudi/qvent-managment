import { sql } from './connect';

export type User = {
  id: number;
  firstName: string;
  password: string;
  email: string;
};

export async function getUser() {
  const users = await sql<User[]>`
SELECT * FROM users;
`;
  return users;
}
export async function getUserById(id: number) {
  const [user] = await sql<User[]>`
  SELECT * FROM users WHERE id=${id}`;

  return user;
}
