import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Card, CardHeader, CardActions, CardContent, Button, 
        Typography, CircularProgress, Tooltip } from '@material-ui/core/';
import { Memory } from '@material-ui/icons';
import Edit from './Edit';
import Report from './Report';
import Add from './Add';
import { formatDate } from '../services/Formatting';

const styles = {
  card: {
    minWidth: 275,
    marginBottom: 10
  },
  cardEmpty: {
    display: 'flex',
    minWidth: 275,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',

  },
  icon: {
    fontSize: 70,
  },
  actions: {
    overflowX: 'auto',
  }
};

class InfoPanel extends React.Component {
  state = {
    station: this.props.selected,
    archive: [],
    disableMetadataEdit: true,
    disableConfigEdit: true,
  }

  handleChange = (event,name) => {
    let station = Object.assign({},this.state.station);
    station[name] = event.target.value;
    this.setState({station});
  }

  render() {
    const { classes, screen, selected, report, archive, refreshStation, generateReport,
       addStation, updateStation, deleteStation, triggerBackup } = this.props;
    if (screen==='add') {
      return (
        <Card>
          <CardHeader title="Add a new station"/>
          <CardContent>
            <Add addStation={addStation} />
          </CardContent>
        </Card>
          
      )
    }
    else if(screen==='archive' && selected) {
      return (
        <>
          {
            archive.map(report => <Report key={report._id} report={report} archive={true}/>)
          }
        </>
      )
    }
    else if (screen==='home' && selected) {
        const {_id, name, location, lastChecked, lastBackup, onlineSince, isOnline} = selected;
        return (
            <>
            <Card className={classes.card}>
              <CardHeader title={name} subheader={location}/>
                <CardActions className={classes.actions}>
                  <Tooltip title="Refresh uptime metrics">
                    <Button size="small" onClick={() => refreshStation(_id)}>Refresh</Button>
                  </Tooltip>
                  <Tooltip title="Generate a new health report">
                    <Button size="small" onClick={() => generateReport(_id)}>New Report</Button>
                  </Tooltip>
                  <Tooltip title="Create a snapshot of the SD card for backup">
                    <Button size="small" onClick={() => triggerBackup(_id)}>Backup</Button>
                  </Tooltip>
                  <Tooltip title="Delete this station">
                    <Button size="small" color="secondary" onClick={() => deleteStation(_id)}>Delete Station</Button>
                  </Tooltip>
                </CardActions>
              </Card>
              { report ? 
                <Report report={report}/> : 
                <Card className={classes.card} style={{alignItems:'center'}}>
                  <CardHeader title={
                    <>Loading report
                    <br />
                    <CircularProgress />
                    </>} 
                  />
                </Card>
              }
              <Card>
                <CardHeader title="Station Information"/>
                <CardContent>
                  <Typography variant="body1"> Connectivity </Typography>
                  <Typography variant="caption">Last Check</Typography>
                  <Typography gutterBottom>{formatDate(lastChecked)}</Typography>
                  <Typography variant="caption">Uptime</Typography>
                  <Typography gutterBottom>{formatDate(onlineSince)}</Typography>
                  <Typography variant="caption">Last Backup</Typography>
                  <Typography gutterBottom>{formatDate(lastBackup)}</Typography>
                  <Edit selected={selected} updateStation={updateStation}/>
                </CardContent>
            </Card></>
        );
    }
    else return (
        <Card className={classes.cardEmpty}>
            <CardContent>
              <Typography variant="h5" gutterBottom> Select a Station </Typography>
              <Typography variant="h5" style={{textAlign: 'center'}}>
                <Memory className={classes.icon}/>
              </Typography>
            </CardContent>
        </Card>
    );
  }
}

InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoPanel);