import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Event, getEventById } from '../../database/events';
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
const formStyles = css`
  margin-left: 20px;
  button {
    margin-left: 3px;
    padding: 3px;
    background-color: #323643;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
  }
  input {
    border-radius: 5px;
    padding: 5px;
  }
`;

type Props =
  | {
      foundEvent: Event[];
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
        <h1>Name:</h1>
        <Image
          src="/showcart.jpeg"
          alt="logo of the site"
          width="100px"
          height="100px"
        />
      </div>

      <div css={formStyles}>
        <div>price </div>
        <div>Available: </div>
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
  const foundEvent = await getEventById(eventId);

  if (typeof foundEvent === 'undefined') {
    return {
      props: {
        error: 'no Items found',
      },
    };
  }
  return {
    props: { foundEvent: JSON.parse(JSON.stringify(foundEvent)) },
  };
}
