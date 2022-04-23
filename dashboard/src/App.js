// https://reactjsexample.com/a-developer-friendly-library-for-creating-flowcharts-and-diagrams/

import Patient from "./components/Patient";
import TabPanel from "./components/TabPanel";
import Loading from "./components/Loading";

import { useState, useEffect } from "react";
import { Tabs, Tab, AppBar } from "@mui/material";
import Charts from "./components/Charts";

function App() {
  const [currentTabValue, setCurrentTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([
    "Start typing",
  ]);

  // IsLoading(setIsLoading)

  const TabComponent = (
    <AppBar
      position="static"
      style={{
        backgroundColor: "#84ad94",
      }}
    >
      <Tabs value={currentTabValue} onChange={handleTabs}>
        <Tab label="Patient Timeline" />
        <Tab label="Charts" />
      </Tabs>
    </AppBar>
  );

  function handleTabs(e, index) {
    setCurrentTabValue(index);
  }

  return (
    <div className="App">
      <div className="main">
        <Loading isLoading={isLoading} />
        {TabComponent}
        <TabPanel value={currentTabValue} index={0}>
          <Patient
            setIsLoading={setIsLoading}
            autoCompleteOptions={autoCompleteOptions}
            setAutoCompleteOptions={setAutoCompleteOptions}
          />
        </TabPanel>
        <TabPanel value={currentTabValue} index={1}>
          <Charts setIsLoading={setIsLoading}/>
        </TabPanel>
      </div>
    </div>
  );
}

export default App;
