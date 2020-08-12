/**
 * Controller for Permission.
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



// Handle Permission create on POST.
exports.postPermissionCreate = async (req, res, next) => {
    try {
         const permission = await models.Permission.create({
            permission_name: req.body.permission_name
        })

            //success Response
            success_res_with_data( res, 'Permission created successfully', permission )
            console.log("Permission created successfully");

        // check if there was an error during post creation 
    } catch (error) {
        error_res( res, error );
    }
};

// Display Permission delete form on GET.
exports.getPermissionDelete = async (req, res, next) => {
    try {
        await models.Permission.destroy({
            where: {
                id: req.params.permission_id
            }
        })
            
            //success Response
            success_res( res, 'Permission deleted successfully' );
            console.log("Permission deleted successfully");
    
    } catch (error) {
        error_res( res, error );
    }
    
};

 

exports.postPermissionUpdate = async (req, res, next) => {
    try {
        console.log("ID is " + req.params.permission_id);
        const permission = await models.Permission.update(
            // Values to update
            {
                permission_name: req.body.permission_name
            }, { // Clause
                where: {
                    id: req.params.permission_id
                }
            }
        )

            //Success Response
            success_res_with_data( res, 'Permission updated successfully', permission );
            console.log("Permission updated successfully");
    } catch (error) {
        error_res( res, error );
    }
};

// Display detail page for a specific Permission.
exports.getPermissionDetails = async (req, res, next) => {
    try {
        
    const permission = await models.Permission.findByPk(
            req.params.permission_id 
        )
            
            //Success Response
            success_res_with_data( res, 'Permission details', permission );
            
            console.log("Permission details renders successfully"); 

    } catch (error) {
        error_res( res, error );
    }
};

// Display list of all roles.
exports.getPermissionList = async (req, res, next) => {
    try {
    const permissions = await models.Permission.findAll()
        console.log("rendering Permission list");
        
        //Success Response
        success_res_with_data( res, 'Permission List', permissions );

        console.log("Permissions list renders successfully");
    } catch (error) {
        error_res( res, error );
    }
};