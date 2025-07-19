const User = require('../models/User');
require('dotenv').config(); 
async function createAdmin() {
   const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const existingAdmin = await User.findOne({ email: adminEmail });
 
  if (!existingAdmin) {
    const adminUser = new User({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      is_verified: true,
      role: 'ADMIN',
    });

    await adminUser.save();
    console.log('✅ Admin created');
  } else {
    console.log('ℹ️ Admin already exists');
  }
}

module.exports = createAdmin;
