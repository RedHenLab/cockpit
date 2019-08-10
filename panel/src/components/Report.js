import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Card, CardHeader, CardContent, Typography, Grid, List, ListItem, ListItemIcon, 
         ListItemText, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core/';
import { Storage, SdStorage, CloudOff, Tv, Security, ExpandMore } from '@material-ui/icons';
import { formatDate, formatSize } from "../services/Formatting";

const styles = {
  card: {
    marginBottom: 10
  },
  subcard: {
    margin: 3,
    borderColor: 'black',
    borderWidth: 1
  }
}

class Report extends React.Component {
  render() {
    const { classes, report } = this.props;
    return ( 
      <Card className={classes.card}>
        <CardHeader title='Latest Report' />
        <CardContent>
        <>
          <Grid container>
            <Grid item md={6} xs={12}>
              <Card elevation={0} className={classes.subcard}>
                <ListItem>
                  <ListItemText primary='Report generation Time' secondary={`${formatDate(report.generated_at, false)}`} />
                </ListItem>
              </Card>
            </Grid>
            <Grid item md={6} xs={12}>
              <Card elevation={0} className={classes.subcard}>
                <ListItem>
                  <ListItemText primary='Report Fetch Time' secondary={`${formatDate(report.fetched_at, false)}`} />
                </ListItem>
              </Card>
            </Grid>
            <Grid item md={6} xs={12}>
              <Card elevation={0} className={classes.subcard}>
                <ListItem>
                  <ListItemIcon>
                    <Storage />
                  </ListItemIcon>
                  <ListItemText primary='Disk Drives' />
                </ListItem>
                {report.disks.map(r => <ListItem key={r._id}>
                  <ListItemText primary={r.name} secondary={`${formatSize(r.available)} TB out of ${formatSize(r.available + r.used)} TB available`} />
                </ListItem>)}
              </Card>
            </Grid>
            <Grid item md={6} xs={12}>
              <Card elevation={0} className={classes.subcard}>
                <ListItem>
                  <ListItemIcon>
                    <SdStorage />
                  </ListItemIcon>
                  <ListItemText primary='Memory Card' />
                </ListItem>
                {report.cards.map(r => <ListItem key={r._id}>
                  <ListItemText primary={r.name} secondary={`${formatSize(r.available, 'GB')} MB out of ${formatSize(r.available + r.used, 'GB')} MB available`} />
                </ListItem>)}
              </Card>
            </Grid>
            <Grid item md={6} xs={12}>
              <Card elevation={0} className={classes.subcard}>
                <ListItem>
                  <ListItemIcon>
                    <Tv />
                  </ListItemIcon>
                  <ListItemText primary='HDHomeRun' />
                </ListItem>
                {report.hdhomerun_devices.map(r => <ListItem key={r._id}>
                  <ListItemText primary={`Device ID:  ${r.id}`} secondary={`Port: ${r.ip}`} />
                </ListItem>)}
              </Card>
            </Grid>
            <Grid item md={6} xs={12}>
              <Card elevation={0} className={classes.subcard}>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText primary='Security' />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Failed Logins' secondary={`${report.security.failed_login}`} />
                </ListItem>
              </Card>
            </Grid>
          </Grid>
          <Card elevation={0} className={classes.subcard}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CloudOff />
                </ListItemIcon>
                <ListItemText primary='Network' />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Log Period`} secondary={`Starting: ${formatDate(report.network.log_start, false)} | Ending:${formatDate(report.network.log_end, false)}`} />
              </ListItem>
              <ExpansionPanel elevation={0}>
                <ExpansionPanelSummary expandIcon={<ExpandMore />} id="downtimes" elevation={0}>
                  <Typography> Downtimes </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <List>
                    {report.network.downtimes.length === 0 ? <ListItem><ListItemText primary='' secondary='No downtimes in this period' /></ListItem> :
                      report.network.downtimes.map(r => <ListItem key={r._id}>
                        <ListItemText primary={``} secondary={`Start:  ${formatDate(r.start, false)} | End: ${formatDate(r.end, false)}`} />
                      </ListItem>)}
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </List>
          </Card>
        </>
      </CardContent>
      </Card>
    );
  }
}

Report.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Report);