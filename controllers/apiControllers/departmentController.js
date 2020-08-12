/**
 * Controller for Department.
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
exports.postDepartmentCreate = async (req, res, next) => {
    try {
        const department = await models.Department.create({
            department_name: req.body.department_name
        })

        //Success Response
        success_res_with_data( res, 'Department created successfully', department );
            console.log("Department created successfully");
            
        // check if there was an error during post creation    
    } catch (error) {
        error_res( res, error );
    }
        
};

// Display Department delete form on GET.
exports.getDepartmentDelete = async(req, res, next) => {
    try {
        await models.Department.destroy({
        where: {
            id: req.params.department_id
        }
    })

        //Success Response
        success_res( res, 'Department deleted successfully' );
        console.log("Department deleted successfully");

    } catch (error) {
        error_res( res, error );
    }
};

exports.postDepartmentUpdate = async (req, res, next) => {
    try {
        console.log("ID is " + req.params.department_id);
        const department = await models.Department.update(
            // Values to update
            {
                department_name: req.body.department_name
            }, { // Clause
                where: {
                    id: req.params.department_id
                }
            }
        )

            //Success Response
            success_res_with_data( res, 'Department updated successfully', department );
            console.log("Department updated successfully");

    } catch (error) {
        error_res( res, error );
    }
    
};

// Display detail page for a specific Department.
exports.getDepartmentDetails = async (req, res, next) => {
    try {
        
    const categories = await models.Category.findAll();

    const department = await models.Department.findByPk(
        req.params.department_id 
    )
        
        //Success Response
        success_res_with_data( res, 'Department details', department );
        console.log("Department details renders successfully");

    } catch (error) {
        error_res( res, error );
    }
};

// Display list of all roles.
exports.getDepartmentList = async (req, res, next) => {
    try {
        const departments = await models.Department.findAll()
        console.log("rendering Department list");

        //Success Response
        success_res_with_data( res, 'Department List', departments );
        console.log("Departments list renders successfully");
    } catch (error) {
        error_res( res, error );
    }
    
};