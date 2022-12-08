const io = require('socket.io')(5000)
io.on('connection', socket =>{
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on('send-message', ({group_Members, text}) => {
        group_Members.forEach(group_Member => {
            const newGroupMembers = group_Members.filter(r => r !== group_Member)
            newGroupMembers.push(id)
            socket.broadcast.to(group_Member).emit('receive-message', { group_Members: newGroupMembers, sender: id, text})
        })
    })
})