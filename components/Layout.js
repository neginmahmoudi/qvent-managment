import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
  return (
    <>
      <Head>
        <title>Qvent</title>
        <meta name="description" content="Queer event managment" />
        <link rel="icon" href="favicon-16.jpeg" />
      </Head>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </>
  );
}
