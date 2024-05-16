const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chats' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

})
let Message = mongoose.model('Message', messageSchema);
module.exports = Message;