

var g_AllEssDataCache = null;                       //所有要素数据缓存
var g_AllVideoList = null;                          //所有视频列表基本数据
var g_AllGroupList = null;                          //所有的分组列表
var g_isFistRefresh = true                          // 是否是第一次刷新数据
var g_isSearchMode = false;                         //是否处于搜索模式

var g_SearchVideoList;

// 父标签
var g_title_data_arr =
    [
        { ParentNodeId: 1, NodeName: '1', NodeText: '默认分组' }
    ];

// 子标签
var g_subtitle_data_arr = [];


//初始化加载执行
window.onload = function () {   //要执行的js代码段  
    try {
        // 刷新列表
        RefreshVideoList();

    } catch (e) {
        layer.msg("处理数据发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//同步获取所有的视频设备信息(获取的数据更新到g_VideoList)
function ajax_async_get_video_info(fail_callback, success_callback) {
    var obj = JSON.parse('[]');

    try {
        //请求服务器
        var jsonData = {
            GetFun: 'GetUserVideoList',
        };

        $.ajax({
            url: '/Home/Index',
            type: 'POST',
            dataType: 'json',
            async: false,                                       //同步执行
            data: jsonData,
        })
        .done(function (response) {
            if (response.rel == 1) { //获取成功
                obj = JSON.parse(response.obj);                 //全局缓存设备信息
                //alert(JSON.stringify(response.obj, 4));         //调试显示信息
                if (response.obj == null)                       //没有数据
                {
                    layer.alert("没有获取到数据！", { icon: 5, scrollbar: false }); //5：失败；6：成功
                }
                else {
                    obj = JSON.parse(response.obj);     //转换为对象
                    g_VideoList = obj;                  //写入全局缓冲区
                    if (success_callback != null) success_callback(obj);              //调用成功回调
                }
            }
            else if (response.rel == -1) //需要登录
            {
                layer.alert(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
                parent.JumpLogon();
            }
            else {

                layer.alert(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
                if (fail_callback != null) fail_callback();             //调用失败回调
            }
        })
        .fail(function () {
            layer.msg('通信错误，请求数据失败！', { icon: 5, scrollbar: false }); //5：失败；6：成功
            if (fail_callback != null) fail_callback();             //调用失败回调
        })
    }
    catch (e) {
        layer.msg("发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
        if (fail_callback != null) fail_callback();             //调用失败回调
    }
}


//生成一个分组与视频列表，返回html字符串
function SpliceOneListGroup(ParentNodeId, TitleText, subtitle_data_arr) {
    var time_id = Date.now();   //获取时间戳，用于生成唯一id
    //父标签div,独立的 , 视频列表是默认展开的
    var div_parent_div = //
        '<div class="layui-colla-item">\
                <h2 class="layui-colla-title">'+ TitleText + '</h2>\
                <div class="layui-colla-content layui-show">\
                <div class="list-block media-list">\
                <ul>';
  
    var htmlString = [];
    var id;
    //循环生成子列
    for (var i = 0; i < subtitle_data_arr.length; i++) {
        if (subtitle_data_arr[i].ParentNodeId == ParentNodeId) {
            id = 'li_' + time_id + '_' + i;
            var li = document.createElement("li");
            //设置 li 属性
            li.setAttribute("id", id);
            //设置 li 属性
            li.setAttribute("data-attribute", i);   //自定义属性，存放索引
            //内容
            li.innerHTML =
            '<a href="#" onclick="select_video(this.id)" id="select_id' + i + '" class="item-link item-content" data-index=' + i + ' data-name="' + subtitle_data_arr[i].NodeName + '>\
                    <div class="item-media"><img src="' + subtitle_data_arr[i].img + '" style="width: 32px;height:20px;"></div>\
                    <div class="item-inner" style="overflow:hidden;">\
                    <div class="item-title-row">\
                    <div class="item-title" id="item_title_id'+ i + '">' + subtitle_data_arr[i].NodeText + '</div>\
                    </div>\
                    <div class="item-subtitle" id="item_subtitle"' + i + '>' + subtitle_data_arr[i].subtitle + '</div>\
                    </div>\
                    </a>';

            //循环添加li到ul
            htmlString.push(li.outerHTML); //添加到ul
        }
    }
    div_parent_div += htmlString.join("");
    div_parent_div += '</ul></div></div></div>';

    //alert(div_parent_div);
    return div_parent_div;
}

//初始化视频分组列表界面
function GroupVideoListInit(id, title_data_arr, subtitle_data_arr) {
    try {
        var div = document.getElementById(id);  //获取容器
        if (div != null) {
            var htmlString = [];
            //循环生成列表
            for (var i = 0; i < title_data_arr.length; i++) {
                htmlString.push(SpliceOneListGroup(title_data_arr[i].ParentNodeId, title_data_arr[i].NodeText, subtitle_data_arr));
            }

            div.innerHTML = htmlString.join("");
            //alert(div.outerHTML);
        }
    }
    catch (e) {
        console.log(e.message);
        alert("错误：" + e.message);
    }
}

//刷新列表
function RefreshVideoList() {
    try {
        g_subtitle_data_arr = [];

        ajax_async_get_video_info(function () {
            console.log('error');
        }, function (res) {
            for (var i = 0; i < res.length; i++) {
                var item = new Object();

                item.ParentNodeId = 1;
                item.NodeName = res[i].NAME;
                item.NodeText = res[i].NAME;
                item.subtitle = '';
                item.img = "../../Images/device.png";

                g_subtitle_data_arr[i] = item;
            }

        });

        //没有数据
        if (g_subtitle_data_arr == null || g_subtitle_data_arr.length == 0) {
            layer.msg('暂无直播数据');
        }
        // 存在视频列表数据
        else {
            GroupVideoListInit('video_list_id', g_title_data_arr, g_subtitle_data_arr);

            if (g_isFistRefresh == true) //第一次加载,进行渲染
            {
                layui.use(['element', 'layer'], function () {
                    /* var element = layui.element;
                     var layer = layui.layer;

                     //监听折叠
                     element.on('collapse(test)', function (data) {
                         //layer.msg('展开状态：' + data.show);
                     });*/
                });
            }
            else //重绘
            {
                var element = layui.element;
                element.render('collapse');

            }

            //获取缓存的要素数据信息
            g_AllVideoList = parent.Read_AllVideoListCache();
            if (g_AllVideoList == null) {
                g_AllVideoList = g_subtitle_data_arr;
                parent.Write_AllVideoListCache(g_AllVideoList);//写入到父缓存
            }

            g_isFistRefresh = false;
        }
    } catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//返回
function back_onclick() {
    try {
        parent.iframe_show_main_list(); //显示主设备列表
    } catch (e) {
        layer.msg("处理数据发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//选择一个视频
function select_video(id) {
    try {
        var aObj = document.getElementById(id);     //获取容器
        var index = aObj.getAttribute('data-index');

        if (index >= 0 && g_VideoList != null && index < g_VideoList.length) {
            var hlsUrl = g_VideoList[index].URL;
            var h5Url = g_VideoList[index].H5URL;
            var name = g_VideoList[index].NAME;

            parent.iframe_show_video_player(hlsUrl, h5Url, name);
        }

    } catch (e) {
        console.log('错误：' + e.message);
    }
}


//绑定搜索事件
$('#search').bind('input propertychange', function () {

    try {
        search_onclick();
    } catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
});

//搜索按钮处理
function search_onclick() {
    var Keyword = document.getElementById("search").value; //获取搜索框内容
    if (Keyword == null || Keyword.length < 1) {
        layer.msg("错误：搜索内容不能为空！", { icon: 5, scrollbar: false }); //5：失败；6：成功
        return;
    }

    g_SearchVideoList = search_video_list(g_AllVideoList, Keyword);    //搜索
    if (g_SearchVideoList.length == 0) return;                       //没有搜索到
    //开始获取搜索的内容，并进行显示
    try {
        g_isSearchMode = true;  //处于搜索模式
        //显示数据-搜索模式
        GroupVideoListInit_SearchMode('video_list_id', g_SearchVideoList);

        //重绘
        var element = layui.element;
        element.render('collapse');
    }
    catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

// 搜索符合条件的搜索视频列(VideoListObj:所有的视频列表；Keyword:搜索关键字，视频名与昵称）
function search_video_list(VideoListObj, Keyword) {
    var obj = JSON.parse('[]');
    var count = 0;

    if (VideoListObj == null || VideoListObj.length == 0) {
        layer.msg("错误：列表为空，无法搜索！", { icon: 5, scrollbar: false }); //5：失败；6：成功
        return obj;
    }

    if (Keyword == null || Keyword.length == 0) {
        layer.msg("错误：请输入搜索关键字！", { icon: 5, scrollbar: false }); //5：失败；6：成功
        return obj;
    }

    try {
        //搜索
        for (var i = 0; i < VideoListObj.length; i++) {
            if (VideoListObj[i].NodeName.indexOf(Keyword) >= 0) {
                // 搜索到数据
                obj[count++] = VideoListObj[i];  

                if (count >= 500) {
                    layer.msg("搜索到超过500个满足条件的数据，提前结束搜索，请修改搜索条件缩小范围！", { icon: 6, scrollbar: false }); //5：失败；6：成功
                    break;
                }
            }
        }
        //没有搜索到满足条件的数据
        if (count == 0) {
            layer.msg("没有搜索到满足条件的设备数据！", { icon: 5, scrollbar: false }); //5：失败；6：成功
        }
    }
    catch (e) {
        layer.msg("搜索发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }

    return obj;
}

//生成一个分组与视频列表，返回html字符串-用于搜索模式
function SpliceOneListGroup_SearchMode(TitleText, subtitle_data_arr) {
    var time_id = Date.now();   //获取时间戳，用于生成唯一id
    //alert(JSON.stringify(TreeConfig, 4));
    //父标签div,独立的
    var div_parent_div = //
        '<div class="layui-colla-item">\
                <h2 class="layui-colla-title">'+ TitleText + '</h2>\
                <div class="layui-colla-content layui-show">\
                <div class="list-block media-list">\
                <ul>';

    var htmlString = [];
    var id;
    //循环生成子列
    for (var i = 0; i < subtitle_data_arr.length; i++) {

        id = 'li_' + time_id + '_' + i;
        var li = document.createElement("li");
        //设置 li 属性
        li.setAttribute("id", id);
        //设置 li 属性
        li.setAttribute("data-attribute", i);   //自定义属性，存放索引
        //内容
        li.innerHTML =
        '<a href="#" onclick="select_video(this.id)" id="select_id' + i + '" class="item-link item-content" data-index=' + i + ' data-name="' + subtitle_data_arr[i].NodeName + '>\
                    <div class="item-media"><img src="'+ subtitle_data_arr[i].img + '" style="width: 32px;height:20px;"></div>\
                    <div class="item-inner" style="overflow:hidden;">\
                    <div class="item-title-row">\
                    <div class="item-title" id="item_title_id'+ i + '">' + subtitle_data_arr[i].NodeText + '</div>\
                    </div>\
                    <div class="item-subtitle" id="item_subtitle"' + i + '>' + subtitle_data_arr[i].subtitle + '</div>\
                    </div>\
                    </a>';

        //循环添加li到ul
        htmlString.push(li.outerHTML); //添加到ul

    }
    div_parent_div += htmlString.join("");
    div_parent_div += '</ul></div></div></div>';

    //alert(div_parent_div);
    return div_parent_div;
}


//取消搜索按钮处理
function search_cancel_onclick() {
    try {
        if (g_isSearchMode == false) return;    //不处于搜索模式的话，直接返回
        g_isSearchMode = false;                 //不处于搜索模式
        // 清空搜索栏数据
        document.getElementById("search").value = '';

        // 显示数据
        GroupVideoListInit('video_list_id', g_title_data_arr, g_AllVideoList);

        //重绘
        var element = layui.element;
        element.render('collapse');
    }
    catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}


// 初始化视频列表
function GroupVideoListInit(id, title_data_arr, subtitle_data_arr) {
    try {
        var div = document.getElementById(id);  //获取容器
        if (div != null) {
            var htmlString = [];
            //循环生成列表
            for (var i = 0; i < title_data_arr.length; i++) {
                htmlString.push(SpliceOneListGroup(title_data_arr[i].ParentNodeId, title_data_arr[i].NodeText, subtitle_data_arr));
            }
            div.innerHTML = htmlString.join("");
            //alert(div.outerHTML);
        }
    }
    catch (e) {
        alert("错误：" + e.message);
    }
}

// 初始化视频列表-用于搜索模式
function GroupVideoListInit_SearchMode(id, subtitle_data_arr) {
    try {
        var GroupName = '搜索视频(' + subtitle_data_arr.length + ')';
        var div = document.getElementById(id);  //获取容器
        if (div != null) {
            var htmlString = [];
            //循环生成列表

            htmlString.push(SpliceOneListGroup_SearchMode(GroupName, subtitle_data_arr));

            div.innerHTML = htmlString.join("");
            //alert(div.outerHTML);
        }
    }
    catch (e) {
        alert("错误：" + e.message);
    }
}