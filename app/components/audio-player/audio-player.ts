// Copyright (c) 2016 Tracktunes Inc

import {Component, Input, OnChanges, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
import {msec2time} from '../../providers/utils/utils';


/**
 * @name AudioPlayer
 * @description
 * An LED lights display. LEDs are displayed either dark (off) or lit up
 * (on), depending on where 'value' is in the interval ['min', 'max'].
 */
@Component({
    selector: 'audio-player',
    templateUrl: 'build/components/audio-player/audio-player.html',
    directives: [IONIC_DIRECTIVES]
})
export class AudioPlayer implements OnChanges {
    @Input() private title: string = '';
    @Input() private url: string = '';
    private time: string = '0:00';
    private duration: string = '0:00';
    private hidden: boolean = true;
    private playPauseButtonIcon: string = 'play';
    private audioElement: HTMLAudioElement;

    constructor() {
        console.log('constructor():AudioPlayer');
    }

    ngOnInit() {
        this.audioElement = <HTMLAudioElement>(
            document.getElementById('audio-player-audio-tag')
        );
/*
        this.audioElement.addEventListener('ended', () => {
            console.log('AUDIO ENDED');
            this.onAudioEnded();
        });
        */
    }

    getCurrentTime() {
        setTimeout(() => {
            if (this.audioElement) {
                this.time = msec2time(this.audioElement.currentTime * 1000.0);
            }
            else {
                this.time = '0:00';
            }
        }, 0);
        return this.time;
    }

    onAudioEnded() {
        this.playPauseButtonIcon = 'play';
    }

    show() {
        this.hidden = false;
    }

    hide() {
        this.hidden = true;
    }

    play() {
        this.audioElement.play();
        console.log('audioElement.duration: ' + this.audioElement.duration);

        this.playPauseButtonIcon = 'pause';
    }

    pause() {
        this.audioElement.pause();
        this.playPauseButtonIcon = 'play';
    }

    onClickPlayPauseButton() {
        console.log('onClickPlayPauseButton()');

        if (this.playPauseButtonIcon === 'play') {
            this.play();
        }
        else {
            this.pause();
        }
    }

    onClickCloseButton() {
        // next line is the trick discussed here
        // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/ ...
        //     ... Using_HTML5_audio_and_video
        this.url = '';
        this.audioElement.src = '';
        this.hide();
    }

    ngOnChanges(changeRecord: { [propertyName: string]: SimpleChange }) {
        if (changeRecord['title']) {
            console.log('AudioPlayer:ngOnChanges(): title: ' + this.title);
            if (this.title !== undefined) {
                this.show();
            }
        }
        if (changeRecord['url']) {
            console.log('AudioPlayer:ngOnChanges(): url: ' + this.url);
            if (this.url !== undefined) {
                this.audioElement.addEventListener('canplay', () => {
                    this.play();
                });
            }
        }
    }
}