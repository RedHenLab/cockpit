import React from 'react';
import { createStyles } from '@material-ui/core/styles';
import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

const useStyles = createStyles(theme => ({
  details: {
    flexDirection: 'column',
  }
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls="credits"
          id="credits"
        >
          <Typography>Credits</Typography> 
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.details}>
            <Typography variant="subtitle1">
              The Cockpit project was developed for <a href="http://www.redhenlab.org/" target="_blank" rel="noopener noreferrer">Red Hen Labs</a>
            </Typography>
            <Typography variant="subtitle1">
              Funded by Google as part of <a href="https://summerofcode.withgoogle.com/projects/#4897653710651392">Google Summer of Code 2019 </a>
            </Typography>
            <Typography variant="subtitle2">
              Developed by Aniruddha Mysore
            </Typography>
            <Typography variant="subtitle2">
              Mentors: José Fonseca and Francis Steen
            </Typography>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
} 
export default Footer;
