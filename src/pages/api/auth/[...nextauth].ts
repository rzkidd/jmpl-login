import NextAuth, {AuthOptions} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {comparePasswords} from '@/libs/bcrypt';

import prisma from "@/libs/prismadb"

const verifyRecaptcha = async (token: String) => {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  var verificationUrl =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    secretKey +
    "&response=" +
    token;

  return await fetch(verificationUrl, {
    method: 'POST'
  }).then(response => response.json());
};

export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
        // token: { label: 'token', type: 'text' }
      },
      async authorize(credentials) {
        // const response = await verifyRecaptcha(credentials?.token as string);

        // if (response.success && response.score >= 0.7) {

          if (!credentials?.email || !credentials?.password) {
            throw new Error('Invalid credentials');
          }

          const user = await prisma.users.findFirst({
            where: {
              email: credentials.email
            }
          });

          if (!user || !user?.password) {
            throw new Error('Invalid credentials');
          }

          const isCorrectPassword = await comparePasswords(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            throw new Error('Invalid credentials');
          }

          return user;
        // }
      }
    })
    // ...add more providers here
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
