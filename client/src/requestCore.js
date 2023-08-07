
export async function get(endpoint, data){
    const headers = {
        'Content-Type': 'application/json',
      };
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers,
    })
    return await response.json();
}

export async function post(endpoint, data = {}){
    const headers = {
        'Content-Type': 'application/json',
      };
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    return await response.json();
}
