import { connect } from "@/app/lib/ConnectDB";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; // Import bcryptjs for password comparison

// Define the User type based on your schema
interface User {
  _id: string;
  roll: string;
  hashedPassword: string;
  name: string;
  photo?: string;
  // Add any other fields from your user schema
}

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        roll: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { roll, password } = credentials;

        // Validate input
        if (!roll || !password) {
          console.error("Missing roll or password");
          return null;
        }

        try {
          const db = await connect(); // Connect to the database
          const currentUser: User | null = await db.collection("users").findOne({ roll });

          // Check if user exists
          if (!currentUser) {
            console.error("User not found");
            return null;
          }

          // Compare provided password with the stored hashed password
          const passwordMatched = await bcrypt.compare(password, currentUser.hashedPassword);
          if (!passwordMatched) {
            console.error("Invalid password");
            return null;
          }

          // Return the user object
          return currentUser;
        } catch (error) {
          console.error("Error in authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user._id;
      token.name = user.name;
      token.roll = user.roll;
      token.photo = user.profilePictureUrl;
      token.phone = user.phone;
      token.department = user.department;
      token.position = user.position;
      token.batch = user.batch;

    }
    return token;
  },
  async session({ session, token }) {
    if (token) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.roll = token.roll;
      session.user.photo = token.photo;
      session.user.phone = token.phone;
      session.user.department = token.department;
      session.user.position = token.position;
      session.user.batch = token.batch; 
    }
    return session;
  },
},
  pages: {
    signIn: "/login", // Redirect to your login page
  },
});

export { handler as GET, handler as POST };
