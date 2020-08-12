const { LeadCampaignData, CampaignData } = require('../../models');
const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');

exports.createLeadCampaignData = async (req, res) => {
    const { campaignDataId, leadResponse } = req.body;

    //To check against empty fields
    if(
        !campaignDataId || campaignDataId == ''|| 
        !leadResponse || leadResponse == ''
    ) errorRes(
        res,
        'Ensure all fields are filled'
    )
    
    try {
        //check if the campaignDataId is valid
        const check = await CampaignData.findByPk( campaignDataId )
        if(!check) errorRes(
            res, 'Invalid Data Entry'
        );

        //check if there is a duplicate in the database
        const info = await LeadCampaignData.findOne({ 
            where: {campaignDataId} 
        });
        if(info) {
            errorRes( 
                res, 
                'This Lead Campaign Data already exists in the database.' 
            );
        } else {
            const leadCampaignData = await LeadCampaignData.create({ 
                campaignDataId, leadResponse 
            });

            const data = await leadCampaignData;

            //Success response
            successResWithData( 
                res, 
                'Lead Campagin Data created successfully.', 
                data 
            );
        }
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.')
    }
};

exports.updateLeadCampaignData = async (req, res) => {
    const { campaignDataId, leadResponse } = req.body;

    //To check against empty fields
    if(
        !campaignDataId || campaignDataId == '' || 
        !leadResponse || leadResponse == ''
    ) errorRes(
        res,
        'Ensure all fields are filled'
    )
    
    try {
        //check if the campaignDataId is valid
        const check = await CampaignData.findByPk( campaignDataId )
        if(!check) errorRes(
            res, 'Invalid Data Entry'
        );

        //check if there is a duplicate in the database
        const info = await LeadCampaignData.findOne({ 
            where: { campaignDataId } 
        });
        if( info && info.id != req.params.leadCampaignDataId ) {
            errorRes( 
                res, 
                'This Leaad Campaign Data already exists in the database.' 
            );
        } else {
            await LeadCampaignData.update({ 
                campaignDataId, leadResponse 
            }, {
                where: { id: req.params.leadCampaignDataId }
            });

            const leadCampaignData = await LeadCampaignData.findByPk(
                req.params.leadCampaignDataId
            )
            const data = await leadCampaignData;

            //Success response
            successResWithData( 
                res, 
                'Lead Campagin Data updated successfully.', 
                data 
            );
        }
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.')
    }
};

exports.deleteLeadCampaignData = async (req, res) => {
    try {
        //check if the id is valid
        const check = await LeadCampaignData.findByPk( req.params.leadCampaignDataId )
        if(!check)errorRes( res, 'Invalid Id entry');

        await LeadCampaignData.destroy({ 
            where: { id: req.params.leadCampaignDataId }
        })

        //Success Response
        successRes( res, 'Lead Campaign Data deleted successfully.' )

    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};

exports.getLeadCampaignData = async (req, res) => {
    try {
        const leadCampaignData = await LeadCampaignData.findByPk(
            req.params.leadCampaignDataId,{
                include: { model: CampaignData }
            }
        )

        //Success Response
        const data = await leadCampaignData;
        successResWithData(
            res, 
            'Lead Campaign Data Details',
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

exports.getAllLeadCampaignData = async (req, res) => {
    try {
        const list = await LeadCampaignData.findAll()

        const data = await list;

        //Success Response
        successResWithData(
            res, 
            'Lead Campaign Data List',
            data
        );
    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};

//This CRUD is basic, It doesn't have any effect on the app to me... 
