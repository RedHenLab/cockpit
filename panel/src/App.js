import React from 'react';
import { CssBaseline, Grid } from '@material-ui/core/';
import StationTable from './StationTable';
import Logo from './logo.png'
import './App.css';

function App() {
  return (
    <React.Fragment>
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
          <Grid item xs={12} style={{padding: 100}}>
            <StationTable />
          </Grid>
        </Grid>
      </div>
    </React.Fragment> 
  );
}

export default App;