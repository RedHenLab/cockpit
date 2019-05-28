import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Card, CardHeader, CardActions, CardContent, Button, Typography, Grid, TextField} from '@material-ui/core/';
import { Memory } from '@material-ui/icons';
import moment from 'moment';

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
    const { classes, selected, refreshStation, updateStation} = this.props;
    if (selected) {
        const {_id, name, location, host, port, username, lastChecked, lastBackup, onlineSince} = selected;
        return (
            <Card className={classes.card}>
              <CardHeader title={name} subheader={location}/>
                <CardContent>
                  <Typography variant="caption">Last Check</Typography>
                      <Typography variant="p" gutterBottom>{formatDate(lastChecked)}</Typography>
                      <Typography variant="caption">Uptime</Typography>
                      <Typography variant="p" gutterBottom>{formatDate(onlineSince)}</Typography>
                      <Typography variant="caption">Last Backup</Typography>
                      <Typography variant="p" gutterBottom>{formatDate(lastBackup)}</Typography>
                  <Grid container>
                    <Grid item className={classes.vertical}>
                      <Typography component="p" gutterBottom>Definition</Typography>
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
                      <Typography component="p" gutterBottom>Configuration</Typography>
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
                            <Button> Test Config </Button>
                            <Button onClick={( ) => updateStation(this.state.station)}> Save </Button>
                          </>
                        ) 
                      }
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                <Button size="small" onClick={() => refreshStation(_id) }>Refresh</Button>
                <Button size="small">Backup</Button>
                <Button size="small">Restore from Flash drive</Button>
    
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
