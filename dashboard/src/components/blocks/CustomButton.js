import { Button, Tooltip } from "@mui/material";

function CustomButton({ copyText, displayText, titleText }) {
  return (
    <Tooltip title={titleText + " : " + `${copyText}`}>
      <Button
        onClick={() => {
          navigator.clipboard.writeText(copyText);
          console.log("Copied:", copyText);
        }}
        variant="secondary"
        style={{
          textTransform: "unset",
          width: "100%",
          height: "100%",
        }}
      >
        {/* {displayText + (displayText.substring(0, 25).length > 20 ? "..." : "")} */}
        {displayText}
      </Button>
    </Tooltip>
  );
}

export default CustomButton;
