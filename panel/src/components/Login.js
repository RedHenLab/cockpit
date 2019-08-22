import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Card, CardHeader, CardActions, CardContent, Button, Grid, TextField, IconButton, InputAdornment } from '@material-ui/core/';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { login } from '../config';
import JWT from '../services/JWT';
import API from '../services/API';

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
  vertical: {
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
  }
};

class LoginCard extends React.Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
  }
  
  handleChange = (event,name) => {
    this.setState({[name]: event.target.value});
  }

  togglePasswordVisibility = () => {
    this.setState({showPassword: !this.state.showPassword});
  };

  signIn = () => {
    API.get(`${login}?username=${this.state.username}&password=${this.state.password}`)
    .then(res => res.json())
    .then((user) => {
      if (user) {
        API.token = user.token;
        JWT.saveToken(user.token);
        this.props.setUser(user);
      }
      else {
        // TODO: Failed login message
      }
    })
    .catch( (err) => { 
        if (err.status === 422) {
          err.json()
            .then(res => { 
              this.props.raiseNotification(res.message);
            })
            .catch(() => { 
              this.props.raiseNotification('Login error. Please try again.')
            })
        }
        else this.props.raiseNotification('Could not login! Please check your connection')
    });
  }
  
  render() {
    const { classes } = this.props;
    const { showPassword, password } = this.state;
    return (
        <Card className={classes.card}>
            <CardHeader title={'Login to Cockpit'}/>
            <CardContent>
            <form>
              <Grid container>
                <Grid item className={classes.vertical}>
                  
                    <TextField
                      label="Username"
                      onChange={(event) => this.handleChange(event,'username')}
                      margin="dense"
                      variant="outlined"
                      autoComplete="username"
                    />
                    <TextField
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        value={password}
                        onChange={(event) => this.handleChange(event,'password')}
                        autoComplete="current-password"
                        InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                aria-label="Toggle password visibility"
                                onClick={this.togglePasswordVisibility}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        ),
                        }}
                    />
                </Grid>
              </Grid>
            </form>
            </CardContent>
            <CardActions>
            <Button size="small" onClick={this.signIn}>Login</Button> 
            </CardActions>
        </Card>
    );
  }
}

LoginCard.propTypes = {
  classes: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  raiseNotification: PropTypes.func.isRequired
};

export default withStyles(styles)(LoginCard);
