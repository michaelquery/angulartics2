import {Injectable} from '@angular/core';

import {Angulartics2} from '../core/angulartics2';

declare var ga: any;
declare var location: any;
declare var dataLayer: any;

@Injectable()
export class Angulartics2GoogleTagManager {

	constructor(
		private angulartics2: Angulartics2
  ) {
		this.angulartics2.settings.pageTracking.trackRelativePath = true;

		// Set the default settings for this module
		this.angulartics2.settings.gtm = {
			// array of additional account names (only works for analyticsjs)
			additionalAccountNames: [],
			userId: null
		};

		this.angulartics2.pageTrack.subscribe((x: any) => this.pageTrack(x.path));

		this.angulartics2.eventTrack.subscribe((x: any) => this.eventTrack(x.action, x.properties));

		this.angulartics2.exceptionTrack.subscribe((x: any) => this.exceptionTrack(x));

		this.angulartics2.setUsername.subscribe((x: string) => this.setUsername(x));

	}

  pageTrack(path: string) {
		if (dataLayer) {
			ga('send', 'pageview', path);
			dataLayer.push({
				event: 'ng.pageview',
				'Page Path': path
			})
		}
	}

  eventTrack(action: string, properties: any) {
		if (dataLayer) {
			var eventOptions = {
				eventCategory: properties.category,
				eventAction: action,
				eventLabel: properties.label,
				eventValue: properties.value,
				nonInteraction: properties.noninteraction,
				page: properties.page || location.hash.substring(1) || location.pathname,
				// This can be used if applicable
				// userId: this.angulartics2.settings.gtm.userId
			};
				dataLayer.push({
					event: 'ng.event',
					eventOptions: eventOptions,
				})
		}
	}

	exceptionTrack(properties: any) {
		this.eventTrack(properties.toString(), {
          'category': 'Exceptions',
          'label': properties.stack
        });
		if (!properties || !properties.appId || !properties.appName || !properties.appVersion) {
			console.error('Must be setted appId, appName and appVersion.');
			return;
		}

		if (properties.fatal === undefined) {
			console.log('No "fatal" provided, sending with fatal=true');
			properties.exFatal = true;
		}

		properties.exDescription = properties.description;

		ga('send', 'exception', properties);
	}

	setUsername(userId: string) {
		this.angulartics2.settings.gtm.userId = userId;
	}


}
