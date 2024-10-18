// src/components/pages/MainPage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header";
import Footer from "../Footer";
import ObjectTable from "../tables/ObjectTable";
import CreateModal from "../modals/CreateModal";
import UpdateModal from "../modals/UpdateModal";
import { useNavigate } from "react-router-dom";
import { fetchCitiesData, fetchCoordinatesData, fetchHumansData } from "../../services/dataService";

const Title: React.FC = () => {
    const { username } = useAuth();
    return <div>
        <h1>Welcome to Main Page, { username ? username : 'Unauthorized User' }</h1>
    </div>
}

const Commands: React.FC<{ openCreateModal: () => void, openUpdateModal: () => void, handleLogout: () => void }> = ({ openCreateModal, openUpdateModal, handleLogout }) => {
    return <div>
        <button onClick={openCreateModal}>Create</button>
        <button onClick={openUpdateModal}>Update</button>
        <button>Delete</button>
        <button>Request Admin</button>
        <button>Special</button>
        <button>Visualize</button>
        <button onClick={handleLogout}>Logout</button>
    </div>
}

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [data, setData] = useState<{ cities: any[], coordinates: any[], humans: any[] } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const openUpdateModal = () => {
        setIsUpdateModalOpen(true);
    }

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
    }


    const fetchData = async () => {
        try {
            setLoading(true);
            const cities = await fetchCitiesData();
            const coordinates = await fetchCoordinatesData();
            const humans = await fetchHumansData();
            setData({ cities, coordinates, humans });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <Title />
            <Commands openCreateModal={openCreateModal} openUpdateModal={openUpdateModal} handleLogout={handleLogout} />

            {data ? (
                <>
                    <ObjectTable data={data} />
                    <CreateModal isOpen={isCreateModalOpen} onClose={closeCreateModal} data={data} onSuccess={fetchData} />
                    <UpdateModal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} data={data} onSuccess={fetchData}/>
                </>
            ) : (
                <div>No data available</div>
            )}

            <Footer />
        </div>
    );
};

export default MainPage;
