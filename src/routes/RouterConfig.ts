// routeMap.js
// 全局路由配置
import Home from "view/Home/index";

export interface RouterConfigModel {
  path: string;
  component?: any;
  auth?: boolean;
  regexp?: RegExp;
}

export const routerConfig: RouterConfigModel[] = [
  { path: "/", component: Home, auth: false },
  // { path: "/auth/callback/:platform", component: Auth, auth: false, regexp: /\/auth\/callback\/.+?\/?/ },
  // { path: "/mainView", component: ARLayout, auth: false },
  // { path: "/codeReview", component: CodeReview, auth: false },
  // { path: "/tsconfig", component: TeamConfig, auth: false },
  // { path: "/mainPage", component: MainPage, auth: false },
];
