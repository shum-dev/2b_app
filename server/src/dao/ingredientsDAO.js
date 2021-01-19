const ingredientsSeed = require('../data_sample/ingredients');

let ingredients;

class IngredientsDAO {
  static async injectDB(conn) {
    if (ingredients) {
      return;
    }
    try {
      ingredients = await conn.db(process.env.DB_NAME).collection('ingredients');

      const deleteAllResult = await ingredients.deleteMany({});
      console.log('Ingredients deletion: ', deleteAllResult.result);
      const seedingResult = await ingredients.insertMany(ingredientsSeed);
      console.log('Ingredients seeds: ', seedingResult.result);
    } catch (err) {
      console.error(`Unable to establish a collection handle in PizzasDAO: ${err.stack}`);
    }
  }

  static getIngredients() {
    try {
      return ingredients.find({});
    } catch (err) {
      return console.error(`Unable to get ingredients: ${err.stack}`);
    }
  }
}

module.exports = IngredientsDAO;
