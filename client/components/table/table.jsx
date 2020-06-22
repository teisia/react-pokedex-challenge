import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

const TableComponent = ({ title, data, columns, getData, loading }) => {
    const classes = useStyles()
    return (
        <TableContainer component={Paper} className={classes.table}>
            <Grid container justify="space-between">
                <Grid item>
                    <Typography variant="h4" className={classes.title}>
                        {title}
                    </Typography>
                </Grid>
            </Grid>
            {loading ? 
                <Grid container direction="column" className={classes.loadingContainer}>
                    <Typography variant="h5">
                        Loading...
                    </Typography>
                    <CircularProgress className={classes.loading} />
                </Grid> : (
                    <Fragment>
                        {data.length ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                    {columns.map((column, i) => {
                                        return (
                                            <TableCell className={classes.headerText} key={column + i}>
                                                {column}
                                            </TableCell>
                                        )
                                    })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.map(row => {
                                        return (
                                            <TableRow key={row.id}>
                                                {row.map((cell, i) => {
                                                    return (
                                                        <TableCell key={cell + i}>
                                                            {cell.replace(/,/g, ", ")}
                                                        </TableCell>
                                                    )
                                                })}
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography>
                                No results matched your search/filter.
                            </Typography>
                        )}
                    </Fragment>
                )}
        </TableContainer>
    )
}

export default TableComponent

const useStyles = makeStyles(theme => ({
    table: {
        margin: 30,
        padding: 20
    },
    headerText: {
        fontWeight: 'bold'
    },
    title: {
        margin: '20px 0px'
    },
    loadingContainer: {
        textAlign: 'center'
    },
    loading: {
        margin: '20px auto'
    }
}))
