export const AlertActionTypes = {
    SET_ALERT: 'SET_ALERT',
    REMOVE_ALERT: 'REMOVE_ALERT',
};
export const RegisterActionTypes = {
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAIL: 'REGISTER_FAIL',
};
export const AuthActionTypes = {
    USER_LOADED: 'USER_LOADED',
    AUTH_ERROR: 'AUTH_ERROR',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAIL: 'LOGIN_FAIL',
    LOGOUT: 'LOGOUT',
};
export const ProfileActionTypes = {
    GET_PROFILE: 'GET_PROFILE',
    PROFILE_ERROR: 'PROFILE_ERROR',
    CLEAR_PROFILE: 'CLEAR_PROFILE',
};
export const EstateActionTypes = {
    GET_ESTATES: 'GET_ESTATES',
    GET_SINGLE_ESTATE: 'GET_SINGLE_ESTATE',
    ESTATE_ERROR: 'ESTATE_ERROR',
    ADD_ESTATE: 'ADD_ESTATE',
    UPLOAD_PHOTO: 'UPLOAD_PHOTO',
    EDIT_ESTATE: 'EDIT_ESTATE',
    DELETE_ESTATE: 'DELETE_ESTATE',
};
export const OfferActionTypes = {
    GET_OFFERS_FOR_ESTATE: 'GET_OFFERS_FOR_ESTATE',
    ADD_OFFER: 'ADD_OFFER',
    DELETE_OFFER: 'DELETE_OFFER',
    UPDATE_OFFER: 'UPDATE_OFFER',
    OFFER_ERROR: 'OFFER_ERROR',
};
export const CommentActionTypes = {
    GET_COMMENTS_FOR_ESTATE: 'GET_COMMENTS_FOR_ESTATE',
    ADD_COMMENT: 'ADD_COMMENT',
    DELETE_COMMENT: 'DELETE_COMMENT',
    UPDATE_COMMENT: 'UPDATE_COMMENT',
    COMMENT_ERROR: 'COMMENT_ERROR',
};
