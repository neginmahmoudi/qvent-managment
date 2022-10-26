// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../database/sessions';
import { getUserWithPasswordHashByUsername } from '../../database/users';

export type LoginResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LoginResponseBody>,
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
    // 2. get the user by the username
    const user = await getUserWithPasswordHashByUsername(request.body.username);

    if (!user) {
      return response
        .status(401)
        .json({ errors: [{ message: 'user not found' }] });
    }

    // 3. check if the hash and the password match
    const session = await createSession(
      user.id,
      crypto.randomBytes(80).toString('base64'),
    );

    const isValidPassword = await bcrypt.compare(
      request.body.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      return response
        .status(401)
        .json({ errors: [{ message: 'password is not valid' }] });
    }
    response.status(200).json({ user: { username: user.username } });
    // 4.Create a session token and serialize a cookie with the token
  } else {
    response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
