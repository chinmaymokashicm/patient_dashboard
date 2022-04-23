import {
  AppBar,
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import getData from "../functions/getData";
import TabPanel from "./TabPanel";
import { DataGrid } from "@mui/x-data-grid";

function Charts({ setIsLoading }) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [currentVizTab, setCurrentVizTab] = useState(0);
  function handleTabs(e, index) {
    setCurrentVizTab(index);
  }
  const VizTabComponent = (
    <AppBar
      position="static"
      style={{
        backgroundColor: "#84ad94",
      }}
    >
      <Tabs value={currentVizTab} onChange={handleTabs}>
        <Tab label="Table" />
        <Tab label="Chart" />
      </Tabs>
    </AppBar>
  );

  const [currentResults, setCurrentResults] = useState([]);

  const [collection, setCollection] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [aggregation, setAggregation] = useState("");
  const [chartType, setChartType] = useState("");

  const [collectionList, setCollectionList] = useState([
    "allergies",
    "careplans",
    "conditions",
    "devices",
    "encounters",
    "imaging_studies",
    "immunizations",
    "medications",
    "observations",
    "organizations",
    "patients",
    "payer_transitions",
    "payers",
    "procedures",
    "providers",
    "supplies",
  ]);
  const [xAxisList, setXAxisList] = useState([]);
  const [yAxisList, setYAxisList] = useState([]);
  const [aggregationList, setAggregationList] = useState(["sum"]);
  const [chartTypeList, setChartTypeList] = useState([
    {
      name: "LineChart",
      value: (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={currentResults}
            margin={{
              top: 50,
              bottom: 50,
            }}
          >
            <XAxis dataKey="_id" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey={aggregation} stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
  ]);

  async function getAxes(collection) {
    const record = await getData(
      null,
      setIsLoading,
      collection,
      {},
      { _id: 0 },
      {},
      1
    );
    const columnNames = Object.keys(record[0]);
    setXAxisList(columnNames);
    const yAxis = columnNames.filter(
      (column) => typeof record[0][column] === "number"
    );
    setYAxisList(yAxis);
  }

  async function createChart() {
    const aggregationQuery = [
      {
        $group: {
          _id: `$${xAxis}`,
          [aggregation]: {
            ["$" + aggregation]: {
              $convert: {
                input: `$${yAxis}`,
                to: "double",
                onError: 0,
                onNull: 0,
              },
            },
          },
        },
      },
      {
        $limit: 20,
      },
    ];

    // {
    //   "collection": "encounters",
    //   "aggregate": [
    //     {
    //       "$group": {
    //         "_id": "$ENCOUNTERCLASS",
    //         "total": {
    //           "$sum": {
    //             "$convert": {
    //               "input": "$BASE_ENCOUNTER_COST",
    //               "to": "double",
    //               "onError": 0,
    //               "onNull": 0
    //             }
    //           }
    //         }
    //       }
    //     }
    //   ]
    // }

    console.log(aggregationQuery);
    const records = await getData(
      null,
      setIsLoading,
      collection,
      {},
      {},
      {},
      {},
      aggregationQuery
    );

    console.log(records);
    setCurrentResults(records);
    if (chartType["name"] === undefined) {
      console.log(chartTypeList[0]["name"]);
      // setChartType(chartTypeList[0]);
    }
  }

  useEffect(() => {
    if (currentResults.length > 0) {
      const columnNames = Object.keys(currentResults[0]);
      setColumns(
        columnNames.map((columnName) => {
          return {
            field: columnName,
            headerName: columnName,
            flex: 1,
          };
        })
      );
      setRows(
        currentResults.map((row, index) => {
          row["id"] = index + 1;
          return row;
        })
      );
    }
  }, [currentResults]);

  useEffect(() => {
    console.log(columns);
  }, [columns]);

  useEffect(() => {
    console.log(rows);
  }, [rows]);

  return (
    <div className="charts">
      <div className="parameters">
        <Stack
          direction="column"
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
          width="100%"
        >
          <Select
            autoWidth
            value={collection}
            label="Collection"
            onChange={(e) => {
              getAxes(e.target.value);
              setCollection(e.target.value);
            }}
          >
            {collectionList.length > 0 &&
              collectionList.map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
          </Select>
          <Select
            autoWidth
            value={xAxis}
            label="X-axis"
            onChange={(e) => {
              setXAxis(e.target.value);
            }}
          >
            {xAxisList.length > 0 &&
              xAxisList.map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
          </Select>
          <Select
            autoWidth
            value={yAxis}
            label="Y-axis"
            onChange={(e) => {
              setYAxis(e.target.value);
            }}
          >
            {yAxisList.length > 0 &&
              yAxisList.map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
          </Select>
          <Select
            autoWidth
            value={aggregation}
            label="Aggregation"
            onChange={(e) => {
              setAggregation(e.target.value);
            }}
          >
            {aggregationList.length > 0 &&
              aggregationList.map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
          </Select>
          <Button
            onClick={() => {
              // Run query
              console.log("Generating");
              createChart();
            }}
            variant="primary"
            disabled={false}
            style={{
              textTransform: "unset",
            }}
          >
            Generate
          </Button>
          <Select
            autoWidth
            value={chartType}
            label="Chart Type"
            onChange={(e) => {
              setChartType(e.target.value);
              console.log(e.target.value);
            }}
          >
            {chartTypeList.length > 0 &&
              chartTypeList.map((option) => {
                return (
                  <MenuItem key={option.name} value={option.value}>
                    {option.name}
                  </MenuItem>
                );
              })}
          </Select>
        </Stack>
      </div>
      <div className="viz">
        {VizTabComponent}
        <TabPanel value={currentVizTab} index={0}>
          {columns.length > 0 && rows.length > 0 && (
            <DataGrid rows={rows} columns={columns} />
          )}
        </TabPanel>
        <TabPanel value={currentVizTab} index={1}>
          {currentResults !== null &&
            currentResults !== undefined &&
            currentResults.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={currentResults}
                  margin={{
                    top: 50,
                    bottom: 50,
                  }}
                >
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Line
                    type="monotone"
                    dataKey={aggregation}
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
        </TabPanel>
      </div>
    </div>
  );
}

export default Charts;
