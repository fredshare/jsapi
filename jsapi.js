var JSAPI ={
	ready : function(onBridgeReady){
        	//先看看全局的WeixinJSBridge存不存在，有些版本的微信WeixinJSBridge会初始化为{}，所以还要看看invoke有没有
        	if (typeof WeixinJSBridge == "undefined" || !WeixinJSBridge.invoke){
	    	//没有就监听ready事件
	    	if( document.addEventListener ){
	        	document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	    	}else if (document.attachEvent){
			document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
	        	document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	    	}
		}else{
	    		//初始化结束直接就执行吧！
	    		onBridgeReady();
		}
    	},
	invoke : function(methodName, args, callback){
		this.ready(function(){
			WeixinJSBridge.invoke(methodName, args, callback);
		});   
	},
	call : function(methodName){
		this.ready(function(){
			//一定要在ready之后才能调用
			WeixinJSBridge.call(methodName);
		});
	},
	on : function(eventName, callback){
		this.ready(function(){
			//一定要在ready之后才能调用
			WeixinJSBridge.on(eventName, callback);
		}); 
	},
	/**
	 * JSAPI 支付相关
	 */
	//获取最近的地址
	getLatest : function(opt){
		this.invoke('getLatestAddress', {
			"appId" : opt.appId,
            "scope" : opt.scope || "jsapi_address",
            "signType" : opt.signType || "sha1",
            "addrSign" : opt.addrSign || "",
            "timeStamp" : opt.timeStamp || "",
            "nonceStr" : opt.nonceStr || ""
		 },function(res){
		 	if (res.err_msg && res.err_msg == 'system:function_not_exist'){
				//5.0这个接口是废弃的 所以直接返回 不用回调
                opt.error && (opt.error());
				return ;
			}
			/*
			res = {
				"proviceFirstStageName" : "",
				"addressCitySecondStageName" : "",
				"addressCountiesThirdStageName" : "",
				"addressDetailInfo" : "",
				"telNumber" : ""
			}
			*/
			opt.callback && (opt.callback(res));
		 });
    },
    edit : function(opt){
		//编辑并选择收货地址
		this.invoke('editAddress', {
			"appId" : opt.appId,
            "scope" : opt.scope || "jsapi_address",
            "signType" : opt.signType || "sha1",
            "addrSign" : opt.addrSign || "",
            "timeStamp" : opt.timeStamp || "",
            "nonceStr" : opt.nonceStr || ""
		 },function(res){
			/*
			res = {
				"proviceFirstStageName" : "",
				"addressCitySecondStageName" : "",
				"addressCountiesThirdStageName" : "",
				"addressDetailInfo" : "",
				"telNumber" : ""
			}
			*/
			opt.callback && (opt.callback(res));
		 });
    },
    //支付
    pay : function(opt){
	    /*
		var res = {
	            "appId" : that.appId, //公众号名称，由商户传入
	            "timeStamp" : that.timeStamp, //时间戳
	            "nonceStr" : that.nonceStr, //随机串
	            "package" : that.package,//扩展包
	            "signType" : that.signType, //微信签名方式:1.sha1
	            "paySign" : that.paySign //微信签名
	        };
	        document.write(JSON.stringify(res));
	    */
		this.invoke(
	        'getBrandWCPayRequest',
	        {
	            "appId" : opt.app_id, //公众号名称，由商户传入
	            "timeStamp" : opt.time_stamp, //时间戳
	            "nonceStr" : opt.nonce_str, //随机串
	            "package" : opt.package,//扩展包
	            "signType" : opt.sign_type || "SHA1", //微信签名方式:1.sha1
	            "paySign" : opt.pay_sign //微信签名
	        },function(res){
				if(res.err_msg == "get_brand_wcpay_request:ok") {
					opt.success && (opt.success(res));
				}else{
	                //get_brand_wcpay_request:cancel 用户取消
	                //get_brand_wcpay_request:fail 发送失败
					opt.error && (opt.error(res.err_msg));	
				}
	        }
	    );
	},
	//分享
	sendAppMessage : function(opt, callback){
		this.invoke('sendAppMessage', opt, callback);
	},
	shareTimeline : function(opt, callback){
		this.invoke('shareTimeline', opt, callback);
	},
	shareWeibo : function(opt, callback){
		this.invoke('shareWeibo', opt, callback);
	},
	on_share_appmessage : function(opt, callback, favorite_opt, favorite_callback){
		this.on('menu:share:appmessage', function(argv){
			//alert(argv.scene);
			//alert(favorite_opt.link);
	        if (argv.scene == "favorite"){//收藏
	        	/*
	        	alert("test");
				alert(argv.scene);
				alert(favorite_opt.link);
				*/
				shareAPI.sendAppMessage(favorite_opt, favorite_callback);
				return;
	        }
	        shareAPI.sendAppMessage(opt, callback)
		});
	},
	on_share_timeline : function(opt, callback){
		this.on('menu:share:timeline', function(argv){
			shareAPI.shareTimeline(opt, callback)
		});
	},
	on_share_weibo : function(opt, callback){
		this.on('menu:share:weibo', function(argv){
			shareAPI.shareWeibo(opt, callback)
		});
	},
	//收藏功能
	addGoodsToFav : function(opt,callback){
		/*opt参数如下：
		 *{
         *  "title" : "活动商品测试", //商品名称
         *  "link" : "http://weigou.qq.com/o2ov1/wx/item/item-detail.shtml", //商品链接
         *  "desc" : "测试 请勿删除、购买", //商品描述
         *  "thumbimg" : "http://shp.qpic.cn/weigou_itempic/0/item-0.jpg/120" //商品缩略图 
         *  }
		 */
		this.invoke('addGoodsToFav', opt, callback);
	}
};
