var list_arr;
var g_AllEssDataCache = null;                       //所有要素数据缓存
var g_AllDeviceList = null;                         //所有设备列表基本数据
var g_AllGroupList = null;                          //所有的分组列表
var g_SearchDeviceList;                             //符合搜索条件的设备信息
var g_isSearchMode = false;                         //是否处于搜索模式

//用于记录当前滑动条位置
var g_scrollTop = {
    dev_obj: null, //父div
    scrollTop: 0 //记录位置
};


/*
//父标签
var title_data_arr =
    [
        { ParentNodeId: 1, NodeName: '1', NodeText: '分组1' },
        { ParentNodeId: 2, NodeName: '2', NodeText: '分组2' },
    ];

//子标签
 var subtitle_data_arr =
     [
         { ParentNodeId: 1, NodeName: '12345', NodeText: '1510260128 测试站点1', subtitle:'', img: "../../Images/device.jpg" },
         { ParentNodeId: 1, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 1, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 1, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 1, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 1, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 1, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 1, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },

         { ParentNodeId: 2, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 2, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 2, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 2, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 2, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
         { ParentNodeId: 2, NodeName: '12345', NodeText: '1510260128 测试站点', subtitle: '', img: "../../Images/device.jpg" },
     ];

*/


//初始化加载执行
window.onload = function () { //要执行的js代码段  
    try {

        //加载框
        // $.showPreloader('加载中...');
        LoadImage(); //下载图片
        //获取缓存的要素数据信息
        g_AllEssDataCache = parent.Read_AllEssDataCache();
        if (g_AllEssDataCache == null) {
            g_AllEssDataCache = parent.GetAllEssData();
            parent.Write_AllEssDataCache(g_AllEssDataCache); //写入到父缓存
        }
        //获取缓存的要素数据信息
        g_AllDeviceList = parent.Read_AllDeviceListCache();
        if (g_AllDeviceList == null) {
            g_AllDeviceList = parent.ajax_sync_get_device_list();
            parent.Write_AllDeviceListCache(g_AllDeviceList); //写入到父缓存
        }
        //获取缓存的要素数据信息
        g_AllGroupList = parent.Read_AllGroupListCache();
        if (g_AllGroupList == null) {
            g_AllGroupList = parent.ajax_sync_get_all_group_list();
            parent.Write_AllGroupListCache(g_AllGroupList); //写入到父缓存
        }

        //将数据转换为能被列表显示的数据
        list_arr = conversion_data_list_node(g_AllGroupList, g_AllDeviceList);
        GroupDeviceListInit('device_list_id', list_arr[0], list_arr[1]);

        layui.use(['element', 'layer'], function () {
            /* var element = layui.element;
             var layer = layui.layer;

             //监听折叠
             element.on('collapse(test)', function (data) {
                 //layer.msg('展开状态：' + data.show);
             });*/
        });

    } catch (e) {

        //layer.msg('错误：' + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
        window.location.href = "Mobile_Index"; //跳转到主页
    }

    // 
}


//记录scrollTop位置，在表格重载之前调用（依赖全局g_scrollTop）
function RecordScrollTop() {
    try {

        g_scrollTop.dev_obj = document.getElementById("main_content_id");

        if (g_scrollTop.dev_obj != null) {
            g_scrollTop.scrollTop = g_scrollTop.dev_obj.scrollTop; //获取滑动条位置
            // console.log('位置：' + g_scrollTop.scrollTop);
        }
    } catch (e) {
        g_scrollTop.scrollTop = 0;
        // console.log(e.message);
    }
}

//还原scrollTop位置，在表格重载之后调用（依赖全局g_scrollTop）
function RestoreScrollTop() {
    try {
        //还原scroll位置
        if (g_scrollTop.dev_obj != null) {
            g_scrollTop.dev_obj.scrollTop = g_scrollTop.scrollTop;
        }
    } catch (e) {
        // console.log(e.message);
    }
}


//选择一个设备
function select_device(id) {
    try {
        var aObj = document.getElementById(id); //获取容器
        var index = aObj.getAttribute('data-index');
        var aObj = document.getElementById('item_title_id' + index); //获取容器
        //console.log('当前选择设备：' + aObj.innerHTML);
        var ST = aObj.innerHTML.substring(0, 10); //前面10个字符的ST
        var NAME = aObj.innerHTML.substring(11); //后面的名称
        parent.Write_ThisDevice(ST, NAME); //将当前设备信息写入到缓冲区
        parent.iframe_show_device_data(); //显示设备实时数据

        //layer.msg('设备索引:'+index);
    } catch (e) {
        layer.msg('错误：' + e.message);
    }
}


//寻找分组所在索引0：默认分组
function FindDeviceGroupIndex(GruopList, DeviceGroup) {
    try {
        if (GruopList == null || GruopList.length == 0 || DeviceGroup == null) return 0;
        for (var i = 0; i < GruopList.length; i++) {
            if (GruopList[i].GROUP == DeviceGroup) return i + 1;
        }
    } catch (e) {

    }

    return 0;
}


//将原始数据转换为能被list显示的数据-正常显示时调用
function conversion_data_list_node(GruopList, DeviceList) {
    var ObjArr = [
        [],
        []
    ]; //0：父标签数据；1：子标签数据
    var GroupDeviceCount; //记录每个分组的设备数量
    var GroupCount = 0; //分组数量-永远都有一个默认分组
    var temp;

    try {
        //先生成父标签
        //默认分组
        ObjArr[0][0] = {
            ParentNodeId: 0,
            NodeName: '0',
            NodeText: '默认分组'
        };
        if (GruopList == null || GruopList.length == 0) //没有分组
        {
            GroupCount = 1;
        } else {
            for (var i = 0; i < GruopList.length; i++) {
                var obj = new Object;
                obj.ParentNodeId = i + 1;
                obj.NodeName = (i + 1) + '';
                obj.NodeText = GruopList[i].GROUP;


                ObjArr[0][i + 1] = obj;
            }
            GroupCount = GruopList.length + 1;
        }
        GroupDeviceCount = new Array(GroupCount); //分组设备记录初始化
        for (var i = 0; i < GroupCount; i++) {
            GroupDeviceCount[i] = 0;
        }

        //子标签
        if (DeviceList == null || DeviceList.length == 0) {
            return ObjArr;
        }
        for (var i = 0; i < DeviceList.length; i++) {
            var obj = new Object;
            temp = FindDeviceGroupIndex(GruopList, DeviceList[i].GROUP); //获取分组id-父标签id
            obj.ParentNodeId = temp;
            obj.NodeName = DeviceList[i].ST;
            obj.NodeText = DeviceList[i].ST + ' ' + DeviceList[i].NAME;
            obj.subtitle = '';
            obj.img = "../../Images/device.png";

            ObjArr[1][i] = obj;

            //记录每个分组设备数量
            GroupDeviceCount[temp]++; //对应分组设备数量+1
        }

        for (var i = 0; i < ObjArr[0].length; i++) {
            ObjArr[0][i].NodeText += '(' + GroupDeviceCount[i] + ')'; //在父标签后面加上分组设备数量
        }

    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
    }

    return ObjArr;
}





//生成一个分组与设备列表，返回html字符串
function SpliceOneListGroup(ParentNodeId, TitleText, subtitle_data_arr) {
    var time_id = Date.now(); //获取时间戳，用于生成唯一id
    //alert(JSON.stringify(TreeConfig, 4));
    //父标签div,独立的
    var div_parent_div = //
        '<div class="layui-colla-item">\
                <h2 class="layui-colla-title">' + TitleText + '</h2>\
                <div class="layui-colla-content">\
                <div class="list-block media-list">\
                <ul>';
    //</ul>
    //</div>
    //</div>
    //</div>


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
            li.setAttribute("data-attribute", i); //自定义属性，存放索引
            //内容
            li.innerHTML =
                '<a href="#" onclick="select_device(this.id)" id="select_id' + i + '" class="item-link item-content" data-index=' + i + ' data-name="' + subtitle_data_arr[i].NodeName + '>\
                    <div class="item-media"><img src="' + subtitle_data_arr[i].img + '" style="width: 32px;height:20px;"></div>\
                    <div class="item-inner" style="overflow:hidden;">\
                    <div class="item-title-row">\
                    <div class="item-title" id="item_title_id' + i + '">' + subtitle_data_arr[i].NodeText + '</div>\
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

//初始化设备分组列表界面
function GroupDeviceListInit(id, title_data_arr, subtitle_data_arr) {
    try {
        var div = document.getElementById(id); //获取容器
        if (div != null) {
            var htmlString = [];
            //循环生成列表
            for (var i = 0; i < title_data_arr.length; i++) {
                htmlString.push(SpliceOneListGroup(title_data_arr[i].ParentNodeId, title_data_arr[i].NodeText, subtitle_data_arr));
            }
            div.innerHTML = htmlString.join("");
            //alert(div.outerHTML);
        }
    } catch (e) {
        alert("错误：" + e.message);
    }
}

//生成一个分组与设备列表，返回html字符p串-用于搜索模式
function SpliceOneListGroup_SearchMode(TitleText, subtitle_data_arr) {
    var time_id = Date.now(); //获取时间戳，用于生成唯一id
    //alert(JSON.stringify(TreeConfig, 4));
    //父标签div,独立的
    var div_parent_div = //
        '<div class="layui-colla-item">\
                <h2 class="layui-colla-title">' + TitleText + '</h2>\
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
        li.setAttribute("data-attribute", i); //自定义属性，存放索引
        //内容
        li.innerHTML =
            '<a href="#" onclick="select_device(this.id)" id="select_id' + i + '" class="item-link item-content" data-index=' + i + ' data-name="' + subtitle_data_arr[i].NodeName + '>\
                    <div class="item-media"><img src="' + subtitle_data_arr[i].img + '" style="width: 32px;height:20px;"></div>\
                    <div class="item-inner" style="overflow:hidden;">\
                    <div class="item-title-row">\
                    <div class="item-title" id="item_title_id' + i + '">' + subtitle_data_arr[i].NodeText + '</div>\
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

//初始化设备分组列表界面-用于搜索模式
function GroupDeviceListInit_SearchMode(id, subtitle_data_arr) {
    try {
        var GroupName = '搜索设备(' + subtitle_data_arr.length + ')';
        var div = document.getElementById(id); //获取容器
        if (div != null) {
            var htmlString = [];
            //循环生成列表

            htmlString.push(SpliceOneListGroup_SearchMode(GroupName, subtitle_data_arr));

            div.innerHTML = htmlString.join("");
            //alert(div.outerHTML);
        }
    } catch (e) {
        alert("错误：" + e.message);
    }
}

// 刷新主列表
function reloadMainList() {
    try {
        g_AllGroupList = parent.ajax_sync_get_all_group_list();
        parent.Write_AllGroupListCache(g_AllGroupList); //写入到父缓存
        window.location.reload();
    } catch (e) {

    }
}

// 跳转到视频列表页面
function showVideoList() {
    try {
        // 跳转到视频列表页
        parent.iframe_show_video_list(); // 调用父页面窗体,显示视频列表
    } catch (e) {

    }

}

//退出登录
function loginout() {
    try {
        //询问是否退出登录
        layer.confirm('确定要退出登录吗？', {
            btn: ['确定', '取消'] //按钮
        }, function () { //确定按钮

            $.showPreloader('通信中...');
            ajax_Logout();

        }, function () { //取消按钮
            //alert("取消了解除");
            return;
        });


    } catch (e) {

    }
}


//请求退出登录
function ajax_Logout() {
    try {
        //请求服务器进行登录
        var jsonData = {
            GetFun: 'LogoutLogin',
        };

        $.ajax({
                url: '/Home/Index',
                type: 'POST',
                dataType: 'json',
                data: jsonData,
            })
            .done(function (response) {
                if (response.rel == 1) { //退出成功
                    //window.location.href = "/Home/Mobile_Login";
                    parent.JumpLogon();
                } else {
                    layer.alert("退出登录失败,未知错误！", {
                        icon: 5,
                        scrollbar: false
                    }); //5：失败；6：成功
                }

            })
            .fail(function () {
                layer.alert("退出登录失败，网络错误！", {
                    icon: 5,
                    scrollbar: false
                }); //5：失败；6：成功
                return;
            })
    } catch (e) {

    }
}


//搜索符合条件的设备基础信息列表(DeviceListObj:所有的设备基础信息列表；Keyword:搜索关键字，设备名与昵称）
function search_device_list(DeviceListObj, Keyword) {
    var obj = JSON.parse('[]');
    var count = 0;

    if (DeviceListObj == null || DeviceListObj.length == 0) {
        layer.msg("错误：列表为空，无法搜索！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
        return obj;
    }
    if (Keyword == null || Keyword.length == 0) {
        layer.msg("错误：请输入搜索关键字！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
        return obj;
    }

    try {
        //搜索
        for (var i = 0; i < DeviceListObj.length; i++) {
            // 如初数据中有null的, 直接跳过, 继续执行
            if (DeviceListObj[i].ST == null || DeviceListObj[i].NAME == null) {
                continue;
            }
            if ((DeviceListObj[i].ST.indexOf(Keyword) >= 0) || (DeviceListObj[i].NAME.indexOf(Keyword) >= 0)) {
                obj[count++] = DeviceListObj[i]; //找到了
                if (count >= 500) {
                    layer.msg("搜索到超过500个满足条件的数据，提前结束搜索，请修改搜索条件缩小范围！", {
                        icon: 6,
                        scrollbar: false
                    }); //5：失败；6：成功
                    break;
                }
            }
        }
        if (count == 0) //没有搜索到满足条件的数据
        {
            layer.msg("没有搜索到满足条件的设备数据！", {
                icon: 5,
                scrollbar: false
            }); //5：失败；6：成功
        }
    } catch (e) {
        layer.msg("搜索发生了错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
    }

    return obj;
}

//搜索按钮处理
function search_onclick() {
    var Keyword = document.getElementById("search").value; //获取搜索框内容
    if (Keyword == null || Keyword.length < 1) {
        layer.msg("错误：搜索内容不能为空！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
        return;
    }
    //layer.msg('搜索：' + Keyword);

    g_SearchDeviceList = search_device_list(g_AllDeviceList, Keyword); //搜索
    if (g_SearchDeviceList.length == 0) return; //没有搜索到
    //开始获取搜索的内容，并进行显示
    try {
        g_isSearchMode = true; //处于搜索模式
        //显示数据-搜索模式
        var list_arr = conversion_data_list_node(g_AllGroupList, g_SearchDeviceList);
        GroupDeviceListInit_SearchMode('device_list_id', list_arr[1]);

        //重绘
        var element = layui.element;
        element.render('collapse');
    } catch (e) {
        layer.msg("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
    }
}

//取消搜索按钮处理
function search_cancel_onclick() {
    try {
        if (g_isSearchMode == false) return; //不处于搜索模式的话，直接返回
        g_isSearchMode = false; //不处于搜索模式
        // 清空搜索栏数据
        document.getElementById("search").value = '';

        //将数据转换为能被列表显示的数据
        var list_arr = conversion_data_list_node(g_AllGroupList, g_AllDeviceList);
        GroupDeviceListInit('device_list_id', list_arr[0], list_arr[1]);

        //重绘
        var element = layui.element;
        element.render('collapse');
    } catch (e) {
        layer.msg("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
    }
}


//下载图片
function LoadImage() {

    //请求服务器获取微信图标
    var jsonData = {
        GetFun: 'GetWeixinPicture',
    };

    $.ajax({
            url: '/Home/Index',
            type: 'POST',
            dataType: 'json',
            data: jsonData,
        })
        .done(function (response) {
            if (response.rel == 1) { //获取成功
                //更新图片
                if (response.obj != null) //可以更新图片
                {
                    document.getElementById('image_id').src = response.obj;
                }
            }
        })
        .fail(function () {
            return;
        })
}


//绑定搜索
$('#search').bind('input propertychange', function () {

    try {
        search_onclick();
    } catch (e) {
        layer.msg("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
    }
});