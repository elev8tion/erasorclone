"use client"
import React, { useEffect, useState } from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader'
import Editor from '../_components/Editor'
import { FILE } from '../../dashboard/_components/FileList';
import Canvas from '../_components/Canvas';
import { getFileById } from '@/lib/localdb';

function Workspace({params}:any) {
   const [triggerSave,setTriggerSave]=useState(false);
   const [fileData,setFileData]=useState<FILE|any>();
   useEffect(()=>{
    console.log("FILEID",params.fileId)
    params.fileId&&getFileData();
   },[])

   const getFileData=()=>{
    const result = getFileById(params.fileId);
    setFileData(result);
  }
  return (
    <div>
      <WorkspaceHeader onSave={()=>setTriggerSave(!triggerSave)} fileId={params.fileId} />

      {/* Workspace Layout  */}
      <div className='grid grid-cols-1
      md:grid-cols-2'>
        {/* Document  */}
          <div className=' h-screen'>
            <Editor onSaveTrigger={triggerSave}
            fileId={params.fileId}
            fileData={fileData}
            />
          </div>
        {/* Whiteboard/canvas  */}
        <div className=' h-screen border-l'>
            <Canvas
             onSaveTrigger={triggerSave}
             fileId={params.fileId}
             fileData={fileData}
            />
        </div>
      </div>
    </div>
  )
}

export default Workspace