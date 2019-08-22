import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Typography, Grid, TextField, Card, CardContent, CardHeader, CardActions, IconButton,} from '@material-ui/core/';
import {Delete, AddOutlined} from '@material-ui/icons';
const styles = {
  vertical: {
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
  }
}

class Edit extends React.Component {
  state = {
    station: this.props.selected,
    editing: false,
  }
  
  handleChange = (event,name) => {
    let station = Object.assign({},this.state.station);
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
    const { classes, selected, updateStation } = this.props;
    const { editing, station } = this.state;
    const { name, location, inchargeName, inchargeEmail, SSHHostPath } = selected;
    return (
      <Card>
        <CardHeader title="Station Information"/>
        <CardContent>
          <Grid container>
            <Grid item className={classes.vertical}>
              <Typography component="p" gutterBottom>Station</Typography>
              <TextField
                label="Name"
                value={editing ? station.name: name}
                onChange={(event) => this.handleChange(event,'name')}
                margin="dense"
                variant="outlined"
                disabled={!editing}
              />
              <TextField
                label="Location"
                value={editing ? station.location: location}
                onChange={(event) => this.handleChange(event,'location')}
                margin="dense"
                variant="outlined"
                disabled={!editing}
              />
              <Typography component="p" gutterBottom>Person Incharge</Typography>
              <TextField
                label="Name"
                value={editing ? station.inchargeName: inchargeName}
                onChange={(event) => this.handleChange(event,'inchargeName')}
                margin="dense"
                variant="outlined"
                disabled={!editing}
              />
              <TextField
                label="Email"
                value={editing ? station.inchargeEmail: inchargeEmail}
                onChange={(event) => this.handleChange(event,'inchargeEmail')}
                margin="dense"
                variant="outlined"
                disabled={!editing}
              />
            </Grid>
            <Grid item className={classes.vertical}>
              <Typography component="p" gutterBottom>SSH Configuration</Typography>
              {
                SSHHostPath.map( (host, index) => 
                  <Grid container alignItems="flex-end" key={index}>
                    <Grid item>
                      <TextField
                        label={`Host ${index+1}`}
                        value={host}
                        onChange={e => this.handleHostPathChange('modify', e.target.value, index)}
                        margin="dense"
                        variant="outlined"
                        disabled={!editing}
                      />
                  </Grid>
                  <Grid item hidden={!editing}>
                    <IconButton onClick={e => this.handleHostPathChange('delete','', index)}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
              { editing && 
                <Button style={{maxWidth: 200}} onClick={() => this.handleHostPathChange('add')}>
                  Add Host <AddOutlined />
                </Button>
              }
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
        { editing ? (
            <>
              <Button onClick={( ) => this.setState({editing: false})}> Cancel </Button>
              <Button disabled> Test Config </Button>
              <Button onClick={( ) =>{this.setState({editing: false}); updateStation(this.state.station)}}> Save </Button>
            </>        
          ) : (
            <Button onClick={( ) => this.setState({editing: true,  station:selected})}> Edit </Button>
          ) 
        }
        </CardActions>
      </Card>
    );
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.object.isRequired,
  updateStation: PropTypes.func.isRequired
};

export default withStyles(styles)(Edit);
