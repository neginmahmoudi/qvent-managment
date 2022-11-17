import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteEventById,
  getEventByIdAndValidSessionToken,
  updateEventById,
} from '../../../database/events';
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

  const eventId = Number(request.query.id);
  if (!eventId) {
    return response.status(404).json({ message: 'Not a valid id' });
  }

  if (request.method === 'GET') {
    const event = await getEventByIdAndValidSessionToken(
      eventId,
      request.cookies.sessionToken,
    );

    // check if the event exist
    if (!event) {
      return response
        .status(404)
        .json({ message: 'Not a valid Id or a valid session token' });
    }
    return response.status(200).json(event);
  }

  if (request.method === 'PUT') {
    // NOT getting the id from the body since is already on the query
    const eventName = request.body?.eventName;
    const image = request.body?.image;
    const description = request.body?.description;
    const address = request.body?.address;
    const eventDate = request.body?.eventDate;
    const categoryId = request.body?.categoryId;
    const eventId = request.body?.eventId;
    const free = request.body?.free;
    console.log('types:', typeof eventId, typeof categoryId);
    // Check all the information to create events
    if (
      !(
        eventName ||
        image ||
        description ||
        address ||
        eventDate ||
        categoryId ||
        eventId ||
        free
      )
    ) {
      return response.status(400).json({ message: 'property is missing' });
    }

    // Create the eventusing the database util function

    const newEvent = await updateEventById(
      eventId,
      image,
      eventName,
      description,
      address,
      eventDate,
      categoryId,
      free,
    );

    if (!newEvent) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    // response with the new created event
    return response.status(200).json(newEvent);
  }

  if (request.method === 'DELETE') {
    const deletedEvent = await deleteEventById(eventId);

    if (!deletedEvent) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json(deletedEvent);
  }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
