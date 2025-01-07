import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AdminDashboard from "../components/AdminDashboard";
import Navigation from "../components/Navigation";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: { session } };
}

export default function Admin() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session || session.user.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">👑 Welcome, Admin {session.user.name}!</h1>
        <p className="text-lg opacity-90">You have full administrative access to the system.</p>
        <p className="text-sm opacity-75 mt-2">Logged in as: {session.user.email}</p>
      </div>
      <AdminDashboard />
    </div>
  );
}
