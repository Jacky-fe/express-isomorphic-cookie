# express-isomorphic-cookie
## 描述
这是一个在express里实现的同构cookie，里面已经集成了express-httpcontext的中间件

## 安装
npm install express-isomorphic-cookie

## 使用
``` js
// 首先添加中间件
import express  from 'express';
import  {  middleware }  from 'express-isomorphic-cookie';
const app = express();
app.use(middleware);

// 使用cookie， load, save, remove
import { cookie } from 'express-isomorphic-cookie';

let count = cookie.load('count') | 0;
count++;
if (count === 1) {
  // 初次访问时，将count设置为1
  cookie.save('count', count);
} else {
  // 再次访问时，删除这个cookie, 存在新cookie里
  cookie.remove('count');
  cookie.save('newcount', count);
}

