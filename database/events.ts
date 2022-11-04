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

// Get a single event by id and valid session token
export async function getEventByIdAndValidSessionToken(
  id: number,
  token: string | undefined,
) {
  if (!token) return undefined;
  const [event] = await sql<Event[]>`
    SELECT
      events.*
    FROM
      events,
      sessions
    WHERE
      sessions.token = ${token}
    AND
      sessions.expiry_timestamp > now()
    AND
      events.id = ${id}
  `;
  return event;
}

export async function createEvent(
  eventName: string,
  description: string,
  address: string,
  eventDate: Date,
  categoryId: number,
  userId: number,
  isFree: boolean,
) {
  const [event] = await sql<Event[]>`
    INSERT INTO events
      ( event_name,
       description,
       address,
       event_date,
       category_id,
       user_id,
       free)
    VALUES
      (${eventName}, ${description}, ${address},${eventDate},${categoryId},${userId},${isFree})
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
