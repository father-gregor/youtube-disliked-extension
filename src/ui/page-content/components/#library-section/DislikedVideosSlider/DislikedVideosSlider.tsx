import React from 'react';

import {DislikedVideoSliderItem} from '../DislikedVideoSliderItem/DislikedVideoSliderItem';

import {IYoutubeVideo} from '../../../../../interfaces/video';

import './DislikedVideosSlider.scss';

interface IDislikedVideosSliderProps {
    videos: IYoutubeVideo[];
}

export class DislikedVideosSlider extends React.Component<IDislikedVideosSliderProps> {
    private getCurrentWidth () {
        return Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
    }

    render () {
        let videos = [];
        let currentWidth = this.getCurrentWidth();
        let videosCount: number;

        if (currentWidth > 1650) {
            videosCount = 5;
        }
        else if (currentWidth > 1200) {
            videosCount = 4
        }
        else {
            videosCount = 3;
        }

        this.props.videos.slice(0, videosCount).forEach((video) => {
            videos.push(<DislikedVideoSliderItem key={video.id} video={video}></DislikedVideoSliderItem>);
        });

        return (
            <div className='disliked-videos-slider'>
                {videos}
            </div>
        );
    }
}
