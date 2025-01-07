import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OtpComponent from "../components/OtpComponent";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/tasks");
    }
  }, [session, router]);

  if (session) {
    return <div className="text-center text-lg font-semibold text-gray-300">Redirecting to tasks...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 space-y-6 p-6">
      <div className="max-w-md w-full bg-gray-800 p-8 shadow-lg rounded-lg border border-gray-700">
        <h1 className="text-3xl font-semibold text-center mb-6 text-teal-400">
          Welcome to TaskMate
        </h1>
        <p className="text-center text-gray-300 mb-4">
          Organize and manage your tasks with ease. Sign in now!
        </p>

        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg mb-4"
        >
          <span className="mr-2">🔒</span> Sign in with Google
        </button>

        <OtpComponent />
      </div>
    </div>
  );
}
