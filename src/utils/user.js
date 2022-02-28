const users = []

// add User by id
const addUser = ({ id, username, room }) => {
    // Format the  user data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate data
    if (!username || !room) {
        return {
            error : "Username & Room name required !"
        }
    }

    // check user is already in room ?
    const usernameTaken = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username
    if (usernameTaken) {
        return {
            error : "Username already taken! Please try with other name!"
        }
    }
    // adding user
    const user = { id, username, room}
    users.push(user)
    return { user }
}
// remove User by id
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index,1)[0]
    }
}

// get user by id
const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id
    })
    if (!user) {
        return {
            Error : 'User not found!'
        }
    }
    return user
}
// get User in room 
const getUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    const user = users.filter((u) => {
        return u.room === room
    })
    if (user.length === 0) {
        return {
            Error : `There is no user in '${room}' room`
        }
    }
    return user
}
module.exports = {
     addUser,
     removeUser,
     getUser,
     getUserInRoom
}