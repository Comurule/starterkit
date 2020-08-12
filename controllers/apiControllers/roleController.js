/**
 * Controller for Role.
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
} = require('../../utils/apiResponse')

// Handle role create on POST.
exports.postRoleCreate = async (req, res, next) => {
    try {
        const role = await models.Role.create({
            role_name: req.body.role_name
        });

        //Success Response
        success_res_with_data( 
            res, 'Role created Successfully', role
        )
            console.log("Role created successfully");
            
    // check if there was an error during post creation
    } catch (error) {
        error_res( res, error );
    }   
};

// Display role delete form on GET.
exports.getRoleDelete = async (req, res, next) => {
    try {
        await models.Role.destroy({
            where: {
                id: req.params.role_id
            }
        })
        
        //Success Response
        success_res( res, 'Role deleted Successfully');

        console.log("Role deleted successfully");

    //check for errors while deleting the role
    } catch (error) {
         error_res( res, error );
    }
};

exports.postRoleUpdate = async (req, res, next) => {
    try {
         console.log("ID is " + req.params.role_id);
        const role = await models.Role.update(
            // Values to update
            {
                role_name: req.body.role_name
            }, { // Clause
                where: {
                    id: req.params.role_id
                }
            }
        );

        //Success Response
        success_res_with_data( res, 'Role updated Successfully', role );
        console.log("Role updated successfully");
    
    } catch (error) {
        error_res( res, error );
    }  
};

// Display detail page for a specific role.
exports.getRoleDetails = async (req, res, next) => {
    try {
        const categories = await models.Category.findAll();

        const role = await models.Role.findByPk( req.params.role_id )
        
            //Succeess Response
            success_res_with_data( res, 'Role details', role )
            
            console.log("Role details renders successfully");
    } catch (error) {
        error_res( res, error );
    }
    
    
};

// Display list of all roles.
exports.getRoleList = async (req, res, next) => {
    try {
        const roles = await models.Role.findAll()
        console.log("rendering role list");

        //Success Response
        success_res_with_data( res, 'Role List', roles );
        console.log("Roles list renders successfully");
        
    } catch (error) {
        error_res( res, error );
    }
};