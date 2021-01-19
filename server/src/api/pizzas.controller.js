const PizzasDAO = require('../dao/pizzasDAO');
const IngredientsDAO = require('../dao/ingredientsDAO');
const PasteriesDAO = require('../dao/pasteriesDAO');

class PizzasController {
  static async apiGetPizzas(req, res) {
    try {
      const pizzasResult = await PizzasDAO.getPizzas();
      const pizzas = await pizzasResult.toArray();

      res.json(pizzas);
    } catch (err) {
      res.status(500).json({ err });
    }
  }

  static async apiPostPizza(req, res) {
    try {
      const { name, pastry, ingredients } = req.body;
      const date = new Date();

      await PizzasDAO.addPizza({
        name, pastry, ingredients, date, author: req.user.email,
      });

      res.json({ status: 'success' });
    } catch (err) {
      res.status(500).json({ err });
    }
  }

  static async apiGetComponents(req, res) {
    try {
      const ingredientsResult = await IngredientsDAO.getIngredients();
      const pasteriesResult = await PasteriesDAO.getPasteries();

      const ingredients = await ingredientsResult.toArray();
      const pasteries = await pasteriesResult.toArray();

      res.json({ ingredients, pasteries });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }
}

module.exports = PizzasController;
