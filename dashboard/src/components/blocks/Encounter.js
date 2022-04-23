import CustomButton from "./CustomButton";

function EncounterBlock(encounterDataRow) {
  encounterDataRow = encounterDataRow.encounterDataRow;
  const distinctENCOUNTERCLASS = [
    "ambulatory",
    "emergency",
    "inpatient",
    "urgentcare",
    "outpatient",
    "wellness",
  ];
  const date = new Date(encounterDataRow["START"]);
  const colorGradient = "linear-gradient(to bottom right, #db928c, #dbd28c)";

  const encounterInfo = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "[A] 33.33% [B] 33.33% [C] 33.33% [D]",
        gridTemplateRows: "[X] 50% [Y] 50% [Z]",
        width: "30%",
      }}
    >
      <div
        style={{
          gridRow: "X / Y",
          gridColumn: "A / B",
          //   backgroundColor: "red",
          backgroundImage: colorGradient,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <CustomButton
          copyText={encounterDataRow["Id"]}
          displayText={"ID"}
          titleText="Copy Encounter ID"
        />
      </div>
      <div
        style={{
          gridRow: "X / Y",
          gridColumn: "B / C",
          //   backgroundColor: "yellow",
          backgroundImage: colorGradient,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <CustomButton
          copyText={encounterDataRow["PATIENT"]}
          displayText={"PID"}
          titleText="Copy Patient ID"
        />
      </div>
      <div
        style={{
          gridRow: "X / Y",
          gridColumn: "C / D",
          //   backgroundColor: "blue",
          backgroundImage: colorGradient,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <CustomButton
          copyText={encounterDataRow["CODE"]}
          displayText={"Code"}
          titleText="Copy Encounter Code from SNOMED-CT"
        />
      </div>
      <div
        style={{
          gridRow: "Y / Z",
          gridColumn: "A / D",
          //   backgroundColor: "cyan",
          backgroundImage: colorGradient,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <CustomButton
          copyText={encounterDataRow["DESCRIPTION"]}
          displayText={
            encounterDataRow["DESCRIPTION"] +
            (encounterDataRow["DESCRIPTION"].substring(0, 10).length > 10
              ? "..."
              : "")
          }
          titleText={"Copy Description"}
        />
      </div>
    </div>
  );

  const payerInfo = (
    <div
      style={{
        // backgroundColor: "pink",
        backgroundImage: colorGradient,
        width: "10%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <CustomButton
        copyText={encounterDataRow["PAYER"]}
        displayText={"Payer"}
        titleText="Copy Payer ID"
      />
    </div>
  );

  const providerInfo = (
    <div
      style={{
        // backgroundColor: "white",
        backgroundImage: colorGradient,
        width: "10%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <CustomButton
        copyText={encounterDataRow["PROVIDER"]}
        displayText={"Provider"}
        titleText="Copy Provider ID"
      />
    </div>
  );

  const reasonInfo = (
    <div
      style={{
        // backgroundColor: "brown",
        backgroundImage: colorGradient,
        width: "15%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <CustomButton
        copyText={encounterDataRow["REASONCODE"]}
        displayText={
          encounterDataRow["REASONDESCRIPTION"] +
          (encounterDataRow["REASONDESCRIPTION"].substring(0, 20).length > 20
            ? "..."
            : "")
        }
        titleText="Copy REASON CODE"
      />
    </div>
  );

  const costInfo = (
    <div
      style={{
        display: "flex",
        width: "15%",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: "50%",
          //   backgroundColor: "red",
          backgroundImage: colorGradient,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomButton
          copyText={encounterDataRow["TOTAL_CLAIM_COST"]}
          displayText={encounterDataRow["TOTAL_CLAIM_COST"]}
          titleText="Copy Claim Cost"
        />
      </div>
      <div
        style={{
          height: "50%",
          //   backgroundColor: "maroon",
          backgroundImage: colorGradient,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomButton
          copyText={encounterDataRow["BASE_ENCOUNTER_COST"]}
          displayText={encounterDataRow["BASE_ENCOUNTER_COST"]}
          titleText="Copy Base Encounter Cost"
        />
      </div>
    </div>
  );

  const dateInfo = (
    <div
      style={{
        // backgroundColor: "#db928c",
        backgroundImage: colorGradient,
        width: "20%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <CustomButton
        copyText={date.toISOString().substring(0, 10)}
        displayText={date.toISOString().substring(0, 10)}
        titleText="Copy Date"
      />
    </div>
  );

  return (
    <div
      className="block encounter"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: "10px",
        // backgroundColor: "green",
        textAlign: "center",
        width: "80%",
        height: "150px",
        margin: "auto",
        borderRadius: "25px 10px",
      }}
    >
      {encounterInfo}
      {payerInfo}
      {providerInfo}
      {reasonInfo}
      {costInfo}
      {dateInfo}
    </div>
  );
}

export default EncounterBlock;
