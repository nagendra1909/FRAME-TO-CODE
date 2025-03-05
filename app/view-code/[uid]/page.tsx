"use client";
import React from 'react'
import axios from 'axios' 
import { useParams } from 'next/navigation';
import { useState,useEffect } from "react";
import { Description } from '@radix-ui/react-dialog';
import { LoaderCircle } from 'lucide-react';
import Constants from '@/app/data/Constants';
interface RECORD {
    id:number,
    description:string,
    code:any,
    imageUrl:string,
    model:string,
    createdBy:string,
}

function ViewCode() {

    const {uid}=useParams();
    const [loading,setLoading]=useState(false);
    const [codeResp,setCodeResp]=useState('');
    useEffect(()=>{
        uid&&GetRecordInfo();
    },[uid])    

    const GetRecordInfo=async()=>{
        setLoading(true);
    const result = await axios.get('/api/user/wireframe-to-code?uid='+uid);
    console.log("result ",result.data);
    const resp=result?.data;
    console.log("Desc",resp.description);
    if (resp?.code==null)
    {
        GenerateCode(resp);
    }
    if (resp?.error){
        console.log("No Result Found");
        setLoading(false);
    }
}
    const GenerateCode = async (record: RECORD) => {
        try {
            setLoading(true);
            console.log("record", record.description);
            
            // Use fetch instead of axios for streaming
            const response = await fetch('/api/user/ai-model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: record.description+":"+Constants.PROMPT,
                    model: record.model,
                    imageUrl: record?.imageUrl
                })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Get the reader from the response body
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to get reader from response');
            }
    
            const decoder = new TextDecoder();
            let accumulatedText = '';
    
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                // console.log("Received chunk:", value);``
    
                const text = (decoder.decode(value)).replace('```typescript',).replace('```', '');
                setCodeResp((prev)=>prev+text);
                accumulatedText += text;
                console.log("Received chunk:", text);
                // You might want to update state here to show the streaming response
                // setState(prevState => prevState + text);
            }
    
            // Update your UI with the complete response
            console.log("Complete response:", accumulatedText);
    
        } catch (error) {
            console.error("Error generating code:", error);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div>ViewCode
        {loading&&<LoaderCircle className='animate-spin'/>}
        <p>{codeResp}</p>
    </div>
  )
}

export default ViewCode