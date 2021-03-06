const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const Estate = require('../models/Estate');
const Offer = require('../models/Offer');
const Comment = require('../models/Comment');
const crypto = require('crypto');

// @desc  Register user
// @route POST /real_estate_ad/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;
    //Create User
    const user = await User.create({
        name,
        email,
        password,
        role,
    });
    sendTokenResponse(user, 200, res);
});

// @desc  Login user
// @route POST /real_estate_ad/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    //Validate email and password
    if (!email || !password) {
        return next(
            new ErrorResponse('Please provide an email and password', 400)
        );
    }
    //Check for user
    const user = await User.findOne({email}).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    //Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc Log user out / clear cookie
// @route GET /real_estate_ad/auth/logout
// @access Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        data: {},
    });
});

// @desc Get current logged in user
// @route GET /real_estate_ad/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
    });
});
// @desc Get current logged in user
// @route GET /real_estate_ad/auth/myProfile
// @access Private
exports.getMyProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const estates = await Estate.find({user: user._id}).populate([
        'comments',
        'offers',
    ]);
    const offers = await Offer.find({user: user._id});
    const comments = await Comment.find({user: user._id});
    res.status(200).json({
        success: true,
        data: {user, estates, offers, comments},
    });
});
// @desc Forgot password
// @route GET /real_estate_ad/auth/forgotpassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
    });
    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }
    //Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});
    //Create rest url
    // const resetUrl = `${req.protocol}://${req.get(
    //     'host'
    // )}/real_estate_ad/auth/resetpassword/${resetToken}`;
    const resetUrl = `${process.env.FRONTEND_URI}/newPassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Click this link to get new password: <a href="${resetUrl}" target="_blank">${resetUrl}</a>`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });
        res.status(200).json({success: true, data: 'Email sent'});
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({
            validateBeforeSave: false,
        });
        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc Reset password
// @route PUT /real_estate_ad/auth/resetpassword/:resettoken
// @access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
    //get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    });
    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }
    //Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
});

// @desc Update user details
// @route PUT /real_estate_ad/auth/updatedetails
// @access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc Update password
// @route PUT /real_estate_ad/auth/updatepassword
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    //Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);

    res.status(200).json({
        success: true,
        data: user,
    });
});

//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};
