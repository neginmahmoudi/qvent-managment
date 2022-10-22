import { sql } from './connect';

export type Event = {
  id: number;
  firstName: string;
  description: string;
  address: string;
  eventDate: Date;
  categoryId: number;
  userId: number;
};

export async function getEvent() {
  const events = await sql<Event[]>`
SELECT * FROM events;
`;
  return events;
}
export async function getEventById(id: number) {
  const [event] = await sql<Event[]>`
  SELECT * FROM events WHERE id=${id}`;

  return event;
}
