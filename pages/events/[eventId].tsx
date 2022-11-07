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
  background-color: #daf3f1;
  align-items: center;

  width: 100%;
  img {
    border-radius: 10px;
  }
`;
const divStyles = css`
  margin-left: 50px;
  background-color: #dae5c0;
  width: 300px;

  border-radius: 10px;
  padding: 20px;
  line-height: 30px;
  display: flex;
  flex-direction: column;
  font-family: monospace;
  font-weight: 800;
  button {
    margin-left: 25px;
    width: 200px;
    border: none;
    background-color: green;
    padding: 10px;
    font-family: monospace;
    border-radius: 10px;
    color: white;
    font-size: larger;
    margin-top: 20px;
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
          width="300px"
          height="300px"
        />
      </div>

      <div css={divStyles}>
        <div>
          <div>Host:{props.foundEventsss.username}</div>
          <div>Event Name: {props.foundEventsss.eventName}</div>
          <div>location: {props.foundEventsss.address}</div>
          <div>{props.foundEventsss.free ? 'free' : ''}</div>
          <div>Date: {props.foundEventsss.eventDate.toString()}</div>
          <div> Category: {props.foundEventsss.categoryName}</div>
          <div>followers</div>
        </div>
        <div>
          <button>+ Follow</button>
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
