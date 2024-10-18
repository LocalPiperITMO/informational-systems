// src/services/apiService.ts

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
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        throw new Error("User is unauthorized! Redirecting...");
    } else {
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
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        throw new Error("User is unauthorized! Redirecting...");
    } else {
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
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        throw new Error("User is unauthorized! Redirecting...");
    } else {
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
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        throw new Error("User is unauthorized! Redirecting...");
    } else {
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
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        throw new Error("User is unauthorized! Redirecting...");
    } else {
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
        return data;  // Return the response data as needed
    } else if (response.status === 403){
        throw new Error("User is unauthorized! Redirecting...");
    } else {
        throw new Error("Failed to update Human");
    }
}