import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';

const containerStyles = css`
  position: relative;
  text-align: center;
  background-color: #666666;
`;
const divStyles = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: fantasy;
  font-size: 80px;
  -webkit-text-stroke: 2px black;
  letter-spacing: 7px;
  font-weight: 100;
  color: #fff;
`;
const imageStyles = css`
  width: 100%;
  opacity: 0.6;
`;
const buttonStyles = css`
  padding: 20px 65px;
  border-radius: 20px;
  border: none;
  margin-bottom: 120px;
  background-color: #404547;
  color: white;
  font-size: 35px;
  letter-spacing: 2px;
  font-weight: 200;
  font-family: fantasy;

  :hover {
    transform: scale(0.9);
    box-shadow: 5px 10px #a5acaf;
  }
`;
export default function Home() {
  return (
    <div css={containerStyles}>
      <Head>
        <title>Home | Qvent</title>
        <meta name="description" content="landing page of the app" />
      </Head>
      <Image
        src="/ilus3.jpeg"
        alt="landing page image"
        width="1530px"
        height="600px"
        css={imageStyles}
      />
      <div css={divStyles}>
        <p> welcome to Qvent ! click to create your Events</p>
        <button
          onClick={() => (location.href = '/events/admin')}
          css={buttonStyles}
        >
          Click!
        </button>
      </div>
    </div>
  );
}
