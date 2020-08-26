
var express = require('express');
var router = express.Router();
var aboutController = require('../controllers/aboutController');
var userController = require('../controllers/userController');
var indexController = require('../controllers/indexController');

const { 
    deleteLead, getAllLeads, getLead, getCreateLead, getUpdateLead
} = require('../controllers/webControllers/leadController');

const { 
    deleteAccount, getAllAccounts, getAccount, getCreateAccount, getUpdateAccount
} = require('../controllers/webControllers/accountController');

const { 
    deleteContact, getAllContacts, getContact, getCreateContact, getUpdateContact
} = require('../controllers/webControllers/contactController');

const { getAllPreference, } = require('../controllers/webControllers/preferenceController');
const { getAllLeadPreference } = require('../controllers/webControllers/leadPreferenceController');
const { getAllCampaigns } = require('../controllers/webControllers/campaignController');
const { getAllCampaignData } = require('../controllers/webControllers/campaignDataController');

console.log("I am in main routes");


//Preference Routes
router.get('/preferences', getAllPreference);

//Lead Preferences Routes
router.get('/leadPreference', getAllLeadPreference);

//Campaign Routes
router.get('/campaigns', getAllCampaigns);

//Campaign Data Routes
router.get('/campaignData', getAllCampaignData);


// LEAD ROUTES
router.get('/leads/create', getCreateLead); 

router.get('/leads/:leadId/update', getUpdateLead); 

router.get('/leads/:leadId/delete', deleteLead); 

router.get('/leads/:leadId', getLead); 

router.get('/leads', getAllLeads);


// ACCOUNT ROUTES

router.get('/accounts/create', getCreateAccount);

router.get('/accounts/:accountId/update', getUpdateAccount);

router.get('/accounts/:accountId/delete', deleteAccount); 

router.get('/accounts/:accountId', getAccount); 

router.get('/accounts', getAllAccounts);


// CONTACT ROUTES

router.get('/contacts/create', getCreateContact);

router.get('/contacts/:contactId/update', getUpdateContact);

router.get('/contacts/:contactId/delete', deleteContact); 

router.get('/contacts/:contactId', getContact); 

router.get('/contacts', getAllContacts);


// USER ROUTES

// GET USER CREATE
router.get('/user/signup', userController.getUserCreate); 

// POST USER CREATE
router.post('/user/create', userController.postUserCreate); 

// GET USER UPDATE
router.get('/user/:user_id/update', userController.getUserUpdate); 

// POST USER UPDATE
router.post('/user/:user_id/update', userController.postUserUpdate); 

// GET USER DELETE
router.get('/user/:user_id/delete', userController.getUserDelete); 

// // GET USER LIST
router.get('/users', userController.getUserList); 

// GET USER DETAILS
router.get('/user/:user_id', userController.getUserDetails); 




// GET ABOUT PAGE
router.get('/about', aboutController.getAbout);

router.get('/', indexController.getIndex);

module.exports = router;
