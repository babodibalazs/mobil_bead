import { ImagesContext } from "@/utils/imagesContext"
import { useContext } from "react"

const useImages = () => {
    return useContext(ImagesContext)
}

export default useImages