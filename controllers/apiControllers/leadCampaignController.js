const { LeadCampaign, Lead, Campaign } = require('../../models');
const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');

exports.updateLeadCampaign = async (req, res) => {
    const campaignName = req.body.campaignName? req.body.campaignName: undefined;
    const pageName = req.body.pageName? req.body.pageName: undefined;
    try {
        const leadCampaign = await LeadCampaign.findByPk( req.params.leadCampaignId, {
            include: [ Lead, Campaign ]
        });
        leadCampaign.campainName = campaignName;
        leadCampaign.pageName += ', '+ pageName;
        const data = await leadCampaign.save();
        //Success response
        successResWithData( res, 'Lead Campagin updated successfully.', data );
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.')
    }
};

exports.deleteLeadCampaign = async (req, res) => {
    try {
        await LeadCampaign.destroy({ where: { id: req.params.leadCampaignId } })

        //Success Response
        successRes( res, 'Lead Campaign deleted Successfully.' )

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' );
    }
};

exports.getLeadCampaign = async (req, res) => {
    try {
        const leadCampaign = await LeadCampaign.findByPk( req.params.leadCampaignId, {
            include:[ Lead, Campaign ]
        });
        if(!leadCampaign) return errorRes(res, 'Invalid Lead Campaign Id');
        //Success Response
        const data = await leadCampaign
        successResWithData( res, 'Lead Campaign Details', data );

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.');
    }
};

exports.getAllLeadCampaign = async (req, res) => {
    try {
        const list = await LeadCampaign.findAll({ include: [ Lead, Campaign ] });

        //Success Response
        const data = await list
        successResWithData( res, 'Lead campaigns List', data );        
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' );
    }
};
