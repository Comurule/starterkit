
exports.getLogin = function (req, res, next) {
        res.render('pages/content', {
            title: 'Update User',
             functioName: 'GET LOGIN PAGE',
            layout: 'layouts/detail'
        });
};

