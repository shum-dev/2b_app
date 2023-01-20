const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

module.exports = async () => ([
  {
    email: 'admin@admin.com',
    password: await hashPassword('admin'),
    isAdmin: true,
  },
  {
    email: 'test@test.com',
    password: await hashPassword('test'),
  },
]);
