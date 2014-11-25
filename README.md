jsapi
=====

微信jsapi接口
###使用方法

#### 引入库
```javascript
<script type="text/javascript" src="../jsapi.js">
```
#### 调用方法
+ 分享到appmessage
```javascript
JSAPI.sendAppMessage(opt,callback);
```
+ 分享到朋友圈
```javascript
JSAPI.shareTimeline(opt,callback);
```
+ 分享到腾讯微博
```javascript
JSAPI.shareWeibo(opt,callback);
```
+ 调用微信支付接口
```javascript
JSAPI.pay(opt,callback);
```
+ 获取收获地址
```javascript
JSAPI.getLatest(opt,callback);
```
+ 编辑收货地址
```javascript
JSAPI.edit(opt,callback);
```
