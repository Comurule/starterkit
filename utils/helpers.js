exports.randNum = () => {
    let num = Math.floor(Math.random()*99999)+1;
    if(num.toString().length < 5){
        num = num.toString().length == 3? `00${num}` : num.toString().length == 4? `0${num}` : num;
        return num;
    };
    return num;
};
/**
 * Checks if the model code is unique. If true, changes the modelCode value. 
 * @param {string} prefix letter to be added to the number generated
 * @param {number} size length of the number to be generated
 * @param {object} model Model class
 * @param {object} condition the model code in "{" "}". eg. {pcCode}  
 * @param {} modelCode variable holding the model code.
 * @returns {} modelCode
 */
exports.checkCodeGen = async (prefix, size, model, condition, modelCode) => {
    let checkModelCode = await model.findOne({where: condition});
    if(checkModelCode) {
        while(checkModelCode) {
            checkModelCode = {};
            modelCode = codeGen(prefix, size);
            checkModelCode = await model.findOne({where: condition});
        }
    }
};

/**
 * Generates a code for the model. 
 * @param {string} prefix letter(s) to be added to the number generated
 * @param {number} size length of the number to be generated
 * @returns {string} modelCode
 */
exports.codeGen = (prefix, size) => {
    const multiplyingValue1= multiplyingValue(size);
    let modelCode = Math.floor(Math.random() * multiplyingValue1 );
    while (modelCode.toString().length < size) {
        modelCode = '0'+ modelCode;
    }
    return `${prefix}${modelCode}`;
};



const codeGen = (prefix, size) => {
    const multiplyingValue1= multiplyingValue(size);
    let modelCode = Math.floor(Math.random() * multiplyingValue1 );
    while (modelCode.toString().length < size) {
        modelCode = '0'+ modelCode;
    }
    return `${prefix}${modelCode}`;
};

const multiplyingValue = (size) => {
    let num = '';
    while(num.length < size) {
        num+='9'
    }
    return Number(num);
};