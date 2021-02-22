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
import {MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker,} from '@material-ui/pickers';
import formatISO from 'date-fns/formatISO'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';



const BACKEND_API = 'http://localhost:8080/ClientAPI'
const PROGRAMS_URL = BACKEND_API + '/programs'


class ProgramDialog extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: '',
            allDay: false,
            isRepeated: false,
            location: '',
            facilitators: ["Resident"],
            levelOfCare: ["INDEPENDENT"],
            dimension: "Intellectual",
            tags: [],
            hobbies: [],
            start: new Date().toISOString(),
            end: new Date().toISOString()
        }
        this.handleAddProgram = this.handleAddProgram.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
    }

    handleAddProgram(event) {
        console.log(this.state)
        fetch(PROGRAMS_URL, {
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

    handleStartDateChange = (date) => {
        this.setState({start:formatISO(date)});
    };
    handleEndDateChange = (date) => {
        this.setState({end:formatISO(date)});
    };

    handleInputChange(event) {
    console.log(event)
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
                    <DialogTitle id="form-dialog-title">New Program</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Fill in all fields, I'm not handling any validation
                    </DialogContentText>
                    <TextField
                        autoFocus
                        name="name"
                        margin="dense"
                        id="new-program-name"
                        label="Program Name"
                        type="text"
                        onChange={this.handleInputChange}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        name="location"
                        margin="dense"
                        id="location"
                        label="Location"
                        type="text"
                        onChange={this.handleInputChange}
                        fullWidth
                    />
                     <FormControlLabel
                        control={<Checkbox checked={this.state.allDay} onChange={this.handleChecked} name="allDay" />}
                        label="All Day"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={this.state.isRepeated} onChange={this.handleChecked} name="isRepeated" />}
                        label="Repeated"
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                            <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="yyyy-MM-dd"
                            margin="normal"
                            id="start-date"
                            label="Start Date"
                            name="start"
                            value={this.state.start}
                            onChange={this.handleStartDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                            <KeyboardTimePicker
                            margin="normal"
                            id="start-time"
                            label="Start Time"
                            name="start"
                            value={this.state.start}
                            onChange={this.handleStartDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                            <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="yyyy-MM-dd"
                            margin="normal"
                            id="end-date"
                            label="End Date"
                            name="end"
                            value={this.state.end}
                            onChange={this.handleEndDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                            <KeyboardTimePicker
                            margin="normal"
                            id="end-time"
                            label="End Time"
                            name="end"
                            value={this.state.end}
                            onChange={this.handleEndDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleAddProgram} color="primary">
                        Add
                    </Button>
                    </DialogActions>
                </Dialog>
            )
        }
    }
}

export default ProgramDialog;