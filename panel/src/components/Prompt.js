import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core/';

const Prompt = ({open, message, handleClose}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Backup started!</DialogTitle>
      <DialogContent>
        <DialogContentText>{`${message}`}</DialogContentText>
      </DialogContent>
    </Dialog>
  )
}


Prompt.propTypes = {
    open: PropTypes.bool.isRequired,
};
  
export default Prompt;