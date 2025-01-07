import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';
import Navigation from '../components/Navigation';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Navigation />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
