import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core/';
import { SignalCellularAlt } from '@material-ui/icons';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },

});

function formatDate(datestring) {
    let date = new Date(datestring);
    return date.toUTCString();
}

function Icon(isOnline) {
    const color = isOnline ? "primary" : "secondary";
    return (
            <SignalCellularAlt color={color}/>  
    )
}
class StationTable extends React.Component {
    constructor() {
        super();
        this.state = {
            stations: []
        };
        fetch('http://localhost:4000/')
            .then((res) => {
                return res.json();
            })
            .then((stations) => {
                this.setState({stations});
            });
    }
    render() {
        const {classes} = this.props;
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Station Name</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Last Check</TableCell>
                            <TableCell>Last Backup</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.stations.map(station => (
                            <TableRow key={station._id}>
                                <TableCell component="th" scope="row">
                                    {station.name}
                                </TableCell>
                                <TableCell>{station.location}</TableCell>
                                <TableCell>{formatDate(station.lastOnline)}</TableCell>
                                <TableCell>{formatDate(station.lastBackup)}</TableCell>
                                <TableCell align="right">{Icon(station.isOnline)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

StationTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StationTable);
