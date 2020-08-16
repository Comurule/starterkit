
const { Lead, PreferenceCenter, CurrentBusiness  } = require('../../models');
const axios = require('axios');

const { renderPage, axiosFetch } = require("../../utils/webResponse");
const { errorLog } = require('../../utils/apiResponse');
 
exports.getUpdateContact = async (req, res) => {
    const response = await axiosFetch(req, 'GET', `/contacts/${req.params.contactId}`);
    const contact = await response.data;
    renderPage(req, res, 'Update Contact', 'GET CONTACT UPDATE', {contact})
};

exports.getContact = async (req, res) =>{
    try {
        const {data} = await axiosFetch(req, 'GET', `/contacts/${req.params.contactId}`);
        const contact = await data;
        //Success Response
        renderPage(req, res, 'Contact Details', 'GET CONTACT DETAILS', {contact});
        
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.deleteContact = async (req, res) =>{
    try {
        const response = await axiosFetch(req, 'GET', `/contacts/${req.params.contactId}/delete`);
        if(response.status){
            //Success Response
            return res.redirect('/main/contacts');
        };
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.getAllContacts = async (req, res) => {        
    renderPage(req, res, 'Contact List', 'GET CONTACT LIST');
};