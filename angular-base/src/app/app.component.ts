import { Component, NgZone } from '@angular/core';
import { registerMicroApps, start } from 'qiankun';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-base';

  constructor(private ngZone: NgZone) {
    (window as any).ngZone = this.ngZone // store reference on window to be used by element during its bootstrap
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    registerMicroApps([
      {
        name: 'angularSub',
        entry: '//localhost:4300',
        container: '#subapp',
        activeRule: '/angular-sub',
      },
      {
        name: 'angularSub2',
        entry: '//localhost:4400',
        container: '#subapp',
        activeRule: '/angular-sub2',
      }
    ]);

    // 启动 qiankun
    start();
  }
}
