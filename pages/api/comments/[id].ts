import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteCommentById,
  getCommentByIdAndValidSessionToken,
} from '../../../database/comments';
import { getValidSessionByToken } from '../../../database/sessions';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session =
    request.cookies.sessionToken &&
    (await getValidSessionByToken(request.cookies.sessionToken));

  if (!session) {
    response
      .status(400)
      .json({ errors: [{ message: 'No valid session token passed' }] });
    return;
  }

  const commentId = Number(request.query.id);
  if (!commentId) {
    return response.status(404).json({ message: 'Not a valid id' });
  }

  if (request.method === 'GET') {
    const comment = await getCommentByIdAndValidSessionToken(
      commentId,
      request.cookies.sessionToken,
    );

    // check if the comment exist
    if (!comment) {
      return response
        .status(404)
        .json({ message: 'Not a valid Id or a valid session token' });
    }
    return response.status(200).json(comment);
  }

  if (request.method === 'DELETE') {
    const deletedComment = await deleteCommentById(commentId);

    if (!deletedComment) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json(deletedComment);
  }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
