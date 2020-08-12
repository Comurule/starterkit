
const { Lead, PreferenceCenter, Account } = require('../../models');
// const flash = require('connect-flash');

const { renderPage } = require("../../utils/webResponse");
const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');

exports.getCreateAccount = async (req, res) => {
    try{
        const lead = await Lead.findByPk(req.query.leadId);
        const preferences = await PreferenceCenter.findAll();
        
        renderPage(req, res, 'Create Account', 'GET ACCOUNT CREATE', {preferences, lead});
    }catch(error) {
        console.log(error);
        res.redirect('back');
    }
};

exports.createAccount = async(req, res) => {

    const accountData = validateInput(req, res);
    try {
        //check for duplicate in the database
        const checkAccount = await Account.findOne({ where: { email: accountData.email }  });
        if(checkAccount) {
            // req.flash('error', 'This Email has been used...');
            return res.redirect('back');
        }
        
        
        const createdAccount = await Account.create({
            ...accountData,
            createdBy: req.user.id,
            modifiedBy: req.user.id
        })

        //add the selected preferences
        const addPreferences = await createOrUpdatePreferences( req, res, createdAccount, 'create' )
        if(!addPreferences) {
            await Account.destroy({ where: { id: createdAccount.id } })
            // req.flash('error', 'Failed to add Preferences');
            return res.redirect('back');
        }
        
        //update the lead model to change status to converted
        await Lead.update({leadStatus:'converted'}, {
            where: {id:accountData.leadId}
        });
        // req.flash('success', 'Account created Successfully...');
        return res.redirect('/main/accounts');
                
    } catch (error) {
        console.log(error);
        errorLog( res, 'Account creation was Unsuccessful.')
    }
    
};
 
exports.getUpdateAccount = async (req, res) => {
    try{
        const account = await Account.findByPk(req.params.accountId);
        const preferences = await PreferenceCenter.findAll();
    
        renderPage(req, res, 'Update Account', 'GET ACCOUNT UPDATE', {preferences, account})

    }catch(error) {
        console.log(error);
        res.redirect('back');
    }        
};

exports.updateAccount = async(req, res) => {
    
    const accountData = validateInput(req, res);
    try {
        //check for duplicate in the database
        const checkAccount = await Account.findOne({ where: { email: accountData.email }  });
        if( checkAccount && checkAccount.id != req.params.accountId ) {
            // req.flash('error', 'This Email has been used...' )
            return res.redirect('back');
        
        }
        await Account.update( { ...accountData, modifiedBy: req.user.id }, 
            { 
                where: { id: req.params.accountId }  
            }
        );

        //add the selected preferences
        const data = await Account.findByPk( req.params.accountId );
        const updatePreferences = await createOrUpdatePreferences( req, res, data, 'update' )
        if(!updatePreferences) {
            // req.flash('error', 'Account Updated but Failed to update Preferences' )
            return res.redirect('/main/accounts');
        }
        //Success Response
        // req.flash('success', 'Account updated successfully...');
        return res.redirect('/main/accounts');
           
   
    } catch (error) {
        console.log(error);
        errorLog( res, 'Account update was Unsuccessful.')
    }
    
};

exports.getAccount = async (req, res) =>{
    try {
        const account = await Account.findByPk( req.params.accountId, {
            include: PreferenceCenter
        } )
        if(!account) return errorRes( res, 'Invalid Account Id');
        
        //Success Response
        renderPage(req, res, 'Account Details', 'GET ACCOUNT DETAILS', {account});
        
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.deleteAccount = async (req, res) =>{
    try {
        await Account.destroy( { where: { id: req.params.accountId }  } )
        
        //Success Response
        res.redirect('/main/accounts');
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll({include: PreferenceCenter});
        renderPage(req, res, 'Account List', 'GET ACCOUNT LIST', {accounts} )
        
    } catch (error) {
        console.log(error)
        errorLog( res, 'Something went Wrong' );
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
    const billingCurrency = (req.body.billingCurrency != '')? req.body.billingCurrency.trim().toUpperCase(): '';
    const billingLanguage = (req.body.billingLanguage != '')? req.body.billingLanguage.trim(): '';
    const billingName = (req.body.billingName != '')? req.body.billingName.trim(): '';
    const billingEmail = (req.body.billingEmail != '')? req.body.billingEmail.trim(): '';
    const billingWebsite = (req.body.billingWebsite != '')? req.body.billingWebsite.trim(): '';
    const billingAddress = (req.body.billingAddress != '')? req.body.billingAddress.trim(): '';
    const billingCity = (req.body.billingCity != '')? req.body.billingCity.trim(): '';
    const billingCountry = (req.body.billingCountry != '')? req.body.billingCountry.trim(): '';
    const leadId = req.body.leadId 
    
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
    if( billingCurrency != '' && (!billingCurrency.match(/^[A-Za-z]+$/) || billingCurrency.trim().length != 3) )
        return errorRes( res, 'Currency should have three alphabets only.' )

    //validate companyWebsite
    const regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
    if( billingWebsite != '' && !billingWebsite.match(regex) ) return errorRes( res, 'Wrong company URL...')
    
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
        billingLanguage,
        billingName,
        billingEmail,
        billingAddress,
        billingCity,
        billingCountry,
        leadId
    }
}

const createOrUpdatePreferences = async(req, res, Data, actionType) => {
    
    const { preferences } = req.body;

    if( !preferences || typeof(preferences) != 'object') 
        return false

    //Create Preferences in Lead Profile
    if( actionType == 'create' && preferences.length > 0 ) {
        try {
            if(preferences.length == 1){
                const preference = await PreferenceCenter.findByPk(preferences)
                await Data.addPreferenceCenter(preference);
                return true

            }else {
                preferences.forEach( async preferenceId => {
                    const preference = await PreferenceCenter.findByPk(preferenceId)
                    await Data.addPreferenceCenter(preference);
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