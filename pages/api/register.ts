// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUserByUsername } from '../../database/users';

export type RegisterResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<RegisterResponseBody>,
) {
  if (request.method === 'POST') {
    // 1. make sure the data exist
    if (
      typeof request.body.username !== 'string' ||
      typeof request.body.password !== 'string' ||
      !request.body.username ||
      !request.body.password
    ) {
      return response
        .status(400)
        .json({ errors: [{ message: 'username or password not provided' }] });
    }
    // 2.we check if the user already exist
    const user = await getUserByUsername(request.body.username);

    if (user) {
      return response
        .status(401)
        .json({ errors: [{ message: 'username is already taken' }] });
    }

    // 3. we hash the password
    const passwordHash = await bcrypt.hash(request.body.password, 12);

    // 4. sql query to create the record
    const userWithoutPassword = await createUser(
      request.body.username,
      passwordHash,
    );
    response
      .status(200)
      .json({ user: { username: userWithoutPassword.username } });
    // 4.Create a session token and serialize a cookie with the token
  } else {
    response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
