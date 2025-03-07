import React from 'react'
import Image from 'next/image';
import { RECORD } from '../[uid]/page';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';


interface Props {
    record?: RECORD;
}

export const SelectionDetail = ({ record,regenerateCode ,isReady}: Props) => {
    return (
        <div className='p-5 bg-gray-100 h-[80vh] rounded-lg'>
            <h2 className='font-bold my-2 p-2'>Wireframe</h2>
            <Image src={record?.imageUrl} alt='WireFrame' width={300} height={400} 
            className='rounded-lg object-contain h-[200px] w-full border border-dashed p-2 bg-white'/>

            <h2 className='font-bold mt-4 mb-2 p-2'>AI Model</h2>
            <Input defaultValue={record?.model} disabled={true} className='bg-white p-2 border border-dashed' />

            <h2 className='font-bold mt-4 mb-2 p-2'>Description</h2>
            <Textarea defaultValue={record?.description} disabled={true} className='bg-white h-[180px] p-2 border border-dashed' />

            <Button className='mt-7 w-full'disabled={!isReady}onClick={regenerateCode}> <RefreshCcw/>Re Generate</Button>
        </div>
        
    )
}
