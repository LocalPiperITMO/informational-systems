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
import DeleteModal from "../modals/DeleteModal";
import SpecOpsModal from "../modals/SpecOpsModal";

const Title: React.FC = () => {
    const { username } = useAuth();
    return <div>
        <h1>Welcome to Admin Panel, { username ? username : 'Unauthorized User' }</h1>
    </div>
}

const Commands: React.FC<{ openCreateModal: () => void, openUpdateModal: () => void, openDeleteModal: () => void, openSpecOpsModal: () => void, handleLogout: () => void }> = ({ openCreateModal, openUpdateModal, openDeleteModal, openSpecOpsModal, handleLogout }) => {
    return <div>
        <button onClick={openCreateModal}>Create</button>
        <button onClick={openUpdateModal}>Update</button>
        <button onClick={openDeleteModal}>Delete</button>
        <button>Check Requests</button>
        <button onClick={openSpecOpsModal}>Special</button>
        <button>Visualize</button>
        <button onClick={handleLogout}>Logout</button>
    </div>
}

const AdminPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSpecOpsModalOpen, setIsSpecOpsModalOpen] = useState(false);
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

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    }

    const openSpecOpsModal = () => {
        setIsSpecOpsModalOpen(true);
    }

    const closeSpecOpsModal = () => {
        setIsSpecOpsModalOpen(false);
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
            <Commands openCreateModal={openCreateModal} openUpdateModal={openUpdateModal} openDeleteModal={openDeleteModal} openSpecOpsModal={openSpecOpsModal} handleLogout={handleLogout} />

            {data ? (
                <>
                    <ObjectTable data={data} />
                    <CreateModal isOpen={isCreateModalOpen} onClose={closeCreateModal} data={data} onSuccess={fetchData} />
                    <UpdateModal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} data={data} onSuccess={fetchData} />
                    <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} data={data} onSuccess={fetchData} />
                    <SpecOpsModal isOpen={isSpecOpsModalOpen} onClose={closeSpecOpsModal} data={data} onSuccess={fetchData} />
                </>
            ) : (
                <div>No data available</div>
            )}

            <Footer />
        </div>
    );
};

export default AdminPage;
