import React from 'react'
import ImageUpload from './_components/Imageupload';


function Dashboard() {
    return (
        <div className=' lg:px-20 xl:px-60' >
            <h2 className='font-bold text-3xl' >Convert Wireframe to Code</h2>
            <ImageUpload/>
        </div>
    )
}

export default Dashboard