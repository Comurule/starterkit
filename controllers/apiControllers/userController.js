/**
 * Controller for User.
 * Author: Chibuike Umechukwu.
 * Version: 1.0.0
 * Release Date: 20-July-2020
 * Last Updated: 22-July-2020
 */

/**
 * Module dependencies.
 */
const models = require('../../models');
const{ 
    error_res, error_res_with_msg, success_res, success_res_with_data
} = require('../../utils/apiResponse');

// Handle User create on POST.
exports.postUserCreate = async(req, res, next) => {
    console.log(req.body);
    // create User POST controller logic here
    // If an User gets created successfully, we just redirect to Users list
    // no need to render a page
  
    try {
        var user = await models.User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            username: req.body.username,
            DepartmentId: req.body.department_id,
            ProfileId: req.body.profile_id,
            RoleId: req.body.role_id,
            CurrentBusinessId: req.body.current_business_id
        })

        console.log("The user id " + user.id);
        
        var actionType = 'create';
        
        // INSERT PERMISSION MANY TO MANY RELATIONSHIP
        var addPermissions = await CreateOrUpdatePermissions (req, res, user, actionType);
        
        if(!addPermissions){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Permissions'});
        }
        
        console.log('User Created Successfully');
    
         // everything done, now redirect....to user created page.
         success_res_with_data(
             res, 'User created successfully', user
         )
        
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        // remove the user that was created so we don't have a user without permission.
        models.User.destroy({ where: {id: user.id}});
        
        error_res( res, error );
        
    }
};

// Display User delete form on GET.
exports.getUserDelete = (req, res, next) => {
    try {
        models.User.destroy({
            where: {
                id: req.params.user_id
            }
        }).then(() => {

            //Success reponse
            success_res(
                res, 'User account deleted successfully.'
            )
            console.log("User deleted successfully");
        });    
    } catch (e) {
        error_res( res, e )
    }
    
};
 
exports.postUserUpdate = async function(req, res, next) {
    console.log("ID is " + req.params.user_id);
    console.log("first_name is " +req.body.first_name);
    console.log("last_name is " + req.body.last_name);
    console.log("email is " +req.body.email);
    console.log("username is " + req.body.username);
    console.log("department_id is " +req.body.department_id);
    console.log("role_id is " +req.body.role_id);
    console.log("profile_id is " +req.body.profile_id);
    
    try {
        
        await models.User.update(
            // Values to update
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                username: req.body.username,
                DepartmentId: req.body.department_id,
                ProfileId: req.body.profile_id,
                RoleId: req.body.role_id,
                CurrentBusinessId: req.body.current_business_id
            }, { // Clause
                where: {
                    id: req.params.user_id
                }
            }
        );
        
        
        var user = await models.User.findByPk(req.params.user_id);
        
        console.log('this is user from update ' + user + 'id' + user.id);
        
        var actionType = 'update';
         
        // INSERT PERMISSION MANY TO MANY RELATIONSHIP
        var updatePermissions = await CreateOrUpdatePermissions (req, res, user, actionType);
        
        if(!updatePermissions){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Permissions'});
        }
        
        console.log('User Updated Successfully');
    
         // everything done, now redirect....to user created page.
        success_res_with_data( res, 'User updated successfully', user );

    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        error_res( res, error );
    }
};

// Display detail page for a specific User.
exports.getUserDetails = async (req, res, next) =>{
    try {
        const permissions = await models.Permission.findAll();
        const departments = await models.Department.findAll();
        const roles = await models.Role.findAll();
        const profiles = await models.Profile.findAll();
        const currentBusinesses = await models.CurrentBusiness.findAll();

        const user = await models.User.findByPk(
            req.params.user_id, {
                include:
                [
                    {
                        model: models.Department 
                    },
                    {
                        model: models.Role
                    },
                    {
                        model: models.Profile
                    },
                    {   model: models.Post},
                    {   model: models.CurrentBusiness},
                    {
                        model: models.Permission,
                        as: 'permissions',
                        attributes: ['id', 'permission_name']
                    } 
                            
                ]
            }
        )
            console.log(user);

            //Success Response
            success_res_with_data( 
                res, 'User Account Details', user 
            );
            console.log("User details renders successfully");    
    } catch (error) {
        error_res( res, error );
    }
    
};

// Display list of all Users.
exports.getUserList = (req, res, next) => {
    try {
        models.User.findAll().then(async function(users) {
            console.log("rendering user list");
            success_res_with_data( res, 'User List', users );
            console.log("Users list renders successfully");
        });
      
    } catch (error) {
        error_res( res, error );
    }
    
};

 
 
//I need to study this....
async function CreateOrUpdatePermissions(req, res, user, actionType) {

    let permissionList = req.body.permissions;
    
    console.log(permissionList);
    
    console.log('type of permission list is ' + typeof permissionList);
    
    // I am checking if permissionList exist
    if (permissionList) { 
        
        // I am checking if only 1 permission has been selected
        // if only one permission then use the simple case scenario for adding permission
        if(permissionList.length === 1) {
            
        // check if we have that permission that was selected in our database model for permission
        const permission = await models.Permission.findByPk(permissionList);
        
        console.log("These are the permissions " + permission);
        
        // check if permission exists
        if (!permission) {
            // destroy the user we created - since the permission selected does not exist.
            // we don't want to have a user in db without a permission
            // note this is only for actionType create i.e. when we are creating a new user
            if(actionType == 'create') models.User.destroy({ where: {id: user.id}});
            return res.status(422).json({ status: false,  error: 'Cannot find that permission selected'});
        }
        
        // since we want to update the permission, lets remove the previous permissions for that user.
        //  remove association before update new entry inside UserPermission table if it exist
        if(actionType == 'update') {
            const oldPermissions = await user.getPermissions();
            await user.removePermissions(oldPermissions);
        }
        
        // now, create a new permission for the user.
        await user.addPermission(permission);
        return true;
    }
    
    // Ok now lets do for more than 1 permissions, the hard bit.
    // if more than one permissions have been selected
    else {
        
        // object might not be the perfect typeof to check - this is just. quick way for me.
        if(typeof permissionList === 'object') {
            // Loop through all the ids in req.body.permissions i.e. the selected permissions
            await permissionList.forEach(async (id) => {
                // check if all permission selected are in the database
                const permission = await models.Permission.findByPk(id);
                
                if (!permission) {
                    // return res.status(400);
                    // destroy the user we created, we don't want user without permission in db
                    if(actionType == 'create') models.User.destroy({ where: {id: user.id}});
                    return res.status(422).json({ status: false,  error: 'Cannot find that permission selected'});
                }
                
                // remove previous associations before we update
                if(actionType == 'update') {
                    const oldPermissions = await user.getPermissions();
                    await user.removePermissions(oldPermissions);
                }
                 
                // now add new permission after removal
                await user.addPermission(permission);
                
            });
            
            return true;
            
        } else {
            // destroy the user we created since permission type is not object
            if(actionType == 'create') models.User.destroy({ where: {id: user.id}});
            return res.status(422).json({ status: false,  error: 'Type of permission list is not an object'});
        }
    }} else {
            // destroy user we created since no permission was selected.
            if(actionType == 'create') { models.User.destroy({ where: {id: user.id}});}
            return res.status(422).json({ status: false,  error: 'No permission selected'});
        }
    
}