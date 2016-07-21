// Copyright (c) 2016 Tracktunes Inc

import {
    Component,
    Input,
    Output,
    ElementRef,
    Renderer,
    EventEmitter
} from '@angular/core';

import {
    Range,
    Form,
    Item
} from 'ionic-angular';

/**
 * @name ProgressSlider
 * @description
 * A progress bar that can be clicked to change the progress location,
 * such as the one used in the youtube or other video or audio players
 * to control and visualize media playback.
 */
@Component({
    selector: 'progress-slider',
    templateUrl: 'build/directives/progress-slider/progress-slider.html'
})
export class ProgressSlider {
    @Input() private progress: number;
    @Output() private change: EventEmitter<any>;
    @Output() private changeEnd: EventEmitter<any>;

    private element: ElementRef;
    private renderer: Renderer;

    private trackWidthRange: { start: number, end: number };
    private mouseUpListener: Function;
    private mouseMoveListener: Function;

    constructor(element: ElementRef, form: Form, renderer: Renderer) {
        console.log('constructor():ProgressSlider');
        this.element = element;
        this.renderer = renderer;
        this.progress = 0;
        this.change = new EventEmitter();
        this.changeEnd = new EventEmitter();
    }

    public progressPercent(): string {
        return (100.0 * this.progress).toString() + '%';
    }

    public remainingPercent(): string {
        return (100.0 - 100.0 * this.progress).toString() + '%';
    }

    private getTrackWidthRange(): { start: number, end: number } {
        // console.dir(this.element.nativeElement);
        let width: number = parseFloat(getComputedStyle(
            this.element.nativeElement.firstChild, null)
            .getPropertyValue('width').replace('px', '')),
            offsetLeft: number = this.element.nativeElement.offsetLeft,
            paddingLeft: number = parseFloat(getComputedStyle(
                this.element.nativeElement.firstChild, null)
                .getPropertyValue('padding-left').replace('px', ''));
        return {
            start: offsetLeft + paddingLeft,
            end: offsetLeft + width - paddingLeft
        };
    }

    private computeProgress(
        clientX: number,
        range: { start: number, end: number }
    ): number {
        // the next if-statement fixes a quirk observed in desktop Chrome
        // where the ondrag event always ends up with a clientX value of 0
        // as its last emitted value, even when that's clearly not the last
        // location of dragging
        if (clientX === 0) {
            return 0;
        }

        let rangeX: number = range.end - range.start,
            clickRelativeX: number = clientX - range.start;

        if (clickRelativeX < 0) {
            clickRelativeX = 0;
        }

        if (clickRelativeX > rangeX) {
            clickRelativeX = rangeX;
        }
        return clickRelativeX / rangeX;
    }

    private jumpToPosition(
        clientX: number,
        range: { start: number, end: number }
    ): void {
        this.progress = this.computeProgress(clientX, this.trackWidthRange);
        this.change.emit(this.progress);
    }

    public onSliderMouseDown(event: MouseEvent): void {
        console.log('onSliderMouseDown ' + this.element.nativeElement);

        this.trackWidthRange = this.getTrackWidthRange();

        this.jumpToPosition(event.clientX, this.trackWidthRange);

        this.mouseUpListener =
            this.renderer.listenGlobal(
                'document',
                'mouseup',
                (mouseEvent: MouseEvent) => {
                    this.onMouseUp(mouseEvent);
                });
        this.mouseMoveListener =
            this.renderer.listenGlobal(
                'document',
                'mousemove',
                (mouseEvent: MouseEvent) => {
                    this.onMouseMove(mouseEvent);
                });
    }

    public onMouseUp(event: MouseEvent): void {
        // free up the listening to mouse up from <body> now that it happened
        // until the next time we click on the progress-bar
        this.mouseUpListener();
        this.mouseMoveListener();
        this.progress =
            this.computeProgress(event.clientX, this.trackWidthRange);
        this.changeEnd.emit(this.progress);
    }

    public onMouseMove(event: MouseEvent): void {
        this.jumpToPosition(event.clientX, this.trackWidthRange);
    }

    public onSliderTouchMove(event: TouchEvent): void {
        this.jumpToPosition(event.touches[0].clientX, this.trackWidthRange);
    }

    public onSliderTouchStart(event: TouchEvent): void {
        this.trackWidthRange = this.getTrackWidthRange();
    }

    public onSliderTouchEnd(): void {
        this.changeEnd.emit(this.progress);
    }
}