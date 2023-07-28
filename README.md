## qiankun - Angular15 Demo

### 简介

以[`qiankun`](https://qiankun.umijs.org/zh) 为基础的Ng15微前端项目Demo，主应用更新了Ng15和子应用采用Ng13。

主应用：Angular15

子应用：Angular13



### 启动

① 为主应用和子应用安装（`npm i`）依赖

② 主应用 `angular-base`  启动 

```
ng serve
```

③ 子应用`angular-sub/angular-sub2`启动

```
npm run serve:single-spa:angular-sub
npm run serve:single-spa:angular-sub2
```

④ 访问 `http://localhost:4200/`



### 问题指引

#### 1、Ng基座的Angular微应用在访问时页面不断刷新闪烁

在按照`qiankun - 项目实践` 中的Angular 微应用构建指南进行后，当使用的基座也为Angular时，通常会出现这种情况，浏览器地址栏会在`angular-sub` 和 `angular-sub/` 循环跳转。由于能力问题无法定位和准确修改该问题，因此在本项目中的微应用均使用`single-spa-angular`构建（使用`single-spa-angular` 构建微应用的步骤参考下文[Ng基座的微应用构建指南](#Ng基座的微应用构建指南)）。



#### 2、`Expected to not be in Angular Zone, but it is!` 

微应用`zone.js`报错，此问题解决有两种方案：

① 参照qiankun-项目实践-解决 `zone.js` 的问题

② 在基座中将`zone.js` 注册进 `window` ，在微应用实例中注册。

将微应用的 `src/polyfills.ts` 里面的引入 `zone.js` 代码删掉。

```typescript
// 主应用
import { NgZone } from '@angular/core';
export class AppComponent {
  constructor(private ngZone: NgZone) {
    (window as any).ngZone = this.ngZone
}

// 微应用 main.ts (main.ts的其他修改参考qiankun项目实践-修改入口文件)
 app = await platformBrowserDynamic()
    .bootstrapModule(AppModule, { ngZone: (window as any).ngZone }) // 注册
    .catch((err) => console.error(err));


```



#### 3、路由问题 

- `Cannot match any routes. URL Segment: 'xxx'`

  微应用路由无法找到

- `Cannot match any routes. URL Segment: 'xxx';Zone: <root> ; Task: Promise.then ; Value: Error: Cannot match any routes.`

  微应用中的子路由无法找到

使用`Angular` 作为基座的微前端中，在主应用路由中需要注册微应用路由 

```typescript
// 主应用 app-routing.module
import { EmptyComponent } from 'qiankun-ng-common';

const routes: Routes = [
  {
    path: 'angular-sub',  // 微应用入口
    component: EmptyComponent
  },
  {
    path: 'angular-sub/home', // 微应用中的子路由
    component: EmptyComponent
  }
];
```



### Ng基座的微应用构建指南

**以下流程仅在Angular微应用情况下适用和验证**

#### 1、安装`single-spa-angular` 插件

```
ng add single-spa-angular
```

#### 2、设置路由

```typescript
// src/app/app-routing.module.ts

+ import { APP_BASE_HREF } from '@angular/common';
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // @ts-ignore
+  providers: [{ provide: APP_BASE_HREF, useValue: '/app-angular'}]
})
```

#### 3、修改入口文件，`src/main.ts` 文件

```typescript
import './public-path';
import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

let app: void | NgModuleRef<AppModule>;
async function render() {
  app = await platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
}
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap(props: Object) {
  console.log(props);
}

export async function mount(props: Object) {
  render();
}

export async function unmount(props: Object) {
  console.log(props);
  // @ts-ignore
  app.destroy();
}
```

#### 4、解决 `zone.js` 的问题

参考 [问题指引 - 2](#问题指引)

#### 5、修正 `ng build` 打包报错问题，修改 `tsconfig.json` 文件

```typescript
- "target": "es2015",
+ "target": "es5",
+ "typeRoots": [
+   "node_modules/@types"
+ ],
```

#### 6、启动

```
npm run serve:single-spa:app-angular
```



### 说明

由于能力和时间问题，本项目仅供学习和参考，如果有错误或改进点感谢您给予指正。


### 更新

主应用更新了Ng15

Angular 对于 Node.js 的版本要求是 16.15.x  或  18.10.x ，建议使用 16.15.0 ，其对应 npm 版本为  8.5.0 

