// src/components/pages/MainPage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header";
import Footer from "../Footer";
import ObjectTable from "../tables/ObjectTable";
import CreateModal from "../modals/CreateModal";
import { useNavigate } from "react-router-dom";
import { fetchCitiesData, fetchCoordinatesData, fetchHumansData } from "../../services/dataService";

const Title: React.FC = () => {
    const { username } = useAuth();
    return <div>
        <h1>Welcome to Main Page, { username ? username : 'Unauthorized User' }</h1>
    </div>
}

const Commands: React.FC<{ openCreateModal: () => void, handleLogout: () => void }> = ({ openCreateModal, handleLogout }) => {
    return <div>
        <button onClick={openCreateModal}>Create</button>
        <button>Update</button>
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

    // State for fetched data
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

    // Fetch data from all endpoints
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
            <Commands openCreateModal={openCreateModal} handleLogout={handleLogout} />

            {/* Pass data to ObjectTable and CreateModal */}
            {data ? (
                <>
                    <ObjectTable data={data} />
                    <CreateModal isOpen={isCreateModalOpen} onClose={closeCreateModal} data={data} />
                </>
            ) : (
                <div>No data available</div>
            )}

            <Footer />
        </div>
    );
};

export default MainPage;
