import { LogOut, UserCircle } from '@emotion-icons/boxicons-regular';
import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';

const containerStyles = css`
  width: 100%;
  min-height: 80px;
  display: flex;
  flex-wrap: wrap;
  gap: 200px;
  justify-content: space-between;
  background-color: #fcfcf5;
  margin-bottom: auto;
`;
const navContainerStyles = css`
  display: flex;
  /* div {
    color: #fff;
    margin-left: 15px;
    padding: 5px;
    background-color: #a32495;
    border-radius: 50%;
  } */
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
    cursor: pointer;
    color: #272343;
    text-align: center;
    padding: 12px 10px;
    text-decoration: none;
  }
  a:hover {
    color: #a32495;
    border-bottom: 1px solid #a32495;
    transition: width 1s;
  }
`;
const iContainerStyles = css`
  margin-right: 40px;
  margin-left: 20px;
  padding: 4px;
`;
const iconStyles = css`
  width: 20px;
  height: 20px;
  color: black;
  margin-right: 5px;
`;

function Anchor({ children, ...restProps }) {
  // using a instead of Link since we want to force a full refresh
  return <a {...restProps}>{children}</a>;
}

export default function Header(props) {
  return (
    <header>
      <div css={containerStyles}>
        <Link href="/">
          <Image
            src="/Qvent.jpg"
            alt="logo of the site"
            width="80px"
            height="80px"
          />
        </Link>
        <div css={navContainerStyles}>
          <nav css={navStyles}>
            <Link href="/">Home</Link>
            <Link href="/events">Events</Link>
            {props.user && (
              <a href="/private-profile">
                <UserCircle css={iconStyles} />
                {props.user.username}
              </a>
            )}
            {props.user ? (
              <div css={iContainerStyles}>
                <Anchor href="/logout">
                  <LogOut css={iconStyles} />
                </Anchor>
              </div>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
