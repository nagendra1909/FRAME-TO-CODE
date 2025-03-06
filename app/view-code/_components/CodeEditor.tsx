import React from 'react'
import { Sandpack } from "@codesandbox/sandpack-react";
import Constants from '@/app/data/Constants';
import { ecoLight,sandpackDark,aquaBlue } from "@codesandbox/sandpack-themes";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";
export function CodeEditor({codeResp,isReady}:any) {
    

    return (
        <div>
            { isReady? <Sandpack template="react"
            theme={aquaBlue}
            options={{
                externalResources: ["https://cdn.tailwindcss.com"],
                showNavigator: true,
                showTabs: true,
                editorHeight:600        
              }}
            customSetup={{ 
                dependencies: { 
                  ...Constants.DEPENDANCY 
                }
              }}
             files={{
                "/App.js": `${codeResp}`,
              }}
            />
            :
            <SandpackProvider template="react"
            theme={aquaBlue}
            files={{
            "/App.js":{
            code:`${codeResp}`,
            active:true
            }
          }}
          customSetup={{ 
            dependencies: { 
              ...Constants.DEPENDANCY 
            }
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
          >
            
    <SandpackLayout>
      <SandpackCodeEditor showTabs={true} style={{height:'700vh'}} />
    </SandpackLayout>
  </SandpackProvider>
}
        </div>
       
    )
}
