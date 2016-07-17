// Copyright (c) 2016 Tracktunes Inc

import {
    // NgZone,
    Injectable
} from '@angular/core';

// clock frequency, in Hz
const CLOCK_FREQUENCY_HZ: number = 24;

// derived constants, please do not touch the constants below:
const CLOCK_INTERVAL_MSEC: number = 1000 / CLOCK_FREQUENCY_HZ;

// maximum allowed number of functions running concurrently
export const MAX_FUNCTIONS: number = 2;

@Injectable()
export class MasterClock {
    public isRunning: boolean;

    private intervalId: NodeJS.Timer;
    private nTicks: number = 0;
    // private ngZone: NgZone = new NgZone({ enableLongStackTrace: false });
    private functions: { [id: string]: () => void } = {};

    /**
     * constructor
     */
    constructor() {
        console.log('constructor():MasterClock');
        this.isRunning = false;
        this.intervalId = null;
        this.nTicks = 0;
        this.start();
    }

    start(): void {
        if (this.isRunning) {
            return;
        }
        // commented block here is a more precisely timed version
        // this.ngZone.runOutsideAngular(() => {
        //     let startTime: number = Date.now(),
        //         timeoutError: number,
        //         id: string,
        //         repeat: () => void = () => {
        //             this.nTicks++;
        //             this.ngZone.run(() => {
        //                 for (id in this.functions) {
        //                     this.functions[id]();
        //                 }
        //             });
        //             timeoutError = Date.now() - startTime -
        //                 this.nTicks * CLOCK_INTERVAL_MSEC;
        //             setTimeout(repeat, CLOCK_INTERVAL_MSEC - timeoutError);
        //         }; // repeat: Function = () => {
        //     setTimeout(repeat, CLOCK_INTERVAL_MSEC);
        // }); // this.ngZone.runOutsideAngular(() => {
        this.intervalId = setInterval(
            // the monitoring actions are in the following function:
            () => {
                this.nTicks++;
                for (let id in this.functions) {
                    this.functions[id]();
                }
            },
            CLOCK_INTERVAL_MSEC);
        this.isRunning = true;
    }

    stop(): void {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        if (this.intervalId) {
            console.log('MasterClock:stop(): clearing interval: ' + this.intervalId);
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Add a function to execute on each clock loop
     * @param {string} id used as handle to added function, for later removal
     * @param {Function} function to execute in the clock's loop
     * @returns {void}
     */
    addFunction(id: string, fun: () => void) {
        const nFunctions = Object.keys(this.functions).length;
        if (nFunctions > MAX_FUNCTIONS) {
            throw Error('MasterClock: too many functions');
        }
        if (nFunctions === 0) {
            this.start();
        }
        this.functions[id] = fun;
    }

    /**
     * Remove a function to execute on each clock loop, via its id
     * @param {string} id of function to remove
     * @returns {void}
     */
    removeFunction(id: string) {
        delete this.functions[id];
        const nFunctions = Object.keys(this.functions).length;
        if (nFunctions === 0) {
            this.stop();
        }
    }

}