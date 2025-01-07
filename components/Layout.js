// components/Layout.js
import AuthButton from "./AuthButton";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">NextAuth Demo</h1>
        <AuthButton />
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}