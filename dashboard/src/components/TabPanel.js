import { Typography } from "@mui/material";

function TabPanel(props) {
  return (
    <div hidden={props.value !== props.index} className="tab-panel">
      {props.value === props.index && (
        <Typography component={"span"}>{props.children}</Typography>
      )}
    </div>
  );
}

export default TabPanel;
