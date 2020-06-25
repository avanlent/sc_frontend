module.exports = {
    errors: {
        noResults: {
            code: 301,
            message: 'No results!',
        },
        setNotFound: {
            code: 302,
            message: 'Set with given Id does not exist.'
        },
        invalidId: {
            code: 206,
            message: 'Set with given Id does not exist.'
        },
        tokenExpired: {
            code: 102,
            message: 'Please log in again.'
        },
        needLogin: {
            code: 106,
            message: 'Unauthorized! Please log in to perform action.'
        },
        notOwner: {
            code: 108,
            message: 'Unauthorized! you are not the set owner.'
        },
        serverError: {
            code: 0,
            message: 'Unexpected problem on our end.'
        },
        clientError: {
            code: 1,
            message: 'Unexpected problem.'
        },
        genericError: {
            code: 3,
            message: 'Unexpected problem.'
        }
    },
    mobileWidth: 768,
}