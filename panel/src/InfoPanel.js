import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Card, CardActions, CardContent, Button, Typography} from '@material-ui/core/';
import { Memory } from '@material-ui/icons';
import moment from 'moment';

const styles = {
  card: {
    minWidth: 275,
  },
  cardEmpty: {
    display: 'flex',
    minWidth: 275,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',

  },
  icon: {
    fontSize: 70,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

function formatDate(datestring) {
  const date = moment(datestring);
  return `${date.format('MMMM Do YYYY, h:mm a')} (${date.fromNow()})`;
}

const InfoPanel = ({ classes, selected, refreshStation}) => {

    if (selected) {
        const {_id, name, location, lastChecked, lastBackup, onlineSince} = selected;
        return (
            <Card className={classes.card}>
                <CardContent>
                <Typography variant="h5" component="h2"> 
                    {name}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {location}
                </Typography>
                <Typography component="p">
                    Last Check:  {formatDate(lastChecked)}
                </Typography>
                <Typography component="p">
                    Last Backup:  {formatDate(lastBackup)}
                </Typography>
                    Uptime: {onlineSince}
                </CardContent>
                <CardActions>
                <Button size="small" onClick={() => refreshStation(_id) }>Refresh</Button>
                <Button size="small">Edit Station</Button>
                <Button size="small">Backup</Button>
                <Button size="small">Restore from Flash drive</Button>
    
                </CardActions>
            </Card>
        );
    } 
    else return (
        <Card className={classes.cardEmpty}>
            <CardContent>
              <Typography variant="h5" gutterBottom> Select a Station </Typography>
              <Typography variant="h5" style={{textAlign: 'center'}}>
                <Memory className={classes.icon}/>
              </Typography>
            </CardContent>
        </Card>
    );
}

InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoPanel);
