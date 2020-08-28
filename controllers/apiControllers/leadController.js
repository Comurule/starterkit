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
const nodemailer = require('nodemailer');
 
 
const { Lead, PreferenceCenter, Campaign, LeadCampaignData } = require('../../models');
const{ 
    errorRes, errorLog, successResWithData, successRes
} = require('../../utils/apiResponse');
const { checkCodeGen, codeGen, sendEmail, message } =  require('../../utils/helpers');

// Handle User create on POST.
exports.createLead = async(req, res) => {    
    try {
        console.log(req.body);
        const {preferences, campaignCode}=req.body;
        const leadData = await validateInput(req, res);
        if(typeof leadData === 'string') return errorRes(res, leadData);
        
        //generate a Code
        let leadCode = codeGen('l', 5);
        await checkCodeGen('l',5, Lead,{leadCode}, leadCode);

        //check for duplicate in the database
        const checkLead = await Lead.findOne({ where: { 
            email: leadData.email,            
            departmentId: req.user.DepartmentId,
            currentBusinessId: req.user.CurrentBusinessId 
        }  });
        if(checkLead) return errorRes( res, 'This Email has been used...');

        const createdLead = await Lead.create({
            ...leadData,
            leadCode,
            createdBy: req.user.id,
            modifiedBy: req.user.id,
            departmentId: req.user.DepartmentId,
            currentBusinessId: req.user.CurrentBusinessId,
        });

        //add the selected preferences
        const addAssociates = await Promise.all([
            createOrUpdatePreferences( req, res, createdLead, 'create' ),
            createOrUpdateCampaign(req.body.campaignCode, createdLead, 'create')
        ]);
        if(!addAssociates || !addAssociates[0] || !addAssociates[1]) {
            await Lead.destroy({ where: { id: createdLead.id } })
            return errorRes(res, 'Invalid Preference or Campaign details.');
        };

        //Success Response
        const data = await createdLead;
        
        const email = createdLead.email;
        const subject = 'Thanks for Subscribing';
        const companyLink = 'https://f410a7592b47419e84d5207582f24765.vfs.cloud9.us-east-1.amazonaws.com/msc'
        const mailTemplate = await message(companyLink, leadCode, preferences.join(','), campaignCode);
        await sendEmail(email, subject, mailTemplate);
        
        successResWithData( res, 'Lead created Successfully', data ); 

    } catch (error) {
        console.log(error);
        await Lead.destroy({ where: { id: createdLead.id } })
        errorLog( res, 'Lead creation was Unsuccessful.')
    }
    
};
 
exports.updateLead = async(req, res) => {
    try {
        //check for duplicate in the database
        const checkLead = await Lead.findOne({ where: { 
            email: req.body.email,
            departmentId: req.user.DepartmentId,
            currentBusinessId: req.user.CurrentBusinessId
        }  });
        //check if the Lead is converted
        if( checkLead.leadStatus == 'converted') 
            return errorRes( res, 'You can not update a "converted" Lead');
        
        if( checkLead && checkLead.id != req.params.leadId ) {
            return errorRes( res, 'This Email has been used...')
        };

        const leadData = validateInput(req, res);
        if(typeof leadData === 'string') return errorRes(res, leadData);

        await Lead.update( {
            ...leadData,
            modifiedBy: req.user.id
        }, { 
            where: { id: req.params.leadId } 
        });

        //add the selected preferences
        const data = await Lead.findByPk( req.params.leadId, {include: [PreferenceCenter, Campaign]} );
        //add the selected preferences
        const addAssociates = await Promise.all([
            createOrUpdatePreferences( req, res, data, 'update' ),
            createOrUpdateCampaign(req.body.campaignCode, data, 'update')
        ]);
        if(!addAssociates || !addAssociates[0] || !addAssociates[1]) {
            return errorRes(res, 'Update Successful, but Failed to add Preference or Campaign details.');
        };

        //Success Response
        successResWithData( res, 'Lead updated Successfully', data );
   
    } catch (error) {
        console.log(error);
        errorLog( res, 'Lead update was Unsuccessful.')
    }
    
};

exports.getLead = async (req, res) =>{
    try {
        const lead = await Lead.findByPk(req.params.leadId, {include: [PreferenceCenter, Campaign, LeadCampaignData]});
        if(!lead) errorRes( res, 'Invalid Lead Id');
        //Success Response
        console.log(lead);
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
            },
            include: [PreferenceCenter, Campaign]
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
        //Create Account
        //Create Contact
        await Lead.update({ leadStatus: req.body.leadStatus.trim() }, {
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
    const leadSource = req.body.leadSource.trim();
    const firstName = (req.body.firstName != '')? req.body.firstName.trim(): undefined;
    const lastName = req.body.lastName.trim();
    const email = req.body.email.trim();
    const username = (req.body.username != '')? req.body.username.trim() : '';
    const address = (req.body.address != '')? req.body.address.trim():'';
    const city = (req.body.city != '')? req.body.city.trim(): '';
    const country = (req.body.country != '')? req.body.country.trim(): '';
    const leadCurrency = (req.body.leadCurrency != '')? req.body.leadCurrency.trim().toUpperCase(): undefined;
    const leadLanguage = (req.body.leadLanguage != '')? req.body.leadLanguage.trim(): undefined;
    const companyName = (req.body.companyName != '')? req.body.companyName.trim(): '';
    const companyEmail = (req.body.companyEmail != '')? req.body.companyEmail.trim(): '';
    const companyWebsite = (req.body.companyWebsite != '')? req.body.companyWebsite.trim(): '';
    const companyAddress = (req.body.companyAddress != '')? req.body.companyAddress.trim(): '';
    const companyCity = (req.body.companyCity != '')? req.body.companyCity.trim(): '';
    const companyCountry = (req.body.companyCountry != '')? req.body.companyCountry.trim(): '';
     
    //check for empty fields
    if(!leadSource || !lastName || !email || leadSource == '' || lastName == '' || email == '') 
        return 'Fill all required Fields';

    //validate leadCurrency 
    if( leadCurrency && (!leadCurrency.match(/^[A-Za-z]+$/) || leadCurrency.trim().length != 3) )
        return 'Currency should have three alphabets only.';

    //validate companyWebsite
    const regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
    if( companyWebsite != '' && !companyWebsite.match(regex) ) return 'Wrong company URL...';
    
    //Success output
    return {
        leadSource,
        firstName, 
        lastName, 
        email,
        username,
        address,
        city,
        country,
        leadCurrency,
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
                let pcCode = (typeof preferences == 'object')? preferences[0] : preferences;
                const preference = await PreferenceCenter.findOne({where: {pcCode}})
                await leadData.addPreferenceCenter(preference);
                return true

            }else {
                preferences.forEach( async pcCode => {
                    const preference = await PreferenceCenter.findOne({where: {pcCode}})
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
            let pcCode;
            if(preferences.length == 1){
                pcCode = (typeof preferences == 'object')? preferences[0] : preferences;
                const preference = await PreferenceCenter.findOne({where: {pcCode}})
                await leadData.addPreferenceCenter(preference);
               return true;
            }else{
                preferences.forEach( async pcCode => {
                    const preference = await PreferenceCenter.findOne({where: {pcCode}})
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

const createOrUpdateCampaign = async(campaignCode, leadData, actionType) => {
    if( !campaignCode) return false
    console.log(1, campaignCode)

    //Create Preferences in Lead Profile
    if( actionType == 'create') {
        try {
            const campaignData = await Campaign.findOne({where:{campaignCode}});
            await leadData.addCampaign(campaignData);
            return true
        } catch (error) {
            console.log(error);
            return false
        }
        //Update Preferences in Lead Profile
    } else if ( actionType == 'update' ) {
        try {
            console.log(leadData.Campaigns);
            //checks if the campaign exists in the existing lead details and skips if so
            leadData.Campaigns.forEach(async campaign=>{
                if(campaign.campaignCode != campaignCode) {
                    const campaignData = await Campaign.findOne({where: {campaignCode}})
                    await leadData.addCampaign(campaignData);
                }
            });        
           return true;
        } catch (error) {
            console.log(error);
            return false
        }
    }
    
   
};