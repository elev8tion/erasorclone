import { FileListContext } from '@/app/_context/FilesListContext'
import { Archive, MoreHorizontal } from 'lucide-react';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';

export interface FILE{
  archive:boolean,
  createdBt:string,
  document:string,
  fileName:string,
  teamId:string,
  whiteboard:string,
  _id:string,
  _creationTime:number
}
function FileList() {

  const {fileList_,setFileList_}=useContext(FileListContext);
  const [fileList,setFileList]=useState<any>();
  const router=useRouter();
  useEffect(()=>{
    fileList_&&setFileList(fileList_);
    console.log(fileList_);
  },[fileList_])

  return (
    <div className='mt-10'>
 

<div className="overflow-x-auto">
  <table className="min-w-full divide-y-2 divide-border bg-card text-sm">
    <thead className="ltr:text-left rtl:text-right">
      <tr>
      <td className="whitespace-nowrap px-4 py-2 font-medium text-foreground">File Name</td>
      <td className="whitespace-nowrap px-4 py-2 font-medium text-foreground">Created At</td>
      <td className="whitespace-nowrap px-4 py-2 font-medium text-foreground">Edited</td>
      <td className="whitespace-nowrap px-4 py-2 font-medium text-foreground">Author</td>

      </tr>
    </thead>

    <tbody className="divide-y divide-border">
      {fileList&&fileList.map((file:FILE,index:number)=>(
        <tr key={index} className="odd:bg-muted/50 hover:bg-muted cursor-pointer"
        onClick={()=>router.push('/workspace/'+file._id)}
        >
        <td className="whitespace-nowrap px-4 py-2 font-medium text-foreground">
          {file.fileName}</td>
        <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
          {moment(file._creationTime).format('DD MMM YYYY')} </td>
        <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
        {moment(file._creationTime).format('DD MMM YYYY')}
        </td>
        <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
          Local User
        </td>
        <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
         
          <DropdownMenu>
  <DropdownMenuTrigger>
  <MoreHorizontal/>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
   
    <DropdownMenuItem className='gap-3'>
       <Archive className='h-4 w-4'/> Archive</DropdownMenuItem>
   
  </DropdownMenuContent>
</DropdownMenu>

        </td>
      </tr>
      ))}
      

    
    </tbody>
  </table>
</div>
    </div>
  )
}

export default FileList