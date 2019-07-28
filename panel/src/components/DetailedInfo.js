import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Card, CardHeader, CardActions, CardContent, Button, 
        Typography, Grid, TextField, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core/';
import { Memory, Storage, SdStorage, CloudOff, Tv, Security } from '@material-ui/icons';
import moment from 'moment';
import { ArcSeries, XYPlot } from 'react-vis';

const styles = {
  card: {
    minWidth: 275,
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
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  vertical: {
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
  }
};

function formatDate(datestring) {
  if (!datestring) { return <br />; }
  const date = moment(datestring);
  return ( 
    <>
    {date.format('MMMM Do YYYY, h:mm a')}
    </>
  );
}

function formatSize(sizeInBytes, format='TB') {
  const divisor = (format === 'TB')? 1000000000 : 1000000;
  return Number.parseFloat(sizeInBytes/divisor).toFixed(2);
}

/**
 * Returns total disk usage fraction 
 * @param {*} disks 
 */
function calcDiskUsage(disks) { 
  let used = 0, available = 0;
  for (const disk of disks) {
    used += disk.used;
    available += disk.available;
  }
  return {used, available, remaining: (used)/(used+available)}
}

class InfoPanel extends React.Component {
  state = {
    station: this.props.selected,
    disableMetadataEdit: true,
    disableConfigEdit: true,
  }

  editMetadata() {

  }
  
  handleChange = (event,name) => {
    let station = Object.assign({},this.state.station);
    station[name] = event.target.value;
    this.setState({station});
  }

  render() {
    const { disableConfigEdit, disableMetadataEdit, station } = this.state;
    const { classes, selected, report, refreshStation, generateReport, updateStation } = this.props;
    if (selected) {
        const {_id, name, location, host, port, username, lastChecked, lastBackup, onlineSince, isOnline} = selected;
        let pieData, usageStats;
        if (report) { 
          usageStats = calcDiskUsage(report.disks);
          pieData = [
            {angle0: 0, angle: (Math.PI*2) , radius: 60, radius0: 35, color: 1},
            {angle0: 0, angle:  usageStats.remaining*(Math.PI*2) , radius: 60, radius0: 35, color: 2}
          ]
        }        
        return (
            <Card className={classes.card}>
              <CardHeader title={name} subheader={location}/>
                <CardContent>
                  <Grid container>
                    <Grid item xs={6} style={{display:'flex', alignItems:'center'}}>
                      <Typography variant='h6'>Status: </Typography>
                      <Typography >{isOnline?'Online':'Offline'}</Typography>
                    </Grid> 
                    { report ? 
                      <>    
                        <Grid item>
                            <XYPlot
                              xDomain={[-2, 2]}
                              yDomain={[-2, 2]}
                              width={160}
                              height={150}> 
                              <ArcSeries
                                animation
                                radiusType={'literal'}
                                center={{x: 0, y: 0}}
                                data={pieData}
                                />
                              </XYPlot> 
                        </Grid> 
                        <Grid item style={{display:'flex', alignItems:'center'}}>
                          {formatSize(usageStats.available)} TB Left
                        </Grid>
                      </> : <> </>
                    }
                  </Grid>
                  { report ? 
                    <>
                      <Typography variant="h6"> Latest Report </Typography>             
                      <List>
                        <ListItem>
                          <ListItemIcon>
                                <Storage/>
                          </ListItemIcon>
                          <ListItemText primary='Disk Drives' />            
                        </ListItem>                            
                        {
                          report.disks.map(r => 
                              <ListItem key={r._id} >
                                <ListItemIcon> </ListItemIcon>
                                <ListItemText primary={r.name} secondary={`${formatSize(r.available)} TB out of ${formatSize(r.available+r.used)} TB available`}/>  
                              </ListItem>
                            )
                        }
                        <ListItem>
                          <ListItemIcon>
                                <SdStorage/>
                          </ListItemIcon>
                          <ListItemText primary='Memory Card' />            
                        </ListItem>
                        {
                          report.cards.map(r => 
                            <ListItem key={r._id} >
                              <ListItemIcon> </ListItemIcon>
                              <ListItemText primary={r.name} secondary={`${formatSize(r.available, 'GB')} GB out of ${formatSize(r.available+r.used, 'GB')} GB available`}/>  
                            </ListItem>
                          )
                        }
                        <ListItem>
                          <ListItemIcon>
                                <Tv/>
                          </ListItemIcon>
                          <ListItemText primary='HDHomeRun' />            
                        </ListItem>
                        {
                          report.hdhomerun_devices.map(r => 
                            <ListItem key={r._id} >
                              <ListItemIcon> </ListItemIcon>
                              <ListItemText primary={`Device ID:  ${r.id}`} secondary={`Port: ${r.ip}`}/>  
                            </ListItem>
                          )
                        }
                        <ListItem>
                          <ListItemIcon>
                                <CloudOff/>
                          </ListItemIcon>
                          <ListItemText primary='Network Downtimes' />            
                        </ListItem>
                        {
                          report.downtimes.length === 0? <ListItem><ListItemIcon></ListItemIcon><ListItemText primary='None' /></ListItem> : 
                          report.downtimes.map(r => 
                            <ListItem key={r._id} >
                              <ListItemIcon> </ListItemIcon>
                              <ListItemText primary={`Duration ID:  ${r.id}`} secondary={`Port: ${r.ip}`}/>  
                            </ListItem>
                          )
                        }
                        <ListItem>
                          <ListItemIcon>
                                <Security/>
                          </ListItemIcon>
                          <ListItemText primary='Security' />            
                        </ListItem>
                        <ListItem>
                          <ListItemIcon></ListItemIcon>
                          <ListItemText primary='Failed Logins' secondary={`${report.security.failed_login}`} />            
                        </ListItem>
                      </List>
                    </> 
                      : <CircularProgress />
                  }
                    
                  <Typography variant="h6"> Station Information </Typography>             
                  <Typography variant="body1"> Connectivity </Typography>
                  <Typography variant="caption">Last Check</Typography>
                  <Typography gutterBottom>{formatDate(lastChecked)}</Typography>
                  <Typography variant="caption">Uptime</Typography>
                  <Typography gutterBottom>{formatDate(onlineSince)}</Typography>
                  <Typography variant="caption">Last Backup</Typography>
                  <Typography gutterBottom>{formatDate(lastBackup)}</Typography>
                  <Grid container>


                    <Grid item className={classes.vertical}>
                      <Typography component="p" gutterBottom>Station</Typography>
                      <TextField
                        label="Name"
                        value={disableMetadataEdit ? name: station.name}
                        onChange={(event) => this.handleChange(event,'name')}
                        margin="dense"
                        variant="outlined"
                        disabled={disableMetadataEdit}
                      />
                      <TextField
                        label="Location"
                        value={disableMetadataEdit ? location: station.location}
                        onChange={(event) => this.handleChange(event,'location')}
                        margin="dense"
                        variant="outlined"
                        disabled={disableMetadataEdit}
                      />
                      { disableMetadataEdit ? (
                          <Button onClick={( ) => this.setState({disableMetadataEdit: false, station:selected})}> Edit </Button>
                        ) : (
                          <>
                            <Button onClick={( ) => this.setState({disableMetadataEdit: true, station:selected})}> Cancel </Button>
                            <Button onClick={( ) => updateStation(this.state.station)}> Save </Button>
                          </>
                        )
                      }
                    </Grid>
                    <Grid item className={classes.vertical}>
                      <Typography component="p" gutterBottom>SSH Configuration</Typography>
                      <TextField
                        label="Host"
                        value={disableConfigEdit ? host: station.host}
                        onChange={(event) => this.handleChange(event,'host')}
                        margin="dense"
                        variant="outlined"
                        disabled={disableConfigEdit}
                      />
                      <TextField
                        label="Port"
                        value={disableConfigEdit ? port: station.port}
                        onChange={(event) => this.handleChange(event,'port')}
                        margin="dense"
                        variant="outlined"
                        disabled={disableConfigEdit}
                      />
                      <TextField
                        label="Username"
                        value={disableConfigEdit ? username: station.username}
                        onChange={(event) => this.handleChange(event,'username')}
                        margin="dense"
                        variant="outlined"
                        disabled={disableConfigEdit}
                      />
                      { disableConfigEdit ? (
                          <Button onClick={( ) => this.setState({disableConfigEdit: false,  station:selected})}> Edit </Button>
                        ) : (
                          <>
                            <Button onClick={( ) => this.setState({disableConfigEdit: true})}> Cancel </Button>
                            <Button disabled> Test Config </Button>
                            <Button onClick={( ) => updateStation(this.state.station)}> Save </Button>
                          </>
                        ) 
                      }
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                <Button size="small" onClick={() => refreshStation(_id) }>Refresh</Button>
                <Button size="small" onClick={() => generateReport(_id) }>Generate Report</Button>
                <Button size="small" disabled>Backup</Button>
                <Button size="small" disabled>Restore from Flash drive</Button>
    
                </CardActions>
            </Card>
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
