// components/AuthButton.js

import { signIn, signOut, useSession } from "next-auth/react";

const AuthButton = () => {
  const { data: session } = useSession();

  const handleSignIn = async () => {
    await signIn("google", {
      callbackUrl: `${process.env.NEXTAUTH_URL}/tasks`,
    });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: process.env.NEXTAUTH_URL });
  };

  return session ? (
    <button onClick={handleSignOut} className="bg-red-500 text-white p-2 rounded">
      Logout
    </button>
  ) : (
    <button onClick={handleSignIn} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
      Sign in with Google
    </button>
  );
};

export default AuthButton;