import React from 'react';
import { CssBaseline, Grid } from '@material-ui/core/';
import StationTable from './components/Table';
import InfoPanel from './components/DetailedInfo';
import LoginCard from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Notification from './components/Notification';
import Prompt from './components/Prompt';
import {list, add, refresh, edit, report, remove, users, backup} from './config';
import API from './services/API';
import JWT from './services/JWT';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'home',
      user: null,
      stations: [],
      selected: null,
      archive: [],
      notification: {
        open: false,
        message: '',
      },
      prompt: {
        open: false,
        message: '',
      }
    }
  }

  componentDidMount() {
    const token = JWT.getToken();
    if (token) {
      API.token = token;
      API.get(users, true)
      .then(req => req.json())
      .then(body => {
        const {user} = body;
        user.token = token;
        this.setState({user});
        this.listStations();
      })
      .catch (() => JWT.clearToken())
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

    API.post(report, { _id: selected._id, archive: true })
    .then(res => res.json())
    .then(archive=> this.setState({archive}))
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
    .catch(() => {
      this.raiseNotification('Error generating report.');
    });
  }
  triggerBackup = (_id) => {
    API.post(backup, { _id})
    .then(res => res.json())
    .then(data => {
      const message = `The SD Card Backup script has been started. It will take 1-2 hours depending on the size of the SD Card.
Backup Path: ${data.file}
Please check /home/csa/nohup.out for any error messages`;
      this.raiseNotification(`Backup started! Path: ${data.file}`)
    })
    .catch(() => {
      this.raiseNotification('Error generating report.');
    });
  }
  setSelection = (selected) => {
    this.setState({selected});
    this.getReport(selected);
  };

  clearSelection = ( ) => this.setState({selected:null});

  switchScreen = (screen) => this.setState({screen});

  setUser = (user) => {
    this.setState({user});
    this.listStations();
  };

  logout = () => {
    this.setState({user:null});
    JWT.clearToken();
  }
  raiseNotification = (message) => this.setState({notification: {open:true, message}});
  raisePrompt = (message) => this.setState({prompt: {open:true, message}});

  handleNotificationClose = () => { 
    const notification = this.state.notification;
    notification.open = false;
    this.setState({notification});
  }
  handlePromptClose = () => { 
    const prompt = this.state.prompt;
    prompt.open = false;
    this.setState({prompt});
  }
  render() {
    const {stations, selected, report, notification, screen, archive} = this.state;

    return (
      <>
        <CssBaseline />
        <div> 
          <Grid container justify="center">
            {/* TODO: Make padding responsive */}
            <Grid item xs={12}  style={{padding: 20}}>
              <Header 
                logout={this.logout}
                user={this.state.user}
                switchScreen={this.switchScreen}
              />
            </Grid>
            {!this.state.user && 
              <Grid item style={{padding: 20}}>
                <LoginCard raiseNotification={this.raiseNotification} setUser={this.setUser}/>
              </Grid>
            }
            {this.state.user && 
            <>
              <Grid item md={6} xs={12} style={{padding: 20}}>
                <InfoPanel
                  screen={screen}
                  stations={stations}
                  selected={selected}
                  report={report}
                  archive={archive}
                  refreshStation={this.refreshStation}
                  updateStation={this.updateStation}
                  generateReport={this.generateReport}
                  deleteStation={this.deleteStation}
                  clearSelection={this.clearSelection}
                  addStation={this.addStation}
                  triggerBackup={this.triggerBackup}
                  switchScreen={this.switchScreen}
                  />
              </Grid>
              <Grid item md={6} xs={12} style={{padding: 20}}>
                <StationTable 
                  stations={stations}
                  selected={selected}
                  setSelection={this.setSelection}
                  clearSelection={this.clearSelection}
                  />
                <Footer />
              </Grid>
            </>
            }
          </Grid>
          <Notification open={notification.open} message={notification.message} handleClose={this.handleNotificationClose}/>
          <Prompt open={prompt.open} message={prompt.message} handleClose={this.handlePromptClose}/>
        </div>
      </> 
    );
  }
}

export default App;