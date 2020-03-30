export class ThemeService {
    private currentThemeMode: 'light' | 'dark';

    private static instance: ThemeService; 

    private constructor () {
        this.updateCurrentTheme();
    }

    public getCurrentTheme () {
        return this.currentThemeMode;
    }

    public updateCurrentTheme (theme?: 'light' | 'dark') {
        this.currentThemeMode = theme || (document.documentElement.getAttribute('dark') ? 'dark' : 'light');
    }

    public static create () {
        if (!ThemeService.instance) {
            ThemeService.instance = new ThemeService();
        }
        return ThemeService.instance;
    }
}
