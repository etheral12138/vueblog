---
title: Web安全
date: 2023-04-20
icon: module
category:
  - 前端技术
tag:
  - Web
  - 安全
---



## 常见Web攻击类型

### XSS跨站脚本攻击

- 窃取用户信息

#### 存储型

恶意脚本被存在数据库中

危害最大，对全部用户可见

#### Reflected

在服务端注入脚本

#### DOM-based

不需要服务器，在浏览器中注入脚本

![image-20230420213840630](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420213840630.png)

#### Mutation-based

基于浏览器，触发Error回调函数

#### 防御

不要将用户提交内容直接转换成DOM

![image-20230420214846591](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420214846591.png)

> SOP同源策略

![image-20230420215037304](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420215037304.png)

> CSP安全策略



### CSRF跨站伪造请求攻击





#### 防御

![image-20230420215142400](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420215142400.png)

token防御

![image-20230420215259156](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420215259156.png)

iframe攻击防御

- 设置服务器响应头部

```
X-FRAME-OPTIONS:DENY/SAMEORIGIN
```

- 区分GET/POST请求

- 通过设置SameSite Cookie避免用户信息被携带

![image-20230420215657045](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420215657045.png)



![image-20230420215819206](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420215819206.png)

第三方Cookie问题：

服务端设置

```
SameSite:
```

SameSite与CORS区别：

| SameSite         | CORS                 |
| ---------------- | -------------------- |
| Cookie发送       | 资源读写（HTTP请求） |
| domain和页面域名 | 资源域名与页面域名   |
| 同源策略         | 白名单               |

使用中间件

### Injection

SQL恶意注入

![image-20230420214216481](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420214216481.png)

#### 防御

- 找到项目中查询SQL的地方

- 使用prepared statement

### SSRF服务端伪造请求

#### 防御



### DoS服务拒绝攻击

TCP三次握手没有完成，又称为SYN雪崩

![image-20230420214658230](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420214658230.png)

#### 防御

![image-20230420220429548](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420220429548.png)

### 中间人攻击

#### 防御

![image-20230420220501532](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420220501532.png)

HTTPS的特性

![image-20230420220519774](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230420220519774.png)



### SRI

通过对比原始内容的哈希值与实际内容的哈希值

保证CDN上资源没有被篡改

### Feature Policy

允许开发者使用的功能



