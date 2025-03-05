"use client"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/configs/firebaseConfig';
import React,{ChangeEvent,use,useState} from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';   
import {CloudUpload,X,WandSparkles, Loader2Icon} from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios';
import Constants from '@/app/data/Constants';
import {uuid} from 'drizzle-orm/pg-core'
// ...existing imports...
//@ts-ignore
import uuid4 from "uuid4";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useAuthContext } from '@/app/provider';

  
function ImageUpload() {

    
    const [previewUrl,setPreviewUrl] = useState<string | null>(null);
    const [file,setFile] = useState<any>();
    const [model,setModel]=useState<string>();
    const [description,setDescription]=useState<string>();
    const {user}=useAuthContext();
    const router=useRouter();
    const [loading,setLoading]=useState(false);
    const onImageselect = (event:ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log(files?.item(0)?.size);
        
        if(files){
            console.log(files[0]);
            if(files[0].size > 10000000){
                // console.log("File size is too large");
                // console.log("Your file size ",files[0].size);
                alert("File size is too large");
                setFile(null);
                return;
            }
            const imageUrl = URL.createObjectURL(files[0]);
            setFile(files[0]);
            setPreviewUrl(imageUrl);
        }
    }
    const onConvertToCodeButtonClick= async () => {
        if(!file || !model || !description) 
        {
            console.log("Please fill all the fields");
            return;
        }    
        setLoading(true); 
    //save image to firebase storage
        const fileName = Date.now()+'.png';
        const imageRef=ref(storage,"wireframe2code/"+fileName);
        await uploadBytes(imageRef,file).then( resp => {
            console.log("Image Uploaded...")
        });
        const imageUrl = await getDownloadURL(imageRef);
        console.log(imageUrl);

    const uid = uuid4() 
    //save info to DATABASE
    const result =await axios.post('/api/user/wireframe-to-code', {
    uid:uid,
    description:description,
    imageUrl:imageUrl,
    model:model,
    email: user?.email
});
    console.log(result.data);
    setLoading(false);
    router.push('/view-code/'+ uid);

    }
    
    return (
        <div className='mt-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>
                {!previewUrl? <div className='p-7 border border-dashed rounded-md shadow-md
                flex flex-col items-center justify-center
                '>
                    <CloudUpload className='h-10 w-10 text-primary'/>
                    <h2 className='font-bold text-lg'>Upload Image</h2>
                    <p className='text-gray-400 mt-3'>Click Button Select WireFrame Image</p>
                    <div className='p-5 border border-dashed w-full flex mt-7 justify-center'>
                        
                        <label htmlFor="imageSelect">
                            <h2 className='p-2 bg-blue-100 font-medium text-primary rounded-md px-3'>Select Image</h2>
                        </label>
                    </div>
                    <input type="file" id="imageSelect" className='hidden'
                    multiple={false}
                    onChange={onImageselect}    
                    />
                </div>:
                <div className='p-5 border border-dashed rounded-md shadow-md'>
                    
                     <img src={previewUrl} alt="preview" width={500} height={500}
                      className='w-full h-[300px] object-contain'
                      />
                     <X className='flex justify-end w-full cursor-pointer '
                     onClick={() => setPreviewUrl(null)}
                     />
                     
                </div>
                }
                <div className='p-7 border border-dashed rounded-lg shadow-md'>
                    <h2 className='font-bold text-lg'>Select AI Model</h2>     
                    <Select onValueChange={(value) => setModel(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Ai Model" />
                        </SelectTrigger>
                    <SelectContent>
                        {Constants?.AiModelList.map((model,index) => (
                            <SelectItem value={model.name} key={index} >
                            <div className='flex items-center gap-3'>
                                <Image src={model.icon} alt={model.name} width={25} height={25}/>
                                <h2>{model.name}</h2>
                            </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>

                    <h2 className='font-bold text-lg mt-7'>Enter Description About Your Webpage</h2>    
                    <Textarea 
                    onChange={(event) => setDescription(event?.target.value)}
                    className='mt-3 h-[150px]' placeholder='Write about your web page'/>
                </div>
            </div>
            <div className='mt-10 flex items-center justify-center'>
                <Button className='mt-5 flex items-center justify-center'
                onClick={onConvertToCodeButtonClick} disabled={loading}>
                     {loading?<Loader2Icon className='animate-spin'/>: <WandSparkles />}
                     Convert to Code</Button>
            </div>
        </div>
    );
}

export default ImageUpload;
