import React from 'react';
import Logo from './../logo.png'
import PropTypes from 'prop-types';
import { Grid, Button, Typography, withStyles, Hidden, Tooltip } from '@material-ui/core/';

const styles = {
  logo: {
    marginRight: 20,
  },
  logoSmall: {
    marginRight: 10,
    height: 90
  },
  headlineSmall: {
    fontSize: 22
  },
  subheaderSmall: {
    fontSize: 18
  },
  float: {
    //float: 'right',
  }
}

class Header extends React.Component {
  render () {
    const { classes, user, switchScreen, logout } = this.props;
    return (
      <Grid container alignItems="center">
        <Grid item>
          <Hidden smUp><img src={Logo} alt="" className={classes.logoSmall}/></Hidden>
          <Hidden xsDown><img src={Logo} alt="" className={classes.logo}/></Hidden>
        </Grid>
        <Grid item xs={6}>
          <Hidden smUp>
            <Typography variant="h2" className={classes.headlineSmall}> Cockpit </Typography>
            <Typography variant="h5" className={classes.subheaderSmall}>Capture Station Monitoring System</Typography>
          </Hidden>
          <Hidden xsDown>
            <Typography variant="h2"> Cockpit </Typography>
            <Typography variant="h5">Capture Station Monitoring System</Typography>
          </Hidden>
        </Grid>
        {user &&
          <Grid item>
            <Grid className={classes.float}>
              <Typography variant="subtitle1">{`${user.email}`}</Typography>
              <Tooltip title="See latest report and station information">
                <Button style={{marginRight:10, marginTop: 10}} variant="contained" onClick={() => switchScreen('home')}> Home </Button>
              </Tooltip>
              <Tooltip title="See all previous reports">
                <Button style={{marginRight:10, marginTop: 10}} variant="contained" onClick={() => switchScreen('archive')}> Archive </Button>
              </Tooltip>
              <Tooltip title="Add a new station to Cockpit">
                <Button style={{marginRight:10, marginTop: 10}} variant="contained" onClick={() => switchScreen('add')}> Add new station </Button>
              </Tooltip>
              <Tooltip title="Logout of Cockpit">
                <Button style={{marginTop: 10}} variant="contained" color="secondary" onClick={logout}>Logout</Button>
              </Tooltip>
            </Grid>
          </Grid>
        }
      </Grid>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.any,
  switchScreen: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default withStyles(styles)(Header);