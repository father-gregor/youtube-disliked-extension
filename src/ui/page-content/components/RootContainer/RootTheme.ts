import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import grey from '@material-ui/core/colors/grey';

let theme;

export function createRootTheme (mode: 'dark' | 'light') {
    theme = createMuiTheme({
        palette: {
            type: mode,
            primary: {
                main: grey[900]
            }
        }
    });
    return theme;
}