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
export type EventDTO = {
  id: number;
  eventName: string;
  description: string;
  address: string;
  eventDate: Date;
  categoryId: number;
  categoryName: string;
  userId: number;
  username: string;
  free: boolean;
};

export async function getEvent() {
  const events = await sql<Event[]>`
  SELECT * FROM events inner join categories on events.category_id=categories.id;
`;
  return events;
}

export async function getEventsWithJoint() {
  const events = await sql<EventDTO[]>`
  SELECT events.id, events.event_name, events.description, events.address, events.event_date, events.category_id, events.user_id, events.free, categories.category_name, users.username
FROM events inner join categories on events.category_id=categories.id inner join users on events.user_id =users.id
order by  events.event_date desc;
`;
  return events;
}
// for category on the events page
export async function getEventsWithJointByCategoryId(id: number) {
  const events = await sql<EventDTO[]>`
SELECT events.id, events.event_name, events.description, events.address, events.event_date, events.category_id, events.user_id, events.free, categories.category_name, users.username
FROM events inner join categories on events.category_id=categories.id inner join users on events.user_id =users.id
WHERE events.category_id=${id};
`;
  return events;
}

export async function getEventById(id: number) {
  const [event] = await sql<Event[]>`
  SELECT * FROM events WHERE id=${id}`;

  return event;
}

export async function getEventByLogedInUser(id: number) {
  const events = await sql<Event[]>`

  SELECT * FROM events where user_id=${id};
`;
  return events;
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
// just to try do not push
export async function getFoundEventById(id: number) {
  const [event] = await sql<EventDTO[]>`
    SELECT events.id, events.event_name, events.description, events.address, events.event_date, events.category_id, events.user_id, events.free, categories.category_name, users.username
FROM events inner join categories on events.category_id=categories.id inner join users on events.user_id =users.id
WHERE events.id=${id};
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
  isFree: boolean,
) {
  console.log('editEvent', id);
  // const strsql = `UPDATE events SET event_name = '${eventName}', description = '${description}', address = '${address}', category_id=${categoryId}, free=${isFree} WHERE id = ${id} RETURNING * `;

  const [event] = await sql<Event[]>`
    UPDATE
      events
    SET
    event_name = ${eventName},
    description = ${description},
    address = ${address},
    category_id=${categoryId},
    free=${isFree}
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
