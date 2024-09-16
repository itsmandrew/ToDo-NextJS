// models/Todo.ts
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

export default mongoose.models.Todo || mongoose.model('Todo', TodoSchema);