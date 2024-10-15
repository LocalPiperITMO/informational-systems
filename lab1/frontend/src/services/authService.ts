export async function loginUser(username: string, password: string): Promise<{ username: string, admin: boolean, token: string }> {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      // Assuming the response contains the user's data and a token
      return { username: data.username, admin: data.admin, token: data.token };
    } else {
      throw new Error('Login failed');
    }
  }

  export async function registerUser(username: string, password: string): Promise<{ username: string, admin: boolean, token: string }> {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { username : data.username, admin: data.admin, token: data.token };
    } else {
      throw new Error('Register failed');
    }
  }
  