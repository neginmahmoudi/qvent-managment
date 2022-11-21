import { Person } from '@emotion-icons/bootstrap';
import { Send } from '@emotion-icons/fluentui-system-regular';
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CommentDTO, getFoundCommentByEventId } from '../../database/comments';
import { EventDTO, getFoundEventById } from '../../database/events';
import { getUserBySessionToken, getUsernameById } from '../../database/users';
import { parseIntFromContextQuery } from '../../utils/contextQuery';

const containerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const itemsStyles = css`
  margin-left: 180px;
  padding: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  img {
    border-radius: 10px;
  }
`;
const divStyles = css`
  margin-left: 50px;
  width: 350px;
  height: 300px;
  border-radius: 10px;
  padding: 20px;
  line-height: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: monospace;
  font-size: 16px;
  font-weight: 900;
`;
const cmStyles = css`
  border-top: 2px solid black;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  textarea {
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #cfd1db;
    border-radius: 18px;
  }
  button {
    margin-left: 10px;
    :hover {
      cursor: pointer;
      box-shadow: -2px 2px gray;
    }
  }
`;
const replyStyles = css`
  width: 408px;
  height: 70px;
  font-size: 15px;
  margin-top: 7px;
  padding: 10px;
  border-bottom: 1px solid black;
  font-family: 'Times New Roman', Times, serif;
  background-color: white;
`;
const profileStyles = css`
  background-color: #f3eada;
  border-radius: 30px;
  width: 70px;
  margin-bottom: 5px;
  padding: 3px;
`;
const iconStyles = css`
  width: 18px;
  height: 18px;
  color: grey;
`;
const btnStyles = css`
  width: 30px;
  height: 30px;
  margin-top: 60px;
  background-color: #0ba40b;
  color: antiquewhite;
  border-radius: 10px;
  border: none;
`;
const icon2Styles = css`
  width: 18px;
  height: 18px;
`;
const msgStyles = css`
  display: flex;
  color: #a32495;
  flex-direction: column;
  align-items: center;
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
  user?: UserHere;
  databaseComments?: CommentDTO[];
  error?: string;
};

export default function SingleEvent(props: Props) {
  const [allComments, setAllComments] = useState<CommentDTO[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  async function getCommentsFromApi() {
    if (props.databaseComments) {
      setAllComments(props.databaseComments);
    }
  }
  async function createCommentFromApi() {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.user?.id.toString(),
        eventId: props.foundEventsss?.id,
        text: newCommentText,
      }),
    });

    const commentFromApi = (await response.json()) as CommentDTO;
    const newState = [
      ...allComments,
      { ...commentFromApi, username: props.user?.username },
    ];
    setAllComments(newState);
    setNewCommentText('');
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
          <meta name="description" content="event not found" />
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
        <meta name="description" content="event for general user" />
      </Head>
      <div css={containerStyles}>
        <div css={itemsStyles}>
          <div>
            <img
              src={
                props.foundEventsss
                  ? props.foundEventsss.image
                  : 'uploaded image'
              }
              width={350}
              height={350}
              alt="preview"
            />
          </div>

          <div css={divStyles}>
            <div>
              <div>Host:{props.foundEventsss?.username}</div>
              <div>Event Name: {props.foundEventsss?.eventName}</div>
              <div>location: {props.foundEventsss?.address}</div>
              <div> {props.foundEventsss?.free ? 'free' : ''}</div>
              <div>Date: {props.foundEventsss?.eventDate.split('T')[0]}</div>
              <div> Category: {props.foundEventsss?.categoryName}</div>
            </div>
          </div>
        </div>
        <p>Ask your questions here !</p>
        <div css={cmStyles}>
          {props.user ? (
            <>
              <div
                css={css`
                  display: flex;
                `}
              >
                {' '}
                <textarea
                  required={true}
                  value={newCommentText}
                  placeholder=" You have questions ?
              ask me !"
                  rows={5}
                  cols={50}
                  onChange={(event) => {
                    setNewCommentText(event.currentTarget.value);
                  }}
                ></textarea>
                <div>
                  <button
                    css={btnStyles}
                    onClick={async () => {
                      await createCommentFromApi();
                    }}
                  >
                    <Send css={icon2Styles} />
                  </button>
                </div>
              </div>
              <div>
                {allComments?.map((comment) => {
                  return (
                    <div key={`commentsList-${comment.id}`}>
                      <div css={replyStyles}>
                        <div css={profileStyles}>
                          <Person css={iconStyles} />
                          {comment.username}:
                        </div>
                        <div> {comment.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div css={msgStyles}>
              <div> to leave a commnet please first log in </div>
              <Link href="/login">Login</Link>
            </div>
          )}
        </div>
        <br />
        <br />
        <br />
        <br />
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
      user: user ? user : null,
    },
  };
}
