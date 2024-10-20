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
        return data;
    } else if (response.status === 403){
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        throw new Error("Failed to send request");
    }
}