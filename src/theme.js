import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#334155',
            light: '#475569',
            dark: '#1E293B',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#64748B',
            light: '#94A3B8',
            dark: '#475569',
        },
        error: {
            main: '#EF4444',
            light: '#FEE2E2',
        },
        success: {
            main: '#059669',
            light: '#D1FAE5',
        },
        warning: {
            main: '#D97706',
            light: '#FEF3C7',
        },
        background: {
            default: '#F1F5F9',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#0F172A',
            secondary: '#64748B',
        },
        divider: '#E2E8F0',
    },
    typography: {
        fontFamily: '"Poppins", sans-serif',

        h4: {
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#0F172A',
        },
        h5: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: '#0F172A',
        },
        h6: {
            fontWeight: 600,
            color: '#334155',
        },
        subtitle1: {
            fontWeight: 500,
            color: '#334155',
        },
        body1: {
            fontSize: '0.9rem',
            color: '#334155',
        },
        body2: {
            fontSize: '0.8rem',
            color: '#64748B',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '0.02em',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    transition: 'all 0.2s ease-in-out',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(51, 65, 85, 0.15)',
                        backgroundColor: '#475569',
                    },
                    '&:active': {
                        boxShadow: 'none',
                    }
                },
                outlined: {
                    borderColor: '#E2E8F0',
                    '&:hover': {
                        borderColor: '#334155',
                        backgroundColor: '#F8FAFC',
                    }
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: '1px solid #E2E8F0',
                    boxShadow: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        fontWeight: 600,
                        color: '#64748B',
                        backgroundColor: '#F8FAFC',
                    }
                }
            }
        }
    },
});

export default theme;