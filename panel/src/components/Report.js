import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Card, CardHeader, CardContent, Typography, Grid, List, ListItem, ListItemIcon, 
         ListItemText, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core/';
import { Storage, SdStorage, CloudOff, Tv, Security, ExpandMore, VideoLibrary } from '@material-ui/icons';
import { formatDate, formatSize, roundUp} from "../services/Formatting";

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
    const { classes, report, archive } = this.props;
    return ( 
      <Card className={classes.card}>
        <CardHeader title={archive?'Archived Report':'Latest Report'} />
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
                  <ListItemText
                    primary={r.name}
                    secondary={
                      <>
                        {`${formatSize(r.available)} TB out of ${formatSize(r.available + r.used)} TB available`}
                        <br />
                        {`${ roundUp(r.used*100/(r.available+r.used))}% used`} 
                      </>}
                  />
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
                  <ListItemText 
                    primary={r.name}
                    secondary={
                      <>
                        {`${formatSize(r.available, 'GB')} GB out of ${formatSize(r.available + r.used, 'GB')} GB available`}
                        <br />
                        {`${ roundUp(r.used*100/(r.available+r.used))}% used`}
                      </>}
                  />
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
            <Grid item md={6} xs={12}>
              <Card elevation={0} className={classes.subcard}>
                <List disablePadding>
                  <ListItem>
                    <ListItemIcon>
                      <CloudOff />
                    </ListItemIcon>
                    <ListItemText primary='Network' />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`Log Period`}
                      secondary={
                        <>
                          {`Starting: ${formatDate(report.network.log_start, false)}`}
                          <br />
                          {`Ending: ${formatDate(report.network.log_end, false)}`}
                        </>}
                      />
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
            </Grid>
            <Grid item md={6} xs={12}>
              <Card elevation={0} className={classes.subcard}>
                <List disablePadding>
                  <ListItem>
                    <ListItemIcon>
                      <VideoLibrary />
                    </ListItemIcon>
                    <ListItemText primary='Capture Report' />
                  </ListItem>
                    { report.xmltv_entries &&
                      <ListItem>
                        <ListItemText
                          primary='XMLTV Entries'
                          secondary={
                            report.xmltv_entries.map(xmlentry =>
                              <span key={`${xmlentry.date}${report._id}`} color={"textSecondary"}> {`${formatDate(xmlentry.date,false,false)} : ${xmlentry.entries} entries`}<br/> </span>
                            )
                          }
                        />
                      </ListItem>
                    }
                  </List>
                  <ExpansionPanel elevation={0} style={{padding: 0}}>
                    <ExpansionPanelSummary expandIcon={<ExpandMore />} id="downtimes" elevation={0}>
                      <Typography> Captured Files </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: 0}}>
                      <List>
                        {report.captured_files.length === 0 ? <ListItem> <Typography>No files found!</Typography> </ListItem>:
                        report.captured_files.map(file => <ListItem key={file} children={<Typography>{`${file}`}</Typography>} />)}
                      </List>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
              </Card>
            </Grid>
          </Grid>
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