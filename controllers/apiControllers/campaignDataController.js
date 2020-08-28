const { CampaignData, Campaign } = require('../../models');
const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');
const { checkCodeGen, codeGen } =  require('../../utils/helpers');

exports.createCampaignData = async (req, res) => {
    const { dataLabel, displayType, campaignId } = req.body;
    console.log(req.body);

    //To check against empty fields
    if(!dataLabel || dataLabel == '' || !displayType || displayType == '' || !campaignId || campaignId == '') 
        return errorRes( res, 'Ensure all required fields are filled' )
    try {
        //check if the campaign exists
        const campaign = await Campaign.findByPk(campaignId);
        if(!campaign) return errorRes(res, 'Invalid Campaign Id');

        //check if there is a duplicate in the database
        const checkCampaignData = await CampaignData.findOne({ where: { dataLabel, campaignId } });
        if(checkCampaignData) return errorRes( res, 'This Campaign Data already exists in the database.' );
        
        //generate a Code
        let cdCode = codeGen('CD', 4);
        await checkCodeGen('CD',4, CampaignData, {cdCode}, cdCode);

        const campaignData = await CampaignData.create({ dataLabel, displayType, cdCode, campaignId });

        //Success response
        const data = await campaignData;
        successResWithData( res, 'Campagin Data created successfully.', data );
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Campaign creation is Unsuccessful.')
    }
};

exports.updateCampaignData = async (req, res) => {
    const { dataLabel, displayType, campaignId } = req.body;

    //To check against empty fields
    if(!dataLabel || displayType == '' || !displayType || dataLabel == '' || !campaignId || campaignId == '') 
        return errorRes( res, 'Ensure all fields are filled' );

    try {
        //check if the campaign exists
        const campaign = await Campaign.findByPk(campaignId);
        if(!campaign) return errorRes(res, 'Invalid Campaign Code');

        //check if there is a duplicate of the update details in the database
        const checkCampaignData = await CampaignData.findOne({ where: { dataLabel } });
        if( checkCampaignData && checkCampaignData.id != req.params.campaignDataId ) { 
            errorRes( res, 'This Campaign Data already exists in the database.' );   
        } 

        await CampaignData.update({ dataLabel, displayType, campaignCode }, {
            where: { id: req.params.campaignDataId }
        });

        //retrieve the updated campaign Data
        const campaignData = await CampaignData.findByPk( req.params.campaignDataId, {include: Campaign} )
        const data = await campaignData;

        //Success response
        successResWithData( res, 'Campagin Data updated successfully.', data );
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Campaign creation is Unsuccessful.')
    }
};

exports.deleteCampaignData = async (req, res) => {
    try {
        //check if the campaignData really exists
        const campaignData = await CampaignData.findByPk( req.params.campaignDataId );
        if(!campaignData) return errorRes( res, 'Campaign Data does not exist.' );

        await CampaignData.destroy({ where: { id: req.params.campaignDataId } });

        //Success Response
        successRes( res, 'Campaign Data deleted Successfully');

    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Something went wrong.');
    }
};

exports.getCampaignData = async (req, res) => {
    try {
        const campaignData = await CampaignData.findByPk(req.params.campaignDataId, {include: Campaign });
        if(!campaignData) errorRes(res, 'Campaign Data does not exist');

        //Success Response
        const data = await campaignData
        successResWithData(res, 'Campaign Data Details', data);
    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Something went wrong.');
    }
};

exports.getAllCampaignData = async (req, res) => {
    try {
        const cdList = await CampaignData.findAll({
            include: [{
                model: Campaign,
                where: {
                    departmentId: req.user.DepartmentId,
                    currentBusinessId: req.user.CurrentBusinessId 
                }
            }]
        });
        
        cdList.forEach(cd=>{
            cd['dataValues'].campaignName = cd.Campaign.campaignName;
        });
        //Success Response
        const data = await cdList;
        successResWithData(res, 'Campaign Data List', data);
    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Something went wrong.');
    }
};