import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
    date: { type: String, required: true },
    hours_worked: { type: Number, default: 0 },
    evening_hours: { type: Number, default: 0 },
    night_hours: { type: Number, default: 0 },
    overtime_hours: { type: Number, default: 0 },
}, { _id: false });

const monthSchema = new mongoose.Schema({
    month: { type: Number },
    days: { type: [daySchema], default: [] },
}, { _id: false });

const yearSchema = new mongoose.Schema({
    year: { type: Number },
    months: { type: [monthSchema], default: [] },
}, { _id: false });

const workerSchema = new mongoose.Schema({
    workerName: { type: String, required: true, unique: true },
    workerDetails: { type: String, required: true },
    birthDate: { type: String, required: true },
    address: { type: String, required: true },
    idCard: { type: String, required: true },
    gender: { type: String, required: true },
    years: { type: [yearSchema], default: [] },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email format!`,
        },
    },
});

workerSchema.index({});
workerSchema.pre('save', function (next) {
    this.workerName = this.workerName
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
    next();
});

const Worker = mongoose.model('Worker', workerSchema);

export default Worker;