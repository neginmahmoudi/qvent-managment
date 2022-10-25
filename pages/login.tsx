import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';

const flexconstyles = css`
  display: flex;
  background-color: #fff;
  height: 603.2px;
`;
const imgStyles = css`
  position: relative;
  left: 55%;
`;
const containerStyles = css`
  width: 300px;
  height: 400px;
  position: absolute;
  top: 25%;
  left: 40%;
  border: 2px solid black;
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
    border-bottom: 1px solid black;
    border-radius: 10px;
    background-color: #fff;
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
    margin-top: 30px;
  }
  a {
    display: block;
    font-family: cursive;
    text-align: center;
    text-decoration: none;
    color: darkblue;
    margin-top: -6px;
  }
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      // we use post bc we are creating a new session
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLowerCase(),
        password,
      }),
    });

    const loginResponseBody = (await loginResponse.json()) as LoginResponseBody;
    console.log(loginResponseBody);
    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return console.log(loginResponseBody.errors);
    }

    console.log(router.query.returnTo);

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) && // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      // refresh the user on state
      await props.refreshUserProfile();
      return await router.push(returnTo);
    }

    // refresh the user on state
    await props.refreshUserProfile();
    // redirect user to user profile
    await router.push(`/private-profile`);
  }

  return (
    <div css={flexconstyles}>
      <div css={imgStyles}>
        <Image
          src="/avatar2.jpg"
          alt="logo of the site"
          width="600px"
          height="400px"
        />
      </div>
      <div css={containerStyles}>
        <Head>
          <title>Login | Qvent</title>
          <meta name="description" content="login page of the app" />
        </Head>

        <div css={formStyles}>
          <h3> Your Account </h3>
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
          <input
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
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
          <br />
          <div css={buttonStyles}>
            <button
              onClick={async () => {
                await loginHandler();
              }}
            >
              Submit
            </button>
            <p> Don't have any account ?</p>
            <Link href="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
