import {
  AppBar,
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
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
import TimelineIcon from "@mui/icons-material/Timeline";
import YAxisParameters from "./blocks/YAxisParameters";

function Charts({ setIsLoading }) {
  // Table variables
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  // X-Axis variables
  const [xAxisCollectionList, setXAxisCollectionList] = useState([
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
  const [xAxisCollectionName, setXAxisCollectionName] = useState("");
  const [xAxisLabelList, setXAxisLabelList] = useState([]);
  const [xAxisLabelName, setXAxisLabelName] = useState("");

  // Y-Axis variables
  const [yAxisCollectionList, setYAxisCollectionList] = useState([]);
  const [yAxisLabelObjList, setYAxisLabelObjList] = useState([
    {
      selectedColumn: null,
      columns: null,
      yAxis: null,
      aggregation: "sum",
    },
  ]);

  const [aggregationList, setAggregationList] = useState(["sum", "avg"]);

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

  useEffect(() => {
    async function getJoinedCollections() {
      if (xAxisLabelName !== "") {
        // Get those tables that have the selected x-axis label in them (for joining tables)
        var collectionListTemp = xAxisCollectionList.filter(
          (tableName) => tableName !== xAxisCollectionName
        );
        var collectionListFinal = [];
        console.log("collectionListTemp", collectionListTemp);
        collectionListFinal = await Promise.all(
          collectionListTemp.map(async (collection) => {
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
            if (columnNames.includes(xAxisLabelName)) {
              // console.log(`${collection} contains ${xAxisLabelName}`);
              return collection;
            }
          })
        );
        collectionListFinal = [...collectionListFinal, xAxisCollectionName];
        collectionListFinal = collectionListFinal.filter(
          (collection) => collection !== undefined
        );
        setYAxisCollectionList(collectionListFinal);
      }
    }
    getJoinedCollections();
  }, [xAxisLabelName]);

  useEffect(() => {
    console.log(yAxisCollectionList);
  }, [yAxisCollectionList]);

  useEffect(() => {
    console.log(yAxisLabelObjList);
  }, [yAxisLabelObjList]);

  async function generateQuery() {
    console.log(
      "xAxisLabelName, yAxisLabelObjList, aggregation",
      xAxisLabelName,
      yAxisLabelObjList
    );
    var yAxisLabelMapping = {};
    Object.keys(yAxisLabelObjList).map((key) => {
      // Create a new key if it does not exist
      if (!(yAxisLabelObjList[key]["selectedColumn"] in yAxisLabelMapping)) {
        yAxisLabelMapping[yAxisLabelObjList[key]["selectedColumn"]] = {};
      }
      if (
        !(
          yAxisLabelObjList[key]["yAxis"] in
          yAxisLabelMapping[yAxisLabelObjList[key]["selectedColumn"]]
        )
      ) {
        yAxisLabelMapping[yAxisLabelObjList[key]["selectedColumn"]][
          yAxisLabelObjList[key]["yAxis"]
        ] = [];
      }
      if (
        !yAxisLabelMapping[yAxisLabelObjList[key]["selectedColumn"]][
          yAxisLabelObjList[key]["yAxis"]
        ].includes(yAxisLabelObjList[key]["aggregation"])
      ) {
        yAxisLabelMapping[yAxisLabelObjList[key]["selectedColumn"]][
          yAxisLabelObjList[key]["yAxis"]
        ].push(yAxisLabelObjList[key]["aggregation"]);
      }
    });
    console.log(yAxisLabelMapping);

    var aggregateQueryList = [];

    // })
    // Looping through each y-axis collection
    Object.keys(yAxisLabelMapping).forEach((foreignCollection) => {
      var lookupObj = {
        $lookup: {
          from: foreignCollection,
          localField: xAxisLabelName,
          foreignField: xAxisLabelName,
          as: "alias",
        },
      };
      var projectObj = {
        $project: {
          [xAxisLabelName]: 1,
          _id: 0,
        },
      };
      // Adding fields in the $project object
      Object.keys(yAxisLabelMapping[foreignCollection]).forEach(
        (foreignField) => {
          projectObj["$project"][`alias.${foreignField}`] = 1;
        }
      );

      var limitObj = {
        $limit: 20,
      };

      var unwindObj = {
        $unwind: "$alias",
      };

      // Creating the $group object
      var groupObj = {
        $group: {
          _id: `$${xAxisLabelName}`,
        },
      };
      // Adding aggregation functions to the $group object
      Object.keys(yAxisLabelMapping[foreignCollection]).forEach(
        (foreignField) => {
          yAxisLabelMapping[foreignCollection][foreignField].forEach(
            (aggFunc) => {
              groupObj["$group"][
                `${foreignCollection}_${foreignField}_${aggFunc}`
              ] = {
                [`$${aggFunc}`]: {
                  $convert: {
                    input: `$alias.${foreignField}`,
                    to: "double",
                    onError: 0,
                    onNull: 0,
                  },
                },
              };
            }
          );
        }
      );
      aggregateQueryList.push([lookupObj, projectObj, limitObj, unwindObj, groupObj]);
    });
    console.log(aggregateQueryList);
    console.log(xAxisCollectionName)
    
    const results = await Promise.all(aggregateQueryList.map(async (aggregateQuery) => {
      const output = await getData(
        null,
        setIsLoading,
        xAxisCollectionName,
        {},
        {},
        {},
        {},
        aggregateQuery
      );
      return output
    }))
    console.log(results)

    return yAxisLabelMapping;
  }

  return (
    <div className="charts">
      <div className="parameters">
        <Stack
          direction="column"
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
          width="100%"
        >
          <TextField
            value={xAxisCollectionName}
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
              setXAxisLabelList(columnNames);
              setXAxisCollectionName(e.target.value);
            }}
            select
            label="X-Axis Table"
          >
            {xAxisCollectionList.length > 0 &&
              xAxisCollectionList.map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
          </TextField>
          <TextField
            value={xAxisLabelName}
            onChange={(e) => {
              setXAxisLabelName(e.target.value);
            }}
            select
            label="X-Axis Label"
          >
            {xAxisLabelList.length > 0 &&
              xAxisLabelList.map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
          </TextField>
          <div className="y-axis-parameters">
            {yAxisLabelObjList.length > 0 &&
              xAxisCollectionList.length > 0 &&
              yAxisLabelObjList.length > 0 &&
              yAxisLabelObjList.map((item, index) => {
                return (
                  <YAxisParameters
                    id={index}
                    setIsLoading={setIsLoading}
                    collectionList={yAxisCollectionList}
                    yAxisLabelObjList={yAxisLabelObjList}
                    setYAxisLabelObjList={setYAxisLabelObjList}
                    aggregationList={aggregationList}
                  />
                );
              })}
          </div>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<TimelineIcon />}
            onClick={generateQuery}
          >
            Generate
          </Button>
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
                  <Line type="monotone" dataKey="sum" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            )}
        </TabPanel>
      </div>
    </div>
  );
}

export default Charts;
