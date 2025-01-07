import { getSession } from "next-auth/react";
import AdminDashboard from "../../components/AdminDashboard";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { session } };
}

export default function AdminPage({ session }) {
  return <AdminDashboard session={session} />;
}
