import React from 'react';
import { CssBaseline, Grid, Button, Typography } from '@material-ui/core/';
import StationTable from './components/Table';
import InfoPanel from './components/DetailedInfo';
import LoginCard from './components/Login';
import Logo from './logo.png'
import Notification from './components/Notification';
import {list, refresh, edit, report} from './config';
import API from './services/API';
import JWT from './services/JWT';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      stations: [],
      selected: null,
      notification: {
        open: false,
        message: '',
      }
    }
  }

  componentDidMount() {
    const token = JWT.getToken();
    if (token) {
      API.token = token;
      this.setState({user: {token} })

      API.get(list, true)
      .then((res) => {
          return res.json();
      })
      .then((stations) => {
          this.setState({stations});
      })
      .catch( err => console.log(err));
    }
   }

  refreshStation = (id) => {
    API.post(refresh, {_id: id})
    .then((stn)=> {
      const stations = this.state.stations;
      const index = stations.findIndex(s => s._id === stn._id);
      stations[index] = stn;
      const notification = { 
        open: true,
        message: 'Refreshed station. If UI has not updated, please reload'
      }
      this.setState({stations, selected: null, notification});
    });
  }

  getReport = (selected) => {
    API.post(report, { _id: selected._id })
    .then(res => res.json())
    .then(report=> this.setState({report: report[0]}))
    .catch();
  }

  generateReport = (_id) => {
    const notification = { 
      open: true,
      message: 'Generated a new report. If UI has not updated, please reload'
    }
    API.post(report, { _id, provideLatest: true })
    .then(res => res.json())
    .then(report=> this.setState({report: report[0], selected: null, notification}))
    .catch();
  } 

  updateStation = (station) => {
    let notification = {
      open:true
    };
    API.post(edit, { station })
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
    this.getReport(selected);
  };

  clearSelection = ( ) => this.setState({selected:null});

  setUser = (user) => this.setState({user});

  logout = () => {
    this.setState({user:null});
    JWT.clearToken();
  }
  handleNotificationClose = ( ) => { 
    const notification = this.state.notification;
    notification.open = false;
    this.setState({notification});
  }
  render() {
    const {stations, selected, report, notification} = this.state;
    return (
      <>
        <CssBaseline />
        <div style={{padding: 20}}> 
          <Grid container justify="center">
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item>
                  <img src={Logo} alt=""/>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="h2"> Cockpit </Typography>
                  <Typography variant="h5">Capture Station Monitoring System</Typography>
                </Grid>
                {this.state.user &&
                  <Grid item>
                    <Button variant="contained" color="secondary" onClick={this.logout}>Logout</Button>
                  </Grid>
                }
              </Grid>
            </Grid>
            {!this.state.user && 
              <Grid item xs={5} style={{padding: 20}}>
                <LoginCard setUser={this.setUser}/>
              </Grid>
            }
            {this.state.user && 
            <>
              <Grid item xs={5} style={{padding: 20}}>
                <InfoPanel
                  stations={stations}
                  selected={selected}
                  report={report}
                  refreshStation={this.refreshStation}
                  updateStation={this.updateStation}
                  generateReport={this.generateReport}
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
            </>
            }
          </Grid>
          <Notification open={notification.open} message={notification.message} handleClose={this.handleNotificationClose}/>
        </div>
      </> 
    );
  }
}

export default App;