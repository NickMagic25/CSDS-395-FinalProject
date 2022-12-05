// from ak7883 on github
// https://github.com/codehandbook/make-api-call-express

const request = require('request')

module.exports = {
    make_API_call : function(url){
        return new Promise((resolve, reject) => {
            request(url, { json: true }, (err, res, body) => {
                if (err) reject(err)
                resolve(body)
            });
        })
    }
}