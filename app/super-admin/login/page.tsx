import React from "react";
import LoginForm from "../components/LoginForm";
import { login } from "../../services/super-admin/auth"

const SuperAdminLogin = () => {
    return (
        <LoginForm loginAction={login}/>
    );
};

export default SuperAdminLogin;
