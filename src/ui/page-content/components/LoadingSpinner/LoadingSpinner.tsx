import React from 'react';
import Loader from 'react-loader-spinner';

import {RootContextType, IRootContext, createRootContext} from '../../context/RootContext';

interface ILoadingSpinnerProps {
    type: string;
    width: number;
    height: number;
    color?: string;
}

export class LoadingSpinner extends React.Component<ILoadingSpinnerProps> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;
    public static defaultProps: ILoadingSpinnerProps = {
        type: 'Rings',
        width: 300,
        height: 300
    };

    render() {
        let color = this.props.color;
        if (!color) {
            color = this.context.Theme.getCurrentTheme() === 'light' ? 'black' : 'white';
        }

        return (
            <Loader type={this.props.type}
                    color={color}
                    width={this.props.width}
                    height={this.props.height}
            />
        );
    }
}
