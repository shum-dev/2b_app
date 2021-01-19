const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

module.exports = async () => ([
  {
    email: 'admin@admin.ru',
    password: await hashPassword('admin'),
    isAdmin: true,
  },
  {
    email: 'test@test.ru',
    password: await hashPassword('test'),
  },
]);
