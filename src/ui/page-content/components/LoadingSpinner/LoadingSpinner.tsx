import React from 'react';
import Loader from 'react-loader-spinner';

interface ILoadingSpinnerProps {
    type: string;
    width: number;
    height: number;
    color?: string;
}

export class LoadingSpinner extends React.Component<ILoadingSpinnerProps> {
    public static defaultProps: ILoadingSpinnerProps = {
        type: 'Rings',
        width: 300,
        height: 300
    };

    render() {
        let color = this.props.color;
        if (!color) {
            color = getComputedStyle(document.documentElement).getPropertyValue('--yt-spec-text-primary');
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
