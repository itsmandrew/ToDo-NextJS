// models/User.ts
import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this todo.'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this user.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email for this user.'],
        unique: true,
    },
    image: String,
    todos: [TodoSchema],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);