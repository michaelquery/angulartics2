import {Injectable} from '@angular/core';

import {Angulartics2} from '../core/angulartics2';

declare var s: any;
declare var location: any;

@Injectable()
export class Angulartics2AdobeAnalytics {

	constructor(
		private angulartics2: Angulartics2
  ) {
		this.angulartics2.settings.pageTracking.trackRelativePath = true;

		// Set the default settings for this module
		this.angulartics2.settings.adobeAnalytics = {
			userId: null
		};

		this.angulartics2.pageTrack.subscribe((x: any) => this.pageTrack(x.path));

		this.angulartics2.eventTrack.subscribe((x: any) => this.eventTrack(x.action, x.properties));

		this.angulartics2.exceptionTrack.subscribe((x: any) => this.exceptionTrack(x));

		this.angulartics2.setUsername.subscribe((x: string) => this.setUsername(x));

		this.angulartics2.setUserProperties.subscribe((x: any) => this.setUserProperties(x));
	}

  pageTrack(path: string) {
		if (typeof s !== 'undefined' && s) {
			s.clearVars();
			s.t({ pageName: path });
		}
	}

	/**
	 * Track Event in Adobe Analytics
	 * @name eventTrack
	 *
	 * @param {string} action Required 'action' (string) associated with the event
	 * @param {object} properties Comprised of the mandatory field 'category' (string) and optional fields 'label' (string), 'value' (integer) and 'noninteraction' (boolean)
	 */
  eventTrack(action: string, properties: any) {
		// Adobe Analytics requires an Event Category
		if (!properties || !properties.category) {
			properties = properties || {};
			properties.category = 'Event';
		}
		if (typeof s !== 'undefined' && s) {
			s.linkTrackVars = 'events';
			s.linkTrackEvents = 'event1';
			s.events = 'event1';
			s.tl(true, 'o', properties.category + ' - ' + action);
		}
	}

	/**
	 * Exception Track Event in Adobe Analytics
	 * @name exceptionTrack
	 *
	 * @param {object} properties Comprised of the mandatory fields 'appId' (string), 'appName' (string) and 'appVersion' (string) and 
	 * optional fields 'fatal' (boolean) and 'description' (string)
	 */
	exceptionTrack(properties: any) {
		if (!properties || !properties.appId || !properties.appName || !properties.appVersion) {
			console.error('Must be setted appId, appName and appVersion.');
			return;
		}

		if (typeof s !== 'undefined' && s) {
			s.linkTrackVars = 'events,prop20,eVar20';
			s.linkTrackEvents = 'event2';
			s.events = 'event2';
			s.prop20 = properties.appName + ' - ' + properties.appVersion;
			s.eVar20 = properties.description || 'No Description';
			s.tl(true, 'o', 'Exception');
		}
	}

	setUsername(userId: string) {
		this.angulartics2.settings.adobeAnalytics.userId = userId;
		if (typeof s !== 'undefined' && s) {
			s.visitorID = userId;
		}
	}

	setUserProperties(properties: any) {
		if (typeof s !== 'undefined' && s) {
			// Set custom variables for Adobe Analytics
			for (let key in properties) {
				if (properties.hasOwnProperty(key)) {
					s[key] = properties[key];
				}
			}
		}
	}
}