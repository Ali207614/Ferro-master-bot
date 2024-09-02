const axios = require('axios');
require('dotenv').config();
class ferroController {

    async getPageContent() {
        try {
            const response = await axios.get('https://ferro.uz/api/page-content/general');

            return response?.data
        } catch (error) {
            throw new Error('API request error:', error);
        }
    }

    async getProductListCategory(id) {
        try {
            const response = await axios.get(`https://ferro.uz/api/product/list/category/${id}`);

            return response?.data
        } catch (error) {
            throw new Error('API request error:', error);
        }
    }
}

module.exports = new ferroController();


