import React from 'react';

import {ToolbarPopupRoot} from '../ui/popup-content/components/ToolbarPopupRoot/ToolbarPopupRoot';

import {renderRootComponent} from '../ui/page-content/components/RootContainer/RootContainer';
import {I18nService} from '../services/i18n.service';
import {ThemeService} from '../services/theme.service';

import '../styles/toolbar-popup.scss';

I18nService.defaultLocale = 'ru';
ThemeService.create().updateCurrentTheme('dark');

renderRootComponent(
    document.getElementById('react-popup-root'),
    <ToolbarPopupRoot></ToolbarPopupRoot>,
    {isContentCloseable: false}
);
