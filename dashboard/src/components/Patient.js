import { Button } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import { TextField, Autocomplete, Stack } from "@mui/material";

import EncounterBlock from "./blocks/Encounter";

import getData from "../functions/getData";

function Patient({
  setIsLoading,
  autoCompleteOptions,
  setAutoCompleteOptions,
}) {
  const [encounterData, setEncounterData] = useState(null);
  const [timeline, setTimeline] = useState(null);

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
                      setIsLoading,
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
              const encounterDataResults = await getData(
                e,
                setIsLoading,
                "encounters",
                {
                  PATIENT: patientId,
                },
                {},
                {
                  START: 1,
                }
              );
              setEncounterData(encounterDataResults);
              setAutoCompleteOptions([patientId]);
              console.log(encounterDataResults);
            }}
          />
        </Stack>
      </div>
      <div
        className="display"
        style={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          overflowY: "scroll",
          // marginTop: ".5rem",
          // margin: "auto",
        }}
      >
        {encounterData !== null && (
          <Fragment>
            {encounterData.map((encounterDataRow, index) => (
              <span key={index}>
                <EncounterBlock encounterDataRow={encounterDataRow} />
              </span>
            ))}
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default Patient;
