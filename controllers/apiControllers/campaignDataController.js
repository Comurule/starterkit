const { CampaignData, User, Campaign } = require('../../models');
const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');

exports.createCampaignData = async (req, res) => {
    const { campaignId, userResponse } = req.body;

    //To check against empty fields
    if(!campaignId || campaignId == '' || 
        !userResponse || userResponse == '') 
        errorRes(
            res,
            'Ensure all fields are filled'
        )
    try {
        //check if the campaignId is valid
        const checkCampaign = await Campaign.findByPk( campaignId );
        if(!checkCampaign) errorRes(
            res, 'CampaignId is invalid'
        )

        //check if there is a duplicate in the database
        const info = await CampaignData.findOne({ 
            where: { campaignId, userId: req.params.userId } 
        });

        if(info) { 
            errorRes( 
                res, 
                'This Campaign Data already exists in the database.' 
            );
        } else {
            const campaignData = await CampaignData.create({ 
                campaignId,
                userId: req.params.userId,
                userResponse
            });

            const data = await campaignData;

            //Success response
            successResWithData( 
                res, 
                'Campagin Data created successfully.', 
                data 
            );
        }
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Campaign creation is Unsuccessful.')
    }
};

exports.updateCampaignData = async (req, res) => {
    const { campaignId, userResponse } = req.body;

    //To check against empty fields
    if(!campaignId || campaignId == '' || 
        !userResponse || userResponse == '') 
        errorRes(
        res,
        'Ensure all fields are filled'
        )

    try {
        //check if there is a duplicate of the update details in the database
        const info = await CampaignData.findOne({ 
            where: { campaignId, userId: req.params.userId } 
        });
        if( info && info.id != req.params.campaignDataId ) { 
            errorRes( 
                res, 
                'This Campaign Data already exists in the database.' 
            );   
        } else {
            await CampaignData.update({ userResponse }, {
                where: {
                    id: req.params.campaignDataId
                }
            });

            //retrieve the updated campaign Data
            const campaignData = await CampaignData.findByPk( req.params.campaignDataId )
            const data = await campaignData;

            //Success response
            successResWithData( 
                res, 
                'Campagin Data updated successfully.', 
                data 
            );
        }

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Campaign creation is Unsuccessful.')
    }
};

exports.deleteCampaignData = async (req, res) => {
    try {
        //check if the campaignData really exists
        const info = await CampaignData.findByPk( req.params.campaignDataId );
        if(!info) errorRes(
            res,
            'Campaign Data does not exist.'
        )

        await CampaignData.destroy({
            where: { id: req.params.campaignDataId }
        })

        //Success Response
        successRes( res, 'Campaign Data deleted Successfully')

    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};

exports.getCampaignData = async (req, res) => {
    try {
        const campaignData = await CampaignData.findByPk( 
            req.params.campaignDataId, {
                include: [
                    { model: User },
                    { model: Campaign }
                ]
        } )
        if(!campaignData) errorRes(
            res,
            'Campaign Data does not exist'
        );

        //Success Response
        const data = await campaignData

        successResWithData(
            res,
            'Campaign Data Details',
            data
        )
    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};

exports.getAllCampaignData = async (req, res) => {
    try {
        const list = await CampaignData.findAll();

        //Success Response
        const data = await list

        successResWithData(
            res,
            'Campaign Data List',
            data
        )
    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};