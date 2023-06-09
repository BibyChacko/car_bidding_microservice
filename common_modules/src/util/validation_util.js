
const { body, validationResult, param } = require("express-validator");


function emailValidation(){
    return body('email').isEmail().withMessage('Please enter a valid email address');
}

function isEmpty(key){
    return body(key).notEmpty().withMessage(`${key} is required`);
}

function containsInParams(key){
    return param(key).notEmpty().withMessage(`${key} is required`);
}

function validatePassword(){
    return  body('password').notEmpty().withMessage('Password is required');
}

function validationHandler(req,res,next){
    const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({status:false,error:errors.errors[0].msg});
            }
            next();
}


exports.isDataExistsInParams = (paramsData,any) =>{
    var validators = [];
    paramsData.forEach(element => {
        validators.push(containsInParams(element));
    });
    if((any || false) && validators.length < paramsData.length){
        next();
        return;
    }
    return [
        validators,
        validationHandler
    ];
}

exports.validateRequiredFields = (requiredFields,any) =>{
    var validators = [];
    requiredFields.forEach(element => {
        validators.push(isEmpty(element));
    });
    if((any || false) && validators.length < requiredFields.length){
        next();
        return;
    }
    return [
        validators,
        validationHandler
    ];
}

exports.validateLogin = [
    emailValidation(),
    validatePassword(),
    validationHandler
];

exports.validateSignUp = [
    emailValidation(),
    validatePassword(),
    isEmpty("name"),
    isEmpty("dob"),
    isEmpty("addressLine1"),
    isEmpty("city"),
    isEmpty("district"),
    isEmpty("state"),
    isEmpty("country"),
    isEmpty("pincode"),
    isEmpty("phone"),
    validationHandler
]