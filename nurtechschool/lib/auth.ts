import NextAuth, { getServerSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { ENDP } from "@/services/endpoint";

export async function getSession() {
  const session: any = await getServerSession(authOptions);
  return session;
}
const resolveAuth = <T extends object>(
  target: T,
  source: Record<string, unknown>,
) => {
  for (const key of Object.keys(source) as (keyof TAuth)[]) {
    const value = (source as any)[key];
    if (value !== undefined) {
      (target as any)[key] = value;
    }
  }
};
export const authOptions = {
  providers: [
    Credentials({
      name: "Send OTP",
      id: "send-otp",
      credentials: {},
      async authorize(
        credentials: Record<string, string> | undefined,
      ): Promise<any> {
        const email = credentials?.email;
        if (!credentials || !email) return null;
        try {
          const { data }: any = await ENDP.auth.send_otp({ email });
          const v = data?.user_otp;
          return {
            token_otp: v.token,
            email,
          };
        } catch (error: any) {
          throw new Error(error?.response?.data?.message);
        }
      },
    }),
    Credentials({
      name: "Verify OTP",
      id: "verify-otp",
      credentials: {},
      async authorize(
        credentials: Record<string, string> | undefined,
      ): Promise<any> {
        const session: any = await getServerSession(authOptions);
        try {
          const { data }: any = await ENDP.auth.verify_otp({
            otp: credentials?.otp as string,
            token: session?.token_otp,
          });
          const v = data?.user;
          return {
            token: data?.access_token,
            name: v?.name,
            email: v?.email,
            id: v?.id,
            image: v?.avatar,
          };
        } catch (error: any) {
          throw new Error(error?.response?.data?.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) resolveAuth(token, user as unknown as Record<string, unknown>);
      return token;
    },
    async session({ session, token }) {
      resolveAuth(session, token);
      return session;
    },
  },
} satisfies NextAuthOptions;

export default NextAuth(authOptions);
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

export async function getAuth() {
  const session: any = await getServerSession(authOptions);
  const user = session?.user;
  const isAuth = Boolean(
    session?.token && user?.email && user.credentials == "verified",
  );

  return {
    isAuth,
    name: user?.name as string,
    id: user?.id,
    avatar: user?.image as string,
    credentials: user?.credentials as string,
    createdAt: user?.created_at as string,
  };
}
