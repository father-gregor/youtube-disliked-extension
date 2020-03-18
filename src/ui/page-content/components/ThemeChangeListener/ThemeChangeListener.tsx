import React from 'react';
import {IRootContext, createRootContext, RootContextType} from '../RootContainer/RootContext';

export class ThemeChangeListener extends React.Component<{onThemeChange: (string) => void}> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;
    private themeObserver: MutationObserver;

    constructor (props) {
        super(props);

        this.observeThemeModeChange();
    }

    componentWillUnmount () {
        if (this.themeObserver) {
            this.themeObserver.disconnect();
        }
    }

    render () {
        return (<section></section>);
    }

    private handleCurrentThemeModeChange () {
        this.context.DislikedVideosPopup.updateCurrentThemeMode();
        this.props.onThemeChange(this.context.DislikedVideosPopup.getCurrentThemeMode());
    }

    private observeThemeModeChange () {
        const targetNode = document.documentElement;
        const config = {attributes: true};

        const observerCallback = (mutationsList: MutationRecord[]) => {
            for (let mutation of mutationsList.filter((m) => m.type === 'attributes')) {
                if (mutation.attributeName === 'dark') {
                    this.handleCurrentThemeModeChange();
                }
            }
        };
        this.themeObserver = new MutationObserver(observerCallback);
        this.themeObserver.observe(targetNode, config);
    }
}