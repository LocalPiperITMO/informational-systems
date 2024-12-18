import { toast } from "react-toastify";
export async function sendAdminRequest(data : any) {
    const response = await fetch('http://localhost:8080/api/admin/requestAdmin', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        toast.success("Request sent successfully")
        return data;
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        throw new Error("Failed to send request");
    }
}

export async function fetchRoleRequests(data: any) {
    const response = await fetch('http://localhost:8080/api/admin/fetchRequests', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        toast.error("Failed to send request")
        throw new Error("Failed to send request");
    }   
}

export async function submitAdminDecisions(data: any) {
    const response = await fetch('http://localhost:8080/api/admin/applyRoles', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (response.ok) {
        const data = await response.json();
        toast.success("Requests processed successfuly")
        return data;
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        toast.error("Failed to send request")
        throw new Error("Failed to send request");
    }
}