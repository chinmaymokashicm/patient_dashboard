import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { TextField, Autocomplete, Stack } from "@mui/material";

import getData from "../functions/getData";

function Patient() {
  const [encounterData, setEncounterData] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([
    "Start typing",
  ]);

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
                    // getPatientIdArray(e.target.value);
                    const patientIds = await getData(
                      null,
                      "patients",
                      {
                        $regex: `.*${e.target.value}.*`,
                      },
                      {
                        Id: 1,
                        _id: 0,
                      }
                    );
                    const patientIdArray = patientIds.map(
                      (object) => object["Id"]
                    );
                    setAutoCompleteOptions(patientIdArray);
                  }
                }}
              />
            )}
            clearOnBlur={false}
            onChange={async (e, patientId) => {
              // Get timeline of the selected Id
              const encounterDataResults = await getData(e, "encounters", {
                PATIENT: patientId,
              });
              setEncounterData(encounterDataResults);
              console.log(encounterDataResults);
            }}
          />
        </Stack>
      </div>
      <div className="display">{timeline}</div>
    </div>
  );
}

export default Patient;
