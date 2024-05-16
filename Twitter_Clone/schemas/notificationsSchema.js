const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
    userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notificationType: String,
    openned: { type: Boolean, default: false },
    entityId: mongoose.Schema.Types.ObjectId
}, { timestamps: true })

notificationsSchema.statics.insertNotification = async (userTo, userFrom, notificationType, entityId) => {
    let data = {
        userTo,
        userFrom,
        notificationType,
        entityId
    }
    await Notification.deleteOne(data).catch(err => console.error(err));
    return Notification.create(data).catch(err => console.error(err));
}

let Notification = mongoose.model('Notifications', notificationsSchema);
module.exports = Notification;