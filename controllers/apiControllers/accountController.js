/**
 * Controller for Account.
 * Author: Chibuike Umechukwu.
 * Version: 1.0.0
 * Release Date: 20-July-2020
 * Last Updated: 22-July-2020
 */

/**
 * Module dependencies.
 */
const { Account, Lead, PreferenceCenter } = require('../../models');
const{ 
    errorRes, errorLog, successResWithData, successRes
} = require('../../utils/apiResponse');

// Handle User create on POST.
exports.createAccount = async(req, res) => { 
    try {
        const accountData = await validateInput(req, res);
        if(typeof accountData === 'string') return errorRes(res, accountData);
        //check for duplicate in the database
        const checkAccount = await Account.findOne({ where: { email: accountData.email }  });
        if(checkAccount) {
            return errorRes( res, 'This Email has been used...')
        };

        const createdAccount = await Account.create({
            ...accountData,
            modifiedBy: req.user.id,
            departmentId: req.user.DepartmentId,
            currentBusinessId: req.user.CurrentBusinessId,
        });

        //add the selected preferences
        const addPreferences = await createOrUpdatePreferences( req, res, createdAccount, 'create' )
        if(!addPreferences) {
            await Account.destroy({ where: { id: createdAccount.id } })
            return errorRes(res, 'Failed to add Preferences');
        };

        //Success Response
        const data = await createdAccount;
        successResWithData( res, 'Account created Successfully', data ); 

    } catch (error) {
        console.log(error);
        await Account.destroy({ where: { id: createdAccount.id } })
        errorLog( res, 'Account creation was Unsuccessful.')
    }
    
};
 
exports.updateAccount = async(req, res) => {
    try {
        const accountData = validateInput(req, res);
        if(typeof accountData === 'string') return errorRes(res, accountData)
        //check for duplicate in the database
        const checkAccount = await Account.findOne({ where: { email: accountData.email }  });
        if( checkAccount && checkAccount.id != req.params.accountId ) {
            return errorRes( res, 'This Email has been used...')
        }
            
        await Account.update( {
            ...accountData,
            modifiedBy: req.user.id
        }, { 
            where: { id: req.params.accountId } 
        });

        //add the selected preferences
        const data = await Account.findByPk( req.params.accountId, {include: PreferenceCenter} );
        const updatePreferences = await createOrUpdatePreferences( req, res, data, 'update' )
        if(!updatePreferences)return errorRes(res, 'Account Updated but Failed to update Preferences');

        //Success Response
        successResWithData( res, 'Account updated Successfully', data );
   
    } catch (error) {
        console.log(error);
        errorLog( res, 'Account update was Unsuccessful.')
    }
    
};

exports.getAccount = async (req, res) =>{
    try {
        const account = await Account.findByPk(req.params.accountId, {include: PreferenceCenter});
        if(!account) errorRes( res, 'Invalid Account Id');

        //Success Response
        const data = await account;
        successResWithData( res, 'Account Details', data );
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.deleteAccount = async (req, res) =>{
    try {
        await Account.destroy( { where: { id: req.params.accountId }  } );
        
        //Success Response
        successRes( res, 'Account record deleted successfully.' );
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    };
    
};

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll({
            where: {
                departmentId: req.user.DepartmentId,
                currentBusinessId: req.user.CurrentBusinessId,
            }
        });
        
        //Success Response
        const data = await accounts;
        successResWithData( res, 'Account List', data ) 

    } catch (error) {
        console.log(error)
        errorLog( res, 'Something went Wrong' );
    }
    
};

// ACCOUNT HELPERS
const validateInput = (req, res) => {

    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const email = req.body.email.trim();
    const username = (req.body.username != '')? req.body.username.trim() : '';
    const address = (req.body.address != '')? req.body.address.trim():'';
    const city = (req.body.city != '')? req.body.city.trim(): '';
    const country = (req.body.country != '')? req.body.country.trim(): '';
    const billingCurrency = (req.body.billingCurrency != '')? req.body.billingCurrency.trim().toUpperCase(): undefined;
    const billingLanguage = (req.body.billingLanguage != '')? req.body.billingLanguage.trim(): undefined;
    const billingName = (req.body.billingName != '')? req.body.billingName.trim(): '';
    const billingEmail = (req.body.billingEmail != '')? req.body.billingEmail.trim(): '';
    const billingWebsite = (req.body.billingWebsite != '')? req.body.billingWebsite.trim(): '';
    const billingAddress = (req.body.billingAddress != '')? req.body.billingAddress.trim(): '';
    const billingCity = (req.body.billingCity != '')? req.body.billingCity.trim(): '';
    const billingCountry = (req.body.billingCountry != '')? req.body.billingCountry.trim(): '';
     
    
    //check for empty fields
    if( 
        !firstName || !lastName || !email || !username || username == '' || 
        firstName == '' || lastName == '' || email == '' 
    ) return 'Fill all required Fields';

    //validate billingCurrency 
    if( billingCurrency && (!billingCurrency.match(/^[A-Za-z]+$/) || billingCurrency.trim().length != 3) )
        return 'Currency should have 3 CAPITAL letters only.';

    //validate billingWebsite
    const regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
    if( billingWebsite != '' && !billingWebsite.match(regex) ) return 'Wrong company URL...';
    
    //Success output
    return {
        firstName, 
        lastName, 
        email,
        username,
        address,
        city,
        country,
        billingCurrency,
        billingLanguage,
        billingName,
        billingEmail,
        billingWebsite,
        billingAddress,
        billingCity,
        billingCountry,
        leadId: req.body.leadId,
        createdBy: req.body.createdBy
    }
};

const createOrUpdatePreferences = async(req, res, data, actionType) => {
    const { preferences } = req.body;

    if( !preferences) 
        return false

    //Create Preferences in Account Profile
    if( actionType == 'create' && preferences.length > 0 ) {
        try {
            if(preferences.length == 1){
                preferenceId = (typeof preferences == 'object')? preferences[0] : preferences;
                const preference = await PreferenceCenter.findByPk(preferenceId)
                await data.addPreferenceCenter(preference);
                return true

            }else {
                preferences.forEach( async preferenceId => {
                    const preference = await PreferenceCenter.findByPk(preferenceId)
                    await data.addPreferenceCenter(preference);
                })
                
                return true
            }
        } catch (error) {
            console.log(error);
            return false
        }
        //Update Preferences in Account Profile
    } else if ( actionType == 'update' && preferences.length > 0 ) {
        try {
            //delete all account preferences            
            await data.removePreferenceCenter(data.PreferenceCenters)
            //add the incoming Preferences to this account
            let preferenceId;
            if(preferences.length == 1){
                preferenceId = (typeof preferences == 'object')? preferences[0] : preferences;
                const preference = await PreferenceCenter.findByPk(preferenceId)
                await data.addPreferenceCenter(preference);
               return true;
            }else{
                preferences.forEach( async preferenceId => {
                    const preference = await PreferenceCenter.findByPk(preferenceId)
                    await data.addPreferenceCenter(preference);
                })
                
               return true;
            }
        } catch (error) {
            console.log(error);
            return false
        }
    }
    
   
};