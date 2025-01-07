import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        // Here you can add your own logic to find the user and validate the credentials
        // For example, you can use the email to find the user in your database
        const user = { id: 1, name: "User", email: credentials.email };
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  adminEmails: ['pushtisonawala786@gmail.com'], // Verify this is your exact email
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = authOptions.adminEmails.includes(user.email) ? 'admin' : 'user';
        console.log('User role set to:', token.role); // Add this for debugging
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl, token }) {
      if (url.startsWith(baseUrl)) {
        if (token?.role === 'admin') {
          return `${baseUrl}/admin`;
        }
        return `${baseUrl}/tasks`;
      }
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);


