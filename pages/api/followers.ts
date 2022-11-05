import { NextApiRequest, NextApiResponse } from 'next';
import { createEvent, getEvent } from '../../../database/events';
import { getValidSessionByToken } from '../../../database/sessions';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  console.log('session is passed', request.cookies.sessionToken);

  const session =
    request.cookies.sessionToken &&
    (await getValidSessionByToken(request.cookies.sessionToken));

  if (!session) {
    response
      .status(400)
      .json({ errors: [{ message: 'No valid session token passed' }] });
    return;
  }
  if (request.method === 'GET') {
    const events = await getEvent();
    return response.status(200).json(events);
  }

  if (request.method === 'POST') {
    console.log(request.body);
    const eventName = request.body?.eventName;
    const description = request.body?.description;
    const address = request.body?.address;
    const eventDate = request.body?.eventDate;
    const categoryId = request.body?.categoryId;
    const userId = request.body?.userId;
    const isFree = request.body?.isFree;
    console.log('isfree', isFree);
    if (
      !(
        eventName &&
        description &&
        address &&
        eventDate &&
        categoryId &&
        userId
      )
    ) {
      return response
        .status(400)
        .json({ message: 'one of the properties of the form is missing' });
    }
    // create a new event using the database util function
    console.log(eventName);
    const newEvent = await createEvent(
      eventName,
      description,
      address,
      eventDate,
      categoryId,
      userId,
      isFree,
    );
    console.log(newEvent);
    return response.status(200).json(newEvent);
  }

  return response.status(400).json({ message: 'Method not allowed' });
}
