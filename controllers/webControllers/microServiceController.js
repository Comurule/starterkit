const { Lead } = require('../../models');
const { renderLeadPage } = require("../../utils/webResponse");

exports.microServiceRender = async (req, res) => {
    const {leadCode, action}= req.query;
    const lead = await Lead.findOne({leadCode});
    
  console.log(req.query);  
  switch (req.query.action) {
    case 'unsubscribe':
        renderLeadPage(req, res, 'Unsubscribe Preference', 'GET UNSUBSCRIBE', {lead});
        break;
        
    case 'manprefs':
        renderLeadPage(req, res, 'Manage Preference', 'GET MANAGE PREFERENCE', {lead});
        break;
        
    case 'mancamp':
        renderLeadPage(req, res, 'Manage CampaignData', 'GET MANAGE CAMPAIGNDATA', {lead});
        break;

    default:
        break;
}
};