import { Stack, Divider, Button, TextField, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import getData from "../../functions/getData";

function YAxisParameters({
  id,
  setIsLoading,
  collectionList,
  yAxisLabelObjList,
  setYAxisLabelObjList,
  aggregationList,
}) {
  return (
    <div>
      {
        <Stack
          direction="column"
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
          width="100%"
          key={id}
        >
          <TextField
            onChange={async (e) => {
              const record = await getData(
                null,
                setIsLoading,
                e.target.value,
                {},
                { _id: 0 },
                {},
                1
              );
              const columnNames = Object.keys(record[0]);
              let yAxisLabelsTemp = yAxisLabelObjList;
              let updatedColumnNames = columnNames.filter(
                (column) => typeof record[0][column] === "number"
              );
              yAxisLabelsTemp[id] = {
                selectedColumn: e.target.value,
                columns: updatedColumnNames,
                yAxis: null,
                aggregation: "sum"
              };
              setYAxisLabelObjList(yAxisLabelsTemp);
            }}
            select
            label="Y-Axis Table"
            key={0}
          >
            {collectionList.length > 0 &&
              collectionList.map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
          </TextField>
          <TextField
            select
            label="Y-Axis Label"
            key={1}
            onChange={(e) => {
              var yAxisLabelsTemp = yAxisLabelObjList;
              yAxisLabelsTemp[id]["yAxis"] = e.target.value;
              setYAxisLabelObjList(yAxisLabelsTemp);
            }}
          >
            {yAxisLabelObjList[id] !== null &&
              yAxisLabelObjList[id]["columns"] !== null &&
              yAxisLabelObjList[id]["columns"].length > 0 &&
              yAxisLabelObjList[id]["columns"].map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
          </TextField>
          <TextField
            onChange={async (e) => {
              var yAxisLabelsTemp = yAxisLabelObjList;
              yAxisLabelsTemp[id]["aggregation"] = e.target.value;
              setYAxisLabelObjList(yAxisLabelsTemp);
            }}
            select
            label="Aggregation"
            defaultValue={yAxisLabelObjList[id]["aggregation"]}
          >
            {aggregationList.length > 0 &&
              aggregationList.map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
          </TextField>
          <Stack
            direction="row"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
            width="100%"
            key={0}
          >
            <Button
              startIcon={<AddIcon />}
              key={0}
              onClick={() => {
                setYAxisLabelObjList([
                  ...yAxisLabelObjList,
                  {
                    selectedColumn: null,
                    columns: null,
                    yAxis: null,
                    aggregation: "sum",
                  },
                ]);
              }}
              style={{
                display: id === yAxisLabelObjList.length - 1 ? "flex" : "none",
                minWidth: "50%",
                maxWidth: "100%",
              }}
            />
            <Button
              startIcon={<RemoveIcon />}
              key={1}
              onClick={() => {
                setYAxisLabelObjList(
                  yAxisLabelObjList.splice(0, yAxisLabelObjList.length - 1)
                );
              }}
              style={{
                display:
                  id === yAxisLabelObjList.length - 1
                    ? id !== 0
                      ? "inline-block"
                      : "none"
                    : "none",
                minWidth: "50%",
                maxWidth: "100%",
              }}
            ></Button>
          </Stack>
        </Stack>
      }
    </div>
  );
}

export default YAxisParameters;
