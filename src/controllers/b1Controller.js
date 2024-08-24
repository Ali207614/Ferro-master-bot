let dbService = require('../services/dbService')

const moment = require('moment');
const { GETEMPBYPHONE } = require("../repositories/dataRepositories");
require('dotenv').config();


class b1Controller {

    async getBusinessPartnerByPhone(phone = '') {
        try {
            let data = await dbService.executeParam(GETEMPBYPHONE, [phone])
            return data
        }
        catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = new b1Controller();


