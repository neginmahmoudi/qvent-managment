import { FilePerson, ListTask, Question } from '@emotion-icons/bootstrap';
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getUserBySessionToken, User } from '../database/users';

type Props = {
  user?: User;
};
const pageStyles = css`
  display: flex;
  height: 100%;
  font-family: cursive;
  /* background-color: #fefcee; */
`;
const menuStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 180px;
  height: 600px;
  background-color: #37303e;
  border-radius: 5px;
  a {
    text-decoration: none;
    color: white;
    line-height: 50px;
    margin-left: 10px;
  }
`;
const containerStyles = css`
  padding: 100px;
  position: relative;
  width: 100%;
  margin: 0 auto;
`;
const buttonStyles = css`
  border: none;
  font-size: 22px;
  color: white;
  border-radius: 10px;
  width: 200px;
  height: 90px;
  background-color: #c34a36;
  cursor: pointer;
  :hover {
    box-shadow: 3px 3px #b0a8b9;
  }

  a {
    text-decoration: none;
    color: white;
    font-size: 28px;
  }
`;
const imgStyles = css`
  border-radius: 50%;
  padding: 10px;
`;
const iconStyles = css`
  width: 20px;
  height: 20px;
  color: white;
`;
const linkStyles = css`
  margin-top: 40px;
  div {
    margin-top: 3px;
  }
`;
export default function UserProfile(props: Props) {
  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>404 - User not found</h1>
        Better luck next time
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Your Profile | Qvent</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <div css={pageStyles}>
        <div css={menuStyles}>
          <div
            css={css`
              margin-top: 20px;
              background-color: azure;
              border-radius: 40%;
            `}
          >
            {' '}
            <Image
              src={`https://avatars.dicebear.com/api/pixel-art/${props.user.username}.svg`}
              alt="avatar profile picture"
              width="120px"
              height="120px"
              css={imgStyles}
            />
          </div>

          <div css={linkStyles}>
            <div>
              <FilePerson css={iconStyles} />
              <Link href="/private-profile">pv profile</Link>
            </div>
            <div>
              <ListTask css={iconStyles} />
              <Link href="/events/admin">Events info</Link>
            </div>
            <div>
              <Question
                css={css`
                  width: 18px;
                  height: 20px;
                  color: white;
                  border: 1px solid white;
                  margin-right: -2px;
                  border-radius: 50%;
                `}
              />
              <Link href="/"> Questions</Link>
            </div>
          </div>
        </div>
        <div css={containerStyles}>
          <h1>welcome to your account, {props.user.username}!</h1>
          <p>to create events click here !</p>
          <Link href="/events/admin">
            <button css={buttonStyles}>+ Create Event</button>
          </Link>

          <div
            css={css`
              position: absolute;
              right: 15%;
              bottom: 25%;
              opacity: 0.9;
            `}
          >
            <Image
              src="/rainbowi.jpg"
              width={400}
              height={400}
              css={css`
                border-radius: 50%;
              `}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/private-profile',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
}
