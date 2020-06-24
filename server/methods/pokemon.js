import request from 'request'
import Future from 'fibers/future'
import isNull from 'lodash.isnull'
import isEmpty from 'lodash.isempty'
import intersection from 'lodash.intersection'
import includes from 'lodash.includes'

Meteor.methods({
    'pokemon.get': function (selectedCategory, selectedFilters, searchValue) {
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

                    // search
                    if (!isNull(searchValue)) {
                        const searchValueLowercase = searchValue.toLowerCase()
                        finalResults = results.filter(r => {
                            return r.name.toLowerCase().includes(searchValueLowercase)
                         })
                    }

                    // filter
                    if (!isEmpty(selectedFilters)) {
                        finalResults = results.filter(r => {
                            if (selectedFilters.length === 1) {
                                const matches = intersection(r[selectedFilters[0].type], [selectedFilters[0].filter])
                                if (matches.length) {
                                    return r
                                }
                            } else {
                                // if theres more than one filter, we narrow the search
                                let allTypeFilters = []
                                let allWeaknessesFilters = []
                                selectedFilters.map(f => {
                                    if (f.type === 'type') {
                                        allTypeFilters.push(f.filter)
                                    } else if (f.type === 'weaknesses') {
                                        allWeaknessesFilters.push(f.filter)
                                    }
                                })
                                
                                let exactTypeMatch = true
                                let exactWeaknessMatch = true
                                if (allTypeFilters.length && !allWeaknessesFilters.length) {
                                    allTypeFilters.map(f => {
                                        if (!includes(r.type, f)) {
                                            exactTypeMatch = false
                                        }
                                    })
                                    if (exactTypeMatch) {
                                        return r
                                    }
                                } else if (!allTypeFilters.length && allWeaknessesFilters.length) {
                                    allWeaknessesFilters.map(f => {
                                        if (!includes(r.weaknesses, f)) {
                                            exactWeaknessMatch = false
                                        }
                                    })
                                    if (exactWeaknessMatch) {
                                        return r
                                    }
                                } else if (allTypeFilters.length && allWeaknessesFilters.length) {
                                    allTypeFilters.map(f => {
                                        if (!includes(r.type, f)) {
                                            exactTypeMatch = false
                                        }
                                    })

                                    allWeaknessesFilters.map(f => {
                                        if (!includes(r.weaknesses, f)) {
                                            exactWeaknessMatch = false
                                        }
                                    })
                                    if (exactTypeMatch && exactWeaknessMatch) {
                                        return r
                                    }
                                }
                            }
                        })
                    }     
                    res.return({ results: finalResults })       
                }
            })
        )
        return res.wait()
    }
})
