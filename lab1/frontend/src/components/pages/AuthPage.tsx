import React from "react";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import Header from "../Header";
import Footer from "../Footer";

const AuthPage: React.FC = () => {
    return (
        <div>
            <Header/>
            <LoginForm/>
            <RegisterForm/>
            <Footer/>
        </div>

    )
}

export default AuthPage;