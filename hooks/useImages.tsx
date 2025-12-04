import { ImagesContext } from "@/utils/imageContext"
import { useContext } from "react"

const useImages = () => {
    return useContext(ImagesContext)
}

export default useImages