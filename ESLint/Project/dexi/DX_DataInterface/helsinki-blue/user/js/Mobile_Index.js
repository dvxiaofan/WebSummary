// <reference path="f:\documents\visual studio 2013\Projects\DX_DataInterface\DX_DataInterface\Views/Shared/Error.cshtml" />
var g_AllEssDataCache = null;                       //所有要素数据缓存
var g_AllDeviceList = null;                         //所有设备列表基本数据
var g_AllVideoList = null;                          // 所有视频列表数据
var g_AllGroupList = null;                          //所有的分组列表
var g_ThisDevice = {
    ST: null,                                       //当前设备编号
    NAME: null,                                     //当前设备名称
};
var g_weixin_state = "";
var g_weixin_url = "";


window.history.forward(1);//放在主页js，点子页的后退按钮不能后退
//初始化加载执行
window.onload = function () {
    try {
        UrlSearch();                                //获取URL参数(更新到 g_weixin_state， g_weixin_url)
        if (g_weixin_state == "WeiXin")             //当前是微信链接，检查是否为微信打开
        {
             test_weixin();                         //检查是否为微信打开
        }

        g_AllEssDataCache = GetAllEssData();        //获取全局要素数据

        //影藏微信的分享功能
       /* if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);

            }
        } else {
            onBridgeReady();
        }*/
    } catch (e) {

    }

}

function onBridgeReady() {
    WeixinJSBridge.call('hideOptionMenu');
}

//检查是否为微信打开
function test_weixin()
{
    try
    {
        var useragent = navigator.userAgent;
        if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
            window.location.href = "../Shared/Error";//若不是微信浏览器，跳转到温馨error页面
        }
    }
    catch(e)
    {

    }
}

//跳转到登录界面
function JumpLogon() {   
    //window.location.href = "/home/Mobile_Login";
    if (g_weixin_state == "WeiXin" && g_weixin_url != null)
    {
        location.href = g_weixin_url;   //跳转
    }
    else
    {
        location.href = "/home/Mobile_Login?1";
    }

}

//读取所有要素数据缓存
function Read_AllEssDataCache() {
    return g_AllEssDataCache;                              //所有要素数据缓存
}

//写入所有要素数据缓存
function Write_AllEssDataCache(AllEssData) {
    g_AllEssDataCache = AllEssData;                              //所有要素数据缓存
}

//读取所有设备数据缓存
function Read_AllDeviceListCache() {
    return g_AllDeviceList;                                   //所有要素数据缓存
}

//写入所有设备数据缓存
function Write_AllDeviceListCache(Data) {
    g_AllDeviceList = Data;                              //所有要素数据缓存
}

// 写入所有视频数据缓存
function Write_AllVideoListCache(Data) {
    g_AllVideoList = Data;
}

// 读取所有视频数据缓存
function Read_AllVideoListCache() {
    return g_AllVideoList;
}

//读取所有分组数据缓存
function Read_AllGroupListCache() {
    return g_AllGroupList;                                   //所有要素数据缓存
}

//写入所有分组数据缓存
function Write_AllGroupListCache(Data) {
    g_AllGroupList = Data;                              //所有要素数据缓存
}

//设置全局当前选择的设备名称与编号
function Write_ThisDevice(ST, NAME) {
    g_ThisDevice.ST = ST;       //当前设备编号
    g_ThisDevice.NAME = NAME;   //当前设备名称
}

//获取全局当前选择的设备名称与编号
function Read_ThisDevice(ST, NAME) {
    return g_ThisDevice;
}


//显示主设备列表
function iframe_show_main_list() {
    try {
        var obj = document.getElementById('iframe_main_list');     //获取容器
        obj.style.display = 'inline'; //显示主设备列表

        obj = document.getElementById('iframe_device_data');     //获取容器
        obj.style.display = 'none'; //影藏设备实时数据

        //调用列表子页面方法，还原滑动条位置
        document.getElementById("iframe_main_list").contentWindow.RestoreScrollTop();

    } catch (e) {
        layer.msg('错误：' + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//显示设备实时数据
function iframe_show_device_data() {
    try {
        //先调用列表子页面方法，记录滑动条位置
        document.getElementById("iframe_main_list").contentWindow.RecordScrollTop();


        var obj = document.getElementById('iframe_device_data');     //获取容器
        obj.style.display = 'inline'; //显示设备实时数据

        obj = document.getElementById('iframe_main_list');     //获取容器
        obj.style.display = 'none'; //隐藏主设备列表

        //调用子页面方法，显示实时数据
        document.getElementById("iframe_device_data").contentWindow.RefreshRealData();
    } catch (e) {
        layer.msg('错误：' + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//显示设备实时数据
function iframe_show_device_data() {
    try {
        //先调用列表子页面方法，记录滑动条位置
        document.getElementById("iframe_main_list").contentWindow.RecordScrollTop();


        var obj = document.getElementById('iframe_device_data');     //获取容器
        obj.style.display = 'inline'; //显示设备实时数据

        obj = document.getElementById('iframe_main_list');     //获取容器
        obj.style.display = 'none'; //隐藏主设备列表

        obj = document.getElementById('iframe_video_list');     //获取容器
        obj.style.display = 'none'; //影藏视频列表

        //调用子页面方法，显示实时数据
        document.getElementById("iframe_device_data").contentWindow.RefreshRealData();
    } catch (e) {
        layer.msg('错误：' + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

// 显示视频列表
function iframe_show_video_list() {

    try {
        //先调用列表子页面方法，记录滑动条位置
        document.getElementById("iframe_main_list").contentWindow.RecordScrollTop();


        var obj = document.getElementById('iframe_device_data');     //获取容器
        obj.style.display = 'none'; //影藏设备实时数据

        obj = document.getElementById('iframe_main_list');     //获取容器
        obj.style.display = 'none'; //隐藏主设备列表

        obj = document.getElementById('iframe_video_list');     //获取容器
        obj.style.display = 'inline'; //显示视频列表


    } catch (e) {
        layer.msg('错误：' + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }

}

// 显示视频播放页面-接收URL以后, 调用子页面方法把URL传递过去
function iframe_show_video_player(hlsUrl, h5Url, name) {

    try {
        //先调用列表子页面方法，记录滑动条位置
        document.getElementById("iframe_main_list").contentWindow.RecordScrollTop();

        var obj = document.getElementById('iframe_device_data');     //获取容器
        obj.style.display = 'none'; //影藏设备实时数据

        obj = document.getElementById('iframe_main_list');     //获取容器
        obj.style.display = 'none'; //隐藏主设备列表

        obj = document.getElementById('iframe_video_list');     //获取容器
        obj.style.display = 'none'; //显示视频列表

        obj = document.getElementById('iframe_video_player');     //获取容器
        obj.style.display = 'inline'; //显示视频列表
        
        //调用视频播放子窗口的URL设置方法
        obj.contentWindow.SetIframeURL(hlsUrl, h5Url, name);

    } catch (e) {
        layer.msg('错误：' + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}



//获取所有编码要素表
function GetAllEssData() {
    var obj = JSON.parse('[]');
    var sta = 0;
    //请求服务器
    var jsonData = {
        GetFun: 'GetAllEssData',
    };


    $.ajax({
        url: '/Home/Index',
        type: 'POST',
        dataType: 'json',
        async: false,   //同步模式，等待结果再返回
        data: jsonData,
    })
    .done(function (response) {
        if (response.rel == 1) { //成功
            if (response.obj == null) {
                layer.alert('要素数据总表为空！', { icon: 5, scrollbar: false }); //5：失败；6：成功
            }
            else {
                obj = JSON.parse(response.obj);
                //alert(JSON.stringify(obj, 4));     //调试显示信息
                sta = 1;
            }

        }
        else if (response.rel == 0) {
            layer.alert(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
        }
        else if (response.rel == -1) //需要登录
        {
            layer.msg(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
            JumpLogon();
        }
        else {
            layer.alert('未知错误！', { icon: 5, scrollbar: false }); //5：失败；6：成功
        }
    })
    .fail(function () {
        layer.alert('通信错误，请求数据失败！', { icon: 5, scrollbar: false }); //5：失败；6：成功
    })

    return obj;
}

//获取当前用户所有设备的基本信息-所有设备列表（ajax同步模式）
function ajax_sync_get_device_list() {
    var obj = JSON.parse('[]');
    var resObj = new Object(); // 把数据转成对象存储
    //请求服务器
    var jsonData = {
        GetFun: 'GetUserDeviceList',
    };

    try {
        $.ajax({
                url: '/Home/Index',
                type: 'POST',
                dataType: 'json',
                async: false, //同步执行
                data: jsonData,
            })
            .done(function (response) {
                if (response.rel == 1) { //获取成功
                    resObj = JSON.parse(response.obj); //全局缓存设备信息
                    //alert(JSON.stringify(response.obj, 4));        //调试显示信息
                    if (response.obj == null) //没有数据
                    {
                        layer.alert("没有获取到数据！", {
                            icon: 5,
                            scrollbar: false
                        }); //5：失败；6：成功
                    } else {
                        // 处理为null的数据
                        for (var i = 0; i < resObj.length; i++) {
                            if (resObj[i].ST == null) continue;
                            obj.push(resObj[i])
                        }
                    }
                } else if (response.rel == -1) //需要登录
                {
                    layer.msg(response.msg, {
                        icon: 5,
                        scrollbar: false
                    }); //5：失败；6：成功
                    JumpLogon();
                } else {

                    layer.alert(response.msg, {
                        icon: 5,
                        scrollbar: false
                    }); //5：失败；6：成功
                }
            })
            .fail(function () {
                layer.alert('通信错误，请求数据失败！', {
                    icon: 5,
                    scrollbar: false
                }); //5：失败；6：成功
            })
    } catch (e) {
        layer.alert("发生了错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
    }


    return obj;
}

let numm = 0;

//获取所有分组的基本信息-所有分组列表（ajax同步模式）
function ajax_sync_get_all_group_list() {
    var obj = JSON.parse('[]');
    //请求服务器
    var jsonData = {
        GetFun: 'GetUserGroupList',
    };

    try {
        $.ajax({
                url: '/Home/Index',
                type: 'POST',
                dataType: 'json',
                async: false, //同步执行
                data: jsonData,
            })
            .done(function (response) {
                if (response.rel == 1) { //获取成功
                    obj = JSON.parse(response.obj); //全局缓存分组信息
                    //alert(JSON.stringify(response.obj, 4));        //调试显示信息
                    if (response.obj == null) //没有数据
                    {
                        //layer.msg("没有获取到分组数据！", { icon: 5, scrollbar: false }); //5：失败；6：成功
                    } else {
                        obj = JSON.parse(response.obj); //转换为对象
                    }
                } else if (response.rel == -1) //需要登录
                {
                    layer.msg(response.msg, {
                        icon: 5,
                        scrollbar: false
                    }); //5：失败；6：成功
                    JumpLogon();
                } else {

                    layer.alert(response.msg, {
                        icon: 5,
                        scrollbar: false
                    }); //5：失败；6：成功
                }
            })
            .fail(function () {
                layer.alert('通信错误，请求数据失败！', {
                    icon: 5,
                    scrollbar: false
                }); //5：失败；6：成功
            })
    } catch (e) {
        layer.alert("发生了错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
    }


    return obj;
}



//javascript操作cookie实现递增时间刷新。
//用到了amazeui操作cookie的api
var int = self.setInterval("refresh()", 300000);
function refresh() {
    try {
        if (g_UserInfoObj != null && g_UserInfoObj[0] != null && g_UserInfoObj[0].NICK_NAME != null) {
            $.ajax({
                url: '/Home/Index',
                type: 'POST',
                dataType: 'json',
                error: function () {
                    layer.msg('定时刷新通信失败！', { icon: 5, scrollbar: false }); //5：失败；6：成功
                },
                success: function (rs) {
                    //layer.msg('定时刷新通信成功！', { icon: 6, scrollbar: false }); //5：失败；6：成功
                }
            });
        }

    } catch (e) {

    }
}

//获取URL参数(更新到 g_weixin_state， g_weixin_url)
function UrlSearch() {
    try {
        var name, value;
        var str = location.href; //取得整个地址栏
        var num = str.indexOf("?")
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        //console.log(arr)
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                //this[name] = value;
                if (name == "state") {
                    g_weixin_state = value;
                    //layer.msg("state=" + g_weixin_state);
                }
                else if (name == "URL") {
                    g_weixin_url = value;
                    //layer.msg("URL=" + g_weixin_url);
                }
            }
        }
    }
    catch (e) {

    }

}

