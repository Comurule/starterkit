
const { Lead, PreferenceCenter, CurrentBusiness  } = require('../../models');
const axios = require('axios');

const { renderPage, axiosFetch } = require("../../utils/webResponse");
const { errorLog } = require('../../utils/apiResponse');
 

exports.getCreateAccount = async (req, res) => {
    renderPage(req, res, 'Create Account', 'GET ACCOUNT CREATE');
};

exports.getUpdateAccount = async (req, res) => {
    const response = await axiosFetch(req, 'GET', `/accounts/${req.params.accountId}`);
    const account = await response.data;
    renderPage(req, res, 'Update Account', 'GET ACCOUNT UPDATE', {account})
};

exports.getAccount = async (req, res) =>{
    try {
        const {data} = await axiosFetch(req, 'GET', `/accounts/${req.params.accountId}`);
        const account = await data;
        //Success Response
        renderPage(req, res, 'Account Details', 'GET ACCOUNT DETAILS', {account});
        
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.deleteAccount = async (req, res) =>{
    try {
        const response = await axiosFetch(req, 'GET', `/accounts/${req.params.accountId}/delete`);
        if(response.status){
            //Success Response
            return res.redirect('/main/accounts');
        };
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.getAllAccounts = async (req, res) => {        
    renderPage(req, res, 'Account List', 'GET ACCOUNT LIST');
};