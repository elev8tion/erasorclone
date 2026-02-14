import React, { useContext, useEffect, useState } from 'react'
import SideNavTopSection, { TEAM } from './SideNavTopSection'
import SideNavBottomSection from './SideNavBottomSection'
import { toast } from 'sonner'
import { FileListContext } from '@/app/_context/FilesListContext'
import { createFile as createFileDB, getFiles as getFilesDB, getCurrentUser, getCurrentTeam } from '@/lib/localdb'

function SideNav() {
  const [activeTeam,setActiveTeam]=useState<TEAM|any>();
  const [totalFiles,setTotalFiles]=useState<Number>();
  const {fileList_,setFileList_}=useContext(FileListContext);

  useEffect(()=>{
    // Set default team on mount
    const team = getCurrentTeam();
    if (team) {
      setActiveTeam(team as any);
    }
  }, []);

  useEffect(()=>{
    activeTeam&&getFiles();
  },[activeTeam])

  const onFileCreate=(fileName:string)=>{
    console.log(fileName)
    const user = getCurrentUser();
    const newFile = createFileDB({
      fileName:fileName,
      teamId:activeTeam?._id,
      createdBy:user?.email || 'local@erasor.app',
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
    const result = getFilesDB(activeTeam?._id);
    console.log(result);
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
      <SideNavTopSection
      setActiveTeamInfo={(activeTeam:TEAM)=>setActiveTeam(activeTeam)}/>
      </div>

     <div>
      <SideNavBottomSection
      totalFiles={totalFiles}
      onFileCreate={onFileCreate}
      />
     </div>
    </div>
  )
}

export default SideNav