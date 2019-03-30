var g_DataAllCnt = 0;                   // 数据总数
var g_HistDataObj = [];                 // 当前历史数据
var g_TableData;                        // 当前表格显示的数据
var cg_OnePageDataCount = 100;          // 一页显示的数量
var g_layer_msg_index;                  // 加载框id
var g_SelectPageIndex = 0;              // 选中页的索引
var g_StartTime;                        // 当前搜索框开始时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_EndTime;                          // 当前搜索框结束时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_TempStartTime;                    // 临时存放时间控件的时间，格式为：{"year":2018,"month":7,"date":25,"hours":0,"minutes":0,"seconds":0}
var g_TempEndTime;                      // 临时存放时间控件的时间，格式为：{"year":2018,"month":7,"date":25,"hours":0,"minutes":0,"seconds":0}
var g_AllDeviceInfo = [];               // 当前用户全部设备的基本信息
var g_AllGroupList = [];                // 当前用户下的设备分组信息
var g_deviceName = '';                  // 当前选中的站点名字
var g_essName = '';                     // 当前选中的要素名字
var g_selectDatas = []                  // 下拉框数据
var g_thisST = '';
var g_thisEss = '';

// 报警要素
var g_AlarmEss = [
    { title : 'TT',     text: '超时' },
    { title : 'VT',     text: '电压' },
    { title : 'Z',      text: '水位1' },
    { title : 'ZB',     text: '水位2' },
    { title : 'Q1',     text: '流量1' },
    { title : 'Q2',     text: '流量2' },
    { title : 'SBL1',   text: '小时水量1' },
    { title : 'SBL2',   text: '小时水量2' },
];

// 报警类型
var g_AlarmType = [
    { title : 'HIGH ALARM',     text: '高报警' },
    { title : 'LOW ALARM',      text: '低报警' },
    { title : 'TIMEOUT',       text: '超时' }
];

// table表格配置
var g_table_config = {
    elem: '#device_list_table_id',
    data: null,
    limit: cg_OnePageDataCount,
    text: { none: '暂无相关数据' },
    height: 'full-250',
    cellMinWidth: 70, // 全局定义常规单元格的最小宽度，layui 2.2.1 新增
    page: false, // 开启分页
    cols: [[ // 表头
    { field: 'ID', title: '序号', width: 60 },
    { field: 'TIME', title: '报警时间', width: 160 },
    { field: 'ST', title: '设备编号', width: 120 },
    { field: 'NAME', title: '站点名称', width: 210 },
    { field: 'A_ESS', title: '报警要素', width: 100 },
    { field: 'A_TYPE', title: '报警类型', width: 110 },
    { field: 'VALUE', title: '报警值', width: 90 },
    { field: 'A_VALUE', title: '阈值', width: 60 },
    { field: 'A_INFO', title: '报警信息', width: 160 },
    { field: 'TT', title: '采集时间', width: 160 }
    ]],
    even: true, // 开启隔行背景
    size: 'sm' // 小尺寸的表格
};

// 底部分页栏配置
var g_table_limt = {
    elem: 'limt_butt_id',
    theme: '#3E79BB',                   // 主题风格
    count: 0,              // 总数
    limit: cg_OnePageDataCount,         // 单页显示数据条数
    groups: 10,      // 连续出现的页码个数
    curr: (g_SelectPageIndex + 1),             // 当前页码
    layout: ['prev', 'page', 'next', 'count'],
    jump: function (obj, first) {// 分页回调
    table_limt_jump_event(obj, first);  // 翻页处理
    }
};

// 用于记录当前滑动条位置
var g_scrollTop = {
    dev_obj: null,          // layui table 父div
    layuitable: null,       // 当前的layui table
    scrollTop: 0            // 记录位置
};

// 初始化加载执行
window.onload = function () {   // 要执行的js代码段  

    $.ajaxSettings.async = false;                   // 由于有ajax，强制js为同步执行
    loading_message('加载数据中...');             // 弹出提示框

    // 自动高度-右侧正文
    var oDiv = document.getElementById('user_content_id_1');
    oDiv.style.height = ($(window).height() - 2) + 'px';

    // 自动高度右侧 panle
    var oDiv = document.getElementById('user_panel_id_1');
    oDiv.style.height = ($(window).height() - 40 + 10) + 'px';

    laydate_init();                                         // 初始化时间控件

    // 获取当前用户所有设备基本信息 
    g_AllDeviceInfo =  ajaxSyncGetDeviceList();    
    g_AllGroupList = ajaxSyncGetAllGroupList();
    
    g_selectDatas = conversion_data_tree_node(g_AllGroupList, g_AllDeviceInfo, 0);

    setTimeout('DelayInitData()', 250);                     // 延时加载数据
    // close_message();                                        // 关闭提示框 
}

// 延时加载数据
function DelayInitData() {
    // 设置站点下拉框数据
    setDeviceSelectData('device_id');
    // 设置要素下拉框数据
    setEssSelectData('ess_id');

    refreshAlarmData(g_StartTime, g_EndTime);   // 获取并显示当前页报警数据
}

// 浏览器窗口大小变化事件
$(window).resize(function () {          // 当浏览器大小变化时
    // 自动高度
    var oDivContent = document.getElementById('user_content_id_1');
    oDivContent.style.height = ($(window).height() - 2) + 'px';

    // 自动高度右侧panle
    var oDiv = document.getElementById('user_panel_id_1');
    oDiv.style.height = ($(window).height() - 40 + 10) + 'px';
});

// 设置下拉框 报警站点选择数据
function setDeviceSelectData(elementID) {
    var $device = $('#' + elementID);

    // 添加设备分组和名称
    for (let i = 0; i < g_selectDatas[0].length; i++) {
        $device.append('<optgroup id="'+ elementID +'_'+ i +'" parentNodeId="' + g_selectDatas[0][i].ParentNodeId + '" label=\"' + g_selectDatas[0][i].NodeText + '\"></optgroup>');

        // 添加option
        for (let j = 0; j < g_selectDatas[1].length; j++) {
            
            var groupElement = document.getElementById(elementID + '_' + i);
            var groupParentNodeId = groupElement.getAttribute('parentNodeId');

            if (groupParentNodeId == g_selectDatas[1][j].ParentNodeId) {
                var optionElement =  document.createElement("option");
                optionElement.setAttribute('parentNodeId', g_selectDatas[1][j].ParentNodeId);
                optionElement.innerHTML = g_selectDatas[1][j].NodeText;
                optionElement.value = g_selectDatas[1][j].NodeName;

                groupElement.appendChild(optionElement);
            }
        }
    }

    var form = layui.form; // 只有执行了这一步，部分表单元素才会自动修饰成功
    form.render('select');

    // 关闭加载提示
    close_message()

}

// 设置下拉框 报警要素选择数据
function setEssSelectData(essId) {
    var $essEle = $('#' + essId);

    var form = layui.form;

    for (let i = 0; i < g_AlarmEss.length; i++) {
        $essEle.append('<option value=\"' + i + '\">' + g_AlarmEss[i].text + '</option>');
    }
    
    form.render('select');
}

// 获取当前用户下报警记录总数量
// StartTime：开始时间，YYYY-MM-DD hh:mm:ss格式；EndTime：结束时间，YYYY-MM-DD hh:mm:ss格式；isASC：是否为顺序查询；
function ajax_sync_get_alarm_data_count(StartTime, EndTime, isASC) {
    var cnt = 0;
    try {
        // 请求服务器
        var jsonData = {
            GetFun: 'GetAlarmDataCount',
            ST: g_thisST,
            REAL_ESS: g_thisEss,
            StartTime: StartTime,               // YYYY-MM-DD hh:mm:ss格式
            EndTime: EndTime,                   // YYYY-MM-DD hh:mm:ss格式
            isASC: isASC,
        };
        

        $.ajax({
            url: '/Home/Index',
            type: 'POST',
            dataType: 'json',
            async: false,                       // 同步执行
            data: jsonData,
        })
        .done(function (response) {
            if (response.rel == 1) {            // 获取成功

                // console.log(response);        // 调试显示信息

                if (response.obj == null) {     // 没有数据

                }
                else {
                    cnt = JSON.parse(response.obj);  // 转换为对象
                }
            }
            else if (response.rel == -1) {           // 需要登录
                layer.alert(response.msg, { icon: 5, scrollbar: false }); // 5：失败；6：成功
                parent.JumpLogon();
            }
            else {
                layer.alert(response.msg, { icon: 5, scrollbar: false }); // 5：失败；6：成功
            }
        })
        .fail(function () {
            layer.alert('通信错误，请求数据失败！', { icon: 5, scrollbar: false }); // 5：失败；6：成功
        })
    }
    catch (e) {
        layer.alert("发生了错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }

    return cnt;
}

// 获取报警记录详细信息(一页)
// StartTime：开始时间，YYYY-MM-DD hh:mm:ss格式；EndTime：结束时间，YYYY-MM-DD hh:mm:ss格式；isASC：是否为顺序查询；
function ajax_sync_get_alarm_data(StartTime, EndTime, isASC, StartIndex, ReadCnt) {
    var obj = [];

    // alert('请求历史数据信息');
    try {
        // 请求服务器
        var jsonData = {
            GetFun: 'GetAlarmData',
            ST: g_thisST,
            REAL_ESS: g_thisEss,
            StartTime: StartTime,               // YYYY-MM-DD hh:mm:ss格式
            EndTime: EndTime,                   // YYYY-MM-DD hh:mm:ss格式
            isASC: isASC,
            StartIndex: StartIndex,
            ReadCnt: ReadCnt,
        };
        // alert('ST_List:'+ST_List);            // 调试显示信息

        $.ajax({
            url: '/Home/Index',
            type: 'POST',
            dataType: 'json',
            async: false,                       // 同步执行
            data: jsonData,
        })
        .done(function (response) {
            if (response.rel == 1) { // 获取成功
                // console.log('data==', response);   // 调试显示信息
                if (response.obj == null) {           // 没有数据

                }
                else {                               // 有数据
                    obj = JSON.parse(response.obj);  // 转换为对象
                }
            }
            else if (response.rel == -1) {           // 需要登录
                layer.alert(response.msg, { icon: 5, scrollbar: false });           // 5：失败；6：成功
                parent.JumpLogon();
            }
            else {
                layer.alert(response.msg, { icon: 5, scrollbar: false });           // 5：失败；6：成功
            }
        })
        .fail(function () {
            layer.alert('通信错误，请求数据失败！', { icon: 5, scrollbar: false });     // 5：失败；6：成功
        })
    }
    catch (e) {
        layer.alert("发生了错误：" + e.message, { icon: 5, scrollbar: false });       // 5：失败；6：成功
    }

    // close_message();
    return obj;
}

// 时间控件初始化
function laydate_init() {
    try {
        var myDate = new Date(); // 获取当前系统时间
        var LastDate = new Date(); // 获取当前系统时间
        LastDate.setDate(LastDate.getDate() - 20); // 获取多少天前时间
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

        // 时间控件初始化
        layui.use('laydate', function () {

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
                value: myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日', // 必须遵循format参数设定的格式
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

    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }
}

// 刷新底部分页栏(AllDataCount:总的数据条数；OnePageCount：一页显示的数据条数；ThisPageIndex：当前页索引，从0开始,无需修改的参数可以为null)
function table_limt_refresh(AllDataCount, OnePageCount, ThisPageIndex) {
    // 刷新底部的分页栏
    layui.use('laypage', function () {
        var laypage = layui.laypage;
        // 执行一个laypage实例-设置分页
        if (AllDataCount != null) {
            g_table_limt.count = AllDataCount;          // 数总数
        } else {
            g_table_limt.count = 0;
        }
        if (OnePageCount != null) {
            g_table_limt.limit = OnePageCount;          // 单页显示数据条数
        }
        if (ThisPageIndex != null) {
            g_table_limt.curr = ThisPageIndex + 1;      // 当前页
        }
        laypage.render(g_table_limt);                   // 重新刷新底部分页
    });
}

// 刷新数据
function refreshAlarmData(StartTime, EndTime) {
    try {
        g_SelectPageIndex = 0;      // 页索引为0
        // 下载报警记录总数量
        g_DataAllCnt = ajax_sync_get_alarm_data_count(StartTime, EndTime, false);
        if (g_DataAllCnt > 0) {
            g_HistDataObj = ajax_sync_get_alarm_data(StartTime, EndTime, false, 0, cg_OnePageDataCount);    // 获取一页数据
        }
        else {
            g_HistDataObj = [];
        }
        g_TableData = conversion_data_layui_table(g_HistDataObj, 1);                        // 将数据转换为能被显示的格式

        if (g_tableIns != null) {                                       // 表格重载
            g_table_config.data = g_TableData;
            g_tableIns.reload(g_table_config);
        }
        else {
            data_table_init(g_TableData, g_DataAllCnt, cg_OnePageDataCount, 1);                                           // 初始化表格
        }
        table_limt_refresh(g_DataAllCnt, cg_OnePageDataCount, g_SelectPageIndex);  // 刷新底部的分页栏
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
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
                layer.alert("没有数据", { icon: 5, scrollbar: false }); // 5：失败；6：成功
                return;
            }

            // 弹出提示框
            g_layer_msg_index = layer.msg('加载中',
            {
                icon: 16
                , shade: 0.1    // 越大界面越黑
                , time: 60000,  // 时间
                anim: 0,        // 平滑放大
                scrollbar: false// 锁定浏览器滑动
            });

            g_SelectPageIndex = obj.curr - 1;   // 获取当前页索引

            g_HistDataObj = ajax_sync_get_alarm_data(g_StartTime, g_EndTime, false, g_SelectPageIndex * cg_OnePageDataCount, cg_OnePageDataCount);   // 获取第n页数据

            g_TableData = conversion_data_layui_table(g_HistDataObj, g_SelectPageIndex * cg_OnePageDataCount + 1);
            // alert(JSON.stringify(g_DeviceInfoDataPage, 4));        // 调试显示信息

            RecordScrollTop();      // 记录scrollTop位置，在表格重载之前调用（依赖全局g_scrollTop）
            // 刷新当前页
            g_table_config.data = g_TableData;                                         // 更新字段
            g_tableIns.reload(g_table_config);

            layer.close(g_layer_msg_index);      // 关闭提示框
            RestoreScrollTop();      // 还原scrollTop位置，在表格重载之后调用（依赖全局g_scrollTop）
        }
        else {
            g_SelectPageIndex = obj.curr - 1;
        }
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }
}

// 初始化表格(只能调用一次，并且会在调用后延时一段时间才能初始化完成)DataTableObj:当前要显示的数据；AllDataCount：总数据条数；OnePageCount：一页显示的数据条数；ThisPageIndex：当前页索引，从0开始
function data_table_init(DataTableObj, AllDataCount, OnePageCount, ThisPageIndex) {
    layui.use('table', function () {
        var table = layui.table;
        // 第一个实例
        g_table_config.data = DataTableObj;
        g_tableIns = table.render(g_table_config);
    });
}

// layui 表单点击事件
layui.use('form', function () {
    var form = layui.form;

    // 快捷选择-查询历史数据
    form.on('select(select_filter)', function (data) {
        //alert(data.value + '天'); // 得到被选中的值
        try {
            if (data.value <= 0) return; // 时间

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
                    refreshAlarmData(g_StartTime, g_EndTime); // 获取并显示当前选择的设备的数据
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

    // 站点选择事件
    form.on('select(device_filter)', function (data) {
        // console.log('device: ', data.value);

        if (data.value == -1) g_thisST = '';
        else g_thisST = data.value;
    })

    // 要素选择事件
    form.on('select(ess_filter)', function (data) {
        // console.log('ess: ', data.value);

        if (data.value == -1) g_thisEss = '';
        else g_thisEss = g_AlarmEss[data.value].title;
    })

});

// 将获取到的设备数据转换为能被layui table显示的数据 DeviceAlarmData:历史数据,StartRowNumber:当前显示的行号起始，从1开始；
function conversion_data_layui_table(DeviceAlarmData, StartRowNumber) {
    var DeviceTableData = JSON.parse('[]');                  // 清空数据，创建一个对象数组

    try {
        if (DeviceAlarmData == null || DeviceAlarmData.length == 0) {   // 没有数据
            return DeviceTableData;
        }

        for (var i = 0; i < DeviceAlarmData.length; i++) {
            var obj = new Object();   // 定义对象

            // 给对象添加属性
            obj.ID = (StartRowNumber + i) + '';                     // 行号，加上起始行号
            obj.TIME = DeviceAlarmData[i].TIME;                     // 报警时间
            obj.ST = DeviceAlarmData[i].ST;                         // 设备编号
            obj.NAME = FindNameForST(obj.ST);                       // 获取当前ST的站点名称
            obj.A_ESS = FindAlarmEss(DeviceAlarmData[i].A_ESS);     // 报警要素
            obj.A_TYPE = FindAlarmType(DeviceAlarmData[i].A_TYPE);  // 报警类型
            obj.VALUE = DeviceAlarmData[i].VALUE;                   // 报警值
            obj.A_VALUE = DeviceAlarmData[i].A_VALUE;               // 阈值
            obj.A_INFO = DeviceAlarmData[i].A_INFO;                 // 报警信息
            obj.TT = DeviceAlarmData[i].TT;                         // 采集时间
            DeviceTableData[i] = obj;                               // 添加对象到数组
        }
    }
    catch (e) {
        layer.alert("处理数据发生了错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }

    close_message();
    return DeviceTableData;
}

//  根据 ST 去查找对应的设备名字
function FindNameForST(ST) {
    try {
        for (var i = 0; i < g_AllDeviceInfo.length; i++) {
            if (g_AllDeviceInfo[i].ST == ST) {
                return g_AllDeviceInfo[i].NAME;
            }
        }
    } catch (e) { }
    return '';
}

// 根据 A_ESS 去查找对应的报警要素
function FindAlarmEss(ess) {
    try {
        for (var i = 0; i < g_AlarmEss.length; i++) {
            if (g_AlarmEss[i].title == ess) {
                return g_AlarmEss[i].text;  // 找到了, 返回对应的表述
            }
        }
        return ess;                         // 没找到, 返回原来的参数
    } catch (e) {
        console.log(e);
    }
}

// 根据 A_TYPE 去查找对应的报警类型
function FindAlarmType(type) {
    try {
        for (var i = 0; i < g_AlarmType.length; i++) {
            if (g_AlarmType[i].title == type) {
                return g_AlarmType[i].text; // 找到了, 返回对应的描述
            }
        }
        return type;                        // 没找到, 返回原来的参数
    } catch (e) {
        console.log(e);
    }
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
    }
    catch (e) {
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
    }
    catch (e) {
        console.log(e.message);
    }
}

// 点击查询数据
function query_data_onclick() {
    try {
        loading_message1('加载数据中...'); // 弹出提示框
        get_time_frame(); // 更新时间范围
        // 延时先等等加载中...显示出来后再加载数据
        setTimeout(
            function () {
                refreshAlarmData(g_StartTime, g_EndTime); // 获取并显示当前选择的设备的数据
                close_message(); // 关闭提示框 
            }, 100);

    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
}

// 初始化要素数据
function AllDeviceEssInit() {
    var obj = null;
    try {
        obj = parent.Read_AllEssDataCache();    // 读取父页面缓存的数据
    }
    catch (e) {

    }
    if (obj == null || obj.length == 0) { // 缓存无效才从服务器获取
        // alert("ajax获取要素表");
        obj = parent.GetAllEssData();  // 获取所有要素数据
        parent.Write_AllEssDataCache(obj);    // 写入缓存到父页面
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

        //准备字段与字段别名
        for (var i = 0; i < g_table_config.cols[0].length; i++) {
            sheetFilter[i] = g_table_config.cols[0][i].field;
            sheetHeader[i] = g_table_config.cols[0][i].title;
        }
        // https:// www.cnblogs.com/kin-jie/p/6180707.html
        option.fileName = '报警记录数据导出';
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
                var option = {};

                //准备字段与字段别名
                for (var i = 0; i < g_table_config.cols[0].length; i++) {
                    sheetFilter[i] = g_table_config.cols[0][i].field;
                    sheetHeader[i] = g_table_config.cols[0][i].title;
                }
                // https:// www.cnblogs.com/kin-jie/p/6180707.html
                option.fileName = '全部报警数据导出';
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

// setTimeout(function () { }, 1000);
// 下载所有数据，用于本地数据导出，需要一个进度条
function DownAllData() {
    var AllData_Obj = [];
    var page_count = Math.ceil(g_DataAllCnt / 500); // 向上取整-获取页数

    try {
        for (var i = 0; i < page_count; i++) {
            var DataObj = ajax_sync_get_alarm_data(g_StartTime, g_EndTime, false, i * 500, 500);   // 获取第一页数据
            if (DataObj == null || DataObj.length == 0) { // 提前结束了，退出
                layer.alert("错误：获取数据失败，提前结束了数据下载！", { icon: 5, scrollbar: false }); // 5：失败；6：成功
                break;
            }
            else {
                for (var j = 0; j < DataObj.length; j++) { // 拷贝数据到列表中-列表中存放所有的数据
                    AllData_Obj[i * 500 + j] = DataObj[j];
                }
            }
        }
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }

    return AllData_Obj;
}

// 刷新当前页面-点击刷新按钮
function RefreshPage_onClick() {
    location.reload();
}