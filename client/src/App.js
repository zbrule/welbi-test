  
import React, { Component } from "react";
import "./App.css";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import ProgramDialog from "./components/ProgramDialog";
import ResidentDialog from "./components/ResidentDialog";

const BACKEND_API = 'http://localhost:8080/ClientAPI'
const PROGRAMS_URL = BACKEND_API + '/programs'
const RESIDENTS_URL = BACKEND_API + '/residents'
const ATTEND_URL = BACKEND_API + '/attend'
const theme = createMuiTheme();
const styles = {
  table: {
    minWidth: 650,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  
};
class App extends Component {

    constructor(props) {
        super(props);
        this.state = { 
          programData: [],
          residentData: [],
          residentForm: {
            name: '',
            firstName: '',
            lastName: '',
            room: '',
            levelOfCare: "INDEPENDENT",
            ambulation: "NOLIMITATIONS",
            birthDate: '',
            moveInDate:  ''
          },
          programForm: {
            name: '',
            allDay: false,
            isRepeated: false,
            location: '',
            facilitators: ["Resident"],
            levelOfCare: ["INDEPENDENT"],
            dimension: "Intellectual",
            tags: [],
            hobbies: [],
            start: '',
            end: ''
          },
          selectedProgram: "",
          selectedResident: "",
          programValue: "",
          residentValue: "",
          dataLoading: true,
          programDialogOpen: false,
          residentDialogOpen: false
       };
       this.handleInputChange = this.handleInputChange.bind(this);
       this.handleAttend = this.handleAttend.bind(this);
       this.handleAddResident = this.handleAddResident.bind(this);

    }

    pullTableData() {
      fetch(PROGRAMS_URL)
        .then(res => res.json())
        .then(res => {
          this.setState({...this.state, programData: res, dataLoading: false});
          console.log(res);
        })
        .catch(err => {
          console.log(err);
          this.setState({...this.state});
        });
      fetch(RESIDENTS_URL)
        .then(res => res.json())
        .then(res => {
          this.setState({...this.state, residentData: res, dataLoading: false});
          console.log(res);
        })
        .catch(err => {
          console.log(err);
          this.setState({...this.state});
        });
    }

    componentDidMount() {
        this.pullTableData()
    }

    showProgramDialog = () => {
      this.setState({ programDialogOpen: !this.state.programDialogOpen });
    };

    showResidentDialog = () => {
      this.setState({ residentDialogOpen: !this.state.residentDialogOpen });
    };


    handleInputChange(event) {
      const target = event.target;
      const name = target.name;
  
      this.setState({
        [name]: target.value
      });
    }
  
    handleAttend(event) {
      let attendee = {
        status: 'Passive',
        residentId: this.state.selectedResident,
      }
      fetch(ATTEND_URL+'?program='+this.state.selectedProgram, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(attendee)
          }).then(this.setState(...this.state))
      event.preventDefault();
    }

    handleAddResident(event) {
      //TODO
      event.preventDefault();
    }

    determineProgram(id){
      let programName = null
      this.state.programData.forEach( element => {
        if (element.id == id) {
          programName = element.name;
        }
      });
      return programName;
    }

    render() {
      const { classes } = this.props;
      if (this.state.dataLoading){
        return <div>Loading...</div>
      }
      else return (
          <div className="App">
            {console.log(this.state.residentData)}
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell><h3>Resident</h3></TableCell>
                      <TableCell><h3>Programs</h3></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  { this.state.residentData.map((row) => {
                    return (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>
                          {row.attendance.map((element, key)=>{
                            let value = this.determineProgram(element.programId);
                            return value != null ? <Chip align="left" key={key} label={value} /> : null
                          })}
                        
                        </TableCell>
                      </TableRow>
                    )
                  }) }
                  </TableBody>
                </Table>
              </TableContainer>
              <FormControl variant="outlined" className={classes.formControl}>
                <Button className={classes.root} variant="contained" color="primary" onClick={e => this.showProgramDialog(e)}>New Program</Button>
                <ProgramDialog onClose={this.showProgramDialog} show={this.state.programDialogOpen}></ProgramDialog>
              </FormControl>
              <FormControl variant="outlined" className={classes.formControl}>
                <Button className={classes.root} variant="contained" color="primary" onClick={e => this.showResidentDialog(e)}>New Resident</Button>
                <ResidentDialog onClose={this.showResidentDialog} show={this.state.residentDialogOpen}></ResidentDialog>
              </FormControl>
              <form className={classes.root} noValidate autoComplete="off" onSubmit={this.handleAttend}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="select-label-resident">Resident</InputLabel>
                  <Select
                    labelId="selected-resident-label"
                    id="selected-resident"
                    name="selectedResident"
                    onChange={this.handleInputChange}
                    label="Resident"
                  >
                    {this.state.residentData && this.state.residentData.length ? this.state.residentData.map((row,key) => (
                        <MenuItem key={key} value={row.id}>{row.name}</MenuItem>
                      )) : null }
                  </Select>
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="select-label-program">Program</InputLabel>
                  <Select
                    labelId="selected-program-label"
                    id="selected-program"
                    name="selectedProgram"
                    onChange={this.handleInputChange}
                    label="Program"
                  >
                    {this.state.programData && this.state.programData.length ? this.state.programData.map((row,key) => (
                        <MenuItem key={key} value={row.id}>{row.name}</MenuItem>
                      )) : null }
                  </Select>
                </FormControl>
                <Button className={classes.root} type="submit" value="Submit" variant="contained" color="primary">Attend</Button>
              </form>
          </div>
        );
    }
}
export default withStyles(styles)(App);
