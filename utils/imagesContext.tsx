import * as fs from 'fs';
import React, { createContext, useState } from "react";

export const ImagesContext = createContext()

const ImagesProvider = (props: any) => {
    const [images, setImages] = useState([])

    const init = () => {
        const folderPath = "C:\\Users\\Megathor\\OneDrive\\Desktop\\Egyetem\\code\\mobil\\mobil_bead\\assets\\profile"
        fs.readdirSync(folderPath).map(filename => {
            const file = folderPath + "\\" + filename
            setImages([...images, file])
        })
    }

    const addImage = (image: string) => setImages([...images, image])
    
    return <ImagesContext.Provider value={{images, init, addImage}} {...props} />
}

export default ImagesProvider