import mongoose, {Document,Model,Schema}  from "mongoose";

export interface INotification extends Document{
   title: string;
   message: string;
   status: string;
   user?: mongoose.Types.ObjectId | string;
}

const notificationSchema = new Schema<INotification>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title:{
        type: String,
        required: true
    },
    message:{
        type:String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default: "unread"
    }
},{timestamps: true});


const NotificationModel: Model<INotification> = mongoose.model('Notification',notificationSchema);

export default NotificationModel;
