import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

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
export default function Login() {
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

          <input placeholder="Username" />
          <input placeholder="Password" />
          <br />
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
