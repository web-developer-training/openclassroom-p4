const uuid = require('uuid/v1');
const Teddy = require('../models/Sauce');

exports.getAllSauces = (req, res, next) => {
  Teddy.find().then(
    (sauces) => {

      res.status(200).json(sauces);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  );
};
