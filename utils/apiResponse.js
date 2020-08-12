exports.errorRes = ( res, message ) => {
    res.status( 400 )
        .json({
            status: false,
            message
        })
};

exports.errorLog = ( res, message ) => {
    res.status( 500 )
        .json({
            status: false,
            message
        })
};

exports.successResWithData = ( res, message, data) => {
    res.status(200)
        .json({
            status: true,
            message,
            data
        })
};

exports.successRes = ( res, message ) => {
    res.status( 200 )
        .json({
            status: true,
            message
        })
};