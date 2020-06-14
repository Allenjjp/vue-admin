import cookie from "cookie_js";

const adminToken = "admin_token"
const usernameKey = "username"


export function getToken() {
    return cookie.get(adminToken);
}

export function setToken(token) {
    return cookie.set(adminToken, token);
}

export function removeToken(token) {
    return cookie.remove(adminToken);
}

export function setUsername(value) {
    return cookie.set(usernameKey, value);
}

export function getUsername() {
    return cookie.get(usernameKey);
}

export function removeUsername() {
    return cookie.remove(usernameKey);
}