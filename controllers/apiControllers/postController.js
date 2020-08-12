// var Post = require('../models/post');
const models = require('../../models');

const async = require('async');
const {
    error_res, error_res_with_msg, success_res, success_res_with_data
} = require('../../utils/apiResponse');


// Handle post create on POST.
exports.postPostCreate = async function( req, res, next) {
    
    
    console.log("This is user id of the user selected " + req.body.user_id)
    
    // get the user id that is creating the post
    let user_id = req.body.user_id;
    
    try{
    // get full details of the user that is creating the post i.e. Department and Current Business
    const user = await models.User.findByPk(
        user_id,
        {
            include:
            [
                        {
                            model: models.Department,
                            attributes: ['id', 'department_name']
                        },
                        {
                            model: models.CurrentBusiness,
                            attributes: ['id', 'current_business_name']
                        },
                        {
                            model: models.Role,
                            attributes: ['id', 'role_name']
                        },
                        {
                            model: models.Profile,
                            attributes: ['id', 'profile_name']
                        },
                        {
                            model: models.Permission,
                            as: 'permissions',
                            attributes: ['id', 'permission_name']
                        } 
                        
            ]
        }
    );
            if(!user) { error_res_with_msg( res, 'User not found!' )};

    console.log('This is the user details making the post' + user);
    
    
    console.log('This is the user department id making the post ' + user.Department.id);
    
    let departmentId = user.Department.id
    let currentBusinessId = user.CurrentBusiness.id
    let roleId = user.Role.id
    let profileId = user.Profile.id
    
    // create the post with user current business and department
    var post = await models.Post.create({
            post_title: req.body.post_title,
            post_body: req.body.post_body,
            UserId: user_id,
            RoleId: roleId,
            ProfileId: profileId,
            DepartmentId: departmentId,
            CurrentBusinessId: currentBusinessId
        } 
    );
    
    console.log("The post id " + post.id);

    
    // let's do what we did for user model
    var actionType = 'create';
        
        // START MANY TO MANY RELATIONSHIP (add categories)
        
        // INSERT PERMISSION MANY TO MANY RELATIONSHIP
        var addCategories = await CreateOrUpdateCategories (req, res, post, actionType);
        
        console.log(addCategories);
        
        if(!addCategories){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Categories'});
        }
        
        // END MANY TO MANY 
        
        console.log('Post Created Successfully');
        
        success_res_with_data( res, 'Post created successfully', post );
        
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        // not sure if we need to detsory the post? shall we?
        models.Post.destroy({ where: {id: post.id}});
        error_res( res, error );
    }
};

// Display post delete form on GET.
exports.getPostDelete = async (req, res, next) => {
    try {
        // find the post
        const post = await models.Post.findByPk(req.params.post_id);

        // Find and remove all associations (maybe not necessary with new libraries - automatically remove. Check Cascade)
        //const categories = await post.getCategories();
        //post.removeCategories(categories);

        // delete post 
        await models.Post.destroy({
            // find the post_id to delete from database
            where: {
                id: req.params.post_id
            }
        })
        //Success Response
        success_res( res, 'Post deleted successfully');
            console.log("Post deleted successfully");
        
    } catch (error) {
        error_res( res, error );
    }
    
    
};

// Handle post update on POST.
exports.postPostUpdate = async (req, res, next) => {
    try {
        console.log("ID is " + req.params.post_id);

        // find the post
        const post = await models.Post.findByPk(req.params.post_id);

        const actionType = 'update';
        
        // INSERT PERMISSION MANY TO MANY RELATIONSHIP
        const updateCategories = await CreateOrUpdateCategories (req, res, post, actionType);
        
        if(!updateCategories){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Categories to post'});
        }
        
        console.log('Post Updated Successfully');

        // now update
        const data = await models.Post.update(
            // Values to update
            {
                post_title: req.body.post_title,
                post_body: req.body.post_body,
                UserId: req.body.user_id
            }, { // Clause
                where: {
                    id: req.params.post_id
                }
            }
            //   returning: true, where: {id: req.params.post_id} 
        )
            //Success Response
            success_res( res, 'Post updated successfully' );
            console.log("Post updated successfully");
    
    } catch (error) {
        error_res( res, error );
    }
    
};

// Display detail page for a specific post.
exports.getPostDetails = async (req, res, next) => {
    try {
        console.log("I am in post details")
        // find a post by the primary key Pk
        const post = await models.Post.findByPk(
            req.params.post_id, {
                include: [
                    
                    {
                        model: models.User,
                        attributes: ['id', 'first_name', 'last_name']
                    },
                    {
                        model: models.Department,
                        attributes: ['id', 'department_name']
                    },
                    {
                        model: models.CurrentBusiness,
                        attributes: ['id', 'current_business_name']
                    },
                    {
                        model: models.Category,
                        as: 'categories',
                        required: false,
                        // Pass in the Category attributes that you want to retrieve
                        attributes: ['id', 'category_name']
                    }

                ]

            }
        )        
            //Success Response 
            success_res_with_data( res, 'Post Details', post );
            console.log("Post details renders successfully");
    
    } catch (error) {
        error_res( res, error );
    }
    
};
                       
// Display list of all posts.
exports.getPostList = async (req, res, next) => {
    try {
        // controller logic to display all posts
        const posts = await models.Post.findAll({
        
            // Make sure to include the categories
            include: [
                {
                    model: models.User,
                    attributes: ['id', 'first_name', 'last_name'],                
                },
                {
                    model: models.Category,
                    as: 'categories',
                    attributes: ['id', 'category_name']
                },
                
                {
                    model: models.Department
                },
                {
                    model: models.CurrentBusiness
                }
            ]

        });
            //Success Response
            console.log(posts);
            success_res_with_data( res, 'Post List', posts )
            
            console.log("Posts list renders successfully");
        
    } catch (error) {
        error_res( res, error );
    }
    

};

exports.getPostListByDepartment = async (req, res, next) => {

};
 

exports.getPostListByEmail = async (req, res, next) => {
   
};
 
async function CreateOrUpdateCategories(req, res, post, actionType) {

    let categoryList = req.body.categories;
    
    console.log(categoryList);
    
    console.log('type of category list is ' + typeof categoryList);
    
    // I am checking if categoryList exist
    if (categoryList) { 
        
        // I am checking if only 1 category has been selected
        // if only one category then use the simple case scenario for adding category
        if(categoryList.length === 1) {
            
        // check if we have that category that was selected in our database model for category
        const category = await models.Category.findByPk(categoryList);
        
        console.log("These are the category " + category);
        
        // check if permission exists
        if (!category) {
            // destroy the post we created and return error - but check if this is truly what you want to do
            // for instance, can a post exist without a ctaegory? if yes, you might not want to destroy
             if(actionType == 'create') models.Post.destroy({ where: {id: post.id}});
             return res.status(422).json({ status: false,  error: 'Cannot find that category selected'});
        }
        
        //  remove association before update new entry inside PostCategories table if it exist
        if(actionType == 'update') {
            const oldCategories = await post.getCategories();
            await post.removeCategories(oldCategories);
        }
        await post.addCategory(category);
        return true;
    
    }
    
    // Ok now lets do for more than 1 categories, the hard bit.
    // if more than one categories have been selected
    else {
        
        if(typeof categoryList === 'object') {
            // Loop through all the ids in req.body.categories i.e. the selected categories
            await categoryList.forEach(async (id) => {
                // check if all category selected are in the database
                const categories = await models.Category.findByPk(id);
                
                if (!categories) {
                    // return res.status(400);
                    // destroy the post we created - again check if this is what business wants
                    if(actionType == 'create') models.Post.destroy({ where: {id: post.id}});
                    return res.status(422).json({ status: false,  error: 'Cannot find that category selected'});
                }
                
                // remove association before if update
                if(actionType == 'update') {
                    const oldCategories = await post.getCategories();
                    await post.removeCategories(oldCategories);
                }
                 await post.addCategory(categories);
            });
            
            return true;
            
        } else {
            // destroy the post we created
            if(actionType == 'create') models.Post.destroy({ where: {id: post.id}});
            return res.status(422).json({ status: false,  error: 'Type of category list is not an object'});
        }
    }} else {
            if(actionType == 'create') { models.Post.destroy({ where: {id: post.id}});}
            return res.status(422).json({ status: false,  error: 'No category selected'});
        }
    
}