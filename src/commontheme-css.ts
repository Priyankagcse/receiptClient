import { createMuiTheme, createTheme, makeStyles } from "@material-ui/core";

export const theme = createTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
});

export const typographyTheme = createTheme({
    typography: {
        h6: {
            fontSize: "16px"
        }
    }
});

export const buttonViewTheme = createMuiTheme({
    overrides: {
        MuiButton: {
            startIcon: {
                marginLeft: '1px',
                marginRight: '1px'
            }
        }
    }
});

export const listStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    }
}));