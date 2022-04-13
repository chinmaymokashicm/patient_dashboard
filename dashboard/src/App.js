// https://reactjsexample.com/a-developer-friendly-library-for-creating-flowcharts-and-diagrams/

import Patient from "./components/Patient";
import TabPanel from "./components/TabPanel";

import { useState } from "react";
import { Tabs, Tab, AppBar } from "@mui/material";
import Query from "./components/Query";

function App() {
  const [currentTabValue, setCurrentTabValue] = useState(0);

  const TabComponent = (
    <AppBar
      position="static"
      style={{
        backgroundColor: "#84ad94",
      }}
    >
      <Tabs value={currentTabValue} onChange={handleTabs}>
        <Tab label="Patient" />
        <Tab label="Query Builder" />
      </Tabs>
    </AppBar>
  );

  function handleTabs(e, index) {
    setCurrentTabValue(index);
  }

  return (
    <div className="App">
      <div className="main">
        {TabComponent}
        <TabPanel value={currentTabValue} index={0}>
          <Patient />
        </TabPanel>
        <TabPanel value={currentTabValue} index={1}>
          <Query />
        </TabPanel>
      </div>
    </div>
  );
}

export default App;
