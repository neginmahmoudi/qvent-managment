import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';

const flexconstyles = css`
  display: flex;
  background-color: #e2f0ed;
  height: 603.2px;
`;
const containerStyles = css`
  width: 300px;
  height: 400px;
  position: absolute;
  top: 25%;
  left: 40%;

  border: 2px solid black;
  background-color: #a1d6d6;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  -o-border-radius: 10px;
`;
const formStyles = css`
  h3 {
    margin-left: 20px;
  }
  input {
    display: block;
    width: 80%;
    padding: 15px 20px;
    margin: auto;
    margin-top: 5px;
    border: none;
    border-bottom: 2px solid black;
    background-color: #a1d6d6;
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
      box-shadow: 5px 5px red;
      transform: scale(0.9);
    }
  }

  p {
    text-align: center;
  }
  a {
    display: block;
    text-align: center;
    text-decoration: none;
    margin-top: -10px;
    color: darkblue;
  }
`;
export default function Login() {
  return (
    <div css={flexconstyles}>
      <div css={containerStyles}>
        <Head>
          <title>Home | Qvent</title>
          <meta name="description" content="login page of the app" />
        </Head>

        <div css={formStyles}>
          <h3> Your Account </h3>

          <input placeholder="Username" />

          <input placeholder="Password" />

          <input placeholder="Email" />
          <div css={buttonStyles}>
            <button>Submit</button>
            <p> Don't have any account ?</p>
            <Link href="/signup">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
