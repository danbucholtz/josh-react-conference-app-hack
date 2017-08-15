import React, { Component } from 'react';

import PageTwo from './PageTwo';

export default class PageThree extends Component {

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

  goBack() {
    const nav = this.element.closest('ion-nav');
    nav.pop();
  }

  render() {
    return [
      <div style={this.style} ref={(element) => this.element = element}>
        <ion-header>
          <ion-navbar>
            <ion-title>Page three</ion-title>
          </ion-navbar>
        </ion-header>
        <ion-content>
          Page Three
          <div>
            <ion-button onClick={() => this.goBack()}>Go Back</ion-button>
          </div>
        </ion-content>
      </div>
    ];
  }
}