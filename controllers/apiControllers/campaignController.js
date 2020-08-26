const { Campaign, CampaignData, Lead } = require('../../models');

const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');
const { checkCodeGen, codeGen } =  require('../../utils/helpers');

exports.createCampaign = async (req, res) => {
    const { campaignName } = req.body;
    console.log(req.body)
    try {
        //To check against empty fields
        if ( !campaignName || campaignName == '' ) errorRes(res, 'Ensure all fields are filled'); 
        //validate name 
        if(!campaignName.match(/^[A-Za-z\s]+$/) ) return errorRes(res, 'Campaign name must be alphabets only.');       
        //generate a Code
        let campaignCode = codeGen('c', 3);
        await checkCodeGen('c',3, Campaign, {campaignCode}, campaignCode);

        //check if there is a duplicate campaign in the database
        const checkCampaign = await Campaign.findOne({where: { campaignName } });
        if (checkCampaign) return errorRes(res, 'This Campaign already exists in the database.');

        const campaign = await Campaign.create({
            campaignName,
            campaignCode,
            departmentId: req.user.DepartmentId,
            currentBusinessId: req.user.CurrentBusinessId
        });

        const data = await campaign;

        //Success response
        successResWithData(res, 'Campagin created successfully.', data);
    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Campaign creation is Unsuccessful.')
    }
};

exports.updateCampaign = async (req, res) => {
    const { campaignName } = req.body;

    //To check against empty fields
    if ( !campaignName || campaignName == '' ) return errorRes(res, 'Ensure all fields are filled');
    //validate name 
    if(!campaignName.match(/^[A-Za-z\s]+$/) ) return errorRes(res, 'Campaign name must be alphabets only.');


    try {
        const checkCampaign = await Campaign.findOne({ where: { campaignName } });
        if (checkCampaign && checkCampaign.id != req.params.campaignId) 
            return errorRes( res, 'This Campaign already exists in the database.' );
 
        await Campaign.update({ campaignName }, {
            where: { id: req.params.campaignId }
        });

        //We'll retrieve the Campaign for Success Response
        const campaign = await Campaign.findByPk(req.params.campaignid)
        const data = await campaign;

        //Success response
        successResWithData( res, 'Campagin updated successfully.', data );
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Campaign Update is Unsuccessful.' )
    }
};

exports.deleteCampaign = async (req, res) => {
    try {
        //check if the campaignId exists..
        //Also, who to be given access to this feature should be checked
        const { campaignId } = req.params;

        const checkCampaign = await Campaign.findByPk(campaignId);
        if (!checkCampaign) return errorRes(res, 'Invalid Campaign Id')

        await Campaign.destroy({ where: { id: campaignId } })

        //Success Response
        successRes(res, 'This Campaign has been deleted Successfully.');
    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Something went wrong.')
    }
};

exports.getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.campaignId, { include: [Lead, CampaignData] });

        //check if the campaign exists in the database
        if (!campaign) return errorRes(res, 'This Campaign does not exist in the database');

        //Success Response
        const data = await campaign
        successResWithData(res, 'Campaign Details', data)

    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Something went wrong.')
    }
};

exports.getCampaignByCode = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ campaignCode: req.params.campaignCode }, {
            include: [Lead, CampaignData]
        });
        //check if the campaign exists in the database
        if (!campaign) return errorRes(res, 'This Campaign does not exist in the database');

        //Success Response
        const data = await campaign
        successResWithData(res, 'Campaign Details', data)

    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Something went wrong.')
    }
};

exports.getAllCampaign = async (req, res) => {
    try {
        const list = await Campaign.findAll({
            where: {
                departmentId: req.user.DepartmentId,
                currentBusinessId: req.user.CurrentBusinessId
            }
        })

        //Success Response
        const data = await list
        successResWithData(res, 'Campaign List', data)

    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Something went wrong.')
    }
};