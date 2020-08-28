const express = require('express');
const router = express.Router();

const {
    createOrUpdateLead, microServices, updateLeadCampaignData
} = require("../controllers/apiControllers/microServiceController");
console.log("I am in api/v2 routes");


router.post('/leads/create', createOrUpdateLead);

router.post('/leadCampaignData/update', updateLeadCampaignData)

router.get('/msc', microServices);

module.exports = router;