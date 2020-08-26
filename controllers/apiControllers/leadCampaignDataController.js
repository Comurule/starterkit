const { LeadCampaignData, CampaignData } = require('../../models');
const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');

exports.updateLeadCampaignData = async (req, res) => {
    const dataLabel = req.body.dataLabel? req.body.dataLabel: undefined;
    const value = req.body.value? req.body.value: undefined;
    
    try {
        await LeadCampaignData.update({ dataLabel, value }, { where: { id: req.params.leadCampaignDataId } });

        const leadCampaignData = await LeadCampaignData.findByPk( req.params.leadCampaignDataId );
        const data = await leadCampaignData;

        //Success response
        successResWithData( res, 'Lead Campagin Data updated successfully.', data );
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.')
    }
};

exports.deleteLeadCampaignData = async (req, res) => {
    try {
        //check if the id is valid
        const checkLeadCampData = await LeadCampaignData.findByPk( req.params.leadCampaignDataId )
        if(!checkLeadCampData) return errorRes( res, 'Invalid Id entry');

        await LeadCampaignData.destroy({ where: { id: req.params.leadCampaignDataId } });
        //Success Response
        successRes( res, 'Lead Campaign Data deleted successfully.' );

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' );
    }
};

exports.getLeadCampaignData = async (req, res) => {
    try {
        const leadCampaignData = await LeadCampaignData.findByPk(req.params.leadCampaignDataId, {
            include: CampaignData
        });
        if(!leadCampaignData) return errorRes(res, 'Invalid Lead Campaign Data details');

        //Success Response
        const data = await leadCampaignData;
        successResWithData( res, 'Lead Campaign Data Details', data );
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' );
    }
};

exports.getAllLeadCampaignData = async (req, res) => {
    try {
        const list = await LeadCampaignData.findAll({ include: CampaignData });
        //Success Response
        const data = await list;
        successResWithData( res, 'Lead Campaign Data List', data );
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' )
    }
};