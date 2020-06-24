import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import orderBy from 'lodash.orderby'
import uniq from 'lodash.uniq'
import isEmpty from 'lodash.isempty'

import TableState from '../../state/singletons/tables'
import PokemonState from '../../state/singletons/pokemon'

import Table from '../../components/table/table'
import { columns, dataIndexes, filterCategories } from '../../lib/constants/pokemon'

const Pokemon = () => {
    const [pokemon, setPokemon] = useState([])
    const [loading, setLoading] = useState(false)

    const getPokemon = () => {
        setLoading(true)
        let formattedData = []
        Meteor.call(
            'pokemon.get',
            TableState.selectedCategory, 
            TableState.selectedFilters, 
            TableState.searchValue,
            (err, res) => {
            if (err) {
                console.log(err)
            } else {
                const results = orderBy(res.results, 'name', 'asc')
                if (isEmpty(PokemonState.filters.weaknesses) && isEmpty(PokemonState.filters.type)) {
                    results.map(item => {
                        if (item.weaknesses) {
                            PokemonState.setFilter('weaknesses', uniq(item.weaknesses))
                            PokemonState.setFilter('type', uniq(item.type))
                        }
                    })
                }
                formattedData = results.map(data => {
                    return columns.map(c => {
                        return data[c.toLowerCase()].toString()
                    })
                })
                setPokemon(formattedData)
            }
            setLoading(false)
        })
    }

    useEffect(() => {
        getPokemon()
    }, [])

    return (
        <Table 
            title="Pokemon" 
            data={pokemon}
            dataIndexes={dataIndexes}
            columns={columns}
            getData={getPokemon}
            filterCategories={filterCategories}
            filterData={[
                uniq(PokemonState.filters.type.slice().sort()), 
                uniq(PokemonState.filters.weaknesses.slice().sort())
            ]}
            loading={loading} />
    )
}

export default observer(Pokemon)
