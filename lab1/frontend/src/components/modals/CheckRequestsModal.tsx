import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { fetchRoleRequests, submitAdminDecisions } from '../../services/adminService';  // API service
import { useAuth } from '../../context/AuthContext';

interface User {
    id: number;
    username: string;
    email: string;
}

interface RequestRole {
    id: number;
    user: User;
    creationDate: string;
}

interface RoleRequestsResponse {
    requests: RequestRole[];
}

interface CheckRequestsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CheckRequestsModal: React.FC<CheckRequestsModalProps> = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const [requests, setRequests] = useState<RequestRole[]>([]);
    const [decisions, setDecisions] = useState<{ [username: string]: 'approved' | 'rejected' }>({});
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');  // Retrieve the token from localStorage
            const response: RoleRequestsResponse = await fetchRoleRequests({ token });  // Fetch requests from backend
            setRequests(response.requests);  // Update state with fetched requests
        } catch (error: any) {
            if (error.message === "User is unauthorized! Redirecting...") {
                logout();
            }
            console.error("Error fetching role requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchRequests();
        }
    }, [isOpen]);

    const handleDecisionChange = (username: string, decision: 'approved' | 'rejected') => {
        setDecisions({ ...decisions, [username]: decision });
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const verdicts = Object.keys(decisions).map(username => ({
            username,
            status: decisions[username],
        }));

        const roleApprovalRequest = {
            token,   // Token must be sent with the request
            verdicts // List of verdicts
        };

        try {
            await submitAdminDecisions(roleApprovalRequest);  // Submit decisions to backend
            await fetchRequests();  // Refetch requests after submission
        } catch (error: any) {
            console.error("Error submitting decisions:", error);
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Adminship Requests</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Request Date</th>
                                    <th>Decision</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request.id}>
                                        <td>{request.id}</td>
                                        <td>{request.user.username}</td>
                                        <td>{new Date(request.creationDate).toLocaleString()}</td>
                                        <td>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`decision-${request.user.username}`}
                                                    value="approved"
                                                    checked={decisions[request.user.username] === 'approved'}
                                                    onChange={() => handleDecisionChange(request.user.username, 'approved')}
                                                />
                                                Approve
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`decision-${request.user.username}`}
                                                    value="rejected"
                                                    checked={decisions[request.user.username] === 'rejected'}
                                                    onChange={() => handleDecisionChange(request.user.username, 'rejected')}
                                                />
                                                Reject
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleSubmit}>Submit Decisions</button>
                        <button onClick={onClose}>Close</button>
                    </div>
                )}
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
};

export default CheckRequestsModal;
