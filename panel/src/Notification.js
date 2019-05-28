import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Snackbar, IconButton } from '@material-ui/core/';
import { Close } from '@material-ui/icons'; 

const styles = theme => ({
    close: {
      padding: theme.spacing.unit / 2,
    },
});  

const Notification = ({classes, open, message, handleClose}) => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{message}</span>}
            action={[
                <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={handleClose}
                >
                <Close />
                </IconButton>,
            ]}
        />
    )
}


Notification.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Notification);