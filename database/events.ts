import { sql } from './connect';

export type Event = {
  id: number;
  eventName: string;
  description: string;
  address: string;
  eventDate: Date;
  categoryId: number;
  userId: number;
  isFree: boolean;
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

export async function createEvent(
  eventName: string,
  description: string,
  address: string,
  eventDate: Date,
  categoryId: number,
  useryId: number,
  isFree: boolean,
) {
  const [event] = await sql<Event[]>`
    INSERT INTO events
      ( eventName,
       description,
       address,
       eventDate,
       categoryId,
       useryIdr,
       isFree)
    VALUES
      (${eventName}, ${description}, ${address},${eventDate},${categoryId},${useryId},${isFree})
    RETURNING *
  `;
  return event;
}

export async function updateEventById(
  id: number,
  eventName: string,
  description: string,
  address: string,
  eventDate: Date,
  categoryId: number,
  useryId: number,
  isFree: boolean,
) {
  const [event] = await sql<Event[]>`
    UPDATE
      events
    SET
    event_name = ${eventName},
    description = ${description},
    address = ${address},
    event_date=${eventDate},
    category_id=${categoryId},
    user_id=${useryId},
    is_free=${isFree},
    WHERE
      id = ${id}
    RETURNING *
  `;
  return event;
}

export async function deleteEventById(id: number) {
  const [event] = await sql<Event[]>`
    DELETE FROM
      events
    WHERE
      id = ${id}
    RETURNING *
  `;
  return event;
}
