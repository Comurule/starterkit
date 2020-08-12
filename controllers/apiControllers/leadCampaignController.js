const { LeadCampaign, User, Campaign } = require('../../models');
const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');

exports.createLeadCampaign = async (req, res) => {
    //This CRUD is basic, It doesn't have any effect on the app to me... 
    //LeadCampaign is a Joint Table(same as CampaignMembers but for Leads),
    // so there ought to be a massive creation of LeadCampaigns(addUsers).
    const { campaignId, userId } = req.body;

    //To check against empty fields
    if(!campaignId || campaignId == '' || !userId || userId == '') 
        errorRes(
        res,
        'Ensure all fields are filled'
        )

    //check if the userId or campaignId are valid
    const lead = await User.findByPk( userId );
    const campaign = await Campaign.findByPk( campaignId );

    if(!lead || !campaign ) errorRes(
        res,
        'Invalid Entries'
    )

    //check if there is a duplicate in the database
    const info = await LeadCampaign.findOne({ where: {campaignId, leadId: userId} });
    if(info) errorRes( 
        res, 
        'This Lead Campaign already exists in the database.' 
        );

    try {
    
        const leadCampaign = await LeadCampaign.create({ campaignId, leadId: userId });

        const data = await leadCampaign;

        //Success response
        successResWithData( 
            res, 
            'Lead Campagin created successfully.', 
            data 
        );

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.')
    }
};

exports.updateLeadCampaign = async (req, res) => {
    //This CRUD is basic, It doesn't have any effect on the app to me... 
    //LeadCampaign is a Joint Table(same as CampaignMembers but for Leads),
    // so there ought to be a massive creation of LeadCampaigns(addUsers).
    const { campaignId, userId } = req.body;

    //To check against empty fields
    if(!campaignId || campaignId == '' || !userId || userId == '') 
        errorRes(
        res,
        'Ensure all fields are filled'
        )

    //check if the userId or campaignId are valid
    const lead = await User.findByPk( userId );
    const campaign = await Campaign.findByPk( campaignId );

    if(!lead || !campaign ) errorRes(
        res,
        'Invalid Entries'
    )

    //check if there is a duplicate in the database
    const info = await LeadCampaign.findOne({ 
        where: {campaignId, leadId: userId} 
    });

    if(info && info.id != req.params.leadCampaignId ) 
        errorRes( 
            res, 
            'This Lead Campaign already exists in the database.' 
        );

    try {
    
        await LeadCampaign.update({ 
            campaignId, leadId: userId 
        },{
            where: { id: req.params.leadCampaignId }
        });

        //Retrieve the updated leadCampaign
        const leadCampaign = await LeadCampaign.findByPk( req.params.leadCampaignId )
        const data = await leadCampaign;

        //Success response
        successResWithData( 
            res, 
            'Lead Campagin updated successfully.', 
            data 
        );

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.')
    }
};

exports.deleteLeadCampaign = async (req, res) => {
    try {
        await LeadCampaign.destroy({
            where: { id: req.params.leadCampaignId }
        })

        //Success Response
        successRes( res, 'Lead Campaign deleted Successfully.' )

    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};

exports.getLeadCampaign = async (req, res) => {
    try {
        const leadCampaign = await LeadCampaign.findByPk( req.params.leadCampaignId, {
            include:[
                { model: Campaign },
                {
                    model: User,
                }
            ]
        });

        //Success Response
        const data = await leadCampaign
        successResWithData(
            res,
            'Lead Campaign Details',
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

exports.getAllLeadCampaign = async (req, res) => {
    try {
        const list = await LeadCampaign.findAll();

        //Success Response
        const data = await list
        successResWithData(
            res,
            'Lead campaigns List',
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

//This CRUD is basic, It doesn't have any effect on the app to me... 
//LeadCampaign is a Joint Table(same as CampaignMembers but for Leads),
// so there ought to be a massive creation of LeadCampaigns(addUsers).