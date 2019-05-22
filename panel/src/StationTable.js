import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles, Tooltip, Paper, Radio, Typography, IconButton } from '@material-ui/core/';
import { Table, TableBody, TableCell, TableHead, TableRow, Toolbar } from '@material-ui/core';
import { SignalCellularAlt, Memory, Close } from '@material-ui/icons';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import moment from 'moment';

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

function formatDate(date) {
    return date?  moment(date).fromNow(): '-';
}

function Icon(isOnline) {
    const color = isOnline ? "primary" : "secondary";
    return (
            <SignalCellularAlt color={color}/>  
    )
}
  
const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit
    },
    highlight: theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
        },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        flex: '0 0 auto'
    }
});

  let EnhancedTableToolbar = props => {
    const { selected, classes, handleClose } = props;
  
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: selected ,
        })}
      >
        <div className={classes.title}>
          {selected ? (
            <Typography color="inherit" variant="subtitle1">
              {selected.name} selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              Capture Stations
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {selected && (
            <Tooltip title="Delete">
              <IconButton onClick={()=>{handleClose()}} aria-label="Delete">
                <Close/>
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>
    );
  };
  
  EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    selected: PropTypes.object,
    handleClose: PropTypes.func.isRequired
  };
  
  EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);
  
class StationTable extends React.Component {
    state = { 
        selectedId: 0,
        selected: null
    }
    handleClick = (selected) => { 
        this.setState({selectedId: selected._id, selected});
        this.props.setSelection(selected);
    }
    handleClose = ( ) => { 
        this.setState({selectedId:0, selected:null});
        this.props.clearSelection();
    }
    isSelected = (id) => {
        return (this.state.selectedId === id);
    }
    render() {
        const {classes, stations} = this.props;
        const {selected} = this.state;
        return (
            <Paper className={classes.root}>
                <EnhancedTableToolbar selected={selected} handleClose={this.handleClose} />
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell><Memory /></TableCell>
                            <TableCell>Station Name</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Last Check</TableCell>
                            <TableCell>Last Backup</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stations.map(station => (
                            <TableRow 
                                hover
                                onClick={( ) => this.handleClick(station)}
                                selected={this.isSelected(station._id)}
                                key={station._id}
                            >
                                <TableCell>
                                    <Radio checked={this.isSelected(station._id)}/>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {station.name}
                                </TableCell>
                                <TableCell>{station.location}</TableCell>
                                <TableCell>{formatDate(station.lastChecked)}</TableCell>
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
