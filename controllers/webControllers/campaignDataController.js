const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');
const { renderPage, axiosFetch } = require("../../utils/webResponse");

exports.getCreateCampaign = async (req, res) => {
    const data = await axiosFetch(req, 'GET', '/preferences', '' )
    const preferences = await data.data;
    console.log(preferences);
    //Success Response
    renderPage(req, res, 'Create Preference', 'GET PREFERENCE CREATE', {preferences})
    
};

exports.getUpdatePreference = async (req, res) => {
    const {data} = await axiosFetch(req, 'GET', `/preferences/${req.params.preferenceId}`);
    const preference = await data;
    console.log(preference);
    //Success Response
    renderPage(req, res, 'Update Preference', 'GET PREFERENCE UPDATE', {preference})
  
};

exports.deletePreference = async (req, res) => {
    try {
        const response = await axiosFetch(req, 'GET', `/preferences/${req.params.preferenceId}/delete`);
        
        // response.status ? req.flash('success', response.message) : req.flash('error', response.message);
        return res.redirect('/main/preferences');


    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};

exports.getPreference = async (req, res) => {
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

exports.getAllCampaignData = async (req, res) => {
    try {
        //Success Response
        renderPage(req, res, 'CampaignData List', 'GET CAMPAIGN DATA LIST')
        
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' )
    }
};