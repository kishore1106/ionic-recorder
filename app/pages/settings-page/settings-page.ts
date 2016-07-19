// Copyright (c) 2016 Tracktunes Inc

import {
    Component
} from '@angular/core';

import {
    IdbAppState
} from '../../providers/idb-app-state/idb-app-state';

/**
 * @name SettingsPage
 * @description
 * Change app settings.
 */
@Component({
    templateUrl: 'build/pages/settings-page/settings-page.html'
})
export class SettingsPage {
    private idbAppState: IdbAppState;

    /**
     * @constructor
     * @param {NavController} nav
     */
    constructor(idbAppState: IdbAppState) {
        console.log('constructor():SettingsPage');
        this.idbAppState = idbAppState;
    }
}