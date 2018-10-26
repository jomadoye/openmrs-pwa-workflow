import React from 'react';
import {encounterRest, selectors} from '@openmrs/react-components';
import { ENCOUNTER_TYPES, CONCEPTS } from "../constants";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import utils from "../utils";


class CheckInEncounters extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      encounters: []
    };
  }

  componentDidMount() {
    encounterRest.fetchEncountersByPatient(
      this.props.patient.uuid, ENCOUNTER_TYPES.CheckInEncounterType.uuid
    ).then(data => {
      this.setState({
        encounters: data.results.sort(function (a, b) {
          return +new Date(b.encounterDatetime) - +new Date(a.encounterDatetime);
        })
      });
    });
  }

  render() {
    let checkInEncounters = [];
    if (this.props.patient && this.props.patient.visit && this.props.patient.visit.encounters) {
      checkInEncounters = this.props.patient.visit.encounters;
    } else {
      checkInEncounters = this.state.encounters;
    }
    let history = checkInEncounters.map((encounter, i) => {
      return (
        <div key={encounter.id}>
          <h5><u>{ utils.formatCalendarDate(encounter.encounterDatetime) }</u></h5>
          <ul>{encounter.obs.map((observation) => {
            return (
              <li key={observation.id}>{ observation.concept.uuid === CONCEPTS.SOURCE_OF_REFERRAL.uuid ? 'Referred from: ' + observation.value.display : observation.display }</li>
            );
          })}</ul>
        </div>
      );
    });
    return (
      <div>
        { history }
      </div>
    );
  }
}

CheckInEncounters.propTypes = {
  patient: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    patient: selectors.getSelectedPatientFromStore(state)
  };
};


export default connect(mapStateToProps)(CheckInEncounters);