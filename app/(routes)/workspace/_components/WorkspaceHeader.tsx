import { Button } from '@/components/ui/button'
import { Link, Save, Settings, Sparkles } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import AISettingsDialog from './AISettingsDialog'
import AIGenerateDialog from './AIGenerateDialog'

function WorkspaceHeader({onSave, fileId}:any) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

  return (
    <>
      <div className='p-3 border-b flex justify-between items-center bg-background'>
        <div className='flex gap-2 items-center'>
          <Image src={'/logo-1.png'}
            alt='logo'
            height={40}
            width={40} />
          <h2 className='text-foreground'>File Name</h2>
        </div>
        <div className='flex items-center gap-4'>
          <Button className='h-8 text-[12px]
          gap-2'
          variant='outline'
          onClick={()=>setSettingsOpen(true)}
          >
          <Settings className='h-4 w-4' /> AI Settings </Button>
          <Button className='h-8 text-[12px]
          gap-2 bg-purple-600 hover:bg-purple-700'
          onClick={()=>setGenerateOpen(true)}
          >
          <Sparkles className='h-4 w-4' /> AI Generate </Button>
          <Button className='h-8 text-[12px]
          gap-2 bg-yellow-500 hover:bg-yellow-600'
          onClick={()=>onSave()}
          >
          <Save className='h-4 w-4' /> Save </Button>
          <Button className='h-8 text-[12px]
          gap-2 bg-blue-600 hover:bg-blue-700'>
            Share <Link className='h-4 w-4' /> </Button>
        </div>
      </div>

      <AISettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
      <AIGenerateDialog
        open={generateOpen}
        onOpenChange={setGenerateOpen}
        fileId={fileId}
        onOpenSettings={() => setSettingsOpen(true)}
      />
    </>
  )
}

export default WorkspaceHeader
