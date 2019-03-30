

var g_HistDataObj = [];                 // 当前历史数据
var g_AllEssDataCache;                  // 所有要素数据列表-从父页面加载
var g_ThisST;                           // 当前设备ST
var g_ThisName;                         // 当前设备Name
var g_StartTime;                        // 当前搜索框开始时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_EndTime;                          // 当前搜索框结束时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_TempStartTime;                    // 临时存放时间控件的时间，格式为：{"year":2018,"month":7,"date":25,"hours":0,"minutes":0,"seconds":0}
var g_TempEndTime;                      // 临时存放时间控件的时间，格式为：{"year":2018,"month":7,"date":25,"hours":0,"minutes":0,"seconds":0}
var g_FieldList = [];                   // 字段英文列表
var g_FieldNameList = [];               // 字段中文列表
var g_FieldUnitList = [];               // 字段单位
var g_FieldDataArr = null;              // 要素数据
var g_TT = [];                          // 观测时间-横轴
var g_MyTree;
var myChart = null;                     // 全局echarts实例
var g_ess1Num;                          // 对比要素1
var g_ess2Num;                          // 对比要素2
var g_ess1Id = 'ess1_id';               // 要素1下拉框id
var g_ess2Id = 'ess2_id';               // 要素2下拉框id
var g_ess1Value = 0;                    // 要素1默认选中value
var g_ess2Value = 1;                    // 要素2默认选中value
var g_Ess1EchartData = {                 // 全局保存要素1数据
    title: '要素1',
    unit: '单位',
    data: []
};
var g_Ess2EchartData = {                 // 全局保存要素2数据
    title: '要素2',
    unit: '单位',
    data: []
};
var g_ess1Title;                            // 图形大标题参数
var g_ess2Title;                            // 图形大标题参数

// 初始化加载执行
window.onload = function () {   // 要执行的js代码段  

    $.ajaxSettings.async = false;                   // 由于有ajax，强制js为同步执行
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

    // 自动高度右侧panle
    var oDiv = document.getElementById('user_panel_id_1');
    oDiv.style.minHeight = ($(window).height() - 40 + 10) + 'px';

    laydate_init();                                 // 初始化时间控件
    g_AllEssDataCache = AllDeviceEssInit();         // 初始化所有要素数据

    // 下载数据
    g_AllDeviceList = ajaxSyncGetDeviceList();    // 获取当前用户所有设备基本信息列表   
    g_AllGroupList = ajaxSyncGetAllGroupList();   // 获取所有分组信息
    // 准备要显示的数据
    var ObjArr = conversion_data_tree_node(g_AllGroupList, g_AllDeviceList, 0);// 子列表数据源
    g_tree_config.ParentData = ObjArr[0];       // 父标签数据源 
    g_tree_config.LiData = ObjArr[1];
    g_tree_config.SelectionEvent = SelectionEvent;// 点击事件
    g_MyTree = new tree_list(g_tree_config);
    g_MyTree.render();  // 绘制列表
    // 侧边栏鼠标悬浮事件
    myTreeHoverEvent()

    g_ThisST = g_AllDeviceList[0].ST;       // 当前设备ST
    g_ThisNAME = g_AllDeviceList[0].NAME;   // 当前设备NAME

    setTimeout('DelayInitData()', 250);        // 延时加载数据
    //close_message();                                    // 关闭提示框 
}

// 延时加载数据，先加载左侧的站点列表
function DelayInitData() {

    // 获取并显示当前选择的设备的数据
    SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime);   

    // 设置要素下拉框
    setSelectOption(g_ess1Id, g_ess1Value);
    setSelectOption(g_ess2Id, g_ess2Value);

    // 更新折线图形数据
    setEchartsPicData();
}

// 浏览器窗口大小变化事件
$(window).resize(function () {          // 当浏览器大小变化时
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

    // echar宽度自适应
    //myChart.resize()
});

// 时间控件初始化
function laydate_init() {
    try {
        // 时间控件初始化
        layui.use('laydate', function () {
            var myDate = new Date();    // 获取当前系统时间
            var LastDate = new Date();    // 获取当前系统时间
            LastDate.setDate(LastDate.getDate() - 1); // 获取2天前时间
            // 初始化时间
            g_TempStartTime = {
                year: LastDate.getFullYear(), month: (LastDate.getMonth() + 1), date: LastDate.getDate(), hours: 0, minutes: 0, seconds: 0
            };
            g_TempEndTime = {
                year: myDate.getFullYear(), month: (myDate.getMonth() + 1), date: myDate.getDate(), hours: 0, minutes: 0, seconds: 0
            };
            get_time_frame();   // 更新一次时间

            var laydate = layui.laydate;
            // 自定义格式
            laydate.render({
                elem: '#test11',
                format: 'yyyy年MM月dd日',
                value: LastDate.getFullYear() + '年' + (LastDate.getMonth() + 1) + '月' + LastDate.getDate() + '日',  // 必须遵循format参数设定的格式
                done: function (value, date, endDate) {// 控件选择完毕后的回调---点击日期、清空、现在、确定均会触发。
                    g_TempStartTime = date;         // 临时存放开始时间
                    //  alert(JSON.stringify(date, 4)); // 得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                },
                theme: '#3E79BB' // 颜色-蓝色
            });

            // 自定义格式
            laydate.render({
                elem: '#test12',
                format: 'yyyy年MM月dd日',
                value: myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日',  // 必须遵循format参数设定的格式
                done: function (value, date, endDate) {// 控件选择完毕后的回调---点击日期、清空、现在、确定均会触发。
                    g_TempEndTime = date;         // 临时存放结束时间
                    // alert(JSON.stringify(date, 4)); // 得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                },
                theme: '#3E79BB' // 颜色-蓝色
            });
        });
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }
}

// 获取时间范围，时间存放到全局 g_StartTime，g_EndTime   
function get_time_frame() {
    try {
        g_StartTime = g_TempStartTime.year + '-' + g_TempStartTime.month + '-' + g_TempStartTime.date + ' 00:00:00';
        g_EndTime = g_TempEndTime.year + '-' + g_TempEndTime.month + '-' + g_TempEndTime.date + ' 23:59:59';

        // alert(g_StartTime + ' ' + g_EndTime);
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }
}
    
// 刷新某个站点数据
function SelectAndGetDeviceHistData(ST, NAME, StartTime, EndTime) {
    try {
        // 刷新站点编号与名称
        document.getElementById('lable_st_id').innerHTML = '编号：' + ST;
        document.getElementById('lable_name_id').innerHTML = '名称：' + NAME;

        // 下载当前设备的历史数据
        g_HistDataObj = ajaxSyncGetHistData(ST, StartTime, EndTime, true, 0, 86400);     // 获取所有数据

        obj = data_handle(g_HistDataObj);         // 整理数据

        if(g_HistDataObj == null) { //服务器拒绝了-数据量太大
            layer.msg("通讯故障、或数据量超出范围，请缩小搜索时间范围后重试!", { icon: 5, scrollbar: false });     // 5：失败；6：成功
        }
        else if (g_HistDataObj.length > 0) {
            if (g_HistDataObj.length >= 20000) {
                layer.msg("警告:一次最多显示2万条历史数据!", { icon: 6, scrollbar: false });     // 5：失败；6：成功
            }
        }
        else {
            layer.msg("错误：没有数据！" , { icon: 5, scrollbar: false }); // 5：失败；6：成功
        }

    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }
}

// 在要素字段总表中查找当前字段名-中文名称
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

// 在要素字段总表中查找当前字段单位
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

// 选择事件
function SelectionEvent(index, data_name, text) {
    loading_message1('加载数据中...');                    // 弹出提示框

    // 选择一个站点的时候还原两个要素的默认值
    g_ess1Value = 0;
    g_ess2Value = 1;

    laydate_init();                                     // 初始化时间控件
    g_ThisST = data_name;                               // 当前设备ST
    var str = text;
    str = str.substring(11, str.length);                // 截取后面的名称
    g_ThisNAME = str;                                   // 当前设备NAME
    // 延时先等等加载中...显示出来后再加载数据
    setTimeout(function () {
        // 获取并显示当前选择的设备的数据
        SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime);

        // 设置要素下拉框
        setSelectOption(g_ess1Id, g_ess1Value);
        setSelectOption(g_ess2Id, g_ess2Value);

        // 更新折线图形数据
        setEchartsPicData();
            
        close_message();                                    // 关闭提示框 
    }, 100);
}

// 点击查询数据
function query_data_onclick() {
    try {
        loading_message1('加载数据中...');                    // 弹出提示框
        get_time_frame();                                   // 更新时间范围
        // 延时先等等加载中...显示出来后再加载数据
        setTimeout(function () {
            // 获取并显示当前选择的设备的数据
            SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime);   

            // 设置要素下拉框
            setSelectOption(g_ess1Id, g_ess1Value);
            setSelectOption(g_ess2Id, g_ess2Value);

            // 更新折线图形数据
            setEchartsPicData();

            close_message();                                    // 关闭提示框 
        }, 100);

    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }
}

// layui 表单事件处理
layui.use('form', function () {
    var form = layui.form;
    
    // 快速搜索下拉框事件
    form.on('select(select_filter)', function (data) {
        try {
            if (data.value <= 0 || data.value > 60) return; // 时间
            var EndDate = new Date();    // 获取当前系统时间
            var StartDate = new Date();    // 获取当前系统时间
            StartDate.setDate(StartDate.getDate() - data.value); // 获取n天前时间

            g_StartTime = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate() + ' ' + StartDate.getHours() + ':' + StartDate.getMinutes() + ':' + StartDate.getSeconds();
            g_EndTime = EndDate.getFullYear() + '-' + (EndDate.getMonth() + 1) + '-' + EndDate.getDate() + ' ' + EndDate.getHours() + ':' + EndDate.getMinutes() + ':' + EndDate.getSeconds();

            loading_message1('加载数据中...');                    // 弹出提示框
        
            // 延时先等等加载中...显示出来后再加载数据
            setTimeout(function () {
                SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime);   // 获取并显示当前选择的设备的数据
                
                // 设置要素下拉框
                setSelectOption(g_ess1Id, g_ess1Value);
                setSelectOption(g_ess2Id, g_ess2Value);

                // 更新折线图形数据
                setEchartsPicData();

                close_message();                                    // 关闭提示框 
            }, 100);
        } catch (e) {
            layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
        }
    });

    // 元素选择下拉框事件 元素1
    form.on('select(ess1_filter)', function (e) {
        // 如果和现有要素2的value一样
        if (e.value == g_ess2Value) {
            layer.alert('请选择不同要素进行对比');
            // 恢复现有要素选中状态为原来值
            $('#' + g_ess1Id)[0][g_ess1Value].selected = true;

            // 更新下拉框
            var form = layui.form;
            form.render('select');
        }
        // 和现有要素2的value不同
        else {
            // 更新要素1的全局value
            g_ess1Value = e.value

            // 设置图形数据
            g_Ess1EchartData = updateEchartsData(g_ess1Value);
            setEcharts(g_TT, g_Ess1EchartData, g_Ess2EchartData);
        }
    });
    // 元素选择下拉框事件 元素2
    form.on('select(ess2_filter)', function (e) {
        // 如果和现有要素1的value一样
        if (e.value == g_ess1Value) {
            layer.alert('请选择不同要素进行对比');
            // 恢复现有要素选中状态为原来值
            $('#' + g_ess2Id)[0][g_ess2Value].selected = true;

            // 更新下拉框
            var form = layui.form;
            form.render('select');
        }
        // 和现有要素1的value不同
        else {
            // 更新要素2的全局value
            g_ess2Value = e.value

            // 设置图形数据
            g_Ess2EchartData = updateEchartsData(g_ess2Value);
            setEcharts(g_TT, g_Ess1EchartData, g_Ess2EchartData);
        }
    });
});

// 设置折线图最新图形数据
function setEchartsPicData() {
    if (g_FieldNameList == null || g_FieldNameList.length <= 0) return;

    g_Ess1EchartData = updateEchartsData(g_ess1Value);
    g_Ess2EchartData = updateEchartsData(g_ess2Value);
    setEcharts(g_TT, g_Ess1EchartData, g_Ess2EchartData);
}

// 更新echarts的显示数据 
function updateEchartsData(value) {
    var essData = new Object();

    essData.title = g_FieldNameList[value];
    essData.unit = g_FieldUnitList[value];
    essData.data = g_FieldDataArr[value];

    return essData;
}

// 设置折线图形
function setEcharts(essDate, ess1Data, ess2Data) {

    // 处理数据 第一个参数：y轴数据， 第二个参数：最大数据的倍数
    g_ess1Num = publicSetEssData(ess1Data.data, 2.1);
    g_ess2Num = publicSetEssData(ess2Data.data, 2.1);

    //  如果echart实例存在
    if (myChart != null && myChart != "" && myChart != undefined) {
        //  销毁实例
        myChart.dispose();
    }
    myChart = echarts.init(document.getElementById("echart_div_id"));

    // 设置图形大标题数据
    if (ess1Data.title == '无数据') {
        g_ess1Title = '';
    } else {
        g_ess1Title = ess1Data.title;
    }

    if (ess2Data.title == '无数据') {
        g_ess2Title = '';
    } else {
        g_ess2Title = ess2Data.title;
    }

    var option = {
        title: {
            text: g_ess1Title + '-' + g_ess2Title + ' 对比图',
            x: 'center',
            align: 'right'
        },
        grid: {
            bottom: 80
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var result1;
                var result2;
                var result = '';
                params.forEach(function (item) {
                    if (item.seriesIndex == 0) {
                        item.color = 'rgb(193, 59, 61)'
                        result1 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color: ' + item.color + '"></span>' + item.seriesName + ': ' + item.value;
                        
                    } 
                    else {
                        item.color = 'rgb(63, 167, 220)'
                        result2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color: ' + item.color + '"></span>' + item.seriesName + ': ' + item.value;
                        
                    }
                    
                    result = item.axisValue + '<br />' + result2 + '<br />' + result1;

                });

                return result;
            },
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            }
        },
        legend: {
            data: [ess1Data.title, ess2Data.title],
            x: 'left'
        },
        dataZoom: [{
            show: true,
            realtime: true,
            //start: 0,
            //end: 100
        }, {
            type: 'inside',
            realtime: true,
            //start: 65,
            //end: 85
        }
        ],
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZero: false
            },
            data: essDate
        }],
        yAxis: [{
            name: ess1Data.title + '(' + ess1Data.unit + ')' + '-下要素',
            type: 'value',
            max: g_ess1Num.maxData,
            min: g_ess1Num.minData,
        }, {
            name: ess2Data.title + '(' + ess2Data.unit + ')' + '-上要素',
            nameLocation: 'start',
            type: 'value',
            max: g_ess2Num.maxData,
            min: g_ess2Num.minData,
            inverse: true,
        }],
        series: [{
            name: ess1Data.title,
            type: 'line',
            animation: false,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(193, 59, 61)'
                    }, {
                        offset: 1,
                        color: 'rgb(165, 26, 43)'
                    }])
                }
            },
            itemStyle: {
                normal: {
                    borderColor: 'rgb(193, 59, 61)'  //  折线折点颜色
                }
            },
            lineStyle: {
                width: 1
            },
            data: ess1Data.data
        }, {
            name: ess2Data.title,
            type: 'line',
            yAxisIndex: 1,
            animation: false,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(63, 167, 220)'
                    }, {
                        offset: 1,
                        color: 'rgb(39, 126, 171)'
                    }])
                }
            },
            itemStyle: {
                normal: {
                    borderColor: 'rgb(63, 167, 220)'  //  折线折点颜色
                }
            },
            lineStyle: {
                width: 1
            },
            data: ess2Data.data
        }]
    };

    $(window).on('resize', function () {
        myChart.resize();
    });

    myChart.setOption(option)
}

// 初始化要素数据
function AllDeviceEssInit() {
    var obj = null;
    try {
        obj = parent.Read_AllEssDataCache();    // 读取父页面缓存的数据
    }
    catch (e) {

    }
    if (obj == null || obj.length == 0) {       // 缓存无效才从服务器获取
        obj = parent.GetAllEssData();           // 获取所有要素数据
        parent.Write_AllEssDataCache(obj);      // 写入缓存到父页面
    }

    return obj;
}

// 处理下载的数据，获取要素名称信息，要素单位信息，时间列表，要素数据列表
function data_handle(all_data_obj) {
    try {
        var cnt;
        // 清空原有数据
        g_TT = [];
        g_FieldList = [];
        g_FieldNameList = [];
        g_FieldUnitList = [];

        cnt = 0;

        //先获取所有字段的字段名-不算时间与ST等
        if (all_data_obj == null || all_data_obj.length == 0) return;

        for (var p in all_data_obj[0]) {//遍历json对象的每个key/value对,p为key
            
            if (p != 'ST' && p != 'TT' && p != 'UT' && p != null) {
                g_FieldList[cnt] = p; //记录字段
                g_FieldNameList[cnt] = get_field_name(g_AllEssDataCache, p);    //获取字段名称
                g_FieldUnitList[cnt] = get_field_uint(g_AllEssDataCache, p);    //获取字段单位
                cnt++;
            }
        }
        //为存放数据申请空间
        var obj_arr = [];
        for (var j = 0; j < g_FieldList.length; j++) {
            var obj = [];

            obj_arr[j] = obj;
        }

        //循环获取所有的时间，TT与要素数据
        for (var i = 0; i < all_data_obj.length; i++) {
            g_TT[i] = all_data_obj[i].TT; //获取观测时间
            for (var j = 0; j < g_FieldList.length; j++) {
                // 对异常的负数 数据处理
                if (all_data_obj[i][g_FieldList[j]] < -30) {
                    obj_arr[j][i] = '无效';
                }
                else {
                    obj_arr[j][i] = all_data_obj[i][g_FieldList[j]];
                }
            }
        }
        g_FieldDataArr = obj_arr;
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

// 设置下拉菜单选项值
function setSelectOption(essId, essValue) {
    try {
        var $ess = $("#" + essId);
        var form = layui.form;

        // 清除原有数据
        $ess.empty();

        // 没有要素数据
        if (g_FieldNameList == null || g_FieldNameList.length == 0) {
            // 清除原有折线图
            $('#echart_div_id').empty();
            $ess.append('<option value="-1">无数据</option>');

            // 只有执行了这一步，部分表单元素才会自动修饰成功
            form.render('select');
            return;
        }
        // 有数据
        for (var i = 0; i < g_FieldNameList.length; i++) {
            // 设置下拉菜单选项值
            $ess.append('<option value=\"' + i + '\">' + g_FieldNameList[i] + '</option>');
        }

        $ess[0][essValue].selected = true;

        form.render('select');

    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

// 显示或隐藏左边栏
function scroll_button_onclick() {
    try {
        var scrollDiv = document.getElementById('div_scroll_id');
        var oDiv = document.getElementById('right_panle_id');
        var oDiv_Ico = document.getElementById('scroll_ico_id');
        var theStatusValue = scrollDiv.getAttribute("data-user-flag");  //  获取自定义属性的值

        if (theStatusValue == 1) {       // 需要隐藏
            $('#left_panle_id').hide();
            oDiv.style.marginLeft = 0 + 'px';
            oDiv_Ico.className = 'fa fa-chevron-right fa-2x';
            scrollDiv.setAttribute('data-user-flag', 0);                // 标志设置为0
            //  重载折线图
            if (myChart != null) myChart.resize();
        }
        else {                          // 需要显示出来
            $('#left_panle_id').show();
            scrollDiv.setAttribute('data-user-flag', 1);                // 标志设置为1
            oDiv_Ico.className = 'fa fa-chevron-left fa-2x';
            oDiv.style.marginLeft = cg_tree_width + 'px';

            //  重载折线图
            if (myChart != null) myChart.resize();
        }
    }
    catch (e) {
        alert("错误：" + e.message);
    }
}
