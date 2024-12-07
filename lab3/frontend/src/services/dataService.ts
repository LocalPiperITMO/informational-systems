export async function fetchCitiesData() {
    const response = await fetch('http://localhost:8080/api/data/cities', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.cities;
    } else {
      throw new Error("Failed to fetch Cities");
    }
  }
  
export async function fetchCoordinatesData() {
    const response = await fetch('http://localhost:8080/api/data/coordinates', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.coordinates;
    } else {
      throw new Error("Failed to fetch Coordinates");
    }
  }
  
export async function fetchHumansData() {
    const response = await fetch('http://localhost:8080/api/data/humans', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.humans;
    } else {
      throw new Error("Failed to fetch Humans");
    }
  }

export async function fetchImopsData(data : any) {
  const response = await fetch('http://localhost:8080/api/data/imops', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    return data.importOperations;
  } else {
    throw new Error("Failed to fetch Import Operations");
  }
}