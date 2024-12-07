// src/components/pages/MainPage.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header";
import Footer from "../Footer";
import ObjectTable from "../tables/ObjectTable";
import CreateModal from "../modals/CreateModal";
import UpdateModal from "../modals/UpdateModal";
import { useNavigate } from "react-router-dom";
import { fetchCitiesData, fetchCoordinatesData, fetchHumansData, fetchImopsData } from "../../services/dataService";
import DeleteModal from "../modals/DeleteModal";
import SpecOpsModal from "../modals/SpecOpsModal";
import { sendAdminRequest } from "../../services/adminService";
import { Container, Button, Spinner } from "react-bootstrap";
import ImportFilesModal from "../modals/ImportFilesModal";

const Title: React.FC = () => {
    const { username } = useAuth();
    return (
        <div className="text-center my-4">
            <h1>Welcome to Main Page, {username ? username : 'Unauthorized User'}</h1>
        </div>
    );
};

const Commands: React.FC<{
    openCreateModal: () => void;
    openUpdateModal: () => void;
    openDeleteModal: () => void;
    handleSendRequest: () => void;
    openSpecOpsModal: () => void;
    openImportFilesModal: () => void;
    isRequestAdminDisabled: boolean;
    handleLogout: () => void;
}> = ({ openCreateModal, openUpdateModal, openDeleteModal, handleSendRequest, openSpecOpsModal, openImportFilesModal, isRequestAdminDisabled, handleLogout }) => {
    return (
        <div className="d-flex justify-content-around my-4">
            <Button variant="primary" onClick={openCreateModal}>Create</Button>
            <Button variant="warning" onClick={openUpdateModal}>Update</Button>
            <Button variant="danger" onClick={openDeleteModal}>Delete</Button>
            <Button variant="info" onClick={handleSendRequest} disabled={isRequestAdminDisabled}>Request Admin</Button>
            <Button variant="success" onClick={openSpecOpsModal}>Special</Button>
            <Button variant="dark" onClick={openImportFilesModal}>Import Files</Button>
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
        </div>
    );
};

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRequestAdminDisabled, setIsRequestAdminDisabled] = useState(false);
    const [isSpecOpsModalOpen, setIsSpecOpsModalOpen] = useState(false);
    const [isImportFilesModalOpen, setIsImportFilesModalOpen] = useState(false);
    const [data, setData] = useState<{ cities: any[], coordinates: any[], humans: any[], imops: any[] } | null>(null);
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
    const openImportFilesModal = () => setIsImportFilesModalOpen(true);
    const closeImportFilesModal = () => setIsImportFilesModalOpen(false);

    const handleSendRequest = () => {
        try {
            sendAdminRequest({ token: localStorage.getItem('token') });
            setIsRequestAdminDisabled(true);
        } catch (error) {
            console.error("Error requesting admin: ", error);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const cities = await fetchCitiesData();
            const coordinates = await fetchCoordinatesData();
            const humans = await fetchHumansData();
            const imops = await fetchImopsData({ token: localStorage.getItem('token') });
            setData({ cities, coordinates, humans, imops });
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
        return (
            <div className="text-center my-4">
                <Spinner animation="border" role="status" />
                <span className="ml-2">Loading...</span>
            </div>
        );
    }

    return (
        <Container fluid className="my-4">
            <Header />
            <Title />
            <Commands
                openCreateModal={openCreateModal}
                openUpdateModal={openUpdateModal}
                openDeleteModal={openDeleteModal}
                handleSendRequest={handleSendRequest}
                openSpecOpsModal={openSpecOpsModal}
                openImportFilesModal={openImportFilesModal}
                isRequestAdminDisabled={isRequestAdminDisabled}
                handleLogout={handleLogout}
            />

            {data ? (
                <ObjectTable data={data} />
            ) : (
                <div className="text-center my-4">No data available</div>
            )}

            <CreateModal isOpen={isCreateModalOpen} onClose={closeCreateModal} data={data} onSuccess={fetchData} />
            <UpdateModal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} data={data} onSuccess={fetchData} />
            <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} data={data} onSuccess={fetchData} />
            <SpecOpsModal isOpen={isSpecOpsModalOpen} onClose={closeSpecOpsModal} data={data} onSuccess={fetchData} />
            <ImportFilesModal isOpen={isImportFilesModalOpen} onClose={closeImportFilesModal} onSuccess={fetchData} />
            <Footer />
        </Container>
    );
};

export default MainPage;
