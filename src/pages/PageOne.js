import React, { Component } from 'react';

import PageTwo from './PageTwo';

export default class PageOne extends Component {

  constructor() {
    super();
    this.style = {
      height: '100%'
    };
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  goToPageTwo() {
    const nav = this.element.closest('ion-nav');
    nav.push(PageTwo);
  }

  render() {
    return [
      <div style={this.style} ref={(element) => this.element = element}>
        <ion-header>
          <ion-navbar>
            <ion-title>Page One</ion-title>
          </ion-navbar>
        </ion-header>
        <ion-content>
          Page One
          <div>
            <ion-button onClick={() => this.goToPageTwo()}>Go to Page Two</ion-button>
          </div>
        </ion-content>
      </div>
    ];
  }
}
