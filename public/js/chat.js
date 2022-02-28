const socket = io()

// Elements 
const $messForm = document.querySelector('#mess-form')
const $messInput = $messForm.querySelector('input')
const $messSend = $messForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messTemplate = document.querySelector('#mess-template').innerHTML
const urlTemplate = document.querySelector('#url-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix : true })

const autoScroll = () => {
    // new message element
    const $newMsg = $messages.lastElementChild

    // height of the new message
    const newMsgStyles = getComputedStyle($newMsg)
    const newMsgMargin = parseInt(newMsgStyles.marginBottom)
    const newMsgHeight = $newMsg.offsetHeight + newMsgMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of message container 
    const containerHeight = $messages.scrollHeight

    //  how far i have scrolled
    const scrolloffset = $messages.scrollTop + visibleHeight
    if (containerHeight - newMsgHeight <= scrolloffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

// for recieving 'message' Event
socket.on("message", (message) => {
    console.log(message)
    const html = Mustache.render(messTemplate, {
        user : message.username,
        myMessage : message.text,
        time : moment(message.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// for receieving 'location' Event
socket.on('location',(link) => {
    console.log(link)
    const html = Mustache.render(urlTemplate,{
        user : link.username,
        url : link.url,
        time : moment(link.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// for receiving 'roomData' Event
socket.on('roomData',({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        roomName : room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messForm.addEventListener('submit',(e)=> {
    e.preventDefault()

     // Disable
    $messSend.setAttribute('disabled','disabled')
    const message = $messInput.value

    socket.emit('sendMessage', message, (error) => {
        // Enable
        $messSend.removeAttribute('disabled')
        $messInput.value = ''
        $messInput.focus()

        if (error) {
            console.log(error)
        }
        console.log("Message Delivered !")
    })
})


$sendLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert("Geolocation does not supported by your Browser!")
    }

    // Disable
    $sendLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }
        socket.emit('sendLocation', location, () => {
            // Enable
            $sendLocation.removeAttribute('disabled')
            
            console.log('Location shared!!')
        })
    })
})

socket.emit('join', { username, room}, (error) => {
    if (error) {
        console.log(error)
        alert(error)
        location.href = '/'
    }
})

// // Client Receiving an event from server
// socket.on('countUpdated', (count) => {
//     console.log("Count updated!!",count)
// })

// document.querySelector('#inc').addEventListener('click',() => {
//     console.log("Button clicked!")
//     // sending event increment to server
//     socket.emit('increment')
// })