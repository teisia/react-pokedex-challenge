import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import orderBy from 'lodash.orderby'

import TableState from '../../state/singletons/tables'

import Table from '../../components/table/table'
import { columns } from '../../lib/constants/pokemon'

const Pokemon = () => {
    const [pokemon, setPokemon] = useState([])
    const [loading, setLoading] = useState(false)

    const getPokemon = () => {
        setLoading(true)
        let formattedData = []
        Meteor.call(
            'pokemon.get',
            '',
            '',
            TableState.searchValue,
            '',
            (err, res) => {
            if (err) {
                console.log(err)
            } else {
                const results = orderBy(res.results, 'name', 'asc')
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
            columns={columns}
            getData={getPokemon}
            loading={loading} />
    )
}

export default observer(Pokemon)
