import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

const flexconstyles = css`
  display: flex;
  height: 603.2px;
  position: relative;
  text-align: center;
  background-color: #fff;
`;

const containerStyles = css`
  width: 300px;
  height: 400px;
  position: absolute;
  top: 25%;
  left: 40%;
  border: 1px solid black;
  background-color: #fcfcf5;

  border-radius: 15px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  -o-border-radius: 10px;
`;
const formStyles = css`
  h3 {
    font-family: cursive;
    margin-left: 20px;
  }
  input {
    display: block;
    width: 80%;
    padding: 15px 20px;
    margin: auto;
    margin-top: 5px;
    border: none;
    border-radius: 10px;
    border-bottom: 2px solid black;

    :hover {
      transform: scale(0.9);
    }
  }
`;
const buttonStyles = css`
  button {
    display: block;
    width: 220px;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: auto;
    border: none;
    border-radius: 10px;
    margin-top: 20px;
    background-color: #f3a267;

    :hover {
      cursor: pointer;
      box-shadow: 5px 5px grey;
      transform: scale(0.9);
    }
  }

  p {
    text-align: center;
    font-family: cursive;
  }
  a {
    display: block;
    font-family: cursive;
    text-align: center;
    text-decoration: none;
    color: blue;
    margin-top: -10px;
  }
`;

// type Props = {
//   refreshUserProfile: () => Promise<void>;
// };

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();
  // const [email, setEmail] = useState('');
  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLowerCase(),
        password,
      }),
    });

    const registerResponseBody =
      (await registerResponse.json()) as RegisterResponseBody;
    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
      return console.log(registerResponseBody.errors);
    }

    const returnTo = router.query.returnTo;
    if (
      returnTo &&
      !Array.isArray(returnTo) && // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      return await router.push(returnTo);
    }
  }
  return (
    <div css={flexconstyles}>
      <Image
        src="/signUp.jpeg"
        alt="funny illustration of queer group"
        width="700px"
        height="250px"
      />
      <div css={containerStyles}>
        <Head>
          <title>Sign Up | Qvent</title>
          <meta name="description" content="login page of the app" />
        </Head>

        <div css={formStyles}>
          <h3> Create Your Account </h3>
          {errors.map((error) => {
            return (
              <p
                css={css`
                  background-color: red;
                  color: white;
                  padding: 5px;
                `}
                key={error.message}
              >
                ERROR: {error.message}
              </p>
            );
          })}
          {/* <input
            value={email}
            onChange={(event) => {
              setEmail(event.currentTarget.value);
            }}
            placeholder="Email"
          /> */}
          <input
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value.toLowerCase());
            }}
            placeholder="Username"
          />
          <input
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
            placeholder="Password"
          />
          <div css={buttonStyles}>
            <button
              onClick={async () => {
                await registerHandler();
              }}
            >
              Sign Up
            </button>
            <p>Already a user ?</p>
            <Link href="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  return {
    props: {},
  };
}
