import { getSession, useSession } from "next-auth/react";
import TaskManager from "../components/TaskManager";
import { useRouter } from "next/router";
import { useEffect } from "react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/", // Redirect to login page
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default function Tasks() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to login if unauthenticated
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session?.user.name}!</h1>
      <TaskManager />
    </div>
  );
}
