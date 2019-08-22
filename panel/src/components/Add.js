import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Typography, Grid, TextField, Card, CardContent, CardHeader, CardActions, Tooltip, IconButton } from '@material-ui/core/';
import { AddOutlined, Delete } from '@material-ui/icons';
const styles = {
  vertical: {
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
  }
}

const StationSchema = {
  name: 'Name',
  location: 'Location',
  host: 'Host', 
  port: 'Port',
  SSHUsername: 'SSH Username',
  inchargeName: 'Incharge Username',
  inchargeEmail: 'Incharge Email'
}

class Add extends React.Component {
  state = {
    station: {
      name: '',
      location: '',
      inchargeName: '',
      inchargeEmail: '',
      SSHHostPath: [],
    }
  }
  
  handleChange = (event,name) => {
    const station = Object.assign({},this.state.station);
    station[name] = event.target.value;
    this.setState({station});
  }

  handleHostPathChange = (op, val='', index=null) => {
    const station = Object.assign({},this.state.station);
    switch(op) { 
      case 'add': 
        station.SSHHostPath.push('');
        break;
      case 'modify':
        station.SSHHostPath[index] = val;
        break;
      case 'delete':
        station.SSHHostPath.splice(index);
        break;
      default: break;
    }

    this.setState({station});
  }

  render() {
    const { classes, addStation, switchScreen } = this.props;
    const { station } = this.state;
    return (
      <Card>
        <CardHeader title="Add a new station"/>
        <CardContent>
          <Grid container>
            <Grid item className={classes.vertical}>
              <Typography component="p" gutterBottom>Station</Typography>
              {Object.keys(station)
                .map(key => {
                  if (key !== 'SSHHostPath') return (
                    <TextField
                      key={key}
                      label={StationSchema[key]}
                      value={station[key]}
                      onChange={event => this.handleChange(event, key)}
                      margin="dense"
                      variant="outlined"
                    />
                  )
                  return null;
                }
                )
              }
            </Grid>
            <Grid item className={classes.vertical}>
              <Typography component="p" gutterBottom>SSH Host Path Configuration</Typography>
              { station.SSHHostPath.map((host,index) => 
                <Grid container alignItems="flex-end" key={index}>
                  <Grid item>
                    <TextField
                      label={`Host ${index+1}`}
                      value={host}
                      onChange={e => this.handleHostPathChange('modify', e.target.value, index)}
                      margin="dense"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <IconButton onClick={e => this.handleHostPathChange('delete','', index)}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
              <Button style={{maxWidth: 200}} onClick={() => this.handleHostPathChange('add')}>
                Add Host <AddOutlined />
              </Button>
            </Grid>

          </Grid>
        </CardContent>
        <CardActions> 
          <Tooltip title="Cancel adding a new station">
            <Button onClick={( ) => switchScreen('home')}> Cancel </Button>
          </Tooltip>
          <Tooltip title="Add this station">
            <Button onClick={( ) => addStation(this.state.station)}> Save </Button>
          </Tooltip>
        </CardActions>
      </Card>
    );
  }
}

Add.propTypes = {
  classes: PropTypes.object.isRequired,
  addStation: PropTypes.func.isRequired,
  switchScreen: PropTypes.func.isRequired
};

export default withStyles(styles)(Add);