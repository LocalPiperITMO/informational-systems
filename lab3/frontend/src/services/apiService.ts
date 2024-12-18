// src/services/apiService.ts
import { toast } from "react-toastify";

export async function createCity(cityData: any) {
    const response = await fetch('http://localhost:8080/api/logic/createCity', {
        method: 'POST',
        body: JSON.stringify(cityData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        toast.success("Successfully created City")
        return data;
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else if (response.status === 409){
        toast.error("City with given name already exists!");
        throw new Error("City with given name already exists!");
    } else {
        toast.error("Failed to create City")
        throw new Error("Failed to create City");
    }
}

export async function createCoordinates(coordinatesData: any) {
    const response = await fetch('http://localhost:8080/api/logic/createCoordinates', {
        method: 'POST',
        body: JSON.stringify(coordinatesData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        toast.success("Successfully created Coordinates")
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        toast.error("Failed to create Coordinates")
        throw new Error("Failed to create Coordinates");
    }
}

export async function createHuman(humanData: any) {
    const response = await fetch('http://localhost:8080/api/logic/createHuman', {
        method: 'POST',
        body: JSON.stringify(humanData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        toast.success("Successfully created Human")
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        toast.error("Failed to create Human")
        throw new Error("Failed to create Human");
    }
}

export async function updateCity(cityData: any) {
    const response = await fetch('http://localhost:8080/api/logic/updateCity', {
        method: 'POST',
        body: JSON.stringify(cityData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        toast.success("Successfully updated City")
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else if (response.status === 409){
        toast.error("City with given name already exists!");
        throw new Error("City with given name already exists!");
    } else {
        toast.error("Failed to update City")
        throw new Error("Failed to update City");
    }
}

export async function updateCoordinates(coordinatesData: any) {
    const response = await fetch('http://localhost:8080/api/logic/updateCoordinates', {
        method: 'POST',
        body: JSON.stringify(coordinatesData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        toast.success("Successfully updated Coordinates")
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        toast.error("Failed to update Coordinates")
        throw new Error("Failed to update Coordinates");
    }
}
export async function updateHuman(humanData: any) {
    const response = await fetch('http://localhost:8080/api/logic/updateHuman', {
        method: 'POST',
        body: JSON.stringify(humanData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        toast.success("Successfully updated Human")
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        toast.error("Failed to update Human")
        throw new Error("Failed to update Human");
    }
}

export async function deleteCity(cityData: any) {
    const response = await fetch('http://localhost:8080/api/logic/deleteCity', {
        method: 'DELETE',
        body: JSON.stringify(cityData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        toast.success("Successfully deleted City")
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        toast.error("Failed to delete City")
        throw new Error("Failed to delete City");
    }
}

export async function deleteCoordinates(coordinatesData: any) {
    const response = await fetch('http://localhost:8080/api/logic/deleteCoordinates', {
        method: 'DELETE',
        body: JSON.stringify(coordinatesData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        toast.success("Successfully deleted Coordinates")
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        throw new Error("Failed to delete Coordinates");
    }
}
export async function deleteHuman(humanData: any) {
    const response = await fetch('http://localhost:8080/api/logic/deleteHuman', {
        method: 'DELETE',
        body: JSON.stringify(humanData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        toast.success("Successfully deleted Human")
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        toast.warning("User is unauthorized! Redirecting...")
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        throw new Error("Failed to delete Human");
    }
}