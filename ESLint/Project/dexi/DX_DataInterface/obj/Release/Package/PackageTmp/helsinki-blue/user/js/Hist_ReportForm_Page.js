var g_DataAllCnt = 0;               // 数据总数
var g_HistDataObj = [];             // 当前历史数据
var g_AllEssDataCache;              // 所有要素数据列表-从父页面加载
var g_TableData;                    // 当前表格显示的数据
var cg_OnePageDataCount = 100;
var g_ThisST;                       // 当前设备ST
var g_ThisName;                     // 当前设备Name
var g_AlarmConfigObj = null;        // 当前设备的报警配置数据
var g_layer_msg_index;              // 加载框id
var g_SelectPageIndex = 0;
var g_StartTime;                    // 当前搜索框开始时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_EndTime;                      // 当前搜索框结束时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_TempStartTime;                // 临时存放时间控件的时间，格式为：{"year":2018,"month":7,"date":25,"hours":0,"minutes":0,"seconds":0}
var g_TempEndTime;                  // 临时存放时间控件的时间，格式为：{"year":2018,"month":7,"date":25,"hours":0,"minutes":0,"seconds":0}
var g_MyTree;
var g_overTdsIndexs = [];           // 记录每一行超限的 td index 的数组

// 表头
var g_table_cols = [];

// 底部分页栏配置
var g_table_limt = {
    elem: 'limt_butt_id',
    theme: '#3E79BB',                           // 主题风格
    count: 0,                                   // 总数
    limit: cg_OnePageDataCount,                 // 单页显示数据条数
    groups: 10,                                 // 连续出现的页码个数
    curr: (g_SelectPageIndex + 1),              // 当前页码
    layout: ['prev', 'page', 'next', 'count'],
    jump: function (obj, first) {               // 分页回调
        table_limt_jump_event(obj, first);      // 翻页处理
    }
};

// 用于记录当前滑动条位置
var g_scrollTop = {
    dev_obj: null,      // layui table 父div
    layuitable: null,   // 当前的layui table
    scrollTop: 0        // 记录位置
};

// table表格配置
var g_table_config = {
    elem: '#device_list_table_id',
    data: null,
    limit: cg_OnePageDataCount,     // 每页显示
    text: {
        none: '暂无相关数据'
    },
    height: 'full-200',
    cellMinWidth: 70,               // 全局定义常规单元格的最小宽度，layui 2.2.1 新增
    page: false,                    // 开启分页
    cols: [g_table_cols],
    even: true,                     // 开启隔行背景
    size: 'sm',                     // 小尺寸的表格
    done: function () {
        var trs = Layui_GetDataTableRows('table_and_page_div_id');
        // console.log(g_overTdsIndexs);

        if (trs == null || trs.length <= 0 || g_overTdsIndexs == null || g_overTdsIndexs.length <= 0) return;

        for (let i = 0; i < trs.length; i++) {
            for (let j = 0; j < trs[i].children.length; j++) {
                // g_overTdsIndexs[i] 里面是否包含 j， 如果有，则把对应要素字体颜色设置为超限颜色
                if (g_overTdsIndexs[i].indexOf(j) != -1) {
                    trs[i].children[j].style.color = '#fa0050';
                }
            }
        }
    }
};

// 初始化加载执行
window.onload = function () { // 要执行的js代码段

    $.ajaxSettings.async = false; // 由于有ajax，强制js为同步执行
    // loading_message('加载数据中...');                 // 弹出提示框

    // 自动高度-右侧正文
    var oDiv = document.getElementById('user_content_id_1');
    oDiv.style.height = ($(window).height() - 2) + 'px';
    // 左侧列表
    var oDiv = document.getElementById('panel_id_1');
    oDiv.style.height = ($(window).height() - 12 - 30) + 'px';

    // 自动高度
    var oDiv = document.getElementById('div_scroll_id');
    oDiv.style.height = ($(window).height() - 2) + 'px';

    // 图标居中
    var oDiv = document.getElementById('scroll_ico_id');
    oDiv.style.marginTop = ($(window).height() - 100) / 2 + 'px';

    // 自动高度右侧 panel
    var oDiv = document.getElementById('user_panel_id_1');
    oDiv.style.height = ($(window).height() - 40 + 10) + 'px';

    laydate_init(); // 初始化时间控件
    g_AllEssDataCache = AllDeviceEssInit(); // 初始化所有要素数据
    // 下载数据
    g_AllDeviceList = ajaxSyncGetDeviceList(); // 获取当前用户所有设备基本信息列表
    g_AllGroupList = ajaxSyncGetAllGroupList(); // 获取所有分组信息
    // alert(JSON.stringify(g_AllGroupList), 4);
    // 准备要显示的数据
    var ObjArr = conversion_data_tree_node(g_AllGroupList, g_AllDeviceList, 0); // 子列表数据源
    g_tree_config.ParentData = ObjArr[0]; // 父标签数据源
    g_tree_config.LiData = ObjArr[1];
    g_tree_config.SelectionEvent = SelectionEvent; // 点击事件
    //  alert(JSON.stringify(g_tree_config.ParentData), 4);
    // alert(JSON.stringify(g_tree_config.LiData), 4);
    g_MyTree = new tree_list(g_tree_config);
    g_MyTree.render(); // 绘制列表
    // 侧边栏鼠标悬浮事件
    myTreeHoverEvent()

    g_ThisST = g_AllDeviceList[0].ST;       // 当前设备ST
    g_ThisNAME = g_AllDeviceList[0].NAME;   // 当前设备NAME


    setTimeout('DelayInitData()', 250);     // 延时加载数据
    close_message(); // 关闭提示框
}

// 延时加载数据，先加载左侧的站点列表
function DelayInitData() {
    // 加载当前设备数据
    SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime); // 获取并显示当前选择的设备的数据

}

// 浏览器窗口大小变化事件
$(window).resize(function () { // 当浏览器大小变化时
    // 自动高度
    var oDivContent = document.getElementById('user_content_id_1');
    oDivContent.style.height = ($(window).height() - 2) + 'px';

    var oDiv = document.getElementById('panel_id_1');
    oDiv.style.height = ($(window).height() - 12 - 30) + 'px';

    // 自动高度
    var oDiv = document.getElementById('div_scroll_id');
    oDiv.style.height = ($(window).height() - 2) + 'px';

    // 图标居中
    var oDiv = document.getElementById('scroll_ico_id');
    oDiv.style.marginTop = ($(window).height() - 100) / 2 + 'px';

    // 自动高度右侧panle
    var oDiv = document.getElementById('user_panel_id_1');
    oDiv.style.height = ($(window).height() - 40 + 10) + 'px';
});

// 时间控件初始化
function laydate_init() {
    try {
        // 时间控件初始化
        layui.use('laydate', function () {
            var myDate = new Date(); // 获取当前系统时间
            var LastDate = new Date(); // 获取当前系统时间
            LastDate.setDate(LastDate.getDate() - 1); // 获取2天前时间
            // 初始化时间
            g_TempStartTime = {
                year: LastDate.getFullYear(),
                month: (LastDate.getMonth() + 1),
                date: LastDate.getDate(),
                hours: 0,
                minutes: 0,
                seconds: 0
            };
            g_TempEndTime = {
                year: myDate.getFullYear(),
                month: (myDate.getMonth() + 1),
                date: myDate.getDate(),
                hours: 0,
                minutes: 0,
                seconds: 0
            };
            get_time_frame(); // 更新一次时间

            var laydate = layui.laydate;
            // 自定义格式
            laydate.render({
                elem: '#test11',
                format: 'yyyy年MM月dd日',
                value: LastDate.getFullYear() + '年' + (LastDate.getMonth() + 1) + '月' + LastDate.getDate() + '日' // 必须遵循format参数设定的格式
                    ,
                done: function (value, date, endDate) { // 控件选择完毕后的回调---点击日期、清空、现在、确定均会触发。
                    g_TempStartTime = date; // 临时存放开始时间
                    //  alert(JSON.stringify(date, 4)); // 得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                },
                theme: '#3E79BB' // 颜色-蓝色
            });

            // 自定义格式
            laydate.render({
                elem: '#test12',
                format: 'yyyy年MM月dd日',
                value: myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日' // 必须遵循format参数设定的格式
                    ,
                done: function (value, date, endDate) { // 控件选择完毕后的回调---点击日期、清空、现在、确定均会触发。
                    g_TempEndTime = date; // 临时存放结束时间
                    // alert(JSON.stringify(date, 4)); // 得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                },
                theme: '#3E79BB' // 颜色-蓝色
            });

        });
    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
}

// 获取时间范围，时间存放到全局 g_StartTime，g_EndTime
function get_time_frame() {
    try {
        g_StartTime = g_TempStartTime.year + '-' + g_TempStartTime.month + '-' + g_TempStartTime.date + ' 00:00:00';
        g_EndTime = g_TempEndTime.year + '-' + g_TempEndTime.month + '-' + g_TempEndTime.date + ' 23:59:59';

        // alert(g_StartTime + ' ' + g_EndTime);
    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
}

// 刷新底部分页栏(AllDataCount:总的数据条数；OnePageCount：一页显示的数据条数；ThisPageIndex：当前页索引，从0开始,无需修改的参数可以为null)
function table_limt_refresh(AllDataCount, OnePageCount, ThisPageIndex) {
    // 刷新底部的分页栏
    layui.use('laypage', function () {
        var laypage = layui.laypage;
        // 执行一个laypage实例-设置分页
        if (AllDataCount != null) {
            g_table_limt.count = AllDataCount; // 数总数
        } else {
            g_table_limt.count = 0;
        }
        if (OnePageCount != null) {
            g_table_limt.limit = OnePageCount; // 单页显示数据条数
        }
        if (ThisPageIndex != null) {
            g_table_limt.curr = ThisPageIndex + 1; // 当前页
        }
        laypage.render(g_table_limt); // 重新刷新底部分页
    });
}

// 刷新某个站点数据
function SelectAndGetDeviceHistData(ST, NAME, StartTime, EndTime) {
    try {

        // 刷新站点编号与名称
        document.getElementById('lable_st_id').innerHTML = '编号：' + ST;
        document.getElementById('lable_name_id').innerHTML = '名称：' + NAME;

        g_SelectPageIndex = 0; // 页索引为0
        // 下载当前设备的历史数据
        g_DataAllCnt = p_ajaxGetHistDataCount(ST, StartTime, EndTime, false); // 获取数据条数
        
        if (g_DataAllCnt > 0) {
            g_HistDataObj = ajaxSyncGetHistData(ST, StartTime, EndTime, false, 0, 100); // 获取第一页数据
        } else {
            g_HistDataObj = [];
        }
        // 获取当前设备的报警配置
        g_AlarmConfigObj = ajax_sync_get_device_alarm_data(ST); 
        // console.log(g_AlarmConfigObj);

        // 将数据转换为能被显示的格式
        g_TableData = conversion_data_layui_table(g_HistDataObj, 1, g_AlarmConfigObj); 
        g_table_config.cols[0] = g_table_cols; // 更新字段
        // alert(JSON.stringify(g_table_cols, 4));        // 调试显示信息
        // alert(JSON.stringify(g_DeviceInfoDataPage, 4));        // 调试显示信息

        if (g_tableIns != null) { // 表格重载
            g_table_config.data = g_TableData;
            g_tableIns.reload(g_table_config);
        } else {
            data_table_init(g_TableData); // 初始化表格
        }
        table_limt_refresh(g_DataAllCnt, cg_OnePageDataCount, g_SelectPageIndex); // 刷新底部的分页栏
    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
}

// 表格翻页处理
function table_limt_jump_event(obj, first) {
    try {
        // obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
        //  console.log(obj.limit); // 得到每页显示的条数

        // 首次不执行
        if (!first) {
            // alert(obj.curr + " " + obj.limit);
            if (g_DataAllCnt == 0) {
                layer.alert("没有数据", {
                    icon: 5,
                    scrollbar: false
                }); // 5：失败；6：成功
                return;
            }

            // 弹出提示框
            g_layer_msg_index = layer.msg('加载中', {
                icon: 16,
                shade: 0.1 // 越大界面越黑
                    ,
                time: 60000, // 时间
                anim: 0, // 平滑放大
                scrollbar: false // 锁定浏览器滑动
            });

            g_SelectPageIndex = obj.curr - 1; // 获取当前页索引

            g_HistDataObj = ajaxSyncGetHistData(g_ThisST, g_StartTime, g_EndTime, false, g_SelectPageIndex * cg_OnePageDataCount, cg_OnePageDataCount); // 获取第n页数据

            g_TableData = conversion_data_layui_table(g_HistDataObj, g_SelectPageIndex * cg_OnePageDataCount + 1, g_AlarmConfigObj); // 将数据转换为能被显示的格式
            g_table_config.cols[0] = g_table_cols; // 更新字段
            // alert(JSON.stringify(g_table_cols, 4));        // 调试显示信息
            // alert(JSON.stringify(g_DeviceInfoDataPage, 4));        // 调试显示信息

            RecordScrollTop(); // 记录scrollTop位置，在表格重载之前调用（依赖全局g_scrollTop）
            // 刷新当前页
            g_table_config.data = g_TableData;
            g_table_config.cols[0] = g_table_cols; // 更新字段
            g_tableIns.reload(g_table_config);

            layer.close(g_layer_msg_index); // 关闭提示框
            RestoreScrollTop(); // 还原scrollTop位置，在表格重载之后调用（依赖全局g_scrollTop）
        } else {
            g_SelectPageIndex = obj.curr - 1;
        }
    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
}

// 初始化表格(只能调用一次，并且会在调用后延时一段时间才能初始化完成)DataTableObj:当前要显示的数据；AllDataCount：总数据条数；OnePageCount：一页显示的数据条数；ThisPageIndex：当前页索引，从0开始
function data_table_init(DataTableObj) {
    layui.use('table', function () {
        var table1 = layui.table;
        // 第一个实例
        g_table_config.data = DataTableObj;
        g_tableIns = table1.render(g_table_config);
    });
}

// 在要素字段总表中查找当前字段名
function get_field_name(AllEssDataCache, field) {
    try {
        for (var i = 0; i < AllEssDataCache.length; i++) {
            if (AllEssDataCache[i].标识符ASCII码 == field) {
                return AllEssDataCache[i].编码要素 + '(' + AllEssDataCache[i].量和单位 + ')';
            }
        }
    } catch (e) {

    }
    return field;
}

// 将获取到的设备数据转换为能被layui table显示的数据 DeviceHistData:历史数据,StartRowNumber:当前显示的行号起始，从1开始；
function conversion_data_layui_table(DeviceHistData, StartRowNumber, DeviceAlarmConfig) {
    var DeviceTableData = JSON.parse('[]'); // 清空数据，创建一个对象数组
    g_FieldList = [];
    var cnt = 0;
    var fileName = ''; // 字段名称
    var DataObj;
    // 表头
    g_table_cols = [{
        field: 'ID',
        title: '序号',
        width: 60,
        // fixed: 'left',
        align: 'center'
    }, {
        field: 'TT',
        title: '采集时间',
        width: 150,
        align: 'center'
    }];

    try {
        if (DeviceHistData == null || DeviceHistData.length == 0) { // 没有数据
            // 清除超限索引数组
            g_overTdsIndexs = [];

            return DeviceTableData;
        }
        // 有数据
        for (var p in DeviceHistData[0]) { // 遍历 json对象的每个 key/value对,p 为 key
            if (p != 'ST' && p != 'TT' && p != 'UT' && p != null) {
                g_FieldList[cnt] = p; // 记录字段
                fileName = get_field_name(g_AllEssDataCache, p); // 获取字段名称
                var obj = {
                    field: p,
                    title: fileName,
                    width: ((fileName.length - 1) * 12 + 30),
                    align: 'center'
                };
                g_table_cols[2 + cnt] = obj;

                cnt++;
            }
        }
            
        // 在最后面添加上传时间
        g_table_cols[2 + cnt] = {
            field: 'UT',
            title: '上传时间',
            width: 150,
            align: 'center'
        };
        // 初始化超限总数组
        g_overTdsIndexs = [];
        for (var i = 0; i < DeviceHistData.length; i++) {
            // 初始化每一行的超限索引
            var g_overTdsIndexArray = [];
            
            var obj = new Object(); // 定义对象
            // 给对象添加属性
            obj.ID = (StartRowNumber + i) + ''; // 行号，加上起始行号

            DataObj = DeviceHistData[i];
            
            if (DataObj == null) {      // 没有找到，有数据
                obj.STATUS = '无数据';  // 状态
            } else {
                // 循环显示普通要素数据
                for (var j = 0; j < g_FieldList.length; j++) {
                    var essTitle = g_FieldList[j];
                    if (DataObj[essTitle] < -30) { // 无效值
                        obj[essTitle] = '';
                    } else {
                        obj[essTitle] = DataObj[essTitle];
                    }

                    // 如果设置了报警值，设置对应数据的颜色和数据
                    if (DeviceAlarmConfig != null && DeviceAlarmConfig[essTitle] != undefined && DeviceAlarmConfig[essTitle].ALARM != undefined && DeviceAlarmConfig[essTitle].ALARM == 1) {

                        var alarmConfigEss = DeviceAlarmConfig[essTitle];
                        // 设置了上限，判断是否超标
                        if (alarmConfigEss.AH != 0 && obj[essTitle] > alarmConfigEss.AH) {
                            g_overTdsIndexArray.push(j + 2);
                        } 
                        // 设置了下限，判断是否超标
                        else if (alarmConfigEss.AL != 0 && obj[essTitle] < alarmConfigEss.AL) {
                            g_overTdsIndexArray.push(j + 2);
                        }
                    }
                }
                obj.TT = DataObj.TT;
                obj.UT = DataObj.UT;
            }
            // 保存每一行的超限索引到总数组
            g_overTdsIndexs.push(g_overTdsIndexArray);

            DeviceTableData[i] = obj; // 添加对象到数组
        }
    } catch (e) {
        layer.alert("处理数据发生了错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }

    return DeviceTableData;
}

// 记录scrollTop位置，在表格重载之前调用（依赖全局g_scrollTop）
function RecordScrollTop() {
    try {
        g_scrollTop.dev_obj = document.getElementById('table_and_page_div_id'); // table的父div
        if (g_scrollTop.dev_obj != null) {
            g_scrollTop.layuitable = g_scrollTop.dev_obj.getElementsByClassName("layui-table-main");
        }
        if (g_scrollTop.layuitable != null && g_scrollTop.layuitable.length > 0) {
            g_scrollTop.scrollTop = g_scrollTop.layuitable[0].scrollTop; // layuitable获取到的是 class=layui-table-main的集合
        }
    } catch (e) {
        g_scrollTop.scrollTop = 0;
        console.log(e.message);
    }
}

// 还原scrollTop位置，在表格重载之后调用（依赖全局g_scrollTop）
function RestoreScrollTop() {
    try {
        // 还原scroll位置
        if (g_scrollTop.layuitable != null && g_scrollTop.layuitable.length > 0) {
            g_scrollTop.layuitable[0].scrollTop = g_scrollTop.scrollTop;
        }
    } catch (e) {
        // console.log(e.message);
    }
}

// 选择事件
function SelectionEvent(index, data_name, text) {
    loading_message1('加载数据中...'); // 弹出提示框

    laydate_init(); // 初始化时间控件
    g_ThisST = data_name; // 当前设备ST
    var str = text;
    str = str.substring(11, str.length); // 截取后面的名称
    g_ThisNAME = str; // 当前设备NAME
    // 延时先等等加载中...显示出来后再加载数据
    setTimeout(
        function () {
            SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime); // 获取并显示当前选择的设备的数据
            // alert(JSON.stringify(obj), 4);
            close_message(); // 关闭提示框 
        }, 100);
}

// 点击查询数据
function query_data_onclick() {
    try {
        loading_message1('加载数据中...'); // 弹出提示框
        get_time_frame(); // 更新时间范围
        // 延时先等等加载中...显示出来后再加载数据
        setTimeout(
            function () {
                SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime); // 获取并显示当前选择的设备的数据
                // alert(JSON.stringify(obj), 4);
                close_message(); // 关闭提示框 
            }, 100);
    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
}

// 快捷选择-查询历史数据
layui.use('form', function () {
    var form = layui.form;
    // 各种基于事件的操作，下面会有进一步介绍
    form.on('select(select_filter)', function (data) {
        // alert(data.value + '天'); // 得到被选中的值
        try {
            if (data.value <= 0 || data.value > 60) return; // 时间
            var EndDate = new Date(); // 获取当前系统时间
            var StartDate = new Date(); // 获取当前系统时间
            StartDate.setDate(StartDate.getDate() - data.value); // 获取n天前时间

            g_StartTime = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate() + ' ' + StartDate.getHours() + ':' + StartDate.getMinutes() + ':' + StartDate.getSeconds();
            g_EndTime = EndDate.getFullYear() + '-' + (EndDate.getMonth() + 1) + '-' + EndDate.getDate() + ' ' + EndDate.getHours() + ':' + EndDate.getMinutes() + ':' + EndDate.getSeconds();
            // alert(g_StartTime + ' ' + g_EndTime);


            loading_message1('加载数据中...'); // 弹出提示框
            // 延时先等等加载中...显示出来后再加载数据
            setTimeout(
                function () {
                    SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime); // 获取并显示当前选择的设备的数据
                    // alert(JSON.stringify(obj), 4);
                    close_message(); // 关闭提示框 
                }, 100);

        } catch (e) {
            layer.alert("错误：" + e.message, {
                icon: 5,
                scrollbar: false
            }); // 5：失败；6：成功
        }
    });
});

// 初始化要素数据
function AllDeviceEssInit() {
    var obj = null;
    try {
        obj = parent.Read_AllEssDataCache(); // 读取父页面缓存的数据
    } catch (e) {

    }
    if (obj == null || obj.length == 0) { // 缓存无效才从服务器获取
        // alert("ajax获取要素表");
        obj = parent.GetAllEssData(); // 获取所有要素数据
        parent.Write_AllEssDataCache(obj); // 写入缓存到父页面
    }

    return obj;
}

// 导出当前页数据
function down_this_page_onclick() {
    try {
        if (g_TableData == null || g_TableData.length == 0) {
            layer.msg('错误：没有数据需要导出，请先查询数据！', {
                icon: 5,
                scrollbar: false
            });
            return;
        }

        var sheetFilter = [];
        var sheetHeader = [];
        var option = {};
        // 准备字段与字段别名
        for (var i = 0; i < g_table_cols.length; i++) {
            sheetFilter[i] = g_table_cols[i].field;
            sheetHeader[i] = g_table_cols[i].title;
        }
        // https:// www.cnblogs.com/kin-jie/p/6180707.html
        var option = {};
        option.fileName = g_ThisNAME + '(' + g_ThisST + ')' + '历史数据导出';
        option.datas = [{
            sheetData: g_TableData,
            sheetName: 'sheet',
            sheetFilter: sheetFilter, // ['two', 'one'],
            sheetHeader: sheetHeader, // ['第一列', '第二列']
        }];
        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();

    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
}

// 导出所有页数据
function down_all_page_onclick() {
    try {
        if (g_TableData == null || g_TableData.length == 0) {
            layer.msg('错误：没有数据需要导出，请先查询数据！', {
                icon: 5,
                scrollbar: false
            });
            return;
        }

        loading_message1('加载数据中...'); // 弹出提示框
        // 延时先等等加载中...显示出来后再加载数据
        setTimeout(
            function () {

                var AllData = DownAllData(); // 下载数据
                if (AllData == null || AllData.length == null) {
                    close_message(); // 关闭提示框 
                    layer.msg('错误：没有数据需要导出，请先查询数据！', {
                        icon: 5,
                        scrollbar: false
                    });
                    return;
                }
                var sheetFilter = [];
                var sheetHeader = [];
                // 准备字段与字段别名
                for (var i = 1; i < g_table_cols.length; i++) {

                    sheetFilter[i - 1] = g_table_cols[i].field;
                    sheetHeader[i - 1] = g_table_cols[i].title;
                }

                var option = {};
                // https:// www.cnblogs.com/kin-jie/p/6180707.html
                option.fileName = g_ThisNAME + '(' + g_ThisST + ')' + '历史数据导出';
                option.datas = [{
                    sheetData: AllData,
                    sheetName: 'sheet',
                    sheetFilter: sheetFilter, // ['two', 'one'],
                    sheetHeader: sheetHeader, // ['第一列', '第二列']
                }];
                close_message(); // 关闭提示框 
                var toExcel = new ExportJsonExcel(option);
                toExcel.saveExcel();
            }, 100);

    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
}

// 下载所有数据，用于本地数据导出，需要一个进度条
function DownAllData() {
    var AllData_Obj = [];
    var page_count = Math.ceil(g_DataAllCnt / 500); // 向上取整-获取页数

    try {
        for (var i = 0; i < page_count; i++) {
            var DataObj = ajaxSyncGetHistData(g_ThisST, g_StartTime, g_EndTime, false, i * 500, 500); // 获取第一页数据
            if (DataObj == null || DataObj.length == 0) // 提前结束了，退出
            {
                layer.alert("错误：获取数据失败，提前结束了数据下载！", {
                    icon: 5,
                    scrollbar: false
                }); // 5：失败；6：成功
                break;
            } else {
                for (var j = 0; j < DataObj.length; j++) // 拷贝数据到列表中-列表中存放所有的数据
                {
                    AllData_Obj[i * 500 + j] = DataObj[j];
                }
            }
        }
    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }

    return AllData_Obj;
}