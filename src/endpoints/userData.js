const Transportation = require('../models/Transportation');
const logger = require('../utils/Logger');
const getAuthedUser = require('../utils/getAuthedUser');
const locales = require('../../config/locales');
const dataSampler = require('../utils/dataSampler');
const { json } = require('body-parser');

module.exports = (app) => {
  app.get('/getMyTransportations', async (req, res) => {
    try {
      const user = await getAuthedUser(req.query.authToken);
      if (!user) {
        return res.status(403).json({ error: 'Need to be logged in.' });
      }
      
      const myTrasportations = await Transportation.find({ $or: [{ providerId: user._id }, { clientId: user._id }, { transporterId: user._id }] }).lean();
      return res.json({ transportations: myTrasportations });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
  app.get('/getlocales', async (req, res) => {
    try {
      return res.json({ locales });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
  app.get('/generateSample', async (req, res) => {
    try {
      const user = await getAuthedUser(req.query.authToken);
      if (!user) {
        return res.status(403).json({ error: 'Need to be logged in.' });
      }
      
      await dataSampler(true, user);

      const myTrasportations = await Transportation.find({ $or: [{ providerId: user._id }, { clientId: user._id }, { transporterId: user._id }] }).lean();
      return res.json({ transportations: myTrasportations });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
  });
}