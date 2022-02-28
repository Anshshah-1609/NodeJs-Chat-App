const generateMsg = (username,text) => {
    return {
        username,
        text,
        createdAt : new Date().getTime()
    }
}

const locationMsg = (username,url) => {
    return {
        username,
        url,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMsg,
    locationMsg
}