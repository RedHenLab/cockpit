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

class Edit extends React.Component {
  state = {
    station: this.props.selected,
    disableMetadataEdit: true,
    disableConfigEdit: true,
  }
  
  handleChange = (event,name) => {
    let station = Object.assign({},this.state.station);
    station[name] = event.target.value;
    this.setState({station});
  }

  render() {
    const { classes, selected, updateStation } = this.props;
    const { disableConfigEdit, disableMetadataEdit, station } = this.state;
    const { name, location, host, port, SSHUsername,  inchargeName, inchargeEmail, SSHHostPath } = selected;
    return (
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
          <Typography component="p" gutterBottom>Person Incharge</Typography>
          <TextField
            label="Name"
            value={disableMetadataEdit ? inchargeName: station.inchargeName}
            onChange={(event) => this.handleChange(event,'inchargeName')}
            margin="dense"
            variant="outlined"
            disabled={disableMetadataEdit}
          />
          <TextField
            label="Email"
            value={disableMetadataEdit ? inchargeEmail: station.inchargeEmail}
            onChange={(event) => this.handleChange(event,'inchargeEmail')}
            margin="dense"
            variant="outlined"
            disabled={disableMetadataEdit}
          />
          { disableMetadataEdit ? (
              <Button onClick={( ) => this.setState({disableMetadataEdit: false, station:selected})}> Edit </Button>
            ) : (
              <>
                <Button onClick={( ) => this.setState({disableMetadataEdit: true, station:selected})}> Cancel </Button>
                <Button onClick={( ) => { this.setState({disableMetadataEdit: true }); updateStation(this.state.station); }}> Save </Button>
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
            value={disableConfigEdit ? SSHUsername: station.SSHUsername}
            onChange={(event) => this.handleChange(event,'SSHUsername')}
            margin="dense"
            variant="outlined"
            disabled={disableConfigEdit}
          />
          <Typography component="p" gutterBottom>SSH Host Path</Typography>
          {
            SSHHostPath.map( (host, index) => 
              <TextField
                label={`Host ${index+1}`}
                value={host}
                margin="dense"
                variant="outlined"
                disabled
              />
            )
          }
          { disableConfigEdit ? (
              <Button onClick={( ) => this.setState({disableConfigEdit: false,  station:selected})}> Edit </Button>
            ) : (
              <>
                <Button onClick={( ) => this.setState({disableConfigEdit: true})}> Cancel </Button>
                <Button disabled> Test Config </Button>
                <Button onClick={( ) =>{this.setState({disableConfigEdit:true}); updateStation(this.state.station)}}> Save </Button>
              </>
            ) 
          }
        </Grid>
      </Grid>
    );
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.object.isRequired,
  updateStation: PropTypes.func.isRequired
};

export default withStyles(styles)(Edit);
