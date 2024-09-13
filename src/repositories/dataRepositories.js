
const { get } = require('lodash')
const moment = require('moment')
let { db } = require('../config')

module.exports = {
    GETEMPBYPHONE: `SELECT T0."empID", T0."lastName", T0."firstName", T0."jobTitle", T0."mobile", T0."U_Master" FROM ${db}.OHEM T0 where T0."mobile"= ?`,
}



