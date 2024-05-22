import React from "react";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
function HomeBtn() {
  return (
    <div>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", borderRadius: 10 }}>
        <Button>Button</Button>
      </Box>
    </div>
  );
}

export default HomeBtn;
