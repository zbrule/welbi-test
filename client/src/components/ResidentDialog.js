import React, { Component } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker,} from '@material-ui/pickers';
import formatISO from 'date-fns/formatISO'



const BACKEND_API = 'http://localhost:8080/ClientAPI'
const RESIDENTS_URL = BACKEND_API + '/residents'


class ProgramDialog extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: '',
            firstName: '',
            lastName: '',
            room: '',
            levelOfCare: "INDEPENDENT",
            ambulation: "NOLIMITATIONS",
            birthDate: new Date().toISOString(),
            moveInDate:  new Date().toISOString()
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAddResident = this.handleAddResident.bind(this);
    }

    handleAddResident(event) {
        console.log(this.state)
        fetch(RESIDENTS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(this.state)
          })
        this.onClose()
        event.preventDefault();
    }

    onClose = e => {
        this.props.onClose && this.props.onClose(e);
      };

    handleBirthDateChange = (date) => {
        this.setState({birthDate:formatISO(date)});
    };
    handleModeInDateChange = (date) => {
        this.setState({moveInDate:formatISO(date)});
    };

    handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
        [name]: target.value
    });
    }

    handleChecked = (event) => {
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
      };

    render() {
        if(!this.props.show){
            return null;
        } else {
            return (
                <Dialog open={this.props.show} onClose={e => this.onClose(e)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">New Resident</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Fill in all fields, I'm not handling any validation
                    </DialogContentText>
                    <TextField
                        autoFocus
                        name="name"
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        onChange={this.handleInputChange}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        name="firstName"
                        margin="dense"
                        id="first-name"
                        label="First Name"
                        type="text"
                        onChange={this.handleInputChange}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        name="lastName"
                        margin="dense"
                        id="last-name"
                        label="Last Name"
                        type="text"
                        onChange={this.handleInputChange}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        name="room"
                        margin="dense"
                        id="room"
                        label="Room"
                        type="text"
                        onChange={this.handleInputChange}
                        fullWidth
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="yyyy-MM-dd"
                                margin="normal"
                                id="birth-date"
                                label="Birth Date"
                                name="birthDate"
                                value={this.state.birthDate}
                                onChange={this.handleBirthDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="yyyy-MM-dd"
                                margin="normal"
                                id="move-in-date"
                                label="Move In Date"
                                name="moveInDate"
                                value={this.state.moveInDate}
                                onChange={this.handleModeInDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleAddResident} color="primary">
                        Add
                    </Button>
                    </DialogActions>
                </Dialog>
            )
        }
    }
}

export default ProgramDialog;