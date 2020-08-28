const { 
    Lead, Campaign, PreferenceCenter, CampaignData, LeadCampaign, LeadCampaignData, User, LeadPreference 
} = require('../../models');
const{ 
    errorRes, errorLog, successResWithData, successRes, errorResWithData
} = require('../../utils/apiResponse');

//Bulk Create Or Update Leads
exports.createOrUpdateLead = async (req, res) =>{
    // req.body = {
    //     formDetails: [{ firstName:, lastName: , email:  }],
    //     leadOwner,
    //     source,
    //     campaignCode,
    //     preferences
    // }
    const { formDetails, source, campaignCode, preferences, leadOwner } = req.body;
    if(!formDetails || !source || !campaignCode || !preferences) 
        return errorRes(res, 'Invalid Request Details');
    if(!req.user && leadOwner) return errorRes(res, 'leadOwner field must be filled');
    let successList=[];
    let errorList =[];
    
    const user = req.user? req.user: await User.findOne({email: leadOwner});
    if(!(Array.isArray(formDetails))) {
        const leadData = validateInput(lead);
            if(typeof leadData == 'string') { 
                return errorRes(res, leadData);
            }
    
            const checkLead = await Lead.findOne({ 
                email: lead.email,
                departmentId: user.DepartmentId,
                currentBusinessId: user.CurrentBusinessId
            });
    
            if(!checkLead) {
                try {         
                    //generate a Code
                    let leadCode = codeGen('l', 5);
                    await checkCodeGen('l',5, Lead,{leadCode}, leadCode); 
    
                    const createdLead = await Lead.create({
                        ...leadData,
                        leadCode,
                        leadSource: source,
                        departmentId:  user.DepartmentId,
                        currentBusinessId: user.CurrentBusinessId
                    });
                    //add campaigncode
                    const addCampaign = await createOrUpdateCampaign(campaignCode, createdLead, 'create');
                    //add preferences
                    const addPreferences = await createOrUpdatePreferences(preferences, createdLead, 'create' );
                    if(!addCampaign || !addPreferences) {
                        await createdLead.destroy();
                        return errorRes(res, 'Invalid Preference or campaignCode input');
                    }
                    //success action
                    return successResWithData(res, 'Lead Created Succesfully', createdLead);
                    
                } catch (error) {
                    console.log(error);
                    await createdLead.destroy();
                    errorLog(res, 'Unsuccessful Lead creation');
                }
                
            } else {
                try {
                    await Lead.update({leadData}, {
                        where: { id: checklead.id }
                    });
                    //update campaigncode
                    const addCampaign = await createOrUpdateCampaign(campaignCode, checkLead, 'update');
                    //update preferences
                    const addPreferences = await createOrUpdatePreferences(preferences, checkLead, 'update' );
                    if(!addCampaign || !addPreferences) {
                        await checkLead.destroy();
                        return errorRes(res, 'Invalid Preference or campaignCode input');
                    }
                    //success action
                    return successResWithData(res, 'Lead Updated Successfully', checkLead)
                } catch (error) {
                    console.log(error);
                    errorLog(res, 'Unsuccessful Lead Update');
                }
            };
    }else {
        formDetails.forEach(async lead=>{
            const leadData = validateInput(lead);
            if(typeof leadData == 'string') { lead.error = leadData; errorList.push(lead); return; }
    
            const checkLead = await Lead.findOne({ 
                email: lead.email,
                departmentId: user.DepartmentId,
                currentBusinessId: user.CurrentBusinessId
            });
    
            if(!checkLead) {
                try {         
                    //generate a Code
                    let leadCode = codeGen('l', 5);
                    await checkCodeGen('l',5, Lead,{leadCode}, leadCode); 
    
                    const createdLead = await Lead.create({
                        ...leadData,
                        leadCode,
                        leadSource: source,
                        departmentId: user.DepartmentId,
                        currentBusinessId: user.CurrentBusinessId
                    });
                    //add campaigncode
                    const addCampaign = await createOrUpdateCampaign(campaignCode, createdLead, 'create');
                    //add preferences
                    const addPreferences = await createOrUpdatePreferences(preferences, createdLead, 'create' );
                    if(!addCampaign || !addPreferences) {
                        await createdLead.destroy();
                        lead.error = 'Invalid Preference or campaignCode input';
                        errorList.push(lead);
                        return;
                    }
                    //success action
                    successList.push(createdLead);
                    
                } catch (error) {
                    console.log(error);
                    await createdLead.destroy();
                    lead.error = error.name;
                    errorList.push(lead);
                    return;
                }
                
            } else {
                try {
                    await Lead.update({leadData}, {
                        where: { id: checklead.id }
                    });
                    //update campaigncode
                    const addCampaign = await createOrUpdateCampaign(campaignCode, checkLead, 'update');
                    //update preferences
                    const addPreferences = await createOrUpdatePreferences(preferences, checkLead, 'update' );
                    if(!addCampaign || !addPreferences) {
                        await checkLead.destroy();
                        lead.error = 'Invalid Preference or campaignCode input'
                        errorList.push(lead);
                        return;
                    }
                    //success action
                    successList.push(checkLead);
                } catch (error) {
                    console.log(error);
                    errorList.push(lead);
                    return;
                }
            };
        });
        //API Response
        if(errorList.length > 0 && successList.length == 0){
            errorRes(res, 'All Lead details failed ')
        } else if(errorList.length > 0 && successList.length > 0) {
            successResWithData(
                res, 
                'Some Leads created/updated successfully. Check the ErrorList for failed Lead details.', 
                {errorList, successList}
            );
        } else { successResWithData(res, 'Leads created/updated successfully', successList); }

    }
};

//
exports.microServices = async (req, res) => {
     const {leadCode, action}= req.query;
     
  switch (req.query.action) {
    case 'unsubscribe':
        unsubscribePreferences(req, res);
        break;
        
    case 'manprefs':
        
        break;
        
    case 'mancamp':
        getLeadCampaignDataByCampaignAndEmail(req, res);
        break;

    default:
        break;
    }   
}

//Post Page for Manage Campaign Data
exports.updateLeadCampaignData = async (req, res) => {
    // req.body = {
    //     formDetails: [{ dataLabel, value, campaignDataId }],
    //     leadCampaignId,
        // leadId
    // }
    console.log(req.body);
    const { formDetails, leadCampaignId, leadId } = req.body;
    let successList=[];
    let errorList =[];
    formDetails.forEach(async (campaignData) => {
        try {
            const checkLCD = await LeadCampaignData.findOne({where: {
                campaignDataId: campaignData.campaignDataId,
                leadCampaignId
            }});
            if(checkLCD){//Updates the Lead Campaign Data instance
    
                checkLCD.dataLabel = campaignData.dataLabel; 
                checkLCD.value = campaignData.value;
                await checkLCD.save();
                successList.push(checkLCD)
            } else { //creates a new Lead Campaign Data instance
    
                const lcd = await LeadCampaignData.create({
                    dataLabel: campaignData.dataLabel,
                    value: campaignData.value,
                    campaignDataId: campaignData.campaignDataId,
                    leadCampaignId,
                    leadId
                });
                if(!lcd) {errorList.push({campaignData, error: 'Error in Lead Campaign Data creation.'}); return;}
    
                successList.push(lcd);
            }
            
        } catch (error) {
            console.log(error);
            errorList.push({campaignData, error: 'poor network signal'});
            return;
        }
    });
    //API Response
    if(errorList.length > 0 && successList.length == 0) {
        return errorResWithData(res, 'Error: Lead Campaign Data Update failed', errorList);
    } else if(errorList.length > 0 && successList.length > 0) {
        return errorResWithData(res, 'Some form Details have errors', errorList);
    } else { return successResWithData( res, 'Lead Campaign Data updated successfully.', successList ); }
};

//Unsubscribe Preferences
const unsubscribePreferences = async (req, res) => {
    const { leadCode, PC } = req.query;
    console.log(req.query);
    if(!PC || !leadCode || PC == '' || leadCode == '') return errorRes(res, 'Invalid Request details');
    let preferences = PC.split(',');
    let errorList = [], successList = [];
    try {
        const lead = await Lead.findOne({ where: {leadCode}});
        if(!lead) return errorRes(res, 'Invalid Lead Code.');
        const leadId = await lead.id;
        if ( preferences.length == 1 ) {
            const preference = PreferenceCenter.findOne({ where: {pcCode: preferences}});
            if(!preference) return errorRes(res, 'Invalid Preference Code');
            console.log(leadId, preferences);
            const leadPreference = await LeadPreference.findOne({ leadId, preferenceId: preference.id });
            if(!leadPreference) return errorRes(res, `${PC} is not associated to this lead.`);
            await LeadPreference.update({isActive: false, enrolled: false}, {where:{id:leadPreference.id}});           

        } else {
            preferences.forEach(async pc=> {
                const preference = await PreferenceCenter.findOne({ where: {pcCode: pc}});
                if(!preference) {
                    errorList.push({ pc , error: 'Invalid Preference Code'}); return;
                }
                console.log(leadId, pc)
                const leadPreference = await LeadPreference.findOne({ leadId, preferenceId: preference.id });
                if(!leadPreference) {
                    errorList.push({ pc, error: `${pc} is not associated to this lead.`}); return;
                }
                await LeadPreference.update({isActive: false, enrolled: false}, {where:{id:leadPreference.id}});  
                successList.push({pc});    
                
                console.log(leadId, pc)
            });
            
        } 
        
        //API response
        if(errorList.length > 0) {
            errorResWithData( res, 'There are errors while Unsubscribing from our system', { errorList, successList })
        } else {
            //success Response
            return successRes(res, `You have been unsubscribed from our system.`);
        }
    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Check your network.')
    }
};
//Get Page for Manage Campaign Data
const getLeadCampaignDataByCampaignAndEmail = async (req, res) => {
    const { leadCode, campaignCode } = req.query;
    console.log(req.query);
    const dbQuery1 = await Promise.all([
        LeadCampaign.findOne({include: [
            { model: Lead, where: {leadCode} },
            { model: Campaign, where: {campaignCode} },
            ]}),
        CampaignData.findAll({ include: { model: Campaign, where: {campaignCode} } })
    ]) 
    if(!dbQuery1) return errorRes(res, 'Invalid Request details');
    const leadCampaign = dbQuery1[0]; const campaignData = dbQuery1[1];


    const data = { leadCampaign, campaignData };
    //Success Response
    return successResWithData(res, 'Lead Campaign Data details', data);
};

//HELPERS
const validateInput = (data) => {
    //check for empty fields
    if( !data.lastName || !data.email || data.lastName == '' || data.email == '') 
        return 'Fill all required Fields';

    const firstName = (data.firstName || data.firstName != '')? data.firstName.trim(): undefined;
    const lastName = data.lastName.trim();
    const email = data.email.trim();
    const username = (data.username || data.username != '')? data.username.trim() : '';
    const address = (data.address || data.address != '')? data.address.trim():'';
    const city = (data.city || data.city != '')? data.city.trim(): '';
    const country = (data.country || data.country != '')? data.country.trim(): '';
    const leadCurrency = (data.leadCurrency || data.leadCurrency != '')? data.leadCurrency.trim().toUpperCase(): undefined;
    const leadLanguage = (data.leadLanguage || data.leadLanguage != '')? data.leadLanguage.trim(): undefined;
    const companyName = (data.leadLanguage || data.companyName != '')? data.companyName.trim(): '';
    const companyEmail = (data.companyEmail || data.companyEmail != '')? data.companyEmail.trim(): '';
    const companyWebsite = (data.companyWebsite || data.companyWebsite != '')? data.companyWebsite.trim(): '';
    const companyAddress = (data.companyAddress || data.companyAddress != '')? data.companyAddress.trim(): '';
    const companyCity = (data.companyCity || data.companyCity != '')? data.companyCity.trim(): '';
    const companyCountry = (data.companyCountry || data.companyCountry != '')? data.companyCountry.trim(): '';
     

    //validate leadCurrency 
    if( leadCurrency && (!leadCurrency.match(/^[A-Za-z]+$/) || leadCurrency.trim().length != 3) )
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
const createOrUpdatePreferences = async(preferences, leadData, actionType) => {
    if( !preferences) return false

    //Create Preferences in Lead Profile
    if( actionType == 'create' && preferences.length > 0 ) {
        try {
            if(preferences.length == 1){
                let pcCode = (typeof preferences == 'object')? preferences[0] : preferences;
                const preference = await PreferenceCenter.findOne(pcCode);
                await leadData.addPreferenceCenter(preference);
                return true

            }else {
                preferences.forEach( async pcCode => {
                    const preference = await PreferenceCenter.findOne(pcCode);
                    await leadData.addPreferenceCenter(preference);
                });                
                return true
            }
        } catch (error) {
            console.log(error);
            return false
        }
        //Update Preferences in Lead Profile
    } else if ( actionType == 'update' && preferences.length > 0 ) {
        try {
            //checks if the preference centers exists in the existing lead details and skips if so
            leadData.PreferenceCenters.forEach(async pc=>{
                if(preferences.length == 1){
                    let pcCode = (typeof preferences == 'object')? preferences[0] : preferences;
                    if(pc.pcCode != pcCode) {
                        const preference = await PreferenceCenter.findOne({pcCode})
                        await leadData.addPreferenceCenter(preference);
                    }
                    return true;
                }else{
                    preferences.forEach( async pcCode => {
                        if(pc.pcCode != pcCode) {
                            const preference = await PreferenceCenter.findOne({pcCode})
                            await leadData.addPreferenceCenter(preference);
                        }
                    });
                   return true;
                }
            });        
           
        } catch (error) {
            console.log(error);
            return false
        }
    }
    
   
};
const createOrUpdateCampaign = async(campaignCode, leadData, actionType) => {
    if( !campaignCode) return false

    //Create Preferences in Lead Profile
    if( actionType == 'create') {
        try {
            const campaignData = await Campaign.findOne({campaignCode});
            await leadData.addCampaign(campaignData);
            return true
        } catch (error) {
            console.log(error);
            return false
        }
        //Update Preferences in Lead Profile
    } else if ( actionType == 'update' ) {
        try {
            //checks if the preference centers exists in the existing lead details and skips if so
            leadData.Campaigns.forEach(async campaign=>{
                if(campaign.campaignCode != campaignCode) {
                    const campaignData = await Campaign.findOne({campaignCode})
                    await leadData.addCampaign(campaignData);
                }
            });        
           
        } catch (error) {
            console.log(error);
            return false
        }
    }
    
   
};