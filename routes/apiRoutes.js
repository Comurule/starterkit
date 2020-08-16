const express = require('express');
const router = express.Router();

const { 
    createCampaign, updateCampaign, deleteCampaign, getCampaign, getAllCampaign 
} = require('../controllers/apiControllers/campaignController');
const { 
    createPreference, updatePreference, deletePreference, 
    getPreference, getAllPreference 
} = require('../controllers/apiControllers/preferenceController');
const { 
    createCampaignData, updateCampaignData, deleteCampaignData, 
    getCampaignData, getAllCampaignData 
} = require('../controllers/apiControllers/campaignDataController');
const { 
    createLeadCampaign, updateLeadCampaign, deleteLeadCampaign, 
    getLeadCampaign, getAllLeadCampaign 
} = require('../controllers/apiControllers/leadCampaignController');
const { 
    createLeadCampaignData, updateLeadCampaignData, 
    deleteLeadCampaignData, getLeadCampaignData, 
    getAllLeadCampaignData 
} = require('../controllers/apiControllers/leadCampaignDataController');
const { 
    createLead, updateLead, deleteLead, getAllLeads, getLead, convertLead 
} = require('../controllers/apiControllers/leadController');
const { 
    createContact, updateContact, deleteContact, getAllContacts, getContact 
} = require('../controllers/apiControllers/contactController');
const { 
    createAccount, updateAccount, deleteAccount, getAllAccounts, getAccount
} = require('../controllers/apiControllers/accountController');

const {
    updateLeadPreference, deleteLeadPreference, getLeadPreference, getAllLeadPreferences, 
} = require('../controllers/apiControllers/leadPreferenceController')
console.log("I am in api/v1 routes");


//Lead campaign Routes

// Account ROUTES

router.post('/accounts/create', createAccount); 

router.post('/accounts/:accountId/update', updateAccount); 

router.get('/accounts/:accountId/delete', deleteAccount); 

router.get('/accounts/:accountId', getAccount); 

router.get('/accounts', getAllAccounts); 

// router.post('/accountPreference/:accountPreferenceId/update', updateAccountPreference);

// router.get('/accountPreference/:accountPreferenceId/delete', deleteAccountPreference); 

// router.get('/accountPreference/:accountPreferenceId', getAccountPreference); 

// router.get('/accountPreference', getAllAccountPreferences);

// Contact ROUTES

router.post('/contacts/create', createContact); 

router.post('/contacts/:contactId/update', updateContact); 

router.get('/contacts/:contactId/delete', deleteContact); 

router.get('/contacts/:contactId', getContact); 

router.get('/contacts', getAllContacts); 

// router.post('/contactPreference/:contactPreferenceId/update', updateContactPreference);

// router.get('/contactPreference/:contactPreferenceId/delete', deleteContactPreference); 

// router.get('/contactPreference/:contactPreferenceId', getContactPreference); 

// router.get('/contactPreference', getAllContactPreferences);

//Campaign Routes
router.post('/users/:userId/campaigns/create', createCampaign);

router.post('/users/:userId/campaigns/:campaignId/update', updateCampaign);

router.get('/campaigns/:campaignId/delete', deleteCampaign);

router.get('/campaigns/:campaignId', getCampaign);

router.get('/campaigns', getAllCampaign);


//Preference Routes
router.post('/preferences/create', createPreference);

router.post('/preferences/:preferenceId/update', updatePreference);

router.get('/preferences/:preferenceId/delete', deletePreference);

router.get('/preferences/:preferenceId', getPreference);

router.get('/preferences', getAllPreference);

//Campaign Data Routes
router.post('/users/:userId/campaignData/create', createCampaignData);

router.post('/users/:userId/campaignData/:campaignDataId/update', updateCampaignData);

router.get('/campaignData/:campaignDataId/delete', deleteCampaignData);

router.get('/campaignData/:campaignDataId', getCampaignData);

router.get('/campaignData', getAllCampaignData);

//Lead Campaign Routes
router.post('/leadCampaign/create', createLeadCampaign);

router.post('/leadCampaign/:leadCampaignId/update', updateLeadCampaign);

router.get('/leadCampaign/:leadCampaignId/delete', deleteLeadCampaign);

router.get('/leadCampaign/:leadCampaignId', getLeadCampaign);

router.get('/leadCampaign', getAllLeadCampaign);

//Lead Campaign Data Routes
router.post('/leadCampaignData/create', createLeadCampaignData);

router.post('/leadCampaignData/:leadCampaignDataId/update', updateLeadCampaignData);

router.get('/leadCampaignData/:leadCampaignDataId/delete', deleteLeadCampaignData);

router.get('/leadCampaignData/:leadCampaignDataId', getLeadCampaignData);

router.get('/leadCampaignData', getAllLeadCampaignData);

// LEAD ROUTES

router.post('/leads/create', createLead); 

router.post('/leads/:leadId/update', updateLead); 

router.post('/leads/:leadId/convert', convertLead); 

router.get('/leads/:leadId/delete', deleteLead); 

router.get('/leads/:leadId', getLead); 

router.get('/leads', getAllLeads); 

router.post('/leadPreference/:leadPreferenceId/update', updateLeadPreference);

router.get('/leadPreference/:leadPreferenceId/delete', deleteLeadPreference); 

router.get('/leadPreference/:leadPreferenceId', getLeadPreference); 

router.get('/leadPreference', getAllLeadPreferences); 


module.exports = router;