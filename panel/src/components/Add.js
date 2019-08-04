import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Typography, Grid, TextField } from '@material-ui/core/';

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
  ssh_username: 'SSH Username',
  incharge_name: 'Incharge Username',
  incharge_email: 'Incharge Email'
}

class Add extends React.Component {
  state = {
    station: {
      name: '',
      location: '',
      host: '',
      port: '',
      ssh_username: '',
      incharge_name: '',
      incharge_email: ''
    }
  }
  
  handleChange = (event,name) => {
    let station = Object.assign({},this.state.station);
    station[name] = event.target.value;
    this.setState({station});
  }

  render() {
    const { classes, addStation } = this.props;
    const { station } = this.state;
    return (
      <Grid container>
        <Grid item className={classes.vertical}>
          <Typography component="p" gutterBottom>Station</Typography>
          {Object.keys(station)
            .map(key => 
              <TextField
                key={key}
                label={StationSchema[key]}
                value={station[key]}
                onChange={event => this.handleChange(event, key)}
                margin="dense"
                variant="outlined"
              />
            )
          }
          <Button disabled> Test Config </Button>
          <Button onClick={( ) => addStation(this.state.station)}> Save </Button>
        </Grid>
      </Grid>
    );
  }
}

Add.propTypes = {
  classes: PropTypes.object.isRequired,
  addStation: PropTypes.func.isRequired
};

export default withStyles(styles)(Add);