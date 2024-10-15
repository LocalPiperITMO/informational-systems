import React from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header";
import Footer from "../Footer";
import ObjectTable from "../tables/ObjectTable";
import { useNavigate } from "react-router-dom";

const Title: React.FC = () => {
    const { username } = useAuth();
    return <div>
        <h1>Welcome to Main Page, { username? username : 'Unauthorized User' }</h1>
    </div>
}

const Commands: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return <div>
        <button>Create</button>
        <button>Update</button>
        <button>Delete</button>
        <button>Request Admin</button>
        <button>Special</button>
        <button>Visualize</button>
        <button onClick={ handleLogout }>Logout</button>
    </div>
}

const Body: React.FC = () => {
    return <div>
        <Title/>
        <Commands/>
        <ObjectTable/>
    </div>
}


const MainPage: React.FC = () => {
    return <div>
        <Header/>
        <Body/>
        <Footer/>
    </div>
}

export default MainPage;