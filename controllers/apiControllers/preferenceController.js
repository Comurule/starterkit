const { PreferenceCenter, Lead } = require('../../models');
const { 
    errorRes, errorLog, successResWithData, successRes 
} = require('../../utils/apiResponse');

exports.createPreference = async (req, res) => {
   
    try {
        //validate inputs
        const inputData = await validateInputs(req,res);
        if(typeof inputData=== 'string') return errorRes(res, inputData);
        
        //check if there is a duplicate in the database
        const checkPreference = await PreferenceCenter.findOne({ 
            where: { 
                name: inputData.name,
                departmentId: req.user['dataValues'].DepartmentId,
                currentBusinessId: req.user['dataValues'].CurrentBusinessId 
            } 
        });
        if( checkPreference ) {
            return errorRes( res, 'This Preference Center already exists in the database.' );
        };

        //check if there is a duplicate pcCode in the database
        const checkPcCode = await PreferenceCenter.findOne({ 
            where: { 
                name: inputData.pcCode,
                departmentId: req.user['dataValues'].DepartmentId,
                currentBusinessId: req.user['dataValues'].CurrentBusinessId 
            } 
        });
        if( checkPcCode ) {
            return errorRes( res, 'This Preference Center already exists in the database.' );
        }
        
            const preference = await PreferenceCenter.create({
                ...inputData,
                departmentId: req.user['dataValues'].DepartmentId,
                currentBusinessId: req.user['dataValues'].CurrentBusinessId
            });

            const data = await preference;

            //Success response
            successResWithData( res, 'Preference created successfully.', data );
        
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Preference creation is Unsuccessful.')
    }
};

exports.updatePreference = async (req, res) => {
    
    try {
        //validate inputs
        const inputData = await validateInputs(req,res);
        if(typeof inputData=== 'string') return errorRes(res, inputData);

        //check if the parentPC isnt the same with the PC itself 
        if(inputData.parentPC != '' && inputData.parentPC == req.params.preferenceId) 
            return errorRes(res, 'Parent PC can not be same as the Preference Center')
        //check if there is a duplicate in the database
        const checkPreference = await PreferenceCenter.findOne({ where: { 
            name: inputData.name,
            departmentId: req.user['dataValues'].DepartmentId,
            currentBusinessId: req.user['dataValues'].CurrentBusinessId 
        } });
        if(checkPreference && checkPreference.id != req.params.preferenceId) {
            errorRes( res, 'This Preference already exists in the database.' );
            
        } else {
    
            await PreferenceCenter.update(inputData, { where: { id: req.params.preferenceId } });

            const preference = await PreferenceCenter.findByPk( req.params.preferenceId )

            const data = await preference;

            //Success response
            successResWithData( 
                res, 
                'Preference updated successfully.', 
                data 
            );
        }

    } catch (error) {
        console.log(error);
        errorLog( res, 'Preference Center Update is Unsuccessful.')
    }
};

exports.deletePreference = async (req, res) => {
    try {
        console.log(1,'Delete Preference');
        //check if the id is valid
        const checkPreference = await PreferenceCenter.findByPk( req.params.preferenceId );
        console.log('got the Preference');
        if(!checkPreference) return errorRes( res, 'Invalid Entry Details' );
        console.log('about to delete the preference')
        await PreferenceCenter.destroy({ where: { id: req.params.preferenceId } })
        console.log('preference deleted')
        //Success Response
        successRes( res, 'Preference Center deleted Successfully.' )

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' )
    }
};

exports.getPreference = async (req, res) => {
    try {
        const preference = await PreferenceCenter.findByPk( req.params.preferenceId, { include: Lead });
        if(!preference) errorRes( res, 'Invalid Entry DEtails' )

        //Success Response
        const data = await preference
        successResWithData( res, 'Preference Center Details', data );

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' )
    }
};

exports.getAllPreference = async (req, res) => {
    console.log('preference list controller');
    try {
        const preferenceList = await PreferenceCenter.findAll({
            where: {
                departmentId: req.user.DepartmentId,
                currentBusinessId: req.user.CurrentBusinessId
            }
        });

        const data = await preferenceList
        successResWithData( res,'Preference Center List', data )

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' )
    }
};

const validateInputs = async (req, res) => {
    const { name, tier, parentPC, pcCode, displayType } = req.body;
    
    //To check against empty fields
    if(!name || !tier || !pcCode || !displayType ||
        name == '' || tier == '' || pcCode == '' || displayType == ''    
    ) 
        return 'Ensure all required fields are filled';

            //validate name 
        if(!name.match(/^[A-Za-z\s]+$/) ) return 'Preference Center name must be alphabets only.';

        //check if the tier and pcCode are valid inputs
        if(isNaN(Number(pcCode)) || isNaN(Number(tier))) return 'Invalid Tier or Code input';

        // check if the parentPC is valid
        if(parentPC && parentPC != '') {
            const parentPreference = await PreferenceCenter.findByPk(parentPC)
            if(!parentPreference ) return 'Invalid Parent Preference Center Input.'
        }

        //check the pcCode has at least 2 digits
        if(pcCode.length < 2) return 'Invalid "Code" format';

        return { 
            name,
            tier, 
            pcCode, 
            displayType, 
            parentPC: parentPC? parentPC : null };
};