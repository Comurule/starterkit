const { Campaign, User } = require('../../models');

const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');

exports.createCampaign = async (req, res) => {
    const { campaignName, campaignOwnerId } = req.body;

    try {
        //To check against empty fields
        if (!campaignName || !campaignOwnerId ||
            campaignName == '' || campaignOwnerId == ''
        ) errorRes(res, 'Ensure all fields are filled');

        //check if the CampaignOwner exists in the database....
        //This can be better modified to add more constraints if the CampaignOwner
        //must be a CEO, Admin or Manager 
        const campaignOwner = await User.findByPk(campaignOwnerId);
        if (!campaignOwner) errorRes(
            res, 'The Campaign Owner does not exist in the database'
        )

        //check if there is a duplicate campaign in the database
        const checkCampaign = await Campaign.findOne({
            where: { campaignName, campaignOwnerId }
        });

        if (checkCampaign) {
            errorRes(
                res, 'This Campaign already exists in the database.'
            )
        } else {

            const campaign = await Campaign.create({
                campaignName,
                campaignOwnerId,
                createdBy: req.params.userId,
                modifiedBy: req.params.userId
            });

            const data = await campaign;

            //Success response
            successResWithData(
                res, 'Campagin created successfully.', data
            );

        }
    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Campaign creation is Unsuccessful.')
    }
};

exports.updateCampaign = async (req, res) => {
    const { campaignName, campaignOwnerId } = req.body;

    //To check against empty fields
    if (!campaignName || !campaignOwnerId ||
        campaignName == '' || campaignOwnerId == ''
    ) errorRes(res, 'Ensure all fields are filled')

    //check if the CampaignOwner exists in the database....
    //This can be better modified to add more constraints if the CampaignOwner
    //must be a CEO, Admin or Manager 
    try {
        const campaignOwner = await User.findByPk(campaignOwnerId);
        if (!campaignOwner) errorRes(
            res,
            'The Campaign Owner does not exist in the database'
        )

        //check if there is a duplicate campaign in the database
        const info = await Campaign.findOne({
            where: { campaignName, campaignOwnerId }
        });
        if (info && info.id != req.params.campaignId) {
            errorRes(
                res,
                'This Campaign already exists in the database.'
            );
        } else {
            await Campaign.update({
                campaignName,
                campaignOwnerId,
                modifiedBy: req.params.userId
            }, {
                where: { id: req.params.campaignId }
            });

            //We'll retrieve the Campaign for Success Response
            const campaign = await Campaign.findByPk(req.params.campaignId)
            const data = await campaign;

            //Success response
            successResWithData(
                res,
                'Campagin updated successfully.',
                data
            );
        }
    } catch (error) {
        console.log(error);
        errorLog(
            res,
            'Error: Campaign Update is Unsuccessful.'
        )
    }
};

exports.deleteCampaign = async (req, res) => {
    try {
        //check if the campaignId exists..
        //(This will be a strong validation)
        const { campaignId } = req.params;

        const checkCampaign = await Campaign.findByPk(campaignId);
        if (!checkCampaign) {
            errorRes(res, 'This Campaign does not exist in the database.')
        } else {

            //Delete the Campaign
            await Campaign.destroy({ where: { id: campaignId } })

            //Success Response
            successRes(res, 'This Campaign has been deleted Successfully.')
        }
    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Something went wrong.')
    }
};

exports.getCampaign = async (req, res) => {
    try {

        const campaign = await Campaign.findByPk(req.params.campaignId, {
            include: [
                {
                    model: User,
                    as: 'users',
                    required: false
                },
                // {
                //     model: User,
                //     as: 'createdBy'
                // },
            ]

        })//This can be modified to suit the requirement needed in the response.

        //check if the campaign exists in the database
        if (!campaign) errorRes(res, 'This Campaign does not exist in the database');

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
        const list = await Campaign.findAll()

        //Success Response
        const data = await list
        successResWithData(res, 'Campaign List', data)

    } catch (error) {
        console.log(error);
        errorLog(res, 'Error: Something went wrong.')
    }
};

exports.addUsers = async (req, res) => {
    try {
        const result = await sequelize.transaction(async (t) => {

            const { userId } = req.body;
            //check the database if the campaign exists
            const checkCampaign = await Campaign.findByPk(req.params.campaignId);
            if (!checkCampaign) errorRes(res, 'Campaign does not exist.');

            //update the modifiedBy field of the campaign
            const campaign = await Campaign.update({ modifiedBy: req.params.userId }, {
                where: { id: req.params.campaignId },
                transaction: t
            });

            // //retrieve the updated campaign to add Users
            // const campaign = await Campaign.findById( req.params.campaignId );

            //To addUsers:::
            //check the typeOf userId and throw error if it's not array
            //if array, check the userId.length
            //if length=1, addUser(userId)
            //if length>1, addUsers(userId)
            if (typeof (userId) != 'array') {
                throw new Error('Wrong userId input type.')
            } else {
                if (userId.length = 1) {
                    const user = await User.findByPk(userId);
                    await campaign.addUser(user, {
                        transaction: t
                    })
                } else {
                    userId.forEach(async (id) => {
                        const user = await User.findByPk(id);
                        await campaign.addUser(user, { transaction: t })
                    })
                }

            }
        });

        //Success Response
        successResWithData( res, 'Successfully added the User(s).', data )

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: System internal Error' )
    }
};

exports.removeUsers = async (req, res) => {
    try {
        const data = await sequelize.transaction(async (t) => {

            const { userId } = req.body;
            //check the database if the campaign exists
            const checkCampaign = await Campaign.findByPk(req.params.campaignId);
            if (!checkCampaign) errorRes( res, 'Campaign does not exist.' );

            //update the modifiedBy field of the campaign
            const campaign = await Campaign.update({ modifiedBy: req.user.id }, {
                where: { id: req.params.campaignId },
                transaction: t
            });

            // //retrieve the updated campaign to add Users
            // const campaign = await Campaign.findById( req.params.campaignId );

            //To addUsers:::
            //check the typeOf userId and throw error if it's not array
            //if array, check the userId.length
            //if length=1, addUser(userId)
            //if length>1, addUsers(userId)
            if (typeof (userId) != 'array') {
                throw new Error('Wrong userId input type.')
            } else {
                if (userId.length = 1) {
                    const user = await User.findByPk(userId);
                    await campaign.removeUser(user, {
                        transaction: t
                    })
                } else {
                    userId.forEach(async (id) => {
                        const user = await User.findByPk(id);
                        await campaign.removeUser(user, { transaction: t })
                    })
                }
            }
        })

        //Success Response
        successResWithData( res, 'Successfully added the User(s).', data )
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: System internal Error' )
    }
};