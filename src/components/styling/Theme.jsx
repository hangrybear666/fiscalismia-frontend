
import { createTheme } from '@mui/material/styles';

export const contentBackgroundColor = '#eaeff1';
export const contentMaxWidth = '1620px';
const menuBgColor = '#081627' // Default
const headerBgColor = '#012731' // Daintree
/**
 * '#313026' // Dark Olive Night
 * '#012731' // Daintree
 * '#2a2f23' // Pine Tree
 */

export let theme = createTheme({
    palette: {
      primary: {
        light: '#63ccff',
        main: '#183863',
        dark: '#006db3',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 700,
        md: 1000,
        lg: 1300,
        xl: 1600,
      },
    },
    typography: {
      h5: {
        fontWeight: 500,
        fontSize: 26,
        letterSpacing: 0.5,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiTab: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
    mixins: {
      toolbar: {
        minHeight: 48,
      },
    },
  });

  theme = {
    ...theme,
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: menuBgColor,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: headerBgColor,
          },
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
          contained: {
            boxShadow: 'none',
            '&:active': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            marginLeft: theme.spacing(1),
          },
          indicator: {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            backgroundColor: theme.palette.common.white,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            margin: '0 16px',
            minWidth: 0,
            padding: 0,
            [theme.breakpoints.up('md')]: {
              padding: 0,
              minWidth: 0,
            },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 0,
            "&:last-child": {
              paddingBottom: '0px',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: theme.spacing(1),
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 4,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgb(255,255,255,0.5)',
            borderColor:'rgba(128,128,128,0.5)',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius:0,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius:0,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: '#4fc3f7',
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: 14,
            fontWeight: theme.typography.fontWeightMedium,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'inherit',
            minWidth: 'auto',
            marginRight: theme.spacing(2),
            '& svg': {
              fontSize: 20,
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            width: 32,
            height: 32,
          },
        },
      },
    },
  };
