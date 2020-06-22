import request from 'request'
import Future from 'fibers/future'
import isNull from 'lodash.isnull'

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
                    const results = JSON.parse(body).pokemon
                    let finalResults = results
                    let totalCount = results.length

                    // search
                    if (!isNull(searchValue)) {
                        const searchValueLowercase = searchValue.toLowerCase()
                        finalResults = results.filter(r => {
                            return r.name.toLowerCase().includes(searchValueLowercase)
                         })
                         totalCount = finalResults.length
                    }     

                    res.return({ results: finalResults, totalCount: totalCount })       
                }
            })
        )
        return res.wait()
    }
})
