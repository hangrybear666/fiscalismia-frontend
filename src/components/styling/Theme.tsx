import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { palette } from './PaletteAndColors';
import { localStorageKeys } from '../../resources/resource_properties';
import React from 'react';

export const contentMaxWidth = '1680px';

type CustomThemeProviderProps = {
  children: React.ReactNode;
};

// Augment the palette to include an ochre color
declare module '@mui/material/styles' {
  interface Palette {
    menu: Palette['primary'];
    tertiary: Palette['primary'];
    header: Palette['primary'];
    border: Palette['primary'];
  }

  interface PaletteOptions {
    menu?: PaletteOptions['primary'];
    tertiary?: PaletteOptions['primary'];
    header?: PaletteOptions['primary'];
    border?: PaletteOptions['primary'];
  }
}

/**
 * Customized Material UI theme, taking palette, mode dark | light (chosen by the user and persisted in user settings) into consideration.
 * Custom breakpoints for responsive design. Custom border, header, menu colors. Custom Typography. And more
 * @param root0
 * @param {CustomThemeProviderProps} root0.children
 * @returns
 */
export default function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const userColorMode = window.localStorage.getItem(localStorageKeys.selectedMode);
  const userPalette = window.localStorage.getItem(localStorageKeys.selectedPalette);

  const selectedPaletteStr = userPalette ? userPalette : 'default';
  const selectedMode = userColorMode ? userColorMode : 'light';
  const paletteKey = `${selectedPaletteStr}${selectedMode}`;
  const selectedPalette = palette.get(paletteKey);

  let theme = createTheme({
    palette: {
      mode: selectedMode,
      ...selectedPalette
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 700,
        md: 1000,
        lg: 1300,
        xl: 1680
      }
    },
    typography: {
      h5: {
        fontWeight: 500,
        fontSize: 26,
        letterSpacing: 0.5
      }
    },
    shape: {
      borderRadius: 8
    },
    components: {
      MuiTab: {
        defaultProps: {
          disableRipple: true
        }
      }
    },
    mixins: {
      toolbar: {
        minHeight: 48
      }
    }
  });

  theme = createTheme(theme, {
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: theme.palette.menu.main
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.header.main
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none'
          },
          contained: {
            boxShadow: 'none',
            '&:active': {
              boxShadow: 'none'
            }
          }
        }
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            marginLeft: theme.spacing(1)
          },
          indicator: {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            backgroundColor: theme.palette.common.white
          }
        }
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
              minWidth: 0
            }
          }
        }
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 0,
            '&:last-child': {
              paddingBottom: '0px'
            }
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: theme.spacing(1)
          }
        }
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 4
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: selectedMode == 'light' ? 'rgb(255,255,255,0.6)' : 'rgb(232,232,232,0.4)',
            borderColor: selectedMode == 'light' ? 'rgba(128,128,128,0.6)' : 'rgba(128,128,128,0.4)'
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 0
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 0
          }
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: '#4fc3f7'
            }
          }
        }
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: 14,
            fontWeight: theme.typography.fontWeightMedium
          }
        }
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'inherit',
            minWidth: 'auto',
            marginRight: theme.spacing(2),
            '& svg': {
              fontSize: 20
            }
          }
        }
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            width: 32,
            height: 32
          }
        }
      }
    }
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
