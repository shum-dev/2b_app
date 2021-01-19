const pizzaSeed = require('../data_sample/pizzas');

let pizzas;
let appDB;

class PizzasDAO {
  static async injectDB(conn) {
    if (pizzas) {
      return;
    }
    try {
      appDB = await conn.db(process.env.DB_NAME);
      pizzas = await conn.db(process.env.DB_NAME).collection('pizzas');

      const deleteAllResult = await pizzas.deleteMany({});
      console.log('Pizza Deletion: ', deleteAllResult.result);
      const seedingResult = await pizzas.insertMany(pizzaSeed);
      console.log('Pizza seeds: ', seedingResult.result);
    } catch (err) {
      console.error(`Unable to establish a collection handle in PizzasDAO: ${err.stack}`);
    }
  }

  static getPizzas() {
    try {
      return pizzas.find({});
    } catch (err) {
      return console.error(`Unable to find pizzas: ${err.stack}`);
    }
  }

  static addPizza({
    name, pastry, ingredients, date, author,
  }) {
    try {
      const pizzaDoc = {
        name,
        pastry,
        ingredients,
        date,
        author,
      };

      return pizzas.insertOne(pizzaDoc);
    } catch (err) {
      return console.error(`Unable to create pizza: ${err.stack}`);
    }
  }
}

module.exports = PizzasDAO;
