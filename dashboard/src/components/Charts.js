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
  purple,
  green,
  cyan,
  blue,
  red,
  pink,
  grey,
  indigo,
  deepOrange,
  deepPurple,
} from "@mui/material/colors";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  ComposedChart,
  Tooltip,
  Area,
  Legend,
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

  // Charts variables
  const chartTypes = ["Line", "Bar", "Area"];
  const chartColors = {
    purple: purple[500],
    green: green[500],
    cyan: cyan[500],
    blue: blue[500],
    red: red[500],
    pink: pink[500],
    grey: grey[500],
    indigo: indigo[500],
    deepOrange: deepOrange[500],
    deepPurple: deepPurple[500],
  };

  const [chartSelection, setChartSelection] = useState([
    {
      type: "Line",
      color: "purple",
      chart: null,
    },
  ]);

  function getChartShape(shapeType="Line", dataKey, color="purple") {
    const chartShapeComponent = {
      Line: <Line dataKey={dataKey} fill={color} />,
      Bar: <Bar dataKey={dataKey} fill={color} />,
      Area: <Area dataKey={dataKey} fill={color} />,
    };
    return chartShapeComponent[shapeType];
  }

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
        $limit: 200,
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
      aggregateQueryList.push([
        lookupObj,
        projectObj,
        limitObj,
        unwindObj,
        groupObj,
      ]);
    });
    console.log(aggregateQueryList);
    console.log(xAxisCollectionName);

    const results = await Promise.all(
      aggregateQueryList.map(async (aggregateQuery) => {
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
        return output;
      })
    );
    setCurrentResults(results);
  }

  useEffect(() => {
    setIsLoading(true);
    console.log(currentResults);
    var columnNames = currentResults
      .map((result) => {
        return [...Object.keys(result[0]).filter((item) => item !== "_id")];
      })
      .flat();
    columnNames = [xAxisLabelName, ...columnNames];
    console.log(columnNames);

    setColumns(
      columnNames.map((columnName) => {
        return {
          field: columnName,
          headerName: columnName,
          flex: 1,
        };
      })
    );

    // Get all unique _id (x-axis values)
    var idArray = currentResults
      .map((result) => {
        return result.map((row) => {
          return row["_id"];
        });
      })
      .flat();
    idArray = [...new Set(idArray)];
    console.log(idArray);

    // Create rows
    var currentResultsFlat = currentResults.flat();
    console.log(currentResultsFlat);
    setRows(
      idArray.map((ID, index) => {
        var obj = {
          id: index,
        };
        currentResultsFlat.forEach((result) => {
          if (result["_id"] === ID) {
            Object.keys(result)
              .filter((key) => key !== "_id")
              .forEach((key) => {
                obj[key] = result[key];
              });
            obj[xAxisLabelName] = result["_id"];
          }
        });
        return obj;
      }).sort((item1, item2) => {
        if(item1[xAxisLabelName] < item2[xAxisLabelName]) return -1
        if(item1[xAxisLabelName] > item2[xAxisLabelName]) return 1
        return 0
      })
    );
    setIsLoading(false);
  }, [currentResults]);

  useEffect(() => {
    if (columns.length > 1) {
      setChartSelection(
        Array(
          columns.filter((columnObj) => columnObj["field"] !== xAxisLabelName)
            .length
        ).fill({
          type: "Line",
          color: "purple",
          chart: null,
        })
      );
    }
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
          style={{
            display: currentVizTab === 0 ? "flex" : "none",
          }}
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

        {columns.length > 1 &&
          columns
            .filter((columnObj) => columnObj["field"] !== xAxisLabelName)
            .map((columnObj, columnIndex) => {
              return (
                <Stack
                  direction="column"
                  spacing={2}
                  divider={<Divider orientation="horizontal" flexItem />}
                  width="100%"
                  style={{
                    display: currentVizTab === 1 ? "flex" : "none",
                    overflow: "auto",
                  }}
                >
                  <Stack direction="column" spacing={2} width="100%">
                    <TextField
                      onChange={(e) => {
                        // Setting chart type
                        setChartSelection(
                          chartSelection.map((obj, chartSelectionObjIndex) => {
                            if (chartSelectionObjIndex === columnIndex) {
                              return {
                                type: e.target.value,
                                chart: getChartShape(
                                  e.target.value,
                                  columnObj["field"],
                                  obj["color"]
                                ),
                                color: obj["color"],
                              };
                            } else {
                              return obj;
                            }
                          })
                        );
                      }}
                      select
                      label={columnObj["field"]}
                      value={
                        chartSelection[columnIndex] !== undefined
                          ? chartSelection[columnIndex]["type"]
                          : ""
                      }
                      style={{
                        paddingTop: "10px",
                        paddingBottom: "10px"
                      }}
                    >
                      {chartTypes.length > 0 &&
                        chartTypes.map((type) => {
                          return (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          );
                        })}
                    </TextField>
                    <TextField
                      onChange={(e) => {
                        // Setting chart color
                        setChartSelection(
                          chartSelection.map((obj, chartSelectionObjIndex) => {
                            if (chartSelectionObjIndex === columnIndex) {
                              return {
                                type: obj["type"],
                                chart: getChartShape(
                                  obj["type"],
                                  columnObj["field"],
                                  chartColors[e.target.value]
                                ),
                                color: e.target.value,
                              };
                            } else {
                              return obj;
                            }
                          })
                        );
                      }}
                      select
                      label={columnObj["field"]}
                      value={
                        chartSelection[columnIndex] !== undefined
                          ? chartSelection[columnIndex]["color"]
                          : ""
                      }
                      defaultValue="purple"
                      style={{
                        paddingTop: "10px",
                        paddingBottom: "10px"
                      }}
                    >
                      {Object.keys(chartColors).map((colorName) => {
                        return (
                          <MenuItem
                            key={colorName}
                            value={colorName}
                          >
                            {colorName}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Stack>
                </Stack>
              );
            })}
      </div>
      <div className="viz">
        {VizTabComponent}
        <TabPanel value={currentVizTab} index={0}>
          {columns.length > 0 && rows.length > 0 && (
            <DataGrid
              rows={rows}
              columns={columns}
              style={{
                padding: "20px",
              }}
            />
          )}
        </TabPanel>
        <TabPanel value={currentVizTab} index={1}>
          {currentResults !== null &&
            currentResults !== undefined &&
            currentResults.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  width={500}
                  height={300}
                  data={rows}
                  margin={{
                    top: 50,
                    bottom: 50,
                  }}
                >
                  <XAxis dataKey={xAxisLabelName} />
                  <YAxis />
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    // legendType="wye"
                    align="center"
                    verticalAlign="top"
                    formatter={(value, entry) => {
                      const { color } = entry;
                      return <span style={{ color }}>{value}</span>
                    }}
                  />
                  <CartesianGrid stroke="#f5f5f5" strokeDasharray="5 5" />
                  {chartSelection.map((selectionObj) => {
                    return(selectionObj["chart"])
                  })}
                </ComposedChart>
              </ResponsiveContainer>
            )}
        </TabPanel>
      </div>
    </div>
  );
}

export default Charts;
