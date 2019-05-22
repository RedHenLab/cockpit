import React from 'react';
import { CssBaseline, Grid } from '@material-ui/core/';
import StationTable from './StationTable';
import InfoPanel from './InfoPanel';
import Logo from './logo.png'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      selected: 0,
    } 
    fetch('http://localhost:4000/')
    .then((res) => {
        return res.json();
    })
    .then((stations) => {
        this.setState({stations});
    });
  }

  refreshStation = (id) => {
    fetch('http://localhost:4000/refresh', {
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

  setSelection = (selected) => {
    this.setState({selected});
  }
  clearSelection = ( ) => {
    this.setState({selected:null});
  }

  render() { 
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
                stations={this.state.stations}
                selected={this.state.selected}
                refreshStation={this.refreshStation}
              />
            </Grid>
            <Grid item xs={7} style={{padding: 20}}>
              <StationTable 
                stations={this.state.stations}
                selected={this.state.selected}
                setSelection={this.setSelection}
                clearSelection={this.clearSelection}
              />
            </Grid>
          </Grid>
        </div>
      </> 
    );
  }
}

export default App;