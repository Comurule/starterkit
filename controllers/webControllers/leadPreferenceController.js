const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');
const { renderPage, axiosFetch } = require("../../utils/webResponse");

exports.getLeadPreference = async (req, res) => {
    try {
        const preference = await PreferenceCenter.findByPk( req.params.preferenceId, { include: Lead });
        if(!preference) errorRes( res, 'Invalid Entry DEtails' )

        const parentPC = await PreferenceCenter.findByPk( preference.parentPC )
        //Success Response
        renderPage(req, res, 'Preference Details', 'GET PREFERENCE DETAILS', {preference, parentPC})
     
    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};

exports.getAllLeadPreference = async (req, res) => {
    try {
        console.log('Lead Preference Controller');
        //Success Response
        renderPage(req, res, 'LeadPreference List', 'GET LEADPREFERENCE LIST')
        
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' )
    }
};
