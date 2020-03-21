import React from 'react';

import {DislikedVideoSliderItem} from '../DislikedVideoSliderItem/DislikedVideoSliderItem';

import {IYoutubeVideo} from '../../../../../interfaces/video';

import './DislikedVideosSlider.scss';

interface IDislikedVideosSliderProps {
    videos: IYoutubeVideo[];
}

export class DislikedVideosSlider extends React.Component<IDislikedVideosSliderProps> {
    render () {
        let videos = [];
        this.props.videos.forEach((video) => {
            videos.push(<DislikedVideoSliderItem></DislikedVideoSliderItem>);
        });

        return (
            <div className='disliked-videos-slider'>
                {videos}
            </div>
        );
    }
}
