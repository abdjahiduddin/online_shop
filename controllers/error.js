exports.get404 = (req, res) => {
    res.render('404', { 
        pageTitle: '404 Page not found', 
        path: '404'
    })
}

exports.get500 = (req, res) => {
    res.render('500', { 
        pageTitle: 'Error Occurred!', 
        path: '500'
    })
}