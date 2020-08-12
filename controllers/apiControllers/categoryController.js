const models = require('../../models');
const {
    error_res, error_res_with_msg, success_res, success_res_with_data
} = require('../../utils/apiResponse');

// Handle category create on POST.
exports.postCategoryCreate = async (req, res, next) => {
    try {
        const category = await models.Category.create({
            category_name: req.body.category_name
        })
            console.log("Category created successfully");

            //Success Response
            success_res_with_data( res, 'Category created successfully', category );

        // check if there was an error during post creation
  
    } catch (error) {
        error_res( res, error );
    }
};    

// Display category delete form on GET.
exports.getCategoryDelete = async (req, res, next) => {
    try {
        await models.Category.destroy({
            // find the category_id to delete from database
            where: {
                id: req.params.category_id
            }
        }) 

        //Success Response
        success_res( res, 'Category deleted successfully')
        console.log("Category deleted successfully");

    } catch (error) {
        error_res( res, error );
    }
};
 
// Handle category update on POST.
exports.postCategoryUpdate = async (req, res, next) => {
    try {
        console.log("ID is " + req.params.category_id);
        const category = await models.Category.update(
            // Values to update
            {
                category_name: req.body.category_name,
            }, { // Clause
                where: {
                    id: req.params.category_id
                }
            }
            //   returning: true, where: {id: req.params.post_id} 
        )
            //Success Response
            success_res_with_data( res, 'Category updated successfully', category );
            console.log("Category updated successfully");

    } catch (error) {
        error_res( res, error );
    }
};

// Display detail page for a specific category.
exports.getCategoryDetails = async (req, res, next) => {
    try {
        // find a post by the primary key Pk
        const category = await models.Category.findByPk(
            req.params.category_id, {
                include: [{
                    model: models.Post,
                    as: 'posts',
                    required: false,
                    // Pass in the Category attributes that you want to retrieve
                    attributes: ['id', 'post_title', 'post_body'],
                    through: {
                        // This block of code allows you to retrieve the properties of the join table PostCategories
                        model: models.PostCategories,
                        as: 'postCategories',
                        attributes: ['post_id', 'category_id'],
                    }
                }]
            }
        )
            //Success Response
            success_res_with_data( res, 'Category details', category );
            console.log("Category details renders successfully");    
        } catch (error) {
            error_res( res, error );
        }
};

// Display list of all categories.
exports.getCategoryList = async (req, res, next) => {
    try {
        // controller logic to display all categories
    const categories = await models.Category.findAll({
        include: [{
            model: models.Post,
            as: 'posts',
            required: false,
            // Pass in the Category attributes that you want to retrieve
            attributes: ['id', 'post_title', 'post_body'],
            through: {
                // This block of code allows you to retrieve the properties of the join table PostCategories
                model: models.PostCategories,
                as: 'postCategories',
                attributes: ['post_id', 'category_id'],
            }
        }]
    })
        
        //Success Response
        success_res_with_data( res, 'Categories List, populated with the associated Posts', categories )
        console.log("Categories list renders successfully");

    } catch (error) {
        error_res( res, error );
    }
};