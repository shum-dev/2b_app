const pasterySeed = require('../data_sample/pastery');

let pasteries;

class PasteriesDAO {
  static async injectDB(conn) {
    if (pasteries) {
      return;
    }
    try {
      pasteries = await conn.db(process.env.DB_NAME).collection('pasteries');

      const deleteAllResult = await pasteries.deleteMany({});
      console.log('Pasteries deletion: ', deleteAllResult.result);
      const seedingResult = await pasteries.insertMany(pasterySeed);
      console.log('Pasteries seeds: ', seedingResult.result);
    } catch (err) {
      console.error(`Unable to establish a collection handle in PizzasDAO: ${err.stack}`);
    }
  }

  static getPasteries() {
    try {
      return pasteries.find({});
    } catch (err) {
      return console.error(`Unable to get pasteries: ${err.stack}`);
    }
  }
}

module.exports = PasteriesDAO;
