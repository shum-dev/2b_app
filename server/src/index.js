const { MongoClient } = require('mongodb');

const PizzasDAO = require('./dao/pizzasDAO');
const PasteriesDAO = require('./dao/pasteriesDAO');
const IngredientsDAO = require('./dao/ingredientsDAO');
const UsersDAO = require('./dao/usersDAO');

const app = require('./server');

const port = process.env.PORT || 8000;

MongoClient.connect(
  process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .then(async (client) => {
    await PizzasDAO.injectDB(client);
    await PasteriesDAO.injectDB(client);
    await IngredientsDAO.injectDB(client);
    await UsersDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('ERROR MONGODB CONNECTION');
    console.error(err.stack);
    process.exit(1);
  });
