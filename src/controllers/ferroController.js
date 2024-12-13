const axios = require('axios');
const { get } = require('lodash');

require('dotenv').config();
class ferroController {
    ferroApi
    constructor() {
        this.ferroApi = process.env.ferro_api
    }


    async getPageContent() {
        try {
            const response = await axios.get(`${this.ferroApi}/page-content/general`);
            if (get(response, 'data.components[0].component.categories', []).length) {
                response.data.components[0].component.categories = response.data.components[0].component.categories.filter(item => !['Montaj', 'Tros va tros aksessuarlari'].includes(item.category.name.textUzLat))
            }
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

    async getChildProduct(id) {
        try {
            const response = await axios.get(`${this.ferroApi}/product/${id}/children`);

            return response?.data
        } catch (error) {
            throw new Error('API request error:', error);
        }
    }

    async ferroSearchApi(text) {
        try {
            const response = await axios.get(`${this.ferroApi}/search/compact/product?query=${text}&language=uz`);
            return response?.data
        } catch (error) {
            throw new Error('API request error:', error);
        }
    }

    async getNewProducts(id) {
        try {
            const response = await axios.get(`${this.ferroApi}/page-content?key=new-products-bot`);
            return response?.data
        } catch (error) {
            throw new Error('API request error:', error);
        }
    }

    async getChildrenDetails(id) {
        try {
            const response = await axios.get(`${this.ferroApi}/product/${id}`);
            return response?.data
        } catch (error) {
            throw new Error('API request error:', error);
        }
    }


}

module.exports = new ferroController();


