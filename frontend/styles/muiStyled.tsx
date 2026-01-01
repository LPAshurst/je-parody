import { Button, TextField, IconButton, Menu, InputBase, Popper, type PopperProps } from '@mui/material';
import { alpha, styled } from "@mui/material/styles";

export const UserButton = styled(IconButton)({
  // marginLeft: "auto",
  marginTop: ".5rem",
  backgroundColor: "#2a3236",
  color: "white",
  "&:hover": {
    boxShadow: "0 0 0 3px #dbdfeeff",
    backgroundColor: "#3a4347",
  },
  "&:focus-visible": {
    outline: "none",
    boxShadow: "0 0 0 3px #7c9aff, 0 0 0 6px rgba(124,154,255,.25)",
  },
});


export const DarkTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    backgroundColor: "#2a2326",
    borderRadius: "15px",
  },
  "& fieldset": {
    border: "none",
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "#aaa",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
  },
  "& .MuiInputLabel-asterisk": {
    color: "red",
  },
  width: "100%"
});

export const LoginButton = styled(Button)(({theme}) => ({
  
    width: "100%", // mobile default
    backgroundColor: "#850e0eff",
    [theme.breakpoints.up("sm")]: {
      width: "15rem", // fixed width on tablets+
    },
    borderRadius: "20rem",
    "&.Mui-disabled": {
      backgroundColor: "#FFFFFF0C", 
      color: "#eef1f32c",           
    },
    "&:hover": {
      backgroundColor: "#850e0eff", // your hover color
      border: "none",             // remove border effect
    },
    "&:focus": {
      outline: "none",            // removes focus ring
    },
    color: "#EEF1F3",
    transition: "none", // get rid of this later if i want transitions
    
    
}));


export const SearchComponent = styled('div')(({ theme }) => ({
  borderRadius: "1.75rem",
  marginTop: ".5rem",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));


export const StyledInputBase = styled(TextField)(({ theme }) => ({
  color: 'inherit',
  "& fieldset": {
    border: "none"
  },
  '& .MuiInputBase-input::placeholder': {
    fontSize: "0.875rem",
    color: "#aaa",
    fontStyle: "italic",
  },
  '& .MuiInputBase-input': {
    fontSize: "0.875rem",
    width: "30ch"
  },

}));



export const StyledMenu = styled(Menu)(({theme}) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    minWidth: "15rem",
    color: '#DBE4E9',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    
    backgroundColor: "#181c1fc2",

    '& .MuiMenu-list': {
      padding: '4px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: ".5rem",
      marginTop: ".5rem",
      marginBottom: ".5rem",
      paddingInlineStart: ".1rem",

    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
        ...theme.applyStyles('dark', {
          color: 'inherit',
        }),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));

const WidthSyncedPopper = (props: PopperProps) => {
  const { anchorEl, style, ...other } = props;
  if (anchorEl) {
  console.log(anchorEl)
  }
  const width =
    anchorEl instanceof HTMLElement ? anchorEl.clientWidth : undefined;

  return (
    <Popper
      {...other}
      anchorEl={anchorEl}
      style={{ ...style, width: "60ch" }}
    />
  );
};

export const StyledPopper = styled(WidthSyncedPopper)(({ theme }) => ({
  "& .MuiPaper-root": {
    // 🔑 Slide up so it “attaches” to the search bar
    marginTop: -2,
    // 🔑 Square top corners, rounded bottom corners
    borderRadius: ".75rem",
    backgroundColor: "#181c1f",
    color: "#fff",
    boxShadow: theme.shadows[4],
  },
}));