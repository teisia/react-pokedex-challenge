import React, { Fragment } from 'react'
import { observer } from 'mobx-react-lite'
import isNull from 'lodash.isnull'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'

import TableState from '../../state/singletons/tables'

const SearchComponent = ({ getData }) => {
    const classes = useStyles()

    const handleSearch = clearing => {
        if (clearing) {
            TableState.setSearchValue(null)
        }
        getData()
    }

    return (
        <TextField 
            placeholder="Search" 
            variant="outlined"
            value={TableState.searchValue || ''}
            InputProps={{
                startAdornment: (
                    <Fragment>
                        {!isNull(TableState.searchValue) && (
                            <InputAdornment 
                                position="start" 
                                onClick={() => {
                                    handleSearch(true)
                                }} 
                                className={classes.iconBtn}>
                                <CloseIcon />
                            </InputAdornment>
                        )}
                    </Fragment>
                ),
                endAdornment: (
                    <InputAdornment 
                        position="end" 
                        onClick={() => {
                            handleSearch(false)
                        }} 
                        className={classes.iconBtn}>
                        <SearchIcon />
                    </InputAdornment>
                )}}
            onChange={e => {
                TableState.setSearchValue(e.target.value)
            }}
            onKeyPress={e => {
                if (e.key === 'Enter') {
                    handleSearch()
                }
            }} />
    )
}

export default observer(SearchComponent)

const useStyles = makeStyles(theme => ({
    iconBtn: {
        cursor: 'pointer'
    }
}))
