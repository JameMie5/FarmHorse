import React from 'react'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import BootstrapClient from '@/components/BootstrapClient.js'
import '@/styles/globals.css'
import '@/styles/responsive-table.css'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
// import HydrationZustand from '@/components/HydrationZustand'
import { getServerSession } from 'next-auth'
import { OPTIONS } from './api/auth/[...nextauth]'
import {NextIntlClientProvider} from 'next-intl'; //
import {useRouter} from 'next/router';

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App: any = ({ Component, pageProps: { session, messages } }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  const router = useRouter();
  // console.log('messages',messages);
  
  return (
    <>
      <Head>
        <title>Unicorn Farm - Website</title>
        <link rel="icon" type="image/png" href="/next.svg"></link>
        <meta property="og:type" content="Unicorn Farm" />
        <meta property="og:title" content="Unicorn Farm" />
        <meta property="og:description" content="Unicorn Farm" />
        <meta property="og:site_name" content="Unicorn Farm" />
        <meta property="og:image:alt" content="Unicorn Farm" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="description" content="Unicorn Farm" />
        <meta name="keywords" content="Unicorn Farm" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"></link>
      </Head>
      <BootstrapClient />
      <SessionProvider session={session}>
      <NextIntlClientProvider   //
      locale={router.locale} //
      messages={messages} //
    >
        {getLayout(<Component  />)} 
        </NextIntlClientProvider>
        </SessionProvider>  
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      session: await getServerSession(req, res, OPTIONS),
      
    },
  }
}


export default App
