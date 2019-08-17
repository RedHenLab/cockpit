class API {
    token;
    sendRequest = (url, request) => { 
        return new Promise( (resolve, reject) => { 
            fetch(url, request)
            .then( res => {
                if (res.status !== 200) {
                    // Reject the json data
                    reject(res);
                }
                else resolve(res);
            })
            .catch( err => reject(err));
        });
    }
    post = (url,body) => { 
        const request = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(body)
        };
        return this.sendRequest(url, request);
    }
    get = (url, includeAuth=false) => { 
        const request = { method: 'GET' };
        if(includeAuth) request.headers =  {
            'Authorization': `Bearer ${this.token}`
        } 

        return this.sendRequest(url, request);
    }
}

const api = new API();

export default api;