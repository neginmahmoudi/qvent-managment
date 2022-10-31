import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getUserByUsername, User } from '../../database/users';

const containerStyles = css`
  width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    padding: 10px;
    background-color: blue;
    color: white;
    text-align: center;
  }
`;
const imgStyles = css`
  border-radius: 50%;
`;

type Props = {
  user?: User;
};

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
        <title>Host's Profile</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <div css={containerStyles}>
        <h1>Your favorite event's host</h1>

        <div>
          <Image
            src="/avatar.jpg"
            alt="avatar image of user"
            width="200px"
            height="200px"
            css={imgStyles}
          />
          <p>username: {props.user.username}</p>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Retrieve the username from the URL
  const username = context.query.username as string;

  const user = await getUserByUsername(username.toLowerCase());

  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  return {
    props: { user },
  };
}
