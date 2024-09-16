import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                const { name, email, image } = user;
                try {
                    await dbConnect();
                    let dbUser = await User.findOne({ email });

                    if (!dbUser) {
                        dbUser = await User.create({ name, email, image });
                    }

                    user.id = dbUser._id.toString();
                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token, user }) {
            if (session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }