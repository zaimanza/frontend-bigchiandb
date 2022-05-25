

const useLocalStorage = () => {

    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
    }

    const setItem = async ({ key, value }) => {
        await localStorage.setItem(key, value)
    }

    const getItem = async ({ key }) => {
        return await localStorage.getItem(key)
    }

    return { setItem, getItem }
}

module.exports = useLocalStorage