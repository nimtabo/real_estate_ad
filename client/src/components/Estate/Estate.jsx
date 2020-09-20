import React, {useState, useEffect} from 'react';
import './Estate.scss';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {deleteEstate} from '../../actions/estate';
import PropTypes from 'prop-types';
import Prompt from '../Prompt/Prompt';
import Picture from '../Picture/Picture';
import Buttons from '../Buttons/Buttons';
import {setPrompt} from '../../actions/prompt';

const Estate = ({
    userId,
    role,
    estate: {
        _id,
        user,
        offers,
        comments,
        photos,
        name,
        description,
        location: {formattedAddress},
    },
    deleteEstate,
    location,
    history,
}) => {
    // const [prompt, setPrompt] = useState({
    //     show: false,
    //     confirm: false,
    //     promptMsg: '',
    // });
    const [pictures, setPictures] = useState(photos);
    useEffect(() => {
        if (confirm) {
            //location.pathname is a prop from withRouter which gives me current url eg./dashboard
            deleteEstate(_id, location.pathname, history);
        }
    }, [confirm, pictures]);
    const handleDelete = () => {
        setPrompt({...prompt, show: true, promptMsg: 'delete estate'});
    };
    // const handleConfirm = () => {
    //     setPrompt({...prompt, confirm: true});
    // };
    // const hidePrompt = () => {
    //     setPrompt({...prompt, show: false});
    // };
    return (
        <div className='estate-container'>
            {show && <Prompt type={'delete'} />}
            <h3 className='estate-name'>
                <Link to={`/estate/${_id}`}>{name}</Link>
            </h3>
            <div className='estate-description'>
                <p className='estate-description_text'>{description}</p>
                {offers && offers.length > 0 && (
                    <span className='estate-description_offers'>
                        {offers.length} offers
                    </span>
                )}
                {comments && comments.length > 0 && (
                    <span className='estate-description_comments'>
                        {comments.length} comments
                    </span>
                )}
            </div>
            <div className='estate-address'>{formattedAddress}</div>

            {photos.length && <Picture photo={photos[0]} />}
            <Buttons props={{role, _id, handleDelete, user, userId}} />
        </div>
    );
};

Estate.propTypes = {
    userId: PropTypes.string,
    deleteEstate: PropTypes.func.isRequired,
    location: PropTypes.object,
    role: PropTypes.string,
};

const mapStateToProps = (state) => ({
    userId: state.auth.isAuthenticated ? state.auth.user.data._id : null,
    role: state.auth.isAuthenticated ? state.auth.user.data.role : 'user',
});

export default connect(mapStateToProps, {deleteEstate})(withRouter(Estate));
