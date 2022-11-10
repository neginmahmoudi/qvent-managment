import { sql } from './connect';

export type Comment = {
  id: number;
  userId: number;
  eventId: number;
  text: string;
};

export async function getComments() {
  const comments = await sql<Comment[]>`
SELECT * FROM comments;
`;
  return comments;
}
export async function getCommentById(id: number) {
  const [comment] = await sql<Comment[]>`
  SELECT * FROM comments WHERE id=${id}`;

  return comment;
}
export async function createComment(
  text: string,
  eventId: number,
  userId: number,
) {
  const [comment] = await sql<Comment[]>`
    INSERT INTO comments
      ( text,
       event_id,
       user_id,
       )
    VALUES
      (${text},${eventId},${userId})
    RETURNING *
  `;
  return comment;
}
export async function getCommentByIdAndValidSessionToken(
  id: number,
  token: string | undefined,
) {
  if (!token) return undefined;
  const [comment] = await sql<Comment[]>`
    SELECT
      comments.*
    FROM
      comments,
      sessions
    WHERE
      sessions.token = ${token}
    AND
      sessions.expiry_timestamp > now()
    AND
      comments.id = ${id}
  `;
  return comment;
}
export async function deleteCommentById(id: number) {
  const [comment] = await sql<Comment[]>`
    DELETE FROM
      comments
    WHERE
      id = ${id}
    RETURNING *
  `;
  return comment;
}
