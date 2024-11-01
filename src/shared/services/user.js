
export function getUser() {
    const user = localStorage.getItem("auth");
    return user ? JSON.parse(user).user : null;
}