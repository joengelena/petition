import create from 'zustand';

interface UserInfo {
    user: LoginUser;
    setUser: (newUser: LoginUser) => void;
    removeUser: () => void;
}

const getLocalStorage = (key: string): LoginUser => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: LoginUser) => window.localStorage.setItem(key, JSON.stringify(value));
const removeLocalStorage = (key: string) => window.localStorage.removeItem(key);


const userInfoStorage = create<UserInfo>((set) => ({
    user: getLocalStorage('user') || {userId: -1, token: ""},
    setUser: (newUser: LoginUser) => set(() => {
        console.log("user storage: " + newUser)
        setLocalStorage('user', newUser)
        return {user: newUser}
    }),
    removeUser: () => set(() => {
        removeLocalStorage('user');
        return {user: {userId: -1, token: ""}}
    })
}))

export const useUserInfoStorage = userInfoStorage;