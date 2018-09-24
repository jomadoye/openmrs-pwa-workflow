import { patientObjByEncounterTypeFilter  } from "@openmrs/react-components";
import { ENCOUNTER_TYPES } from "../../constants";

// ADHERENCE COUNSELING QUEUE
/*
- Is automatically triggered after a high VL result
- Patient needs to complete 3 consecutive Adherence Counseling sessions before a Confirmatory VL test is done

Here are the filtering criteria for the Adherence Counseling Queue:
1. Last VL is not LDL and no regiment switch in the last 6months
2. Last VL is not LDL and patient has not recorded 3 consecutive adherence counseling
3. If they miss the second counseling then start from 1 again
 */
const adherenceFilter = patient => {
  return true;
};


export default {
  required: [patientObjByEncounterTypeFilter(ENCOUNTER_TYPES.AdherenceCounselingEncounterType.uuid, 'exclude'), adherenceFilter],
  completed: [patientObjByEncounterTypeFilter(ENCOUNTER_TYPES.AdherenceCounselingEncounterType.uuid, 'include')]
};