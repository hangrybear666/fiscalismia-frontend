
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { menuBgColor, headerBgColor, palette } from './PaletteAndColors';
import { localStorageKeys } from '../../resources/resource_properties';

export const contentMaxWidth = '1680px';

export default function CustomThemeProvider({ children }) {

  const userColorMode = window.localStorage.getItem(localStorageKeys.selectedMode)
  const userPalette = window.localStorage.getItem(localStorageKeys.selectedPalette)

  const selectedPaletteStr = userPalette ? userPalette : 'default'
  const selectedMode = userColorMode ? userColorMode : 'light'
  const paletteKey = `${selectedPaletteStr}${selectedMode}`
  const selectedPalette = palette.get(paletteKey)

  let theme = createTheme({
    palette: {
      mode: selectedMode,
      ...selectedPalette,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 700,
        md: 1000,
        lg: 1300,
        xl: 1680,
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
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

