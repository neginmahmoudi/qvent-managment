import { sql } from './connect';

export type Follower = {
  id: number;
  userId: number;
  eventId: number;
};

export async function getEvent() {
  const followers = await sql<Follower[]>`
SELECT * FROM pageItems;
`;
  return followers;
}
export async function getEventById(id: number) {
  const [follower] = await sql<Follower[]>`
  SELECT * FROM followers WHERE id=${id}`;

  return follower;
}
