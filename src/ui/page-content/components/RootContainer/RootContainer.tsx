import React from 'react';
import ReactDOM from 'react-dom';
import {Theme, ThemeProvider} from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import {LoadingSpinner} from '../LoadingSpinner/LoadingSpinner';
import {ClosePopupButton} from '../ClosePopupButton/ClosePopupButton';
import {PreAuthScreen} from '../PreAuthScreen/PreAuthScreeen';
import {MessageWithButton} from '../MessageWithButton/MessageWithButton';
import {ThemeChangeListener} from '../ThemeChangeListener/ThemeChangeListener';

import {Bind} from '../../decorators/Bind.decorator';
import {createRootContext, IRootContext, initRuntimeRootContext} from '../../context/RootContext';
import {createRootTheme} from '../../context/RootTheme';
import {ThemeService} from '../../../../services/theme.service';
import {GeneralErrorType} from '../../../../interfaces/general';

import './RootContainer.scss';

const RootContext = createRootContext();

interface IRootContainerProps {
    isContentCloseable: boolean;
}

interface IRootContainerState {
    isAuthorized: boolean;
    isRootContextLoaded: boolean;
    rootContext: IRootContext;
    rootTheme: Theme;
    currentError: string;
}

let PreMountError: string = null;

class RootContainer extends React.Component<IRootContainerProps, IRootContainerState> {
    private rootContext: IRootContext = {} as IRootContext;
    private mounted: boolean;
    private messagingSubId: number;
    private authChangeCallback = (() => {
        this.setState({
            isAuthorized: this.state.rootContext.YoutubeAuth.isAuthorized()
        });
    }).bind(this);

    constructor (props) {
        super(props);

        this.state = {
            isAuthorized: false,
            isRootContextLoaded: false,
            rootContext: this.rootContext,
            rootTheme: createRootTheme(ThemeService.create().getCurrentTheme()),
            currentError: PreMountError
        };

        if (PreMountError) {
            PreMountError = null;
        }

        initRuntimeRootContext().then((context) => {
            this.rootContext = {...context};

            this.setState({
                isAuthorized: context.YoutubeAuth.isAuthorized(),
                isRootContextLoaded: true,
                rootContext: this.rootContext
            });

            this.rootContext.YoutubeAuth.subscribeToAuthChange(this.authChangeCallback);
            this.messagingSubId = this.rootContext.ChromeMessaging.subscribeToErrors((errorType: GeneralErrorType) => {
                if (this.mounted) {
                    this.setState({currentError: errorType});
                }
                else {
                    PreMountError = errorType;
                }
            });
        });
    }

    @Bind
    updateRootTheme (currentTheme: 'dark' | 'light') {
        this.setState({
            rootTheme: createRootTheme(currentTheme)
        });
    }

    @Bind
    handleSuccessAuth () {
        this.setState({
            isAuthorized: true
        });
    }

    @Bind
    handleCloseList () {
        this.rootContext.DislikedVideosPopup.closePopup();
    }

    componentDidMount () {
        this.mounted = true;
        if (PreMountError) {
            this.setState({
                currentError: PreMountError
            });
            PreMountError = null;
        }
    }

    componentWillUnmount () {
        this.mounted = false;
        PreMountError = null;
        if (this.rootContext.YoutubeAuth) {
            this.rootContext.YoutubeAuth.unsubscribeFromAuthChange(this.authChangeCallback);
        }
        if (this.messagingSubId) {
            this.rootContext.ChromeMessaging.unsubscribe(this.messagingSubId);
        }
    }

    render () {
        let content;
        let isCentered = true;
        if (this.state.isRootContextLoaded) {
            const YoutubeAuth = this.state.rootContext.YoutubeAuth;
            const I18n = this.rootContext.I18n;

            if (this.state.currentError) {
                content = <MessageWithButton message={I18n.getMessage(`${this.state.currentError}Error`)}></MessageWithButton>;
            }
            else {
                if (YoutubeAuth.isAuthorized()) {
                    content = this.props.children;
                    isCentered = false;
                }
                else {
                    content = <PreAuthScreen onSuccessAuth={this.handleSuccessAuth}></PreAuthScreen>;
                }
            }
        }
        else {
            content = <LoadingSpinner/>
        }

        return (
            <RootContext.Provider value={this.state.rootContext}>
                <ThemeProvider theme={this.state.rootTheme}>
                    <ClickAwayListener mouseEvent={this.props.isContentCloseable ? 'onClick' : false} onClickAway={this.handleCloseList}>
                        <div className={`react-root-disliked-list-container ${isCentered ? 'centered' : ''}`}>
                            {this.props.isContentCloseable && <ClosePopupButton onClose={this.handleCloseList}></ClosePopupButton>}
                            {content}
                        </div>
                    </ClickAwayListener>

                    <ThemeChangeListener onThemeChange={this.updateRootTheme}></ThemeChangeListener>
                </ThemeProvider>
            </RootContext.Provider>
        );
    }
}

export function renderRootComponent (insertionPoint: Element, mainContent:React.ReactNode, isCloseable?: boolean) {
    ReactDOM.render(
        mainContent ?
            <RootContainer isContentCloseable={isCloseable}>
                {mainContent}
            </RootContainer>
            : null,
        insertionPoint
    )
}
