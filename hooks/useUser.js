import { useContext } from "react"
import { UserContext } from "../utils/userContext"

const useUser = () => {
    return useContext(UserContext)
}

export default useUser