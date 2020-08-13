const { CurrentBusiness  } = require('../models');
const flash = require('connect-flash');
const axios = require("axios");


/** 
 * Render Pages on Lead Campaign Front End App
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {String} title - title of the page
 * @param {String} functioName - string used in the switch statement to access the page
 * @param {Object} rest - Additional object to be passed to the page
 * @returns {Object} - Page rendered
 */
exports.renderPage = async (req, res, title, functioName, rest ) => {
    const currentBusiness = await CurrentBusiness.findOrCreate({where: {id: req.user.CurrentBusinessId }});
     res.render('pages/content', {
        title,
        functioName,
        layout: 'layouts/main',
        user: req.user,
        current_business_name: currentBusiness[0].current_business_name,
        ...rest
    })
};


/** 
 * Axios call to the Api Controllers 
 * @param {object} req - request object
 * @param {string} method - fetch method( get or post)
 * @param {string} url - relative path to the API controller
 * @param {Object} data - Additional details passed to the API(in Post requests)
 * @returns {Object} - response object from the API call
 */
exports.axiosFetch = async ( req, method, url, data ) => {
    const responseData = await axios({
        method,
        url: `https://comurule-leadcampaign.herokuapp.com/api/v1${url}`,
        data,
    });
    return responseData.data;
};