import React from 'react';
import Logo from './../logo.png'
import PropTypes from 'prop-types';
import { Grid, Button, Typography, withStyles, Hidden } from '@material-ui/core/';

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
  }
}

class Header extends React.Component {
  render () {
    const { classes } = this.props;
    return (
      <Grid container alignItems="center">
        <Grid item>
          <Hidden smUp><img src={Logo} alt="" className={classes.logoSmall}/></Hidden>
          <Hidden xsDown><img src={Logo} alt="" className={classes.logo}/></Hidden>
        </Grid>
        <Grid item xs={7}>
          <Hidden smUp>
            <Typography variant="h2" className={classes.headlineSmall}> Cockpit </Typography>
            <Typography variant="h5" className={classes.subheaderSmall}>Capture Station Monitoring System</Typography>
          </Hidden>
          <Hidden xsDown>
            <Typography variant="h2"> Cockpit </Typography>
            <Typography variant="h5">Capture Station Monitoring System</Typography>
          </Hidden>
        </Grid>
        {this.props.user &&
          <Grid item>
          <Button style={{marginRight:10, marginTop: 10}} variant="contained" onClick={() => this.props.switchScreen('home')}> Home </Button>
          <Button style={{marginRight:10, marginTop: 10}} variant="contained" onClick={() => this.props.switchScreen('archive')}> Archive </Button>
          <Button style={{marginRight:10, marginTop: 10}} variant="contained" onClick={() => this.props.switchScreen('add')}> Add new station </Button>
          <Button style={{marginTop: 10}} variant="contained" color="secondary" onClick={this.props.logout}>Logout</Button>
          </Grid>
        }
      </Grid>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.any.isRequired,
  showAddScreen: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default withStyles(styles)(Header);