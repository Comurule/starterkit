/**
 * Controller for Lead.
 * Author: Chibuike Umechukwu.
 * Version: 1.0.0
 * Release Date: 20-July-2020
 * Last Updated: 22-July-2020
 */

/**
 * Module dependencies.
 */
const { Lead, PreferenceCenter } = require('../../models');
const{ 
    errorRes, errorLog, successResWithData, successRes
} = require('../../utils/apiResponse');

// Handle User create on POST.
exports.createLead = async(req, res) => {    
    try {
        const leadData = await validateInput(req, res);
        if(typeof leadData === 'string') return errorRes(res, leadData);
        //check for duplicate in the database
        const checkLead = await Lead.findOne({ where: { 
            email: leadData.email,            
            departmentId: req.user['dataValues'].DepartmentId,
            currentBusinessId: req.user['dataValues'].CurrentBusinessId 
        }  });
        if(checkLead) {
            return errorRes( res, 'This Email has been used...')
        };

        const createdLead = await Lead.create({
            ...leadData,
            createdBy: req.user.id,
            modifiedBy: req.user.id,
            departmentId: req.user.DepartmentId,
            currentBusinessId: req.user.CurrentBusinessId,
        });

        //add the selected preferences
        const addPreferences = await createOrUpdatePreferences( req, res, createdLead, 'create' )
        if(!addPreferences) {
            await Lead.destroy({ where: { id: createdLead.id } })
            return errorRes(res, 'Failed to add Preferences');
        };

        //Success Response
        const data = await createdLead;
        successResWithData( res, 'Lead created Successfully', data ); 

    } catch (error) {
        console.log(error);
        await Lead.destroy({ where: { id: createdLead.id } })
        errorLog( res, 'Lead creation was Unsuccessful.')
    }
    
};
 
exports.updateLead = async(req, res) => {
    try {
        const leadData = validateInput(req, res);
        if(typeof leadData === 'string') return errorRes(res, leadData);

        //check for duplicate in the database
        const checkLead = await Lead.findOne({ where: { 
            email: leadData.email,
            departmentId: req.user['dataValues'].DepartmentId,
            currentBusinessId: req.user['dataValues'].CurrentBusinessId
        }  });
        if( checkLead && checkLead.id != req.params.leadId ) {
            return errorRes( res, 'This Email has been used...')
        };
        //check if the Lead is converted
        if( checkLead.leadStatus == 'converted') 
            return errorRes( res, 'You can not update a "converted" Lead');
            
        await Lead.update( {
            ...leadData,
            modifiedBy: req.user.id
        }, { 
            where: { id: req.params.leadId } 
        });

        //add the selected preferences
        const data = await Lead.findByPk( req.params.leadId, {include: PreferenceCenter} );
        const updatePreferences = await createOrUpdatePreferences( req, res, data, 'update' )
        if(!updatePreferences)return errorRes(res, 'Lead Updated but Failed to update Preferences');

        //Success Response
        successResWithData( res, 'Lead updated Successfully', data );
   
    } catch (error) {
        console.log(error);
        errorLog( res, 'Lead update was Unsuccessful.')
    }
    
};

exports.getLead = async (req, res) =>{
    try {
        const lead = await Lead.findByPk(req.params.leadId, {include: PreferenceCenter});
        if(!lead) errorRes( res, 'Invalid Lead Id');
        //Success Response
        const data = await lead;
        successResWithData( res, 'Lead Details', data );
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.deleteLead = async (req, res) =>{
    try {
        //check if the Lead is in the Database
        const checkLead = await Lead.findByPk(req.params.leadId);
        if(!checkLead) return errorRes(res, 'Invalid Lead Id');
        //check if the Lead is converted
        if( checkLead.leadStatus == 'converted') 
            return errorRes( res, 'You can not delete a "converted" Lead');
        await Lead.destroy( { where: { id: req.params.leadId }  } );
        
        //Success Response
        successRes( res, 'Lead Account deleted successfully.' );
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.findAll({
            where: {
                departmentId: req.user.DepartmentId,
                currentBusinessId: req.user.CurrentBusinessId,
            }
        });
        
        //Success Response
        const data = await leads
        successResWithData( res, 'Lead List', data ) 

    } catch (error) {
        console.log(error)
        errorLog( res, 'Something went Wrong' );
    }
    
};

exports.convertLead = async(req, res) => {
    try {
        await Lead.update({ leadStatus: req.body.status.trim() }, {
            where: { id: req.params.leadId }
        }); 
        //Success Response
        successRes(res, 'Lead converted Successfully...');
    } catch (error) {
        console.log(error);
        errorLog(res, 'Something went wrong...')
    }
    
};

// LEAD HELPERS
const validateInput = (req, res) => {
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const email = req.body.email.trim();
    const username = (req.body.username != '')? req.body.username.trim() : '';
    const password = (req.body.password != '')? req.body.password.trim() : null;
    const address = (req.body.address != '')? req.body.address.trim():'';
    const city = (req.body.city != '')? req.body.city.trim(): '';
    const country = (req.body.country != '')? req.body.country.trim(): '';
    const leadCurrency = (req.body.leadCurrency != '')? req.body.leadCurrency.trim().toUpperCase(): '';
    const leadLanguage = (req.body.leadLanguage != '')? req.body.leadLanguage.trim(): '';
    const companyName = (req.body.companyName != '')? req.body.companyName.trim(): '';
    const companyEmail = (req.body.companyEmail != '')? req.body.companyEmail.trim(): '';
    const companyWebsite = (req.body.companyWebsite != '')? req.body.companyWebsite.trim(): '';
    const companyAddress = (req.body.companyAddress != '')? req.body.companyAddress.trim(): '';
    const companyCity = (req.body.companyCity != '')? req.body.companyCity.trim(): '';
    const companyCountry = (req.body.companyCountry != '')? req.body.companyCountry.trim(): '';
     
    
    //check for empty fields
    if( 
        !firstName || !lastName || !email || !username || username == '' || 
        firstName == '' || lastName == '' || email == '' 
    ) return 'Fill all required Fields';
    

    //validate the password
    if(password != null) {
        if(password.length < 8 ) 
            return 'Password should not be less than 8 characters.';
    }

    //validate leadCurrency 
    if( leadCurrency != '' && (!leadCurrency.match(/^[A-Za-z]+$/) || leadCurrency.trim().length != 3) )
        return 'Currency should have three alphabets only.';

    //validate companyWebsite
    const regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
    if( companyWebsite != '' && !companyWebsite.match(regex) ) return 'Wrong company URL...';
    
    //Success output
    return {
        firstName, 
        lastName, 
        email,
        username,
        password,
        address,
        city,
        country,
        leadCurrency: leadCurrency != '' ? leadCurrency : null,
        leadLanguage,
        companyName,
        companyEmail,
        companyWebsite,
        companyAddress,
        companyCity,
        companyCountry,
    }
};

const createOrUpdatePreferences = async(req, res, leadData, actionType) => {
    const { preferences } = req.body;

    if( !preferences) 
        return false

    //Create Preferences in Lead Profile
    if( actionType == 'create' && preferences.length > 0 ) {
        try {
            if(preferences.length == 1){
                preferenceId = (typeof preferences == 'object')? preferences[0] : preferences;
                const preference = await PreferenceCenter.findByPk(preferenceId)
                await leadData.addPreferenceCenter(preference);
                return true

            }else {
                preferences.forEach( async preferenceId => {
                    const preference = await PreferenceCenter.findByPk(preferenceId)
                    await leadData.addPreferenceCenter(preference);
                })
                
                return true
            }
        } catch (error) {
            console.log(error);
            return false
        }
        //Update Preferences in Lead Profile
    } else if ( actionType == 'update' && preferences.length > 0 ) {
        try {
            //delete all lead preferences            
            await leadData.removePreferenceCenter(leadData.PreferenceCenters)
            //add the incoming Preferences to this lead
            let preferenceId;
            if(preferences.length == 1){
                preferenceId = (typeof preferences == 'object')? preferences[0] : preferences;
                const preference = await PreferenceCenter.findByPk(preferenceId)
                await leadData.addPreferenceCenter(preference);
               return true;
            }else{
                preferences.forEach( async preferenceId => {
                    const preference = await PreferenceCenter.findByPk(preferenceId)
                    await leadData.addPreferenceCenter(preference);
                })
                
               return true;
            }
        } catch (error) {
            console.log(error);
            return false
        }
    }
    
   
};