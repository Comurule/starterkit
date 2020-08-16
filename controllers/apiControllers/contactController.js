/**
 * Controller for Contact.
 * Author: Chibuike Umechukwu.
 * Version: 1.0.0
 * Release Date: 20-July-2020
 * Last Updated: 22-July-2020
 */

/**
 * Module dependencies.
 */
const { Contact, PreferenceCenter } = require('../../models');
const{ 
    errorRes, errorLog, successResWithData, successRes
} = require('../../utils/apiResponse');

// Handle User create on POST.
exports.createContact = async(req, res) => {    
    try {
        const contactData = await validateInput(req, res);
        if(typeof contactData === 'string') return errorRes(res, contactData);
        //check for duplicate in the database
        const checkContact = await Contact.findOne({ where: { email: contactData.email }  });
        if(checkContact) {
            return errorRes( res, 'This Email has been used...')
        };

        const createdContact = await Contact.create({
            ...contactData,
            modifiedBy: req.user? req.user.id: null,
            departmentId: req.user.departmentId,
            currentBusinessId: req.user.currentBusinessId,
        });

        //add the selected preferences
        const addPreferences = await createOrUpdatePreferences( req, res, createdContact, 'create' )
        if(!addPreferences) {
            await Contact.destroy({ where: { id: createdContact.id } })
            return errorRes(res, 'Failed to add Preferences');
        };

        //Success Response
        const data = await createdContact;
        successResWithData( res, 'Contact created Successfully', data ); 

    } catch (error) {
        console.log(error);
        await Contact.destroy({ where: { id: createdContact.id } })
        errorLog( res, 'Contact creation was Unsuccessful.')
    }
    
};
 
exports.updateContact = async(req, res) => {
    try {
        const ContactData = validateInput(req, res);
        if(typeof contactData === 'string') return errorRes(res, contactData)
        //check for duplicate in the database
        const checkContact = await Contact.findOne({ where: { email: contactData.email }  });
        if( checkContact && checkContact.id != req.params.contactId ) {
            return errorRes( res, 'This Email has been used...')
        }
            
        await Contact.update( {
            ...contactData,
            modifiedBy: req.user? req.user.id: null
        }, { 
            where: { id: req.params.contactId } 
        });

        //add the selected preferences
        const data = await Contact.findByPk( req.params.contactId, {include: PreferenceCenter} );
        const updatePreferences = await createOrUpdatePreferences( req, res, data, 'update' )
        if(!updatePreferences)return errorRes(res, 'Contact Updated but Failed to update Preferences');

        //Success Response
        successResWithData( res, 'Contact updated Successfully', data );
   
    } catch (error) {
        console.log(error);
        errorLog( res, 'Contact update was Unsuccessful.')
    }
    
};

exports.getContact = async (req, res) =>{
    try {
        const contact = await Contact.findByPk(req.params.contactId, {include: PreferenceCenter});
        if(!contact) errorRes( res, 'Invalid Contact Id');

        //Success Response
        const data = await contact;
        successResWithData( res, 'Contact Details', data );
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.deleteContact = async (req, res) =>{
    try {
        await Contact.destroy( { where: { id: req.params.contactId }  } );
        
        //Success Response
        successRes( res, 'Contact record deleted successfully.' );
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    };
    
};

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            where: {
                departmentId: req.user.departmentId,
                currentBusinessId: req.user.currentBusinessId,
            }
        });
        
        //Success Response
        const data = await Contacts;
        successResWithData( res, 'Contact List', data ) 

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
    const mailingCurrency = (req.body.mailingCurrency != '')? req.body.mailingCurrency.trim().toUpperCase(): '';
    const mailingLanguage = (req.body.mailingLanguage != '')? req.body.mailingLanguage.trim(): '';
    const mailingName = (req.body.mailingName != '')? req.body.mailingName.trim(): '';
    const mailingEmail = (req.body.mailingEmail != '')? req.body.mailingEmail.trim(): '';
    const mailingWebsite = (req.body.mailingWebsite != '')? req.body.mailingWebsite.trim(): '';
    const mailingAddress = (req.body.mailingAddress != '')? req.body.mailingAddress.trim(): '';
    const mailingCity = (req.body.mailingCity != '')? req.body.mailingCity.trim(): '';
    const mailingCountry = (req.body.mailingCountry != '')? req.body.mailingCountry.trim(): '';
     
    
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

    //validate mailingCurrency 
    if( mailingCurrency != '' && (!mailingCurrency.match(/^[A-Za-z]+$/) || mailingCurrency.trim().length != 3) )
        return 'Currency should have 3 CAPITAL letters only.';

    //validate mailingWebsite
    const regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
    if( mailingWebsite != '' && !mailingWebsite.match(regex) ) return 'Wrong company URL...';
    
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
        mailingCurrency: mailingCurrency != '' ? mailingCurrency : null,
        mailingLanguage,
        mailingName,
        mailingEmail,
        mailingWebsite,
        mailingAddress,
        mailingCity,
        mailingCountry,
        createdBy: req.body.createdBy != '' ? req.body.createdBy : null,
    }
};

const createOrUpdatePreferences = async(req, res, data, actionType) => {
    const { preferences } = req.body;

    if( !preferences) 
        return false

    //Create Preferences in Contact Profile
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
        //Update Preferences in Contact Profile
    } else if ( actionType == 'update' && preferences.length > 0 ) {
        try {
            //delete all Contact preferences            
            await data.removePreferenceCenter(data.PreferenceCenters)
            //add the incoming Preferences to this Contact
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