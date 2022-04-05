import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import { RouterConfigModel } from "./RouterConfig";

export class Auth extends React.Component<any> {
  render() {
    const { location, config } = this.props;
    const { pathname } = location;

    const isLogin = localStorage.getItem("__aurochs_token");
    let routePath = pathname;
    const targetRouterConfig = config.find((v: RouterConfigModel) => {
      // 支持隐式传参
      // 如果有正则，优先匹配正则
      if (v.regexp && pathname.match(v.regexp) != null) {
        routePath = v.path;
        return true;
      }
      // 其他情况直接进行比较

      return v.path === pathname;
    });
    if (targetRouterConfig && !targetRouterConfig.auth && !isLogin) {
      const { component } = targetRouterConfig;

      return <Route exact path={routePath} component={component} />;
    } else {
      return <Redirect to="/" />;
    }

    // if (isLogin) {
    //   // 如果是登陆状态，想要跳转到登陆，重定向到主页
    //   if (routePath === "/login") {
    //     return <Redirect to="/mainView" />;
    //   } else {
    //     // 如果路由合法，就跳转到相应的路由
    //     if (targetRouterConfig) {
    //       return <Route path={routePath} component={targetRouterConfig.component} />;
    //     } else {
    //       // 如果路由不合法，重定向到 404 页面
    //       return <Redirect to="/404" />;
    //     }
    //   }
    // } else {
    //   // 非登陆状态下，当路由合法时且需要权限校验时，跳转到登陆页面，要求登陆
    //   if (targetRouterConfig && targetRouterConfig.auth) {
    //     // return <Redirect to='/login' />
    //     return <Redirect to="/mainView" />;
    //   } else {
    //     // 非登陆状态下，路由不合法时，重定向至 404
    //     return <Redirect to="/404" />;
    //   }
    // }
  }
}
