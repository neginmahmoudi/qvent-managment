import {
  ArrowLeftCircle,
  Info,
  InfoCircle,
  Person,
} from '@emotion-icons/bootstrap';
import { MessageDetail } from '@emotion-icons/boxicons-regular';
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CommentDTO,
  getFoundCommentByEventId,
} from '../../../database/comments';
import { EventDTO, getFoundEventById } from '../../../database/events';
import { getUserBySessionToken } from '../../../database/users';
import { parseIntFromContextQuery } from '../../../utils/contextQuery';

const containerStyles = css`
  display: flex;
`;

const itemsStyles = css`
  display: flex;
  justify-content: flex-start;
  margin-left: 150px;
  padding: 50px;
  align-items: flex-start;
  width: 100%;
  img {
    border-radius: 30px;
  }
`;
const divStyles = css`
  margin-left: 50px;
  background-color: #f3eada;
  width: 350px;
  height: 400px;
  border: 1px solid;
  border-radius: 10px;
  padding: 20px;
  line-height: 40px;
  display: flex;
  overflow: auto;
  flex-direction: column;
  align-items: flex-start;
  font-family: monospace;
  font-size: 16px;
  font-weight: 900;
`;
const cmStyles = css`
  display: flex;
  margin-left: 30px;
  height: 400px;
  overflow: auto;
  gap: 20px;
`;
const replyStyles = css`
  width: 300px;
  height: 80px;
  font-size: 15px;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 10px;
  font-family: 'Times New Roman', Times, serif;
  font-size: 16px;
  border: 1px solid black;
  div {
    background-color: #f3eada;
    border-radius: 30px;
    width: 70px;
    margin-bottom: 8px;
    padding: 3px;
  }
`;
const iconStyles = css`
  width: 18px;
  height: 18px;
  color: grey;
`;
const iconsStyles = css`
  height: 28px;
  width: 28px;
  padding: 5px;
`;
const msgStyles = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: larger;
  padding: 10px;
`;

type UserHere = {
  id: number;
  username: string;
};

type Props = {
  foundEventsss?: EventDTO;
  user?: UserHere | undefined;
  databaseComments?: CommentDTO[];
  error?: string | undefined;
};

export default function SingleEvent(props: Props) {
  const [allComments, setAllComments] = useState<CommentDTO[]>([]);

  async function getCommentsFromApi() {
    if (props.databaseComments) {
      setAllComments(props.databaseComments);
    }
  }

  useEffect(() => {
    getCommentsFromApi().catch((err) => {
      console.log(err);
    });
  }, []);

  if ('error' in props) {
    return (
      <div>
        <Head>
          <title>Event not found</title>
          <meta name="description" content="event not found in profile" />
        </Head>
        <h1>{props.error}</h1>
        sorry , try <Link href="/index.js">this</Link>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Event</title>
        <meta name="description" content="event in profile" />
      </Head>
      <div
        css={css`
          margin-top: 5px;
          margin-left: 5px;
          width: 35px;
          height: 35px;
          cursor: pointer;
        `}
      >
        {' '}
        <Link href="/events/admin">
          <ArrowLeftCircle />
        </Link>
      </div>
      <div css={containerStyles}>
        <div css={itemsStyles}>
          <div>
            <img
              src={
                props.foundEventsss
                  ? props.foundEventsss.image
                  : 'uploaded image'
              }
              width={400}
              height={400}
              alt="preview"
            />
          </div>

          <div css={divStyles}>
            <div>
              <p>
                <InfoCircle css={iconsStyles} />
                details :
              </p>
              <div>Host:{props.foundEventsss?.username}</div>
              <div>Event Name: {props.foundEventsss?.eventName}</div>
              <div>event info: {props.foundEventsss?.description}</div>
              <div>location: {props.foundEventsss?.address}</div>
              <div>{props.foundEventsss?.free ? 'free' : ''}</div>
              <div>Date: {props.foundEventsss?.eventDate.split('T')[0]}</div>
              <div> Category: {props.foundEventsss?.categoryName}</div>
            </div>
          </div>

          <div css={cmStyles}>
            {props.user ? (
              <>
                <div>
                  <div>
                    <MessageDetail css={iconsStyles} /> messages
                  </div>

                  {allComments?.map((comment) => {
                    return (
                      <div key={`commentsList-${comment.id}`}>
                        <div css={replyStyles}>
                          <div>
                            <Person css={iconStyles} />
                            {comment.username}
                          </div>
                          {comment.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div css={msgStyles}>
                <div> no comments </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  const user = token && (await getUserBySessionToken(token));
  const eventId = parseIntFromContextQuery(context.query.eventId);

  if (typeof eventId === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'event not found',
      },
    };
  }

  const foundEvent = await getFoundEventById(Number(eventId));
  if (typeof foundEvent === 'undefined') {
    return {
      props: {
        error: 'no events found',
      },
    };
  }
  const databaseComments =
    eventId && (await getFoundCommentByEventId(Number(eventId)));
  return {
    props: {
      databaseComments: databaseComments ? databaseComments : [],
      foundEventsss: JSON.parse(JSON.stringify(foundEvent)),
      user,
    },
  };
}
