"use client"
import React from 'react'
import Header from './_components/Header'
import FileList from './_components/FileList'

function Dashboard() {
  return (
    <div className='p-8'>
      <Header/>
      <FileList/>
    </div>
  )
}

export default Dashboard