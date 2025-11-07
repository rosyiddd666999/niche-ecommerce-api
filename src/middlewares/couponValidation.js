const { body } = require("express-validator");
const { handleValidationErrors } = require("./core/errorsValidationHandling.js");

const createCouponValidation = [
    body("name")
        .isString()
        .withMessage("Name must be a string")
        .isLength({ max: 100 })
        .withMessage("Name must be at most 100 characters long"),
    body("code")
        .isString()
        .withMessage("Code must be a string")
        .isLength({ max: 10 })
        .withMessage("Code must be at most 10 characters long"),
    body("discount")
        .isNumeric()
        .withMessage("Discount must be a number"),
    handleValidationErrors,
];

const updateCouponValidation = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string")
        .isLength({ max: 100 })
        .withMessage("Name must be at most 100 characters long"),
    body("code")
        .optional()
        .isString()
        .withMessage("Code must be a string")    
        .isLength({ max: 10 })
        .withMessage("Code must be at most 10 characters long"),
    body("discount")
        .optional()
        .isNumeric()
        .withMessage("Discount must be a number"),
    handleValidationErrors,
];

module.exports = {
    createCouponValidation,
    updateCouponValidation,
};