import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';

const containerStyles = css`
  width: 100%;
  min-height: 80px;
  display: flex;
  flex-wrap: wrap;
  gap: 200px;
  justify-content: space-around;
  background-color: #fcfcf5;
  margin-bottom: auto;
`;
const navContainerStyles = css`
  display: flex;
  div {
    color: #dfd3c3;
  }
`;
const navStyles = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  a {
    margin-left: 30px;
    text-decoration: none;
    color: #272343;
    text-align: center;
    padding: 12px 10px;
    text-decoration: none;
  }
  a:hover {
    color: blueviolet;
    border-bottom: 1px solid #91915d;
    transition: width 1s;
  }
`;

export default function Header() {
  return (
    <header>
      <div css={containerStyles}>
        <div>
          <Image
            src="/Qvent.jpg"
            alt="logo of the site"
            width="80px"
            height="80px"
          />
        </div>
        <div css={navContainerStyles}>
          <nav css={navStyles}>
            <Link href="/">Home</Link>
            <Link href="/Events">Events</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Sign up</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
