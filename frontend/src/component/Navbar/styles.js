import { makeStyles } from "@mui/styles";

const drawerWidth = 250;
export default makeStyles((theme) => ({
  profile: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  toolbar: {
    height: "80px",
    display: " flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "240px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0",
      flexWrap: "wrap",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  drawerPaper: {
    width: drawerWidth,
  },
  linkButton: {
    "&:hover": {
      color: "white !important",
      textDecoration: "none",
    },
  },
}));
