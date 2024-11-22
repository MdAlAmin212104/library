import { connect } from "@/app/lib/ConnectDB";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; // Import bcryptjs for hashing passwords

// // Define the User type based on your schema
// interface User {
//   _id: string;
//   roll: string;
//   hashedPassword: string;
//   name: string;
//   // Add any other fields from your user schema
// }

const handler = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        roll: {},
        password: {},
      },
      async authorize(credentials: { roll: string; password: string } | null) {
        // Check if credentials exist
        if (!credentials) return null;

        const { roll, password } = credentials;

        // If roll or password is missing, return null
        if (!roll || !password) return null;

          const db = await connect(); // Make sure connect is typed correctly
          const currentUser = await db.collection("users").findOne({ roll });
          

          // If no user found
          if (!currentUser) {
            return null;
          }
          //console.log(password, 'this is a new password', currentUser.password, 'user password');

          // Compare the provided password with the stored hashed password
          const passwordMatched = bcrypt.compare(
            password,
            currentUser.hashedPassword
        );

          // If passwords do not match, return null
          if (!passwordMatched) {
            return null;
          }
          return currentUser;
      },
    }),
  ],
  callbacks: {},
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
