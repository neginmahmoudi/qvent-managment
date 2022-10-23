import {
  FacebookWithCircle,
  InstagramWithCircle,
  TwitterWithCircle,
} from '@emotion-icons/entypo-social';
import { css } from '@emotion/react';
import Link from 'next/link';

const footerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #6d6d6e;
`;
const itemSocialStyles = css`
  display: flex;
  gap: 10px;
  width: 130px;
  height: 60px;

  opacity: 0.75;
  :hover {
    opacity: 0.9;
  }
`;

const copyrightStyles = css`
  font-size: 13px;
  opacity: 0.6;
`;
export default function Footer() {
  return (
    <footer css={footerStyles}>
      <div css={itemSocialStyles}>
        <Link href="/">
          <InstagramWithCircle />
        </Link>
        <Link href="/">
          <TwitterWithCircle />
        </Link>
        <Link href="/">
          <FacebookWithCircle />
        </Link>
      </div>

      <p css={copyrightStyles}>Qvent Management App © 2022</p>
    </footer>
  );
}
