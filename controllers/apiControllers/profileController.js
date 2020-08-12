/**
 * Controller for Profile.
 * Author: Chibuike Umechukwu.
 * Version: 1.0.0
 * Release Date: 20-July-2020
 * Last Updated: 22-July-2020
 */

/**
 * Module dependencies.
 */
const models = require('../../models');
const {
    error_res, error_res_with_msg, success_res, success_res_with_data
} = require('../../utils/apiResponse');

// Handle profile create on POST.
exports.postProfileCreate = async (req, res, next) => {
    try {
        const profile = await models.Profile.create({
            profile_name: req.body.profile_name
        });
        console.log("Profile created successfully");

        //Success Response
        success_res_with_data( res, 'Profile created successfully', profile );

         // check if there was an error during post creation
    } catch (error) {
        error_res( res, error )
    }   
};

// Display profile delete form on GET.
exports.getProfileDelete = async (req, res, next) => {
    try {
        await models.Profile.destroy({
            where: {
                id: req.params.profile_id
            }
        });
            //Success Response
            success_res( res, 'Profile deleted successfully.' );
            console.log("Profile deleted successfully");

    } catch (error) {
        error_res( res, error );
    }
};

exports.postProfileUpdate = async (req, res, next) => {
    try {
        console.log("ID is " + req.params.profile_id);
        const profile = models.Profile.update(
            // Values to update
            {
                profile_name: req.body.profile_name
            }, { // Clause
                where: {
                    id: req.params.profile_id
                }
            }
        )

        //Success Response
        success_res_with_data( res, 'Profile updated successfully', profile )
            console.log("Profile updated successfully");

    } catch (error) {
        error_res( res, error );
    }
    
};

// Display detail page for a specific profile.
exports.getProfileDetails = async (req, res, next) => {
    try {
        const categories = await models.Category.findAll();

        const profile = await models.Profile.findByPk( req.params.profile_id );
            
            console.log(profile);
            
            //Success Response
            success_res_with_data( res, 'Profile details', profile )
            
            console.log("Profile details renders successfully");
    
    } catch (error) {
        error_res( res, error );
    }
};

// Display list of all profiles.
exports.getProfileList = async (req, res, next) => {
    try {
        const profiles = await models.Profile.findAll();

        console.log("rendering profile list");
        
        //Success Response
        success_res_with_data( res, 'Profile List', profiles );
        console.log("Profiles list renders successfully");

    } catch (error) {
        error_res( res, error );
    }
};