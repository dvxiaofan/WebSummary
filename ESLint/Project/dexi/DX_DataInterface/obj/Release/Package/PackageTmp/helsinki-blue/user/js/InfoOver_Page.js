var g_ThisSelectMarkerIndex = 0;                        //本次选择的marker索引
var g_RealDataObj = [];                                 //当前实时数据
var g_AllEssDataCache;                                  //所有要素数据列表-从父页面加载
var g_MyTree;
var g_ThisST;                                           //当前设备ST
var g_ThisName;                                         //当前设备Name
var g_SubpageData = {                                   //传递到子页面的数据
        TableData: [],
        TT: null,
        AlarmConfigObj:null,                                 //当前设备的报警配置数据
    };
var g_iframeWin = null;

var g_map;

var g_make_ico_red;     //红色图标 - 报警颜色
var g_make_ico_green;   //绿色图标 - 选中颜色
var g_make_ico_blue;    //蓝色图标 - 默认颜色
var g_marker = [];      //标记集合
var g_AlarmConfigObj;   //当前设备的报警配置

// 刷新
function refresh(enName) {
    g_map.setMapStyle('amap://styles/' + enName);
}

//初始化加载执行
window.onload = function () {   //要执行的js代码段  
    //获取当前用户设备的经纬度

    $.ajaxSettings.async = false;                    //由于有ajax，强制js为同步执行
    loading_message('加载数据中...');                 //弹出提示框
    make_ico_init();                                //初始化图标
    g_AllEssDataCache = AllDeviceEssInit();         //初始化所有要素数据
    //左侧列表
    var oDiv = document.getElementById('panel_id_1');
    oDiv.style.height = ($(window).height() - 12 - 30) + 'px';

    //自动高度
    var oDiv = document.getElementById('div_scroll_id');
    oDiv.style.height = ($(window).height() - 2) + 'px';

    //图标居中
    var oDiv = document.getElementById('scroll_ico_id');
    oDiv.style.marginTop = ($(window).height() - 100) / 2 + 'px';

    //下载数据
    g_AllDeviceList = ajaxSyncGetDeviceList();    //获取当前用户所有设备基本信息列表   
    //alert(JSON.stringify(g_AllDeviceList, 4));        //调试显示信息
    g_AllGroupList = ajaxSyncGetAllGroupList();    //获取所有分组信息
    //alert(JSON.stringify(g_AllGroupList), 4);
    //准备要显示的数据
    var ObjArr = conversion_data_tree_node(g_AllGroupList, g_AllDeviceList, 0);//子列表数据源
    g_tree_config.ParentData = ObjArr[0];       //父标签数据源 
    g_tree_config.LiData = ObjArr[1];
    g_tree_config.SelectionEvent = SelectionEvent;//点击事件
    // alert(JSON.stringify(g_tree_config.ParentData), 4);
    //alert(JSON.stringify(g_tree_config.LiData), 4);
    g_MyTree = new tree_list(g_tree_config);
    g_MyTree.render();  //绘制列表
    // 侧边栏鼠标悬浮事件
    myTreeHoverEvent()

    g_ThisST = g_AllDeviceList[0].ST;       //当前设备ST
    g_ThisNAME = g_AllDeviceList[0].NAME;   //当前设备NAME

    //延时200ms再弹窗子窗口
    setTimeout('open_real_frame()', 210);
    //延时500ms显示当前实时数据
    setTimeout('show_real_data()', 500);

    // 设置地图
    g_map = new AMap.Map('container', {
        resizeEnable: true,
        //zoom: 10,
        center: [114.3, 30.6]
    });

    var features = [];
    features.push('bg');
    features.push('road');
    g_map.setFeatures(features);

    var scale = new AMap.Scale({
        visible: true
    }),
    toolBar = new AMap.ToolBar({
        visible: true
    }),
    overView = new AMap.OverView({
        visible: true
    });

    g_map.addControl(scale);
    g_map.addControl(toolBar);
    g_map.addControl(overView);

    scale.show();

    marker_init(g_map, g_AllDeviceList);    //初始化marker

    SetMarker(0);           //默认选择第0个

    //marker.setIcon(icon); 修改图标

    close_message();                                    //关闭提示框 
    document.getElementById("cancel_search_button_id").disabled = "true";    //禁用取消搜索按钮
}

//初始化marker-在初始化地图完成后调用（依赖全局变量g_marker）
function marker_init(map, DeviceListObj) {
    try {
        //alert(JSON.stringify(DeviceListObj), 4);
        g_marker = [];
        if (DeviceListObj == null || DeviceListObj.length == 0 || map == null) return;
        for (var i = 0; i < DeviceListObj.length; i++) {
            // 创建一个 Marker 实例：
            var marker = new AMap.Marker({
                position: new AMap.LngLat(DeviceListObj[i].LONG, DeviceListObj[i].LAT),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                title: DeviceListObj[i].NAME,   //站点名称
                offset: new AMap.Pixel(-20, -50),
                icon: g_make_ico_blue, // 添加 Icon 实例

            });

            marker.setTitle(DeviceListObj[i].NAME); // 设置鼠标划过点标记显示的文字提示
            marker.ST = DeviceListObj[i].ST;        //编号
            marker.NAME = DeviceListObj[i].NAME;    //站点名称
            marker.index = i;                       //索引
            marker.zIndex = 1;                      //默认显示的层
            marker.on('click', function (e) {
                
                make_set_reset(g_ThisSelectMarkerIndex, e.target.index);            //设置make图标颜色
                g_ThisSelectMarkerIndex = e.target.index;                           //记录本次索引

                //更新数据
                g_ThisST = e.target.ST;                                             //当前设备ST
                g_ThisNAME = e.target.NAME;                                         //当前设备NAME
                SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME);                    //获取并显示当前选择的设备的数据

                // alert(e.target.ST + ' ' + e.target.index);
            });
            // 将创建的点标记添加到已有的地图实例：
            g_marker[i] = marker;
            //g_map.add(marker);
        }
        if (g_marker.length > 0) //批量添加marker
        {
            g_map.add(g_marker);
        }
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//搜索一个make点索引
function search_make_index(ST) {
    try {
        if (g_marker == null || g_marker.length == 0 || ST == null) return 0;
        for (var i = 0; i < g_marker.length; i++) {
            if (ST == g_marker[i].ST) {
                return g_marker[i].index;
            }
        }
        return 0;
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//设置一个make图标，并复原一个图标
function make_set_reset(ResetIndex, SetIndex) {
    try {
        if (ResetIndex >= g_marker.length || SetIndex >= g_marker.length) return;

        //将上次选中的maker设置为默认色
        g_marker[ResetIndex].setIcon(g_make_ico_blue);          //修改图标
        //去掉提示文字
        g_marker[ResetIndex].setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
            content: null
        });
        //去掉提示文字后鼠标放上去也不会再提示了，增加鼠标滑过文字提示
        g_marker[ResetIndex].setTitle(g_marker[ResetIndex].NAME); // 设置鼠标划过点标记显示的文字提示
        g_marker[ResetIndex].setTop(false);     //取消置顶

        //本次索引的图标
        g_marker[SetIndex].setTop(true);     //置顶
        g_marker[SetIndex].setIcon(g_make_ico_green);          //修改图标
        g_marker[SetIndex].setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
            offset: new AMap.Pixel(20, -25),//修改label相对于maker的位置
            content: g_marker[SetIndex].NAME
        });
        //g_marker[SetIndex].setzIndex(0);  //设置选择的在最顶层
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//初始化标记图标
function make_ico_init() {
    // 创建 AMap.Icon
    g_make_ico_red = creatMarkIcon('red', 0);
    g_make_ico_green = creatMarkIcon('green', 5);
    g_make_ico_blue = creatMarkIcon('blue', 0);
}

// 创建标记点图标
function creatMarkIcon(color, plus) {
    let iconWidth = 50 + plus,
        iconHeight = 80 + plus,
        Proportion = 1.5;

    try {
        let icon = new AMap.Icon({
            size: new AMap.Size(iconWidth / Proportion, iconHeight / Proportion),       // 图标尺寸
            image: `../../Images/map_mark_${color}-50x80.png`,                          // icon 图像
            imageOffset: new AMap.Pixel(0, 0),                                          // 图像相对展示区域的偏移量，适用于雪碧图等
            imageSize: new AMap.Size(iconWidth / Proportion, iconHeight / Proportion)   // 根据所设置的大小拉伸或压缩图片
        });
        // 返回图标
        return icon;
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//程序选择一个make点
function SetMarker(index) {
    try {
        if (index >= g_marker.length) return;
        make_set_reset(g_ThisSelectMarkerIndex, index);             //设置make图标颜色
        g_ThisSelectMarkerIndex = index;                            //记录本次索引
        //设置地图中心
        if (g_AllDeviceList == null) return;
        g_map.setCenter([g_AllDeviceList[index].LONG, g_AllDeviceList[index].LAT]);
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//浏览器窗口大小变化事件
$(window).resize(function () {          //当浏览器大小变化时
    //自动高度
    var oDivContent = document.getElementById('user_content_id_1');
    oDivContent.style.height = ($(window).height() - 2) + 'px';

    var oDiv = document.getElementById('panel_id_1');
    oDiv.style.height = ($(window).height() - 12 - 30) + 'px';

    //自动高度
    var oDiv = document.getElementById('div_scroll_id');
    oDiv.style.height = ($(window).height() - 2) + 'px';

    //图标居中
    var oDiv = document.getElementById('scroll_ico_id');
    oDiv.style.marginTop = ($(window).height() - 100) / 2 + 'px';
});

//弹窗子窗口
function open_real_frame() {
    try {
        layer.open({
            type: 2,
            title: '详细信息',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: ['300px', '500px'],
            content: '/home/RealFrame',
            offset: 'rt', //右上角弹出,
            //skin: 'layui-layer-rim', //加上边框
            closeBtn: 0,    //关闭按钮无
            maxBtn: 0,       //最大化按钮
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                g_iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            },
        });
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//延时显示实时数据
function show_real_data() {
    try {
        if (g_iframeWin == null) //子窗口还未打开
        {
            setTimeout('show_real_data()', 500);
            return;
        }
        //初始化默认显示数据
        g_ThisST = g_AllDeviceList[0].ST;       //当前设备ST
        g_ThisNAME = g_AllDeviceList[0].NAME;   //当前设备NAME
        SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME);   //获取并显示当前选择的设备的数据
    } catch (e) {

    }
}

//刷新某个站点数据状态，标签栏状态
function set_title_status(TT) {
    var STATUS = null;
    var html = '实时数据';
    try {
        var oDiv = document.getElementById('title_status_id');
        if (TT == null) //无数据
        {
            STATUS = '无数据';
            html = '实时数据&nbsp<span class="layui-badge layui-bg-gray">' + STATUS + '</span>';

        }
        else {
            var date1 = new Date(TT.replace(/\-/g, "\/"));
            var date2 = new Date();     //结束时间
            var date3 = date2.getTime() - date1.getTime();   //时间差的毫秒数    
            //alert('当前时间：' + date2.getTime() + ' TT:' + date1.getTime() + ' 时间差：' + (date3 / 1000));
            var temp = date3 / 1000;//转换为秒
            if (temp > 6 * 3600 || temp < -6 * 3600) //时间相差6小时以上显示为异常
            {
                STATUS = '异常';  //状态
                html = '实时数据&nbsp<span class="layui-badge">' + STATUS + '</span>';
            }
            else if (temp > 2 * 3600 || temp < -2 * 3600) //时间相差2小时以上显示为连接中
            {
                STATUS = '连接中';  //状态
                html = '实时数据&nbsp<span class="layui-badge layui-bg-orange">' + STATUS + '</span>';
            }
            else {
                STATUS = '正常';  //状态
                html = '实时数据&nbsp<span class="layui-badge layui-bg-green">' + STATUS + '</span>';;
            }
        }

    } catch (e) {

    }
    oDiv.innerHTML = html;
}

//刷新某个站点数据
function SelectAndGetDeviceRealData(ST, NAME) {
    try {
        var count = 0;
        var arr = [];
        var obj = new Object();

        //第一行显示编号
        obj.ESS = '编号';
        obj.DATA = ST;
        arr[count++] = obj;
        //第二行显示名称
        obj = new Object();
        obj.ESS = '名称';
        obj.DATA = NAME;
        arr[count++] = obj;

        //下载当前设备的实时数据
        if (g_tree_config.LiData != null && g_tree_config.LiData.length > 0) {
            g_RealDataObj = ajaxSyncGetRealData(ST);
            g_AlarmConfigObj = ajax_sync_get_device_alarm_data(ST);//获取当前设备的报警配置
            //alert(JSON.stringify(g_RealDataObj), 4);
        }

        var TableData = conversion_data_layui_table(g_RealDataObj);   //将获取到的实时数据转换为表格能显示的数据
        if (TableData != null && TableData.length > 0) {
            for (var i = 0; i < TableData.length; i++) {
                obj = new Object();
                obj.ESS = TableData[i].ESS;
                obj.DATA = TableData[i].DATA;
                arr[count++] = obj;
            }
        }
        g_SubpageData.TableData = arr;
        g_SubpageData.AlarmConfigObj = g_AlarmConfigObj;                //当前设备的报警配置
        if (g_RealDataObj != null && g_RealDataObj.length > 0) {
            g_SubpageData.TT = g_RealDataObj[0].TT;
        }
        else {
            g_SubpageData.TT = null;
        }
        set_title_status(g_SubpageData.TT);     //更新状态
        //alert(JSON.stringify(g_SubpageData), 4);
        //调用子页面方法，更新数据
        g_iframeWin.refresh_data(g_SubpageData);
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//刷新某个站点数据状态，标签栏状态
function set_title_status(TT) {
    var STATUS = null;
    var html = '详细信息';
    try {
        var oDiv = document.getElementById('layui-layer2');
        //alert(oDiv);
        oDiv = oDiv.getElementsByClassName('layui-layer-title')[0];
        //alert(oDiv);

        if (TT == null || TT == undefined) //无数据
        {
            STATUS = '无数据';
            html = '详细信息&nbsp<span class="layui-badge layui-bg-gray">' + STATUS + '</span>';

        }
        else {
            var date1 = new Date(TT.replace(/\-/g, "\/"));
            var date2 = new Date();     //结束时间
            var date3 = date2.getTime() - date1.getTime();   //时间差的毫秒数    
            //alert('当前时间：' + date2.getTime() + ' TT:' + date1.getTime() + ' 时间差：' + (date3 / 1000));
            var temp = date3 / 1000;//转换为秒
            if (temp > 6 * 3600 || temp < -6 * 3600) //时间相差6小时以上显示为异常
            {
                STATUS = '异常';  //状态
                html = '详细信息&nbsp<span class="layui-badge">' + STATUS + '</span>';
            }
            else if (temp > 2 * 3600 || temp < -2 * 3600) //时间相差2小时以上显示为连接中
            {
                STATUS = '连接中';  //状态
                html = '详细信息&nbsp<span class="layui-badge layui-bg-orange">' + STATUS + '</span>';
            }
            else {
                STATUS = '正常';  //状态
                html = '详细信息&nbsp<span class="layui-badge layui-bg-green">' + STATUS + '</span>';;
            }
        }

        oDiv.innerHTML = html;

    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }

}


//初始化表格(只能调用一次，并且会在调用后延时一段时间才能初始化完成)DataTableObj:当前要显示的数据；AllDataCount：总数据条数；OnePageCount：一页显示的数据条数；ThisPageIndex：当前页索引，从0开始
function data_table_init(DataTableObj) {
    layui.use('table', function () {
        var table1 = layui.table;
        //第一个实例
        g_table_config.data = DataTableObj;
        g_tableIns = table1.render(g_table_config);
    });
}



//在要素字段总表中查找当前字段名
function get_field_name(AllEssDataCache, field) {

    try {
        for (var i = 0; i < AllEssDataCache.length; i++) {
            if (AllEssDataCache[i].标识符ASCII码 == field) {
                return AllEssDataCache[i].编码要素;
            }
        }
    } catch (e) {

    }
    return field;
}


//在要素字段总表中查找当前字段单位
function get_field_uint(AllEssDataCache, field) {

    try {
        for (var i = 0; i < AllEssDataCache.length; i++) {
            if (AllEssDataCache[i].标识符ASCII码 == field) {
                return AllEssDataCache[i].量和单位;
            }
        }
    } catch (e) {

    }
    return field;
}

//将获取到的设备数据转换为能被layui table显示的数据 DeviceRealData:需要显示的详细设备信息
function conversion_data_layui_table(DeviceRealData) {
    var DeviceTableData = JSON.parse('[]');                  //清空数据，创建一个对象数组   
    var cnt = 0;
    var FielName = '';  //字段名称
    var DataObj;
    var EssList = [];   //要素字段列表
    var EssName = [];   //要素字段名称
    var EssUint = [];   //要素字段名称
    var EssData = [];   //字段对应值

    try {

        if (DeviceRealData == null || DeviceRealData.length == 0)//没有数据
        {
            return DeviceTableData;
        }
        else {
            //强制第一个为采集时间
            var obj = new Object();
            obj.ID = (cnt + 1) + '';
            obj.ESS = '采集时间';                                        //获取要素名称
            obj.DATA = DeviceRealData[0]['TT'];                         //获取字段年对于的值
            // obj.UINT = get_field_uint(g_AllEssDataCache, 'TT');       //获取要素单位
            DeviceTableData[cnt] = obj;
            cnt++;

            //遍历json对象的每个key/value对,p为key-获取要素数据 ESS_ASCII
            for (var p in DeviceRealData[0]) {

                //alert(p + " " + DeviceRealData[0][p]);

                if (p != 'ST' && p != 'TT' && p != 'UT' && (p != null)) {


                    EssList[cnt] = p; //记录字段

                    var obj = new Object();

                    obj.ESS = get_field_name(g_AllEssDataCache, p);    //获取要素名称
                    if (DeviceRealData[0][p] == '-9999.999') //无效值
                    {
                        obj.DATA = '-';                    //获取字段年对于的值
                    }
                    else {
                        obj.DATA = DeviceRealData[0][p] + ' ' + get_field_uint(g_AllEssDataCache, p);                    //获取字段年对于的值
                    }

                    //alert(p + " " + DeviceRealData[0][p]);
                    if ((DeviceRealData[0][p] != null) && (DeviceRealData[0][p] != null)) {
                        //alert(p + " " + DeviceRealData[0][p]);
                        DeviceTableData[cnt] = obj;
                        cnt++;
                    }

                }
            }

            //强制最后一个为上传时间
            var obj = new Object();
            obj.ID = (cnt + 1) + '';
            obj.ESS = '上传时间';                                        //获取要素名称
            obj.DATA = DeviceRealData[0]['UT'];                         //获取字段年对于的值
            // obj.UINT = get_field_uint(g_AllEssDataCache, 'TT');       //获取要素单位
            DeviceTableData[cnt] = obj;
            cnt++;
        }
    }
    catch (e) {
        layer.alert("处理数据发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }

    //alert(JSON.stringify(DeviceTableData, 4));        //调试显示信息
    return DeviceTableData;
}


//选择事件
function SelectionEvent(index, data_name, text) {
    //loading_message1('加载数据中...');                    //弹出提示框


    g_ThisST = data_name;                                   //当前设备ST
    var make_index = search_make_index(g_ThisST);
    //alert(make_index);
    SetMarker(make_index);             //更新地图的marker点
    var str = text;
    str = str.substring(11, str.length);                //截取后面的名称
    g_ThisNAME = str;                                   //当前设备NAME
    SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME);   //获取并显示当前选择的设备的数据
    //alert(JSON.stringify(obj), 4);
    //close_message();                                    //关闭提示框 
    //alert(JSON.stringify(obj), 4);
    //alert('选择索引：' + index);
}

//点击按钮刷新当前设备实时数据
function RefreshThisRealData_OnClick() {
    loading_message1('加载数据中...');                    //弹出提示框
    SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME);   //获取并显示当前选择的设备的数据
    close_message();                                    //关闭提示框 
}

//点击按钮刷新当前设备实时图片
function RefreshThisRealPicture_OnClick() {
    loading_message1('加载数据中...');                    //弹出提示框
    getPicture();   //刷新图片
    close_message();                                    //关闭提示框 
}



//初始化要素数据
function AllDeviceEssInit() {
    var obj = null;
    try {
        obj = parent.Read_AllEssDataCache();    //读取父页面缓存的数据
    }
    catch (e) {

    }
    if (obj == null || obj.length == 0) //缓存无效才从服务器获取
    {
        //alert("ajax获取要素表");
        obj = parent.GetAllEssData();  //获取所有要素数据
        parent.Write_AllEssDataCache(obj);    //写入缓存到父页面
    }

    return obj;
}
