// src/components/pages/AdminPage.tsx

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
import CheckRequestsModal from "../modals/CheckRequestsModal";
import { Button } from "react-bootstrap";

const Title: React.FC = () => {
    const { username } = useAuth();
    return (
        <div className="text-center my-4">
            <h1>Welcome to Admin Panel, {username ? username : 'Unauthorized User. Get out now.'}</h1>
        </div>
    );
}

const Commands: React.FC<{
    openCreateModal: () => void;
    openUpdateModal: () => void;
    openDeleteModal: () => void;
    openSpecOpsModal: () => void;
    openCheckRequestsModal: () => void;
    handleLogout: () => void;
}> = ({ openCreateModal, openUpdateModal, openDeleteModal, openSpecOpsModal, openCheckRequestsModal, handleLogout }) => {
    return (
        <div className="d-flex justify-content-around my-4">
            <Button variant="primary" onClick={openCreateModal} disabled={localStorage.getItem('admin') !== 'true'}>Create</Button>
            <Button variant="warning" onClick={openUpdateModal} disabled={localStorage.getItem('admin') !== 'true'}>Update</Button>
            <Button variant="danger" onClick={openDeleteModal} disabled={localStorage.getItem('admin') !== 'true'}>Delete</Button>
            <Button variant="info" onClick={openCheckRequestsModal} disabled={localStorage.getItem('admin') !== 'true'}>Check Requests</Button>
            <Button variant="success" onClick={openSpecOpsModal} disabled={localStorage.getItem('admin') !== 'true'}>Special</Button>
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
        </div>
    );
}

const AdminPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSpecOpsModalOpen, setIsSpecOpsModalOpen] = useState(false);
    const [isCheckRequestsModalOpen, setIsCheckRequestsModalOpen] = useState(false);
    const [data, setData] = useState<{ cities: any[], coordinates: any[], humans: any[] } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const openUpdateModal = () => setIsUpdateModalOpen(true);
    const closeUpdateModal = () => setIsUpdateModalOpen(false);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openSpecOpsModal = () => setIsSpecOpsModalOpen(true);
    const closeSpecOpsModal = () => setIsSpecOpsModalOpen(false);
    const openCheckRequestsModal = () => setIsCheckRequestsModalOpen(true);
    const closeCheckRequestsModal = () => setIsCheckRequestsModalOpen(false);

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
        return <div className="text-center my-4">Loading...</div>;
    }

    return (
        <div>
            <Header />
            <Title />
            <Commands
                openCreateModal={openCreateModal}
                openUpdateModal={openUpdateModal}
                openDeleteModal={openDeleteModal}
                openSpecOpsModal={openSpecOpsModal}
                openCheckRequestsModal={openCheckRequestsModal}
                handleLogout={handleLogout}
            />

            {data ? (
                <>
                    <ObjectTable data={data} />
                    <CreateModal isOpen={isCreateModalOpen} onClose={closeCreateModal} data={data} onSuccess={fetchData} />
                    <UpdateModal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} data={data} onSuccess={fetchData} />
                    <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} data={data} onSuccess={fetchData} />
                    <SpecOpsModal isOpen={isSpecOpsModalOpen} onClose={closeSpecOpsModal} data={data} onSuccess={fetchData} />
                    <CheckRequestsModal isOpen={isCheckRequestsModalOpen} onClose={closeCheckRequestsModal} />
                </>
            ) : (
                <div className="text-center my-4">No data available</div>
            )}

            <Footer />
        </div>
    );
};

export default AdminPage;
