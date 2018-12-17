import React from 'react';
import DatePicker from 'react-16-bootstrap-date-picker';
import { Button, ButtonToolbar, Grid, Row, Col,FormGroup, ControlLabel } from 'react-bootstrap';
import {
  patientActions,
  CardList,
  patientObjByEncounterTypeFilter,
  selectors,
  PatientCard,
} from '@openmrs/react-components';

import { push } from "connected-react-router";
import { connect } from "react-redux";
import { ENCOUNTER_TYPES, LOCATION_TYPES } from '../constants';
import utils from "../utils";
import ic3PatientActions from '../patient/patientActions';
import ScreeningFilters from '../screening/ScreeningFilters'

class CheckInQueue extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      appointmentDate: new Date().toISOString()
    };

  }


  handleAppointmentDateChange(value, formattedValue) {
    this.setState(() => ({
      appointmentDate: value,
      formattedAppointmentDate: formattedValue
    }));
  }


  getAppointmentReport(){
    this.props.dispatch(patientActions.clearPatientStore());
    this.props.dispatch(ic3PatientActions.getIC3Patients(this.props.location, utils.formatReportRestDate(this.state.appointmentDate), true));  // getExpectedAppoints == true

  };

  onMountOtherActionCreators() {
    this.props.dispatch(patientActions.clearSelectedPatient());
  }
  redirectToCheckinPageActionCreator() {
    return push('/checkin/checkInPage');
  }

  render() {
    const fetchListActionCreator = this.props.fetchListActionCreator ? this.props.fetchListActionCreator :
      () => {
        if (!this.props.updating) {
          this.props.dispatch(ic3PatientActions.getIC3Patients(
            this.props.session.sessionLocation ? this.props.session.sessionLocation.uuid : null, utils.formatReportRestDate(new Date())
          ));
        }
      };

    return (
      <div>
        {/* uncomment this to get an appt search widget that can be used for testing <br />
        <Grid>
          <Row>
            <FormGroup controlId="formApptDate">
              <Col
                componentClass={ControlLabel}
                sm={2}
              >Appointment Date</Col>
              <Col sm={2}>
                <DatePicker
                  id="appt-datepicker"
                  onChange={this.handleAppointmentDateChange.bind(this)}
                  value={this.state.appointmentDate}
                />
              </Col>
              <Col sm={2} >
                <ButtonToolbar>
                  <Button
                    bsSize="small"
                    bsStyle="success"
                    onClick={this.getAppointmentReport.bind(this)}
                    type="submit"
                  >
                    Get Appointment Report
                  </Button>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Row>
        </Grid>

        <br />
*/}
        <CardList
          card={PatientCard}
          delayInterval={0}
          dispatch={this.props.dispatch}
          fetchListActionCreator={fetchListActionCreator}
          filters={[patientObjByEncounterTypeFilter(ENCOUNTER_TYPES.CheckInEncounterType.uuid, 'exclude')]}
          getPatientIdentifiers={utils.getPatientIdentifiers}
          loading={this.props.updating}
          onMountOtherActionCreators={[
            () => this.props.dispatch(patientActions.clearSelectedPatient())
          ] }
          rowData={ Object.values(this.props.patients) }
          rowSelectedActionCreators={[patientActions.setSelectedPatient, this.redirectToCheckinPageActionCreator.bind(this)]}
          ScreeningFilters={ScreeningFilters}
          searchFilterFields={['name.givenName', 'name.familyName', 'identifiers.0.identifier', 'identifiers.1.identifier', 'identifiers.2.identifier']}
          title="Check-In Queue"
        />

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    location: state.openmrs.session.sessionLocation ? state.openmrs.session.sessionLocation.uuid : LOCATION_TYPES.UnknownLocation,
    patients: selectors.getPatientStore(state),
    updating: selectors.isPatientStoreUpdating(state),
    session: state.openmrs.session,
  };
};

export default connect(mapStateToProps)(CheckInQueue);
