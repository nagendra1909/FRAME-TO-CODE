"use client";
import React, { use } from 'react'
import axios from 'axios' 
import { useParams } from 'next/navigation';
import { useState,useEffect } from "react";
import { Description } from '@radix-ui/react-dialog';
import { LoaderCircle } from 'lucide-react';
import Constants from '@/app/data/Constants';
import AppHeader from '@/app/_components/AppHeader';
import { SelectionDetail } from '../_components/SelectionDetail';
import { CodeEditor } from '../_components/CodeEditor';
import { Loader2 } from 'lucide-react';
export interface RECORD {
    id:number,
    description:string,
    code:any,
    imageUrl:string,
    model:string,
    createdBy:string,
    uid:string,
}

function ViewCode() {

    const {uid}=useParams();
    const [loading,setLoading]=useState(false);
    const [codeResp,setCodeResp]=useState('');
    const [record,setRecord]=useState<RECORD>();
    const [isReady,setIsReady]=useState(false);
    const [isExistingCode,setIsExistingCode]=useState();
    useEffect(()=>{
        uid&&GetRecordInfo();
    },[uid])    

    const GetRecordInfo=async()=>{
        setIsReady(false);
        setCodeResp('');
        setLoading(true);
       
    const result = await axios.get('/api/user/wireframe-to-code?uid='+uid);
    console.log("result ",result.data);
    const resp=result?.data;
    setRecord(result?.data);
    console.log("Desc",resp.description);
    if (resp?.code==null)
    {
        GenerateCode(resp);
    }
    else{
        setCodeResp(resp?.code?.resp);
        setLoading(false);
    }
    if (resp?.error){
        console.log("No Result Found");
        //setLoading(false);
    }
    }
    const GenerateCode = async (record: RECORD) => {
        try {
            setLoading(true);
                        const response = await fetch('/api/user/ai-model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: record+":"+Constants.PROMPT,
                    model: record.model,
                    imageUrl: record?.imageUrl
                })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setLoading(false);
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
    
                const text = (decoder.decode(value)).replace('```typescript','').replace('```', '');
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
            
        }
        setIsReady(true);
        UpdateCodeToDb();
            
    }

    useEffect(() => {
        if (codeResp !='' && record?.uid&&isReady && record?.code==null) {
            UpdateCodeToDb();
        }
    },[codeResp&&record] )

    const UpdateCodeToDb = async () => {
        try {
            const result = await axios.put('/api/user/wireframe-to-code', {
                uid: record?.uid,
                codeResp: {resp:codeResp}  // Use the state variable directly
            });
            console.log("Code updated in DB:", result.data);
        } catch (error) {
            console.error("Error updating code:", error);
        }
    }

  return (
    <div>
        <AppHeader hideSidebar={true}/>
        <div className='grid grid-cols-1 md:grid-cols-5 p-5 gap-10'>
            <div>
                {/*selection details*/}
                <SelectionDetail record={record}
                regenerateCode={ ()=>{GetRecordInfo()}}
                isReady={isReady}
                />

            </div>
            <div className='col-span-4'>
                {/*code details*/}
                {loading ? (
                    <div >
                        <h2 className='font-bold text-2xl text-center p-20 flex items-center justify-center bg-slate-100 h-[80vh] rounded-xl'>
                            <Loader2 className='animate-spin'/>
                            Analyzing the Wireframe...
                        </h2>
                    </div>
                ) : (
                    <CodeEditor 
                    codeResp={codeResp} 
                    isReady={isReady} 
                    />
                )}
 
            </div>

        </div>
       
       
    </div>
  )
}

export default ViewCode