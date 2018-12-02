import React, { Component } from "react";
import "./App.css";

import {
  TextField,
  createMuiTheme,
  MuiThemeProvider,
  Typography,
  Toolbar,
  AppBar,
  CssBaseline,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#FF5722"
    },
    secondary: {
      main: "#f44336"
    }
  }
});

class App extends Component {
  state = {
    firstName: "",
    lastName: "",
    loading: false,
    dialogOpen: false,
    dialogMessage: "",
    dialogTitle: "",
    id: 1
  };

  submitGuest = () => {
    this.setState({ loading: true });
    fetch(
      `${
        process.env.NODE_ENV === "development" ? "http://localhost:1235" : ""
      }/party/${this.state.id || 1}/register`,
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: this.state.firstName,
          lastName: this.state.lastName
        })
      }
    )
      .then(response => {
        if (response.ok) {
          this.setState({
            firstName: "",
            lastName: "",
            dialogMessage: "You have been added",
            dialogTitle: "Success"
          });
        } else if (response.status === 401) {
          this.setState({
            firstName: "",
            lastName: "",
            dialogMessage: "The guest limit for this party has been reached.",
            dialogTitle: "Error"
          });
        } else if (response.status === 404) {
          this.setState({
            firstName: "",
            lastName: "",
            dialogMessage:
              "This party doesn't exist. You may need to create it using the API.",
            dialogTitle: "Error"
          });
        } else {
          this.setState({
            firstName: "",
            lastName: "",
            dialogMessage: "An unknown error occured",
            dialogTitle: "Error"
          });
        }
        this.setState({ dialogOpen: true, loading: false });
        console.log(response);
      })
      .catch(err => {
        this.setState({
          loading: false,
          dialogOpen: true,
          dialogMessage: err.message || err,
          dialogTitle: "Error"
        });
      });
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <CssBaseline />
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography
                variant="title"
                color="inherit"
                style={{ flexGrow: 1 }}
              >
                RSVP
              </Typography>
            </Toolbar>
          </AppBar>

          <Grid
            container
            spacing={24}
            alignItems="center"
            justify="center"
            style={{ margin: 16 }}
          >
            <Grid item xs={8}>
              <Card>
                {this.state.loading && <LinearProgress color="secondary" />}

                <CardContent>
                  <TextField
                    label="ID"
                    InputLabelProps={{
                      shrink: true
                    }}
                    placeholder="1"
                    fullWidth
                    margin="normal"
                    onChange={event =>
                      this.setState({
                        id: !isNaN(event.target.value)
                          ? parseInt(event.target.value, 10)
                          : ""
                      })
                    }
                    value={this.state.id}
                    type="number"
                  />
                  <TextField
                    label="First Name"
                    InputLabelProps={{
                      shrink: true
                    }}
                    placeholder="John"
                    fullWidth
                    margin="normal"
                    onChange={event =>
                      this.setState({ firstName: event.target.value })
                    }
                    value={this.state.firstName}
                  />
                  <TextField
                    label="Last Name"
                    InputLabelProps={{
                      shrink: true
                    }}
                    placeholder="Doe"
                    fullWidth
                    margin="normal"
                    onChange={event =>
                      this.setState({ lastName: event.target.value })
                    }
                    value={this.state.lastName}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    onClick={this.submitGuest}
                    disabled={
                      this.state.loading ||
                      !this.state.firstName ||
                      !this.state.lastName ||
                      !this.state.id
                    }
                  >
                    Join
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          <Dialog
            open={this.state.dialogOpen}
            onClose={() => this.setState({ dialogOpen: false })}
          >
            <DialogTitle id="alert-dialog-title">
              {this.state.dialogTitle}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>{this.state.dialogMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ dialogOpen: false })}
                color="primary"
                autoFocus
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
