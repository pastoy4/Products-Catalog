require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ username: 'admin' });
        if (existing) {
            console.log('Admin user already exists. Skipping seed.');
        } else {
            await User.create({
                username: 'admin',
                email: 'admin@catalog.com',
                password: 'admin123',
            });
            console.log('Admin user created: admin / admin123');
        }

        await mongoose.disconnect();
        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
};

seedAdmin();
