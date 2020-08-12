/**
 * Controller for Current Business.
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
 

// Handle department create on POST.
exports.postCurrentBusinessCreate = async (req, res, next) => {
    try {
        const currentBusiness = await models.CurrentBusiness.create({
        current_business_name: req.body.current_business_name
    })

        //Success Response
        success_res_with_data( res, 'Current Business created successfully', currentBusiness );
        console.log("Current Business created successfully");
        
        // check if there was an error during post creation    
    } catch (error) {
        error_res( res, error );
    };
};

// Display Current Business delete form on GET.
exports.getCurrentBusinessDelete = async (req, res, next) => {
    try {
        await models.CurrentBusiness.destroy({
            where: {
                id: req.params.current_business_id
            }
        })
            
            //Success Response
            success_res( res, 'Current Business deleted successfully.' );
            console.log("Current Business deleted successfully");
    
    } catch (error) {
        error_res( res, error );
    };
};

exports.postCurrentBusinessUpdate = async (req, res, next) => {
    try {
        console.log("ID is " + req.params.current_business_id);
    const business = await models.CurrentBusiness.update(
        // Values to update
        {
            current_business_name: req.body.current_business_name
        }, { // Clause
            where: {
                id: req.params.current_business_id
            }
        }
    )

        //Success Response
        success_res_with_data( res, 'Current Business updated successfully', business );
        console.log("Current Business updated successfully");

    } catch (error) {
        error_res( res, error );
    }
};

// Display detail page for a specific Current Business.
exports.getCurrentBusinessDetails = async (req, res, next) => {
    try {
        const categories = await models.Category.findAll();

        const business = await models.CurrentBusiness.findByPk(
            req.params.current_business_id 
        );
            
            //Success Response
            success_res_with_data( res, 'Current Business details', business );
            console.log("Current Business details renders successfully");
            
    } catch (error) {
        error_res( res, error );
    } 
};

// Display list of all roles.
exports.getCurrentBusinessList = async (req, res, next) => {
    try {
        const businesses = await models.CurrentBusiness.findAll();
        console.log("rendering Current Business list");
       
       //Success Response
       success_res_with_data( res, 'Current Business List', businesses );
        console.log("Current Business list renders successfully");
    
    } catch (error) {
        error_res( res, error );
    }
    
};