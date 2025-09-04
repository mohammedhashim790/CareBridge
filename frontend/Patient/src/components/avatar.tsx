import React from 'react';
import PropTypes from 'prop-types';

const InitialsAvatar = ({firstName, lastName, name, size = 80, bgColor = '#FFF', textColor = '#000'}) => {

    let initials = '';

    if (name) {

        const nameParts = name.trim().split(' ');
        initials = nameParts
            .slice(0, 2)
            .map(part => part.charAt(0).toUpperCase())
            .join('');
    } else if (firstName || lastName) {

        initials = [firstName ? firstName.charAt(0).toUpperCase() : '', lastName ? lastName.charAt(0).toUpperCase() : ''].join('');
    }

    const avatarStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: bgColor,
        color: textColor,
        display: 'flex',
        border: '1px solid #000',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.4}px`,
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        margin: '5px'
    };

    return <div style={avatarStyle}>{initials}</div>;
};

InitialsAvatar.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number,
    bgColor: PropTypes.string,
    textColor: PropTypes.string,
};

export default InitialsAvatar;
