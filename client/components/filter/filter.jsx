import React, { useState, Fragment } from 'react'
import isNull from 'lodash.isnull'
import includes from 'lodash.includes'
import { observer } from 'mobx-react-lite'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import FilterIcon from '@material-ui/icons/FilterList'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'

import TableState from '../../state/singletons/tables'

const FilterComponent = ({ categories, dataIndexes, getData, filterData, tableTitle }) => {
    const classes = useStyles()
    const [openFilter, setOpenFilter] = useState(false)

    const handleCategoryClick = category => {
        TableState.setSelectedCategory(category.toLowerCase(), tableTitle)
    }

    const handleCheck = value => {
        TableState.setSelectedFilters(value)
        // refetch the data with filters
        getData()
    }

    return (
        <Fragment>
            <Drawer 
                anchor="right" 
                open={openFilter} 
                onClose={()=> { 
                    setOpenFilter(false) 
                }}>
                <List className={classes.list}>
                    {!isNull(TableState.selectedCategory) ? (
                        <Fragment>
                            <IconButton  
                                onClick={()=> { 
                                    TableState.setSelectedCategory(null) 
                                }}>
                                <BackIcon />
                            </IconButton>
                            <Typography className={classes.selectedCategory}>
                                {TableState.selectedCategory[0].toUpperCase() + 
                                    TableState.selectedCategory.substring(1, TableState.selectedCategory.length)}
                            </Typography>
                            {filterData.map((row, rowIndex) => {
                                if (rowIndex === dataIndexes[TableState.selectedCategory]) {
                                    return row.map((value, index) => {  
                                        // some values are the same for different categories i.e. bug
                                        // we want to make sure that only the correct cateogry value is checked
                                        let selectedCategoryFilterChosen = false
                                        TableState.selectedFilters.map(f => {
                                            if (f.filter === value && f.type === TableState.selectedCategory) {
                                                selectedCategoryFilterChosen = true
                                            }
                                        })  
                                        return (
                                            <ListItem 
                                                key={value + index} 
                                                divider>
                                            <FormControlLabel
                                                className={classes.checkbox}
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={
                                                            includes(TableState.selectedFilterValues, value) && 
                                                            selectedCategoryFilterChosen
                                                        }
                                                        onChange={() => {
                                                            handleCheck(value)
                                                        }} /> }
                                                label={value.replace(/,/g, ", ")} />
                                            </ListItem>
                                        )
                                    })
                                }
                            })}
                        </Fragment>
                    ) : (
                        <Fragment>
                            <ListItem className={`${classes.title} ${classes.marginLeft}`}>
                                Filter
                            </ListItem>
                            {categories.map(category => {
                                return (
                                    <ListItem 
                                        key={category} 
                                        button
                                        divider 
                                        onClick={()=>{ 
                                            handleCategoryClick(category) 
                                        }}>
                                        <ListItemText primary={category} className={classes.marginLeft} />
                                        <KeyboardArrowRightIcon />
                                    </ListItem>
                                )
                            })}
                        </Fragment>
                    )}
                </List>
            </Drawer>
            <Grid align="right">
                <Tooltip title="Filter">
                    <IconButton onClick={setOpenFilter} className={classes.marginLeft}>
                        <FilterIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Fragment>
    )
}

export default observer(FilterComponent)

const useStyles = makeStyles(theme => ({
    title: {
        fontWeight: 'bold',
        fontSize: '1.2rem'
    },
    list: {
        width: 200,
        maxWidth: '40vw'
    },
    checkbox: { 
        marginLeft: 5
    },
    marginLeft: {
        marginLeft: 20
    },
    selectedCategory: {
        fontWeight: 'bold',
        marginLeft: 20
    }
}))
