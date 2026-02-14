import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Search, Send, User } from 'lucide-react'
import React from 'react'

function Header() {
  return (
    <div className='flex justify-end w-full gap-2 items-center'>
        <div className='flex gap-2 items-center border rounded-md p-1 bg-background'>
            <Search className='h-4 w-4'/>
            <input type='text' placeholder='Search' className='bg-transparent outline-none'/>
        </div>
        <ThemeToggle />
        <div className='rounded-full bg-secondary p-2'>
            <User className='h-4 w-4'/>
        </div>
        <Button className='gap-2 flex text-sm h-8 hover:bg-blue-700 bg-blue-600'>
          <Send className='h-4 w-4'/> Invite
        </Button>
    </div>
  )
}

export default Header