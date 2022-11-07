import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { EventDTO, getFoundEventById } from '../../database/events';
import { parseIntFromContextQuery } from '../../utils/contextQuery';

const itemsStyles = css`
  margin: 0 auto;
  padding: 80px;
  display: flex;
  align-items: center;
  width: 100%;
  button {
    margin-top: 5px;
    width: 200px;
  }
`;
type Props =
  | {
      foundEventsss: EventDTO;
    }
  | {
      error: string;
    };
export default function SingleEvent(props: Props) {
  if ('error' in props) {
    return (
      <div>
        <Head>
          <title>Event not found</title>
          <meta name="description" content="event not found" />
        </Head>
        <h1>{props.error}</h1>
        sorry , try <Link href="/index.js">this</Link>
      </div>
    );
  }
  return (
    <div css={itemsStyles}>
      <div>
        <Image
          src="/showcart.jpeg"
          alt="logo of the site"
          width="100px"
          height="100px"
        />
      </div>

      <div>
        <div>
          <div>host:{props.foundEventsss.username}</div>
          <div>event name: {props.foundEventsss.eventName}</div>
          <div>location: {props.foundEventsss.address}</div>
          <div>{props.foundEventsss.free ? 'free' : ''}</div>
          <div>{props.foundEventsss.eventDate.toString()}</div>
          <div>{props.foundEventsss.categoryName}</div>
          <div>followers</div>
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  const eventId = parseIntFromContextQuery(context.query.eventId);
  if (typeof eventId === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'event not found',
      },
    };
  }
  const foundEvent = await getFoundEventById(eventId);
  console.log('show meeee', foundEvent);
  if (typeof foundEvent === 'undefined') {
    return {
      props: {
        error: 'no events found',
      },
    };
  }
  return {
    props: {
      foundEventsss: JSON.parse(JSON.stringify(foundEvent)),
    },
  };
}
