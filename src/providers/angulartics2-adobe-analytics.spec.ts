import {Location} from '@angular/common';
import {ReflectiveInjector, ReplaySubject} from '@angular/core';
import {fakeAsync, tick} from '@angular/core/testing';

import {Angulartics2} from '../core/angulartics2';
import {Angulartics2AdobeAnalytics} from './angulartics2-adobe-analytics';

describe('Angulartics2AdobeAnalytics', () => {
  let s: any;
  let location: Location;
  let angulartics2: Angulartics2;
  let angulartics2AdobeAnalytics: Angulartics2AdobeAnalytics;

  beforeEach(() => {
    s = {
      clearVars: jasmine.createSpy('clearVars'),
      t: jasmine.createSpy('t'),
      tl: jasmine.createSpy('tl'),
      linkTrackVars: '',
      linkTrackEvents: '',
      events: ''
    };

    const locationMock = {
      path: () => '/home',
      prepareExternalUrl: (value: string) => value,
      subscribe: (next: any) => {}
    };

    const injector = ReflectiveInjector.resolveAndCreate([
      Angulartics2AdobeAnalytics,
      Angulartics2,
      {provide: Location, useValue: locationMock}
    ]);

    window['s'] = s;
    location = injector.get(Location);
    angulartics2 = injector.get(Angulartics2);
    angulartics2AdobeAnalytics = injector.get(Angulartics2AdobeAnalytics);
  });

  afterEach(() => {
    delete window['s'];
  });

  it('should track pages', fakeAsync(() => {
    angulartics2.pageTrack.next({ path: '/about' });
    tick();
    expect(s.clearVars).toHaveBeenCalled();
    expect(s.t).toHaveBeenCalledWith({ pageName: '/about' });
  }));

  it('should track events', fakeAsync(() => {
    angulartics2.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
    tick();
    expect(s.linkTrackVars).toBe('events');
    expect(s.linkTrackEvents).toBe('event1');
    expect(s.events).toBe('event1');
    expect(s.tl).toHaveBeenCalledWith(true, 'o', 'cat - do');
  }));

  it('should set user properties', fakeAsync(() => {
    s.prop1 = '';
    s.eVar1 = '';
    angulartics2.setUserProperties.next({ prop1: 'test1', eVar1: 'test2' });
    tick();
    expect(s.prop1).toBe('test1');
    expect(s.eVar1).toBe('test2');
  }));

  it('should set username', fakeAsync(() => {
    s.visitorID = '';
    angulartics2.setUsername.next('testuser');
    tick();
    expect(s.visitorID).toBe('testuser');
  }));
});