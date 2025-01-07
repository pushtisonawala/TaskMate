// pages/dashboard.js

import { getSession, useSession } from "next-auth/react";
import TaskManager from "../components/TaskManager";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { session } };
}

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome, {session.user.name}!</h1>
      <p className="mt-2">Your email: {session.user.email}</p>
      <TaskManager />
    </div>
  );
}