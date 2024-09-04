const axios = require('axios');
require('dotenv').config();
class ferroController {

    ferroApi
    constructor() {
        this.ferroApi = process.env.ferro_api
    }


    async getPageContent() {
        try {
            const response = await axios.get(`${this.ferroApi}/page-content/general`);

            return response?.data
        } catch (error) {
            throw new Error('API request error:', error);
        }
    }

    async getProductListCategory(id) {
        try {
            const response = await axios.get(`${this.ferroApi}/product/list/category/${id}`);

            return response?.data
        } catch (error) {
            throw new Error('API request error:', error);
        }
    }
}

module.exports = new ferroController();


