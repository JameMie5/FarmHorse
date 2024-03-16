import NextAuth from 'next-auth'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { restLogin } from './login'

export const OPTIONS: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'APP',
      credentials: {
        phoneNo: { label: 'phoneNo', type: 'text', placeholder: 'Enter your phoneNo' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        console.log('%c[...nextauth].ts line:19 credentials:::::::::::::::::::', 'color: #007acc;', credentials)
        try {
          const loginResponse: any = await restLogin(credentials.phoneNo, credentials.password)
          console.log('%c[...nextauth].ts line:22 loginResponse::::::::::', 'color: #007acc;', loginResponse)
          if (loginResponse.code === 0) {
            return {
              id: loginResponse.data._xid,
              user: loginResponse.data,
              accessToken: loginResponse.data._xhad,
              message: loginResponse.message,
            }
          } else {
            return null
          }
        } catch (error) {
          console.log('Error Authenticate data::::::::::::::::::::::', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn() {
      return true
    },
    session: async ({ session, token }: any) => {
      session.user = token.user ? token.user : session.user
      session.accessToken = token.accessToken
      session.message = token.message

      return session
    },
    jwt: async ({ token, session, user }: any) => {
      if (user) {
        token.user = {
          id: user.id,
          user: user.user,
        }
        token.accessToken = user.accessToken
        token.message = user.message
      }
      return token
    },
  },
}
export default NextAuth(OPTIONS)
