/**
 * Controller for Lead Preference.
 * Author: Chibuike Umechukwu.
 * Version: 1.0.0
 * Release Date: 20-July-2020
 * Last Updated: 22-July-2020
 */

/**
 * Module dependencies.
 */
const { LeadPreference, Lead, PreferenceCenter } = require('../../models');
const{ 
    errorRes, errorLog, successResWithData
} = require('../../utils/apiResponse');


exports.createLeadPreference = async(req, res) => {
    await validateInput(req, res);

    const {leadId, preferenceId} = req.body;
    
    try {
        //check for duplicate in the database
        const checkLeadPreference = await LeadPreference.findOne({ where: { leadId, preferenceId }  });
        if(checkLeadPreference) {
            errorRes( res, 'This Lead Preference already exists.')
        }else{
        
            const createdLeadPreference = await LeadPreference.create(req.body)
            
            //Success Response
            const data = await createdLeadPreference;
            successResWithData( res, 'Lead Preference created Successfully', data )
        }     
   
    } catch (error) {
        console.log(error);
        errorLog( res, 'LeadPreference creation was Unsuccessful.')
    }
    
};
 
exports.updateLeadPreference = async(req, res) => {
    try {
        const checkLeadPreference = await LeadPreference.findByPk(req.params.leadPreferenceId);
        if(!checkLeadPreference) errorRes(res, 'Invalid Lead Preference Id');
        console.log(typeof req.body.isActive, typeof req.body.enrolled);
        const isActive = (typeof req.body.isActive == 'boolean')? req.body.isActive : checkLeadPreference.isActive;
        const enrolled = (typeof req.body.enrolled == 'boolean')? req.body.enrolled : checkLeadPreference.enrolled;

        await LeadPreference.update( { isActive, enrolled }, { where: { id: req.params.leadPreferenceId } });

        //Success Response
        const data = await LeadPreference.findByPk( req.params.leadPreferenceId );
        successResWithData( res, 'LeadPreference updated Successfully', data )
        if(!data) return errorRes(res, 'Invalid Lead Preference Id')
      
    } catch (error) {
        console.log(error);
        errorLog( res, 'Lead Preference update was Unsuccessful.')
    }
    
};

exports.getLeadPreference = async (req, res) =>{
    try {
        const leadPreference = await LeadPreference.findByPk( req.params.leadPreferenceId, {
            include: [ Lead, PreferenceCenter ]
        })
        if(!leadPreference) return errorRes( res, 'Invalid LeadPreference Id')

        //Success Response
        const data = await leadPreference
        successResWithData( res, 'Lead Preference Account Details', data );
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.deleteLeadPreference = async (req, res) =>{
    try {
        await LeadPreference.destroy( { where: { id: req.params.leadPreferenceId }  } );
        
        //Success Response
        successRes( res, 'Lead Preference Account deleted successfully.' );
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.getAllLeadPreferences = async (req, res) => {
    try {
        const LeadPrefs = await LeadPreference.findAll();
        
        //Success Response
        const data = await LeadPrefs
        successResWithData( res, 'LeadPreference List', data );

    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went Wrong' );
    }
    
};