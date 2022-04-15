import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { TextField, Autocomplete, Stack } from "@mui/material";

import getData from "../functions/getData";

function Patient() {
  const [patientData, setPatientData] = useState(null);
  const [encounterData, setEncounterData] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([
    "Start typing",
  ]);
  const [autoCompleteText, setAutoCompleteText] = useState(null);

  async function getPatientIdArray(autoCompleteText) {
    const patientIds = await getData(
      null,
      "patients",
      {
        $regex: `.*${autoCompleteText}.*`,
      },
      {
        Id: 1,
        _id: 0,
      }
    );
    const patientIdArray = patientIds.map((object) => object["Id"]);
    setAutoCompleteOptions(patientIdArray);
  }

  async function getEncounterData(patientId) {
    const encounterDataResults = await getData(null, "encounters", {
      query: {
        PATIENT: patientId,
      },
    });
    setEncounterData(encounterDataResults);
    console.log(encounterDataResults)
  }

  return (
    <div className="patient">
      <div className="search">
        <Stack direction="column" spacing={2}>
          <Autocomplete
            options={autoCompleteOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient ID"
                onChange={async (e) => {
                  if ((e.target.value !== "") | (e.target.value !== null)) {
                    getPatientIdArray(e.target.value);
                  }
                }}
              />
            )}
            clearOnBlur={false}
            value={autoCompleteText}
            onChange={(e, patientId) => {
              // Get timeline of the selected Id
              console.log(patientId);
              getEncounterData(patientId)
            }}
          />
        </Stack>
      </div>
      <div className="display">{timeline}</div>
    </div>
  );
}

export default Patient;
