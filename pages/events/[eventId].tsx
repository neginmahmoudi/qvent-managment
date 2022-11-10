import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Comment, getComments } from '../../database/comments';
import { EventDTO, getFoundEventById } from '../../database/events';
import { getUserBySessionToken, User } from '../../database/users';
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
type UserHier = {
  id: number;
  username: string;
};

type Props = {
  foundEventsss?: EventDTO;
  user?: UserHier;
  databaseComments?: Comment[];
  error?: string;
};

export default function SingleEvent(props: Props) {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

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
        text: newComment,
      }),
    });

    const commentFromApi = (await response.json()) as Comment;
    const newState = [...allComments, commentFromApi];
    setAllComments(newState);
    setNewComment('');
  }
  async function deleteCommentFromApiById(id: number) {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    });
    const deletedComment = (await response.json()) as Comment;

    const filteredComment = allComments.filter((comment) => {
      return comment.id !== deletedComment.id;
    });

    setAllComments(filteredComment);
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
    <div css={itemsStyles}>
      <div>
        <Image
          src={
            props.foundEventsss ? props.foundEventsss.image : 'www.image.com'
          }
          width={200}
          height={200}
          alt="preview"
        />
      </div>

      <div css={divStyles}>
        <div>
          <div>Host:{props.foundEventsss?.username}</div>
          <div>Event Name: {props.foundEventsss?.eventName}</div>
          <div>location: {props.foundEventsss?.address}</div>
          <div>{props.foundEventsss?.free ? 'free' : ''}</div>
          <div>Date: {props.foundEventsss?.eventDate.split('T')[0]}</div>
          <div> Category: {props.foundEventsss?.categoryName}</div>
        </div>
      </div>
      {props.databaseComments?.map((comment) => {
        return (
          <div key={`commentsList-${comment.id}`}>
            {comment.text}
            <button
              onClick={async () => {
                const result = confirm('Want to delete the comment?');
                if (result) {
                  await deleteCommentFromApiById(comment.id);
                }
              }}
            >
              {' '}
              remove
            </button>
          </div>
        );
      })}
      <div>{props.user && props.user.username}</div>
      {props.user ? (
        <>
          <textarea
            value={newComment}
            placeholder="you have questions ?"
            rows={4}
            cols={50}
            onChange={(event) => {
              setNewComment(event.currentTarget.value);
            }}
          ></textarea>
          <button
            onClick={async () => {
              await createCommentFromApi();
            }}
          >
            send
          </button>
        </>
      ) : (
        <div> to leave a commnet please first log in </div>
      )}
    </div>
  );
}
export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  const token = context.req.cookies.sessionToken;
  const user = token && (await getUserBySessionToken(token));
  const databaseComments = await getComments();
  if (!user) {
    return {
      props: {
        error: 'user is not logged in to leave a comment',
      },
    };
  }
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
      databaseComments: databaseComments,
      foundEventsss: JSON.parse(JSON.stringify(foundEvent)),
      user: user,
    },
  };
}
