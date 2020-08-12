const models = require('../../models');
const { success_res_with_data, error_res_with_msg, error_res } = require('../../utils/apiResponse');


//Get all Posts by Department name
exports.getAllPostsByDept = async(req, res) => {
    try {
        const department = await models.Department.findOne({ 
            where: { department_name: req.params.department_name }
        });
        //If Such Department doesn't exist
        if(!department){ 
            error_res_with_msg(  res, `${req.params.department_name} does not exist in the database.`  )
        } else {
            const posts = await models.Post.findAll({
                where: { DepartmentId: department.id }
            });
            let post_array = [];
            posts.forEach(post => {
                post_array.push({
                    id: post.id,
                    post_title: post.post_title,
                    post_body: post.post_body,
                    department: department.department_name
                })
            })

            //Success Response
            success_res_with_data( res,
                `All Posts In ${department.department_name}`,
                post_array
            );
        }
    } catch (e) {
        error_res(res, e);
    }
};

//Get all Posts by username
exports.getAllPostsByUsername = async(req, res) => {
    try {
        const user = await models.User.findOne({ 
            where: { username: req.params.username },
            include: {
                model: models.Post,
                attributes: [ 'id', 'post_title', 'post_body' ]
            }
        });
        //If Such User doesn't exist
        if(!user){ 
            error_res_with_msg(  res, `${req.params.username} does not exist in the database.`  )
        }

        //Success Response
        let posts = [];
            user.Posts.forEach(post => {
                posts.push({
                    id: post.id,
                    post_title: post.post_title,
                    post_body: post.post_body,
                    author: user.username
                })
            })
        success_res_with_data( res,
            `All Posts by ${user.username}`,
            posts
            )

    } catch (e) {
        error_res( res, e );
    }
};

//Get all Posts by username and department name
exports.getAllPostsByUsernameByDept = async(req, res) => {
    try {
        const department = await models.Department.findOne({
            where: { department_name: req.params.department_name }
        });

        //If Such Department doesn't exist
        if(!department){ 
            error_res_with_msg(  res, `${req.params.department_name} does not exist in the database.`  )
        }else{
            const user = await models.User.findOne({
                where: { 
                    username: req.params.username, 
                    DepartmentId: department.id 
                },
                include: { 
                    model: models.Post, 
                    attributes: [ 'id', 'post_title', 'post_body' ]
                }
            });
            //If Such User doesn't exist
            if(!user){ 
                error_res_with_msg(  res, `${req.params.username} in 
                    ${req.params.department_name} department does not exist in the database.`  )
            }
            let posts = [];
            user.Posts.forEach(post => {
                posts.push({
                    id: post.id,
                    post_title: post.post_title,
                    post_body: post.post_body,
                    author: user.username
                })
            })
            
            //Success Response
            success_res_with_data( res,
                `All Posts by ${req.params.username} in ${req.params.department_name}`,
                posts
            )
        }
    } catch (e) {
        error_res(res, e);
    }
};

//Get all Users by role
exports.getAllUsersByRole = async(req, res) => {
    try {
        const role = await models.Role.findOne({ 
            where: { role_name: req.params.role_name } 
        });

        //If Such Role doesn't exist
        if(!role){ 
            error_res_with_msg(  res, `${req.params.role_name} does not exist in the database.`  )
        } else {
            const users = await models.User.findAll({
                where: { 
                    RoleId: role.id
                }
            });
            //If Such User doesn't exist
            if(!users){ 
                error_res_with_msg(  
                    res, 
                    `There are no Users as ${req.params.role_name} in the database.`  
                );
            }

             //Success Response
             let data = [];
            users.forEach(user => {
                data.push({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: role.role_name
                })
            })
             success_res_with_data( res,
                `All Users in ${req.params.role_name} role`,
                data
            )
        }
    } catch (e) {
        error_render_with_msg(res, e);
    }
};

//Get al Users by Profile
exports.getAllUsersByProfile = async(req, res) => {
    try {
        const profile = await models.Profile.findOne({ 
            where: { profile_name: req.params.profile_name } 
        });

        //If Such Profile doesn't exist
        if(!profile){ 
            error_res_with_msg(  res, `${req.params.profile_name} does not exist in the database.`  )
        } else {
            const users = await models.User.findAll({
                where: { 
                    ProfileId: profile.id
                }
            });
            //If Such User doesn't exist
            if(!users){ 
                error_res_with_msg(  
                    res, 
                    `There are no Users as ${req.params.profile_name} in the database.`  
                );
            }
             //Success Response
             let data = [];
            users.forEach(user => {
                data.push({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile: profile.profile_name
                })
            })
            success_res_with_data(
                res, 
                `All Users in ${req.params.profile_name} profile`,
                data
            )
        }
    } catch (e) {
        error_res(res, e);
    }
};

//Get all Posts by category name
exports.getAllPostsByCategory = async(req, res) => {
    try {
        const category = await models.Category.findOne({ 
            where: { category_name: req.params.category_name } 
        });

        //If Such Role doesn't exist
        if(!category){ 
            error_res_with_msg(  res, `${req.params.category_name} does not exist in the database.`  )
        } else {
            const post_bulk = await models.Post.findAll({
                include: { 
                    model: models.Category,
                    as: 'categories',
                    through: 'PostCategories',
                    attributes: [ 'id', 'category_name' ]
                }
            });
            let posts = [];
            console.log(typeof(post_bulk));
            post_bulk.forEach(post => {
                post.categories.forEach((category) => {
                    if(category.category_name == req.params.category_name){
                        console.log(post.id, post.post_title)
                        posts.push(post);
                    }
                })
            });

            //If Such User doesn't exist
            if(!posts){ 
                error_res_with_msg(  
                    res, 
                    `There are no Posts in ${req.params.category_name} in the database.`  
                );
            }
            
             //Success Response
             let data = [];
            posts.forEach(post => {
                data.push({
                    id: post.id,
                    post_title: post.post_title,
                    post_body: post.post_body,
                    category: req.params.category_name
                })
            })
             success_res_with_data( res,
                `All Posts in ${req.params.category_name} category`,
                posts
            )
        }
    } catch (e) {
        error_res( res, e );
    }
};

//Get all Posts by a User in a Current Business
exports.getAllPostsByUserInCurrentBusiness = async(req, res) => {
    try {
        const business = await models.CurrentBusiness.findOne({
            where: { current_business_name: req.params.current_business_name }
        });

        //If Such Current Business doesn't exist
        if(!business){ 
            error_res_with_msg(  res, `${req.params.current_business_name} does not exist in the database.`  )
        }else{
            const user = await models.User.findOne({
                where: { 
                    username: req.params.username, 
                    CurrentBusinessId: business.id 
                },
                include: { 
                    model: models.Post, 
                    attributes: [ 'id', 'post_title', 'post_body' ]
                }
            });
            //If Such User doesn't exist
            if(!user){ 
                error_res_with_msg(  res, `${req.params.username} in 
                    ${req.params.current_business_name} does not exist in the database.`  )
            }

            //Success Response
            let posts = [];
            user.Posts.forEach(post => {
                posts.push({
                    id: post.id,
                    post_title: post.post_title,
                    post_body: post.post_body,
                    author: user.username,
                    business: business.current_business_name
                })
            });

            success_res_with_data( res,
                `All Posts by ${req.params.username} in ${req.params.current_business_name}`,
                posts
            )
        }        

    } catch (e) {
        error_res(res, e);
    }
};

//Get all Posts by a User in Engineering department in Business Company 123
exports.getAllPostsByUserInCurrentBusinessInDept = async(req, res) => {
    try {
        const department = await models.Department.findOne({
            where: { department_name: req.params.department_name }
        });

        const business = await models.CurrentBusiness.findOne({
            where: { current_business_name: req.params.current_business_name }
        });

        //If Such Current Business OR Department doesn't exist
        if( !business || !department ){ 
            error_res_with_msg(  res, `${req.params.current_business_name} or 
                ${req.params.department_name} does not exist in the database.`  )
        }else{
            const user = await models.User.findOne({
                where: { 
                    username: req.params.username, 
                    CurrentBusinessId: business.id,
                    DepartmentId: department.id
                },
                include: { 
                    model: models.Post, 
                    attributes: [ 'id', 'post_title', 'post_body' ]
                }
            });
            //If Such User doesn't exist
            if(!user){ 
                error_res_with_msg(  res, `${req.params.username} in 
                    ${req.params.current_business_name} and 
                    ${req.params.department_name} department does not exist in the database.`  
                )
            }

            //Success Response
            let posts = [];
            user.Posts.forEach(post => {
                posts.push({
                    id: post.id,
                    post_title: post.post_title,
                    post_body: post.post_body,
                    author: user.username,
                    business: business.current_business_name,
                    department: department.department_name
                })
            })
            success_res_with_data( res,
                `All Posts by ${req.params.username} in ${req.params.department_name} department in 
                ${req.params.current_business_name}`,
                posts
            );
        }        
    } catch (e) {
        error_res(res, e);
    }
};

//Get all Posts for a current business Company ABC
exports.getAllPostsForCurrentBusiness = async(req, res) => {
    try {
        const business = await models.CurrentBusiness.findOne({ 
            where: { 
                current_business_name: req.params.current_business_name 
            }
        });
        //If Such Business doesn't exist
        if(!business){ 
            error_res_with_msg(  res, `${req.params.current_business_name} does not exist in the database.`  )
        }
        const posts = await models.Post.findAll({
            where: { CurrentBusinessId: business.id }
        });

        //Success Response
        let data = [];
            posts.forEach(post => {
                data.push({
                    id: post.id,
                    post_title: post.post_title,
                    post_body: post.post_body,
                    business: business.current_business_name
                })
            })
        success_res_with_data( res,
            `All Posts for ${req.params.current_business_name}`,
            data
        )
    } catch (e) {
        error_res(res, e);
    }
};

//Get all Posts by a User in Role=Manager, Department =Engineering
exports.getAllPostsByUserInDeptInRole = async(req, res) => {
    try {
        const department = await models.Department.findOne({
            where: { department_name: req.params.department_name }
        });

        const role = await models.Role.findOne({
            where: { role_name: req.params.role_name }
        });

        //If Such  Role or Department doesn't exist
        if( !role || !department ){ 
            error_res_with_msg(  res, `${req.params.role_name} or 
                ${req.params.department_name} does not exist in the database.`  )
        }else{
            const user = await models.User.findOne({
                where: { 
                    username: req.params.username, 
                    RoleId: role.id,
                    DepartmentId: department.id
                },
                include: { 
                    model: models.Post, 
                    attributes: [ 'id', 'post_title', 'post_body' ]
                }
            });
            //If Such User doesn't exist
            if(!user){ 
                error_res_with_msg(  res, `${req.params.username} as 
                    ${req.params.role_name} in 
                    ${req.params.department_name} department does not exist in the database.`  
                )
            }

            //Success Response
            let posts = [];
            user.Posts.forEach(post => {
                posts.push({
                    id: post.id,
                    post_title: post.post_title,
                    post_body: post.post_body,
                    author: user.username,
                    department: department.department_name,
                    role: role.role_name
                })
            })
            success_res_with_data(
                res, 
                `All Posts by ${req.params.username} as ${req.params.role_name} 
                in ${req.params.department_name}`,
                posts
            )
        }        
    } catch (e) {
        error_res( res, e );
    }
};

//Profile= Administreator, Current Business = Company ABC
exports.getAllPostsByUserInCurrentBusinessInDeptInRoleInProfile = async(req, res) => {
    try {
        const business = await models.CurrentBusiness.findOne({
            where: { current_business_name: req.params.current_business_name }
        });
        const profile = await models.Profile.findOne({
            where: { profile_name: req.params.profile_name }
        });
        const department = await models.Department.findOne({
            where: { department_name: req.params.department_name }
        });

        const role = await models.Role.findOne({
            where: { role_name: req.params.role_name }
        });

        //If Such accounts don't exist
        if( !role || !department || !business || !profile ){ 
            error_res_with_msg(  res, `${req.params.role_name} or 
                ${req.params.department_name} or ${req.params.current_business_name}
                or ${req.params.profile_name} does not exist in the database.`  )
        }else{
            const user = await models.User.findOne({
                where: { 
                    username: req.params.username, 
                    RoleId: role.id,
                    DepartmentId: department.id,
                    ProfileId: profile.id,
                    CurrentBusinessId: business.id
                },
                include: { 
                    model: models.Post, 
                    attributes: [ 'id', 'post_title', 'post_body' ]
                }
            });
            //If Such User doesn't exist
            if(!user){ 
                error_res_with_msg(  res, `${req.params.username} as 
                    ${req.params.role_name} and ${req.params.profile_name} in 
                    ${req.params.department_name} in ${req.params.current_business_name} 
                     does not exist in the database.`  
                )
            }

            //Success Response
            let posts = [];
            user.Posts.forEach(post => {
                posts.push({
                    id: post.id,
                    post_title: post.post_title,
                    post_body: post.post_body,
                    author: user.username,
                    role: role.role_name,
                    profile: profile.profile_name,
                    department: department.department_name,
                    business: business.current_business_name
                })
            })
            success_res_with_data(
                res,
                `All Posts by ${req.params.username} as Role: ${req.params.role_name} and Profile: ${req.params.profile_name} in department: ${req.params.department_name} in business: ${req.params.current_business_name}`,
                posts
            )
        }        
    } catch (e) {
        error_res(res, e);
    }
};