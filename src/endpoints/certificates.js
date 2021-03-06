const Transportation = require('../models/Transportation');
const logger = require('../utils/Logger');
const getAuthedUser = require('../utils/getAuthedUser');
const path = require('path');

module.exports = (app) => {
  app.get('/certificate/:transportationId', async (req, res) => {
    try {
      const user = await getAuthedUser(req.query.authToken);
      if (!user) {
        return res.status(403).json({ error: 'Need to be logged in.' });
      }
      
      const transportation = await Transportation.findById(req.params.transportationId);
      if (!transportation) {
        return res.status(404).json({ error: 'Not found.' });
      }

      if (!((transportation.clientId && transportation.clientId.toString() === user._id.toString())
        || (transportation.transporterId.toString() === user._id.toString())
        || (transportation.providerId.toString() === user._id.toString())
        || user.isAdmin)) {

        return res.status(403).json({ error: 'No access to this transportation.' });
      }

      if (!transportation.certificatePath) {
        return res.status(400).json({ error: 'Certificate is not issued.' });
      }

      return res.sendFile(path.join(__dirname, '../../certificates/' + transportation.certificatePath));
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
  });
}