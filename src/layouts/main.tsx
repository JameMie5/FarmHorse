import React, { Component, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'
import Menubar from '@/components/Menubar'
import { useSession } from 'next-auth/react'
import Footer from '@/components/Footer'
import "bootstrap/dist/css/bootstrap.min.css";
import Buttonlanguage from '@/components/buttonlanguage';

function MainLayout({ children }: { children: React.ReactNode }) {
 
  const router = useRouter()
  const session: any = useSession()
  // useEffect(() => {
  //   if (session.status === 'unauthenticated') {
  //     setTimeout(() => {
  //       router.push('/login')
  //     }, 1000)
  //   }
  // }, [router, session])
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="_sidebar _shadow d-lg-block d-md-none d-none">
            <Sidebar />
          </div>
          <div className="_main">
            <Menubar />
            <div className="row mx-0">
              <div className="col-12">
                <div>{children}</div>
              </div>
            </div>
            <Footer/>
          </div>
        </div>
      </div>
    </>
  )
}
export default MainLayout

