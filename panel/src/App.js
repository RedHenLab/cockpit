import React from 'react';
import { CssBaseline, Grid, Button, Typography } from '@material-ui/core/';
import StationTable from './components/Table';
import InfoPanel from './components/DetailedInfo';
import LoginCard from './components/Login';
import Logo from './logo.png'
import Notification from './components/Notification';
import {list, add, refresh, edit, report, remove} from './config';
import API from './services/API';
import JWT from './services/JWT';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      add: false,
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
      this.setState({user: {token} });
      this.listStations();
    }
   }

  refreshStation = (id) => {
    API.post(refresh, {_id: id})
    .then((stn)=> {
      const stations = this.state.stations;
      const index = stations.findIndex(s => s._id === stn._id);
      stations[index] = stn;
      this.setState({stations, selected: null});
      this.raiseNotification('Refreshed station. If UI has not updated, please reload');
    })
    .catch(err => {
      this.raiseNotification('Could not refresh station.');
      console.log(err);
    });
  }

  listStations() { 
    API.get(list, true)
    .then(res => res.json())
    .then(stations => this.setState({stations}))
    .catch( err => {
      this.setState({notification: {open:true, message: 'Your session has expired. Please login again'}});
    });
  }

  addStation = (station) => {
    API.post(add,station)
    .then(() => {
      this.raiseNotification('Added successfully');
      this.listStations();
    })
    .catch(err => {
      this.raiseNotification('Could not add new station.');
      console.log(err);
    })
  }

  updateStation = (station) => {
    API.post(edit, station)
     .then((res) => {
       if (res.status === 200) {
          this.raiseNotification('Station updated.');
       }
       else {this.raiseNotification('Error. Could not update station.'); }
     })
     .catch((err) => {
        this.raiseNotification('Error. Could not update station.');
        console.error(err);
     });
  }
  deleteStation = (id) => {
    API.post(remove, {_id: id})
      .then(() => {
        const stations = this.state.stations;
        const index =  stations.findIndex(s => s._id === id);
        stations.splice(index,1);
        this.setState({stations});
        this.raiseNotification('Deleted station.');
      })
      .catch((err) => {
        // TODO: Add err.json() part to API
        this.raiseNotification('Could not delete station');
      })
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

  setSelection = (selected) => {
    this.setState({selected});
    this.getReport(selected);
  };

  clearSelection = ( ) => this.setState({selected:null});

  setUser = (user) => {
    this.setState({user});
    this.listStations();
  };

  logout = () => {
    this.setState({user:null});
    JWT.clearToken();
  }
  raiseNotification = (message) => this.setState({notification: {open:true, message}});

  handleNotificationClose = () => { 
    const notification = this.state.notification;
    notification.open = false;
    this.setState({notification});
  }
  render() {
    const {stations, selected, report, notification, add} = this.state;
    return (
      <>
        <CssBaseline />
        <div style={{padding: 20}}> 
          <Grid container justify="center">
            <Grid item xs={12}  style={{padding: 20}}>
              <Grid container alignItems="center">
                <Grid item>
                  <img src={Logo} alt=""/>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h2"> Cockpit </Typography>
                  <Typography variant="h5">Capture Station Monitoring System</Typography>
                </Grid>
                {this.state.user &&
                  <Grid item>
                    <Button style={{marginRight:10}} variant="contained" onClick={() => this.setState({add: true})}> Add new station </Button>
                    <Button variant="contained" color="secondary" onClick={this.logout}>Logout</Button>
                  </Grid>
                }
              </Grid>
            </Grid>
            {!this.state.user && 
              <Grid item xs={5} style={{padding: 20}}>
                <LoginCard raiseNotification={this.raiseNotification} setUser={this.setUser}/>
              </Grid>
            }
            {this.state.user && 
            <>
              <Grid item md={5} xs={12} style={{padding: 20}}>
                <InfoPanel
                  add={add}
                  stations={stations}
                  selected={selected}
                  report={report}
                  refreshStation={this.refreshStation}
                  updateStation={this.updateStation}
                  generateReport={this.generateReport}
                  deleteStation={this.deleteStation}
                  clearSelection={this.clearSelection}
                  addStation={this.addStation}
                  />
              </Grid>
              <Grid item md={7} xs={12} style={{padding: 20}}>
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