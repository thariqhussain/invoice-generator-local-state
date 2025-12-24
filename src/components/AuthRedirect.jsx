import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

export default function AuthRedirect({children}) {
    if(isLoggedIn()) {
        return <Navigate to="/sidenav"/>
    }
    return children
}