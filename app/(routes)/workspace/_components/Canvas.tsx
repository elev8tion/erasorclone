import React, { useEffect, useState } from 'react'
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { FILE } from '../../dashboard/_components/FileList';
import { updateWhiteboard as updateWhiteboardDB } from '@/lib/localdb';
import { parseWhiteboardData } from '@/lib/visualization-loader';

function Canvas({onSaveTrigger,fileId,fileData}:{onSaveTrigger:any,fileId:any,fileData:FILE}) {

    const [whiteBoardData,setWhiteBoardData]=useState<any>();

    useEffect(()=>{
        onSaveTrigger&&saveWhiteboard();
    },[onSaveTrigger])
    const saveWhiteboard=()=>{
        const result = updateWhiteboardDB(fileId, JSON.stringify(whiteBoardData));
        console.log('Whiteboard saved:', result);
    }
    return (
    <div style={{ height: "670px" }}>
   {fileData&& <Excalidraw
    theme='dark'
    initialData={
        fileData?.whiteboard ? parseWhiteboardData(fileData.whiteboard) : { elements: [], appState: { viewBackgroundColor: "#ffffff" } }
    }
    onChange={(excalidrawElements, appState, files)=>
        setWhiteBoardData(excalidrawElements)}
    UIOptions={{
        canvasActions:{
            saveToActiveFile:false,
            loadScene:false,
            export:false,
            toggleTheme:false

        }
    }}
    >
        <MainMenu>
            <MainMenu.DefaultItems.ClearCanvas/>
            <MainMenu.DefaultItems.SaveAsImage/>
            <MainMenu.DefaultItems.ChangeCanvasBackground/>
        </MainMenu>
        <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint/>
            <WelcomeScreen.Hints.MenuHint/>
            <WelcomeScreen.Hints.ToolbarHint/>
            <WelcomeScreen.Center>
                <WelcomeScreen.Center.MenuItemHelp/>
            </WelcomeScreen.Center>
        </WelcomeScreen>
        </Excalidraw>}
  </div>
  )
}

export default Canvas