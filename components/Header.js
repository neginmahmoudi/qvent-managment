import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <div>
        <div>
          <Image src="" alt="logo of the site" width="80px" height="80px" />
        </div>
        <div>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/about">Events</Link>
            <Link href="/product">Login</Link>
            <Link href="/checkout">Sign up</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
