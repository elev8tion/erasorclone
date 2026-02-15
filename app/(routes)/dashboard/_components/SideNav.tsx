import React, { useContext, useEffect, useState } from 'react'
import SideNavTopSection from './SideNavTopSection'
import SideNavBottomSection from './SideNavBottomSection'
import { toast } from 'sonner'
import { FileListContext } from '@/app/_context/FilesListContext'
import { createFile as createFileDB, getFiles as getFilesDB } from '@/lib/localdb'

function SideNav() {
  const [totalFiles,setTotalFiles]=useState<Number>();
  const {fileList_,setFileList_}=useContext(FileListContext);

  useEffect(()=>{
    getFiles();
  },[])

  const onFileCreate=(fileName:string)=>{
    const newFile = createFileDB({
      fileName:fileName,
      archive:false,
      document:'',
      whiteboard:''
    });
    if(newFile) {
      getFiles();
      toast('File created successfully!')
    } else {
      toast('Error while creating file')
    }
  }

  const getFiles=()=>{
    const result = getFilesDB();
    setFileList_(result);
    setTotalFiles(result?.length)
  }

  return (
    <div
    className=' h-screen
    fixed w-72 borde-r border-[1px] p-6
    flex flex-col bg-background
    '
    >
      <div className='flex-1'>
      <SideNavTopSection />
      </div>

     <div>
      <SideNavBottomSection
      onFileCreate={onFileCreate}
      />
     </div>
    </div>
  )
}

export default SideNav
