
const { Lead, PreferenceCenter, CurrentBusiness  } = require('../../models');
const { renderPage } = require("../../utils/webResponse");
const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');

exports.getCreateLead = async (req, res) => {
    const preferences = await PreferenceCenter.findAll();
    
    renderPage(req, res, 'Create Lead', 'GET LEAD CREATE', {preferences});
};

exports.createLead = async(req, res) => {

    const leadData = validateInput(req, res);
    try {
        //check for duplicate in the database
        const checkLead = await Lead.findOne({ where: { email: leadData.email }  });
        if(checkLead) {
            return errorRes( res, 'This Email has been used...')
        }
        
        const createdLead = await Lead.create({
            ...leadData,
            createdBy: req.user.id,
            modifiedBy: req.user.id
        })

        //add the selected preferences
        const addPreferences = await createOrUpdatePreferences( req, res, createdLead, 'create' )
        if(!addPreferences) {
            await Lead.destroy({ where: { id: createdLead.id } })
            return errorRes(res, 'Failed to add Preferences');
        }
        res.redirect('/main/leads')
                
    } catch (error) {
        console.log(error);
        errorLog( res, 'Lead creation was Unsuccessful.')
    }
    
};
 
exports.getUpdateLead = async (req, res) => {
    const lead = await Lead.findByPk(req.params.leadId);
    const preferences = await PreferenceCenter.findAll();
    
    renderPage(req, res, 'Create Lead', 'GET LEAD UPDATE', {preferences, lead})
};

exports.updateLead = async(req, res) => {
    
    const leadData = validateInput(req, res);
    try {
        //check for duplicate in the database
        const checkLead = await Lead.findOne({ where: { email: leadData.email }  });
        if( checkLead && checkLead.id != req.params.leadId ) {
            return errorRes( res, 'This Email has been used...')
        }else{
            
            const updatedLead = await Lead.update( {
                ...leadData,
                modifiedBy: req.user.id
            }, 
                { 
                    where: { id: req.params.leadId }  
                }
            )

            //add the selected preferences
            const data = await Lead.findByPk( req.params.leadId );
            const updatePreferences = await createOrUpdatePreferences( req, res, data, 'update' )
            if(!updatePreferences)return errorRes(res, 'Lead Updated but Failed to update Preferences');

            //Success Response
            res.redirect('/main/leads');
        }     
   
    } catch (error) {
        console.log(error);
        errorLog( res, 'Lead update was Unsuccessful.')
    }
    
};

exports.getLead = async (req, res) =>{
    try {
        const lead = await Lead.findByPk( req.params.leadId, {
            include: PreferenceCenter
        } )
        if(!lead) return errorRes( res, 'Invalid Lead Id');
        
        //Success Response
        renderPage(req, res, 'Lead Details', 'GET LEAD DETAILS', {lead});
        
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.deleteLead = async (req, res) =>{
    try {
        await Lead.destroy( { where: { id: req.params.leadId }  } )
        
        //Success Response
        res.redirect('/main/leads');
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.findAll({include: PreferenceCenter});
        console.log(leads);
        renderPage(req, res, 'Lead List', 'GET LEAD LIST', {leads} )
        
    } catch (error) {
        console.log(error)
        errorLog( res, 'Something went Wrong' );
    }   
};

// LEAD HELPERS
const validateInput = (req, res) => {
    console.log(req.body);
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
        !firstName || !lastName || !email || firstName == '' || lastName == '' || email == '' 
    ) errorRes( res, 'Fill all Fields' );
    

    //validate the password
    if(password != null) {
        if(password.length < 8 ) 
            return errorRes( res, 'Password should not be less than 8 characters.' )
    }

    //validate leadCurrency 
    if( leadCurrency != '' && (!leadCurrency.match(/^[A-Za-z]+$/) || leadCurrency.trim().length != 3) )
        return errorRes( res, 'Currency should have three alphabets only.' )

    //validate companyWebsite
    const regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
    if( companyWebsite != '' && !companyWebsite.match(regex) ) return errorRes( res, 'Wrong company URL...')
    
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
        leadLanguage,
        companyName,
        companyEmail,
        companyAddress,
        companyCity,
        companyCountry,
    }
}

const createOrUpdatePreferences = async(req, res, leadData, actionType) => {
    
    const { preferences } = req.body;

    if( !preferences || typeof(preferences) != 'object') 
        return false

    //Create Preferences in Lead Profile
    if( actionType == 'create' && preferences.length > 0 ) {
        try {
            if(preferences.length == 1){
                const preference = await PreferenceCenter.findByPk(preferences)
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
            const oldPreferences = await leadData.getPreferenceCenter();
            await leadData.removePreferenceCenter(oldPreferences)

            //add the incoming Preferences to this lead
            if(preferences.length == 1){

                const preference = await PreferenceCenter.findByPk(preferences)
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
    
   
}