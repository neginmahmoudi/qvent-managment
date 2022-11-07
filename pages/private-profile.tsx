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
  font-family: cursive;
`;
const menuStyles = css`
  width: 160px;
  height: 600px;
  background-color: orange;
  border-radius: 10px;

  img {
    padding: 10px;
    border-radius: 50%;
    margin-top: 30px;
    margin-left: 40px;
  }
  a {
    text-decoration: none;
    color: black;
    line-height: 50px;
    margin-left: 30px;
  }
`;
const containerStyles = css`
  margin-left: 200px;
  margin-top: 100px;
`;
const buttonStyles = css`
  border: none;
  border-radius: 10px;
  width: 300px;
  height: 100px;
  background-color: pink;

  a {
    text-decoration: none;
    color: black;
    font-size: 28px;
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
          <Image
            src="/avatar.jpg"
            alt="avatar profile picture"
            width="150px"
            height="150px"
          />
          <br />
          <br />
          <br />
          <Link href="/pages/private-profile">Home</Link>
          <br />
          <Link href="/pages/private-profile">profile</Link>
          <br />
          <Link href="/events/admin">Events</Link>
        </div>
        <div css={containerStyles}>
          <h1>welcome back, {props.user.username}!</h1>
          <p>to create events click here !</p>
          <button css={buttonStyles}>
            <Link href="/events/admin"> + Create Event</Link>
          </button>
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
