import React, { Component, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <>
      <div className="main-layout">
        <div className="content">
          <div className="_h_100vh d-flex align-items-center justify-content-center">{children}</div>
        </div>
      </div>
    </>
  )
}
export default MainLayout
