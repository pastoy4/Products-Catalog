require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

/**
 * Usage:
 *   # in backend/.env set MONGO_URI
 *   NEW_ADMIN_USERNAME=newadmin NEW_ADMIN_EMAIL=newadmin@example.com NEW_ADMIN_PASSWORD='newpass123' npm run change-admin
 *
 * Notes:
 * - Updates the FIRST user matching CURRENT_ADMIN_USERNAME (default: "admin")
 * - Password is re-hashed via the User model pre('save') hook.
 */

async function main() {
    const currentUsername = process.env.CURRENT_ADMIN_USERNAME || 'admin';
    const newUsername = process.env.NEW_ADMIN_USERNAME;
    const newEmail = process.env.NEW_ADMIN_EMAIL;
    const newPassword = process.env.NEW_ADMIN_PASSWORD;

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is required (set it in backend/.env)');
    }

    if (!newUsername || !newEmail || !newPassword) {
        throw new Error(
            'NEW_ADMIN_USERNAME, NEW_ADMIN_EMAIL, and NEW_ADMIN_PASSWORD are required'
        );
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username: currentUsername });
    if (!user) {
        throw new Error(`User not found: username="${currentUsername}"`);
    }

    // Check conflicts
    const conflict = await User.findOne({
        $or: [{ username: newUsername }, { email: newEmail }],
        _id: { $ne: user._id },
    });
    if (conflict) {
        throw new Error('Username or email already in use by another user');
    }

    user.username = newUsername;
    user.email = newEmail;
    user.password = newPassword;
    await user.save();

    console.log(`Admin updated successfully: ${currentUsername} -> ${newUsername}`);

    await mongoose.disconnect();
    console.log('Done.');
}

main().catch(async (err) => {
    console.error('Change admin error:', err.message);
    try {
        await mongoose.disconnect();
    } catch (_) {
        // ignore
    }
    process.exit(1);
});

