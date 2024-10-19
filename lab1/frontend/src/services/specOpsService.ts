export async function calculateTelephoneSum(data: { token: string | null; }) {
    const response = await fetch('http://localhost:8080/api/spec/1', {
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
        throw new Error("Failed to perform operation");
    }
}
export async function countMetersAbove(data: { token: string | null; spec2: number; }) {
    const response = await fetch('http://localhost:8080/api/spec/2', {
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
        throw new Error("Failed to perform operation");
    }
} 
export async function getUniqueMASLValues(data: { token: string | null; }) {
    const response = await fetch('http://localhost:8080/api/spec/3', {
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
        throw new Error("Failed to perform operation");
    }
}
export async function relocateCityPopulation(data: { token: string | null; spec4: number; }) {
    const response = await fetch('http://localhost:8080/api/spec/4', {
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
        throw new Error("Failed to perform operation");
    }
} 
export async function relocateCapitalPopulation(data: { token: string | null; spec5: number }) {
    const response = await fetch('http://localhost:8080/api/spec/5', {
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
        throw new Error("Failed to perform operation");
    }
}