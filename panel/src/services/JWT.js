export default class JWT {
    static getToken() { 
        return window.localStorage['jwt'];
    }
    static saveToken(token) { 
        window.localStorage['jwt'] = token;
    }
    static clearToken() { 
        window.localStorage.removeItem('jwt')
    }
}