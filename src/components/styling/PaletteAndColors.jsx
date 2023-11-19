
export const contentBackgroundColor = '#eaeff1';
export const menuBgColor = '#081627' // Default
export const headerBgColor = '#012731' // Daintree
/**
 * '#313026' // Dark Olive Night
 * '#012731' // Daintree
 * '#2a2f23' // Pine Tree
 */

export const palette = new Map();
palette.set(
  "defaultlight",
  {
    primary: {
      main: '#183863',
    },
    secondary: {
      main: '#bd9fc2',
    },
    info: {
      main: '#29b6f6',
    },
    success: {
      main: '#66bb6a',
    },
    warning: {
      main: '#ffa726',
    },
    error: {
      main: '#f44336',
    },
  }
)
palette.set(
  "defaultdark",
  {
    primary: {
      light: '#aed581',
      main: '#eeeeee',
      dark: '#689f38',
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    secondary: {
      light: '#d3bcd6',
      main: '#bd9fc2',
      dark: '#68456e',
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    info: {
      light: "#4fc3f7",
      main: "#29b6f6",
      dark: "#0288d1",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
})
palette.set(
  "pastellight",
  {
    primary: {
      main: '#ede6db',
    },
    secondary: {
      main: '#8fbdd3',
    },
    info: {
      main: '#a2b38b',
    },
    success: {
      main: '#e9d5da',
    },
    warning: {
      main: '#FAFFC7',
    },
    error: {
      main: '#9d5353',
    },
  }
)
palette.set(
  "pasteldark",
  {
    primary: {
      main: '#CCF1FF',
    },
    secondary: {
      main: '#E0D7FF',
    },
    info: {
      main: '#FFCCE1',
    },
    success: {
      main: '#D7EEFF',
    },
    warning: {
      main: '#FAFFC7',
    },
    error: {
      main: '#FFDFD3',
    },
  }
)