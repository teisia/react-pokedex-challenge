import request from 'request'
import Future from 'fibers/future'

Meteor.methods({
    'pokemon.get': function (selectedCategory, selectedFilters, searchValue, page) {
        var options = {
            uri: Meteor.settings.pokemon.endpoint
        }
        let res = new Future()
        request(
            options,
            Meteor.bindEnvironment(function (error, response, body) {
                if (error) {
                    console.log('This is error: ' + error)
                    console.log('This is body: ' + body)
                    res.return('error')
                } else {
                    const results = JSON.parse(body)
                    let totalCount = results.length

                    res.return({ results: results, totalCount: totalCount })
                }
            })
        )
        return res.wait()
    }
})
