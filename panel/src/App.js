import React from 'react';
import { CssBaseline, Grid } from '@material-ui/core/';
import StationTable from './StationTable';
import InfoPanel from './InfoPanel';
import Logo from './logo.png'
import Notification from './Notification';
import {list, refresh, edit} from './config';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      selected: 0,
      notification: {
        open: false,
        message: '',
      }
    }
    fetch(list)
    .then((res) => {
        return res.json();
    })
    .then((stations) => {
        this.setState({stations});
    });
  }

  refreshStation = (id) => {
    fetch(refresh, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stationId: id
      })
    })
    .then((stn)=> {
      const stations = this.state.stations;
      const index = stations.findIndex(s => s._id === stn._id);
      stations[index] = stn;
      this.setState({stations});
    });
  }

  updateStation = (station) => {
    let notification = {
      open:true
    };
    fetch(edit, { 
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ station })  
    })
     .then((res) => {
       if (res.status === 200) { 
          notification.message = 'Station updated.';
       }
       else {notification.message = 'Error. Could not update station.';}
     })
     .catch((err) => {
        notification.message = 'Error. Could not update station.';
        console.error(err);
     })
     .finally(() => {
      this.setState({notification})
     });
  }

  setSelection = (selected) => {
    this.setState({selected});
  }
  clearSelection = ( ) => {
    this.setState({selected:null});
  }

  handleNotificationClose = ( ) => { 
    const notification = this.state.notification;
    notification.open = false;
    this.setState({notification});
  }
  render() {
    const {stations, selected, notification} = this.state;
    return (
      <>
        <CssBaseline />
        <div style={{padding: 20}}> 
          <Grid container>
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item>
                  <img src={Logo} alt=""/>
                </Grid>
                <Grid item>
                  <h1>Cockpit</h1>
                  <h2>Capture Station Monitoring System</h2>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5} style={{padding: 20}}>
              <InfoPanel
                stations={stations}
                selected={selected}
                refreshStation={this.refreshStation}
                updateStation={this.updateStation}
              />
            </Grid>
            <Grid item xs={7} style={{padding: 20}}>
              <StationTable 
                stations={stations}
                selected={selected}
                setSelection={this.setSelection}
                clearSelection={this.clearSelection}
              />
            </Grid>
          </Grid>
          <Notification open={notification.open} message={notification.message} handleClose={this.handleNotificationClose}/>
        </div>
      </> 
    );
  }
}

export default App;