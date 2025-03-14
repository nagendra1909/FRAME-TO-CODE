"use client"
import { auth } from '@/configs/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Image from 'next/image';
import React, { useEffect } from 'react'
import { useAuthContext } from '../provider';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function ProfileAvatar() {

    const user = useAuthContext();
    const router = useRouter();
    const onButtonPress = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            router.replace('/')
        }).catch((error) => {
            // An error happened.
        });
    }
    return (
        <div>
            <Popover >
                <PopoverTrigger>
                    <Image src={user?.user?.photoURL ? user?.user?.photoURL: '/placeholder.svg' } alt='profile' className='rounded-full' width={25} height={25}/>
                    {/* {user?.user?.photoURL && <Image src={user?.user?.photoURL} alt='profile' className='w-[25px] h-[25px] rounded-full' />} */}
                </PopoverTrigger>
                <PopoverContent className='w-[100px] mx-w-sm'>
                    <Button variant={'ghost'} onClick={onButtonPress} className=''>Logout</Button>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default ProfileAvatar