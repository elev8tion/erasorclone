import { LayoutGrid } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'

function SideNavTopSection() {
    return (
        <div>
            <div className='flex items-center gap-3 p-3'>
                <Image src='/logo-1.png' alt='logo'
                    width={40}
                    height={40} />
                <h2 className='font-bold text-[17px]'>Erasor</h2>
            </div>

            {/* All File Button  */}
            <Button variant='outline'
             className='w-full justify-start
              gap-2 font-bold mt-8 bg-gray-100'>
                <LayoutGrid className='h-5 w-5'/>
                All Files</Button>
        </div>
    )
}

export default SideNavTopSection
