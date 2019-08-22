import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles, Tooltip, Paper, Radio, Typography, IconButton } from '@material-ui/core/';
import { Table, TableBody, TableCell, TableHead, TableRow, Toolbar } from '@material-ui/core';
import { Check, Memory, Close, Error } from '@material-ui/icons';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { green, red } from '@material-ui/core/colors';


import moment from 'moment';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: 20
  },
  table: {
    minWidth: 700,
    overflowX: 'auto'
  },
});

function formatDate(date) {
  return date?  moment(date).fromNow(): '-';
}

function Icon(isOnline) {
  return (isOnline) ?
    <Tooltip title='Station is online.'>
      <Check style={{color:green[500]}}/>
    </Tooltip>
  :   
  <Tooltip title='Station has not been reachable.'>
    <Error style={{color:red[500]}} />
  </Tooltip>
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
          <Tooltip title="Close Selection">
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
    selectedId: null,
  }
  componentWillReceiveProps({selected}) {
    this.setState({selectedId: (selected) ? selected._id: null});
  }

  isSelected = (id) => {
    return this.state.selectedId === id;
  }
  render() {
    const {classes, stations, selected, setSelection, clearSelection} = this.props;
    return (
      <Paper className={classes.root} elevation={1}>
        <EnhancedTableToolbar selected={selected} handleClose={clearSelection} />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell><Memory /></TableCell>
              <TableCell>Station Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Last Check</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.map(station => (
              <TableRow 
                hover
                onClick={( ) => setSelection(station)}
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
  selected: PropTypes.object,
  setSelection: PropTypes.func.isRequired,
  clearSelection: PropTypes.func.isRequired
};

export default withStyles(styles)(StationTable);
