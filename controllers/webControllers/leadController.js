
const { Lead, PreferenceCenter, CurrentBusiness  } = require('../../models');
// const flash = require('connect-flash');
const axios = require('axios');

const { renderPage, axiosFetch } = require("../../utils/webResponse");
const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');

exports.getCreateLead = async (req, res) => {
    // const {data} = await axiosFetch(req, 'GET', '/preferences', '');
    // const preferences = await data;
    renderPage(req, res, 'Create Lead', 'GET LEAD CREATE');
};
 
exports.getUpdateLead = async (req, res) => {
    const response = await axiosFetch(req, 'GET', `/leads/${req.params.leadId}`);
    const lead = await response.data;
    renderPage(req, res, 'Update Lead', 'GET LEAD UPDATE', {lead})
};

exports.getLead = async (req, res) =>{
    try {
        const {data} = await axiosFetch(req, 'GET', `/leads/${req.params.leadId}`);
        const lead = await data;
        //Success Response
        renderPage(req, res, 'Lead Details', 'GET LEAD DETAILS', {lead});
        
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.deleteLead = async (req, res) =>{
    try {
        const response = await axiosFetch(req, 'GET', `/leads/${req.params.leadId}/delete`);
        if(response.status){
            //Success Response
            // req.flash('success', 'Lead deleted Successfully...');
            return res.redirect('/main/leads');
        };
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.getAllLeads = async (req, res) => {        
    renderPage(req, res, 'Lead List', 'GET LEAD LIST')
};