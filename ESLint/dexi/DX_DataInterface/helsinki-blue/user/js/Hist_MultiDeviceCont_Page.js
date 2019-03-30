

var g_HistDataObj = [];                     // 当前历史数据
var g_AllEssDataCache;                      // 所有要素数据列表-从父页面加载
var g_ThisST;                               // 当前设备ST
var g_StartTime;                            // 当前搜索框开始时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_EndTime;                              // 当前搜索框结束时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_TempStartTime;                        // 临时存放时间控件的时间，格式为：{"year":2018,"month":7,"date":25,"hours":0,"minutes":0,"seconds":0}
var g_TempEndTime;                          // 临时存放时间控件的时间，格式为：{"year":2018,"month":7,"date":25,"hours":0,"minutes":0,"seconds":0}
var g_FieldList = [];                       // 字段英文列表
var g_TT = [];                              // 观测时间-横轴
var g_oneNameId = 'device_one_name_id';
var g_twoNameId = 'device_two_name_id';
var g_deviceOneId = 'device_one_id';
var g_deviceTwoId = 'device_two_id';
var g_ess1SelectId = 'device_one_ess_id';   // 站点1要素下拉框id
var g_ess2SelectId = 'device_two_ess_id';   // 站点2要素下拉框id

var g_deviceOneIndex = 0;                   // 默认站点一索引
var g_deviceTwoIndex = 1;                   // 默认站点二索引

var g_ess1Index = 0;                        // 要素1默认选中value
var g_ess2Index = 0;                        // 要素2默认选中value
var g_deviceOneName = '';                   // 站点1name
var g_deviceTwoName = '';                   // 站点2name
var g_deviceOneST;
var g_deviceTwoST;
var g_deviceOneData;
var g_deviceTwoData;
var myChart;                                // 全局echarts实例
var ess1Max;                                // 对比要素1的y轴最大值
var ess2Max;                                // 对比要素2的y轴最大值
var g_Ess1EcharData = {                     // 全局保存要素1数据
    title: '无数据',
    unit: '单位',
    data: ['']
};
var g_Ess2EcharData = {                     // 全局保存要素2数据
    title: '无数据',
    unit: '单位',
    data: ['']
};

var g_ess1Title;                            // 图形大标题参数
var g_ess2Title;                            // 图形大标题参数

// 初始化加载执行
window.onload = function () {  

    $.ajaxSettings.async = false;                   // 由于有ajax，强制js为同步执行
    loading_message('加载数据中...');               // 弹出提示框
        
    // 自动高度-右侧正文
    var oDiv = document.getElementById('user_content_id_1');
    oDiv.style.height = ($(window).height() - 2) + 'px';

    // 自动高度右侧panle
    var oDiv = document.getElementById('user_panel_id_1');
    oDiv.style.minHeight = ($(window).height() - 40 + 10) + 'px';

    // 初始化时间控件
    laydate_init();

    // 初始化所有要素数据
    g_AllEssDataCache = AllDeviceEssInit();        

    // 获取当前用户所有设备基本信息列表 
    g_AllDeviceList = ajaxSyncGetDeviceList();      
    g_AllGroupList = ajaxSyncGetAllGroupList();

    // 获取前两个设备的具体数据
    setTimeout('getDefaultData()', 100);

}

// 加载默认显示数据
function getDefaultData() {

    // 设置时间
    get_time_frame();

    // 设置站点下拉框数据
    var ObjArr = conversion_data_tree_node(g_AllGroupList, g_AllDeviceList, 0);
    setDeviceSelectData(ObjArr, g_deviceOneId, g_deviceOneIndex, g_oneNameId);
    setDeviceSelectData(ObjArr, g_deviceTwoId, g_deviceTwoIndex, g_twoNameId);

    // 设置要素下拉框数据
    setEssSelectData(g_deviceOneData.nameList, g_ess1SelectId, g_ess1Index);
    setEssSelectData(g_deviceTwoData.nameList, g_ess2SelectId, g_ess2Index);
    
    // 显示折线图形数据
    g_Ess1EcharData = setEchartsInitData(g_deviceOneData, g_ess1SelectId, g_ess1Index);
    g_Ess2EcharData = setEchartsInitData(g_deviceTwoData, g_ess2SelectId, g_ess2Index);
    
    // 初始化显示图形
    initEcharts(g_TT, g_Ess1EcharData, g_Ess2EcharData);
}

var essName = '';
// 设置要素数据和echarts数据
function setEchartsInitData(deviceData, essSelectId, essValue) {

    var essEchartsData = new Object();

    // 设备数据存在
    if (!($.isEmptyObject(deviceData))) {
        //  设置echarts数据
        essEchartsData.title = deviceData.nameList[essValue];
        essEchartsData.unit = deviceData.unitList[essValue];
        essEchartsData.data = deviceData.essData[essValue];
    }
    // 设备无数据
    else {
        essEchartsData.title = '无数据';
        essEchartsData.unit = '单位';
        essEchartsData.data = [''];
    }

    return essEchartsData;
}

// 设置下拉框 站点选择数据
function setDeviceSelectData(objData, elementID, deviceIndex, nameTextId) {
    var $device = $('#' + elementID);
    var $deviceNameElem = $('#' + nameTextId);

    // 添加设备分组和名称
    for (let i = 0; i < objData[0].length; i++) {
        $device.append('<optgroup id="'+ elementID +'_'+ i +'" parentNodeId="' + objData[0][i].ParentNodeId + '" label=\"' + objData[0][i].NodeText + '\"></optgroup>');

        // 添加option
        for (let j = 0; j < objData[1].length; j++) {
            
            var groupElement = document.getElementById(elementID + '_' + i);
            var groupParentNodeId = groupElement.getAttribute('parentNodeId');

            if (groupParentNodeId == objData[1][j].ParentNodeId) {
                var optionElement =  document.createElement("option");
                optionElement.setAttribute('parentNodeId', objData[1][j].ParentNodeId);
                optionElement.innerHTML = objData[1][j].NodeText;
                optionElement.value = objData[1][j].NodeName;

                groupElement.appendChild(optionElement);
            }
        }
    }

    var $selectedDevice = $('#' + elementID + '_0');

    // 设置默认选中站点
    $selectedDevice[0].children[deviceIndex].selected = true;

    var deviceInfoText = $selectedDevice[0].children[deviceIndex].innerHTML;

    var deviceSt = getSt(deviceInfoText);

    $deviceNameElem[0].innerHTML = deviceInfoText;
    
    // 获取对应站点数据
    getDeviceData(deviceSt, deviceInfoText, elementID);

    var form = layui.form; // 只有执行了这一步，部分表单元素才会自动修饰成功
    form.render('select');

    // 关闭加载提示
    close_message()

}

// 获取下拉框选中设备编号
function getSt(innerString) {
    return innerString.substring(0, 10);
}

// 获取设备数据
function getDeviceData(deviceSt, deviceName, elementId) {
    var deviceData = SelectAndGetDeviceHistData(deviceSt, g_StartTime, g_EndTime);

    // 保存对应数据
    if (elementId == g_deviceOneId) {
        g_deviceOneST = deviceSt;
        g_deviceOneName = deviceName;
        g_deviceOneData = deviceData;
    }
    if (elementId == g_deviceTwoId) {
        g_deviceTwoST = deviceSt;
        g_deviceTwoName = deviceName;
        g_deviceTwoData = deviceData;
    }
}

// 设置下拉框 要素选项值
function setEssSelectData(FieldNameList, essSelectId, essValue) {
    try {
        var $essElement = $('#' + essSelectId);
        var form = layui.form;

        // 清除原有数据
        $essElement.empty();

        // 没有要素数据
        if (FieldNameList == null || FieldNameList.length == 0) {
            $essElement.append('<option value="-1">无数据</option>');

            form.render('select');
            return;
        };

        // 有要素数据
        for (var i = 0; i < FieldNameList.length; i++) {
            // 设置下拉菜单选项值
            $essElement.append('<option value=\"' + i + '\">' + FieldNameList[i] + '</option>');
        }

        // 保持原来选中要素为当前显示的要素
        $essElement[0][essValue].selected = true;

        // 只有执行了这一步，部分表单元素才会自动修饰成功
        form.render('select');

    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

// layui 表单事件处理
layui.use('form', function () {
    var form = layui.form;

    // 快速搜索下拉框事件
    form.on('select(select_filter)', function (data) {
        try {
            loading_message1('加载数据中...');                    // 弹出提示框

            if (data.value <= 0 || data.value > 60) return; // 时间
            var EndDate = new Date();    // 获取当前系统时间
            var StartDate = new Date();    // 获取当前系统时间
            StartDate.setDate(StartDate.getDate() - data.value); // 获取n天前时间

            g_StartTime = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate() + ' ' + StartDate.getHours() + ':' + StartDate.getMinutes() + ':' + StartDate.getSeconds();
            g_EndTime = EndDate.getFullYear() + '-' + (EndDate.getMonth() + 1) + '-' + EndDate.getDate() + ' ' + EndDate.getHours() + ':' + EndDate.getMinutes() + ':' + EndDate.getSeconds();

            // 延时先等等加载中...显示出来后再加载数据
            setTimeout(function () {
                // 获取并显示当前选择的设备的数据
                g_deviceOneData = SelectAndGetDeviceHistData(g_deviceOneST, g_StartTime, g_EndTime);  
                g_deviceTwoData = SelectAndGetDeviceHistData(g_deviceTwoST, g_StartTime, g_EndTime);  

                // 设置要素下拉框数据
                setEssSelectData(g_deviceOneData.nameList, g_ess1SelectId, g_ess1Index);
                setEssSelectData(g_deviceTwoData.nameList, g_ess2SelectId, g_ess2Index);
                
                // 显示折线图形数据
                g_Ess1EcharData = setEchartsInitData(g_deviceOneData, g_ess1SelectId, g_ess1Index);
                g_Ess2EcharData = setEchartsInitData(g_deviceTwoData, g_ess2SelectId, g_ess2Index);

                // 设置图形数据
                initEcharts(g_TT, g_Ess1EcharData, g_Ess2EcharData);

                close_message();                                    // 关闭提示框 
            }, 100);                                    // 关闭提示框 
        } catch (e) {
            layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
        }
    });

    // 站点1选择事件
    form.on('select(device_one_filter)', function (data) {

        if (g_deviceOneST != data.value) {
            g_ess1Index = 0;
        }

        g_deviceOneST = data.value;
        g_deviceOneName = getNameWithSt(g_deviceOneST);
    })

    // 站点2选择事件
    form.on('select(device_two_filter)', function (data) {

        if (g_deviceTwoST != data.value) {
            g_ess2Index = 0;
        }

        g_deviceTwoST = data.value;
        g_deviceTwoName = getNameWithSt(g_deviceTwoST);
    })

    // 站点1 选择要素事件
    form.on('select(device_one_ess_filter)', function (data) {

        // 更新要素1的全局value
        g_ess1Index = data.value;

        // 根据value值获取对应的要素数据,（缓存里查找数据）
        g_Ess1EcharData.title = g_deviceOneData.nameList[data.value];
        g_Ess1EcharData.unit = g_deviceOneData.unitList[data.value];
        g_Ess1EcharData.data = g_deviceOneData.essData[data.value];

        initEcharts(g_TT, g_Ess1EcharData, g_Ess2EcharData);
    })

    // 站点2 选择要素事件
    form.on('select(device_two_ess_filter)', function (data) {
        
        // 更新要素2的全局value
        g_ess2Index = data.value;

        // 根据value值获取对应的要素数据,（缓存里查找数据）
        g_Ess2EcharData.title = g_deviceTwoData.nameList[data.value];
        g_Ess2EcharData.unit = g_deviceTwoData.unitList[data.value];
        g_Ess2EcharData.data = g_deviceTwoData.essData[data.value];

        initEcharts(g_TT, g_Ess1EcharData, g_Ess2EcharData);
    })
});

// 通过st获取设备名字
function getNameWithSt(ST) {
    try {
        for (let i = 0; i < g_AllDeviceList.length; i++) {
            if (ST == g_AllDeviceList[i].ST) {
                return ST + g_AllDeviceList[i].NAME
            }
        }
    } catch (e) {
        return '无数据'
    }
}

// 初始化折线图形
function initEcharts(essDate, ess1Data, ess2Data) {
    // 处理数据 第一个参数：y轴数据， 第二个参数：最大数据的倍数
    ess1Num = publicSetEssData(ess1Data.data, 2.1);
    ess2Num = publicSetEssData(ess2Data.data, 2.1);

    //  如果echat实例存在
    if (myChart != null && myChart != "" && myChart != undefined) {
        //  销毁实例
        myChart.dispose();
    }
    //  基于准备好的dom，初始化echarts实例
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
            start: 0,
            end: 100
        }, {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
        }
        ],
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZero: false
            },
            data: essDate,
        }],
        yAxis: [{
            name: ess1Data.title + '(' + ess1Data.unit + ')' + '-下要素',
            type: 'value',
            max: ess1Num.maxData,
            min: ess1Num.minData,
        }, {
            name: ess2Data.title + '(' + ess2Data.unit + ')' + '-上要素',
            type: 'value',
            max: ess2Num.maxData,
            min: ess2Num.minData,
            inverse: true,
            nameLocation: 'start',
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
                width: 1,
                color: 'rgb(39, 126, 171)'
            },
            data: ess2Data.data
        }]
    };

    $(window).on('resize', function () {
        myChart.resize();
    });

    myChart.setOption(option)
}

// 浏览器窗口大小变化事件
$(window).resize(function () {          // 当浏览器大小变化时
    // 自动高度
    var oDivContent = document.getElementById('user_content_id_1');
    oDivContent.style.height = ($(window).height() - 2) + 'px';

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
function SelectAndGetDeviceHistData(ST, StartTime, EndTime) {

    var obj = new Object();

    try {
        // 下载当前设备的历史数据
        g_HistDataObj = ajaxSyncGetHistData(ST, StartTime, EndTime, true, 0, 86400);     // 获取所有数据
        if(g_HistDataObj == null) { //服务器拒绝了-数据量太大
            layer.msg("通讯故障、或数据量超出范围，请缩小搜索时间范围后重试!", { icon: 5, scrollbar: false });     // 5：失败；6：成功
        }
        else if (g_HistDataObj.length > 0) {
            if (g_HistDataObj.length >= 20000) {
                layer.msg("警告:一次最多显示2万条历史数据!", { icon: 6, scrollbar: false });     // 5：失败；6：成功
            }
            obj = data_handle(g_HistDataObj);         // 整理数据
        }
        else {
            // 没有数据清除页面，并显示没有数据
            //$('#echart_div_id').empty('');
            layer.msg(ST + " 暂无数据！", { icon: 5, scrollbar: false }); // 5：失败；6：成功
        }
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }

    return obj;
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

// 点击搜索查询数据
function query_data_onclick() {
    try {

        // 设置顶部显示的站点信息
        document.getElementById(g_oneNameId).innerHTML = g_deviceOneName;
        document.getElementById(g_twoNameId).innerHTML = g_deviceTwoName;

        loading_message1('加载数据中...');                    // 弹出提示框
        get_time_frame();                                   // 更新时间范围
        // 延时先等等加载中...显示出来后再加载数据
        setTimeout(function () {
            
            g_deviceOneData = SelectAndGetDeviceHistData(g_deviceOneST, g_StartTime, g_EndTime);   // 获取并显示当前选择的设备的数据
            g_deviceTwoData = SelectAndGetDeviceHistData(g_deviceTwoST, g_StartTime, g_EndTime);   // 获取并显示当前选择的设备的数据

            // 设置要素下拉框数据
            setEssSelectData(g_deviceOneData.nameList, g_ess1SelectId, g_ess1Index);
            setEssSelectData(g_deviceTwoData.nameList, g_ess2SelectId, g_ess2Index);
            
            // 显示折线图形数据
            g_Ess1EcharData = setEchartsInitData(g_deviceOneData, g_ess1SelectId, g_ess1Index);
            g_Ess2EcharData = setEchartsInitData(g_deviceTwoData, g_ess2SelectId, g_ess2Index);
            
            // 初始化显示图形
            initEcharts(g_TT, g_Ess1EcharData, g_Ess2EcharData);

            close_message();                                    // 关闭提示框 
        }, 100);
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
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
    if (obj == null || obj.length == 0) {       // 缓存无效才从服务器获取
        obj = parent.GetAllEssData();           // 获取所有要素数据
        parent.Write_AllEssDataCache(obj);      // 写入缓存到父页面
    }

    return obj;
}

// 处理下载的数据，获取要素名称信息，要素单位信息，时间列表，要素数据列表
function data_handle(all_data_obj) {
    var cnt;
    var deviceData = new Object();
    var fieldNameList = [];
    var fieldUnitList = [];
    g_TT = [];

    try {
        //先获取所有字段的字段名-不算时间与ST等
        cnt = 0;
        if (all_data_obj == null || all_data_obj.length == 0) return;
        for (var p in all_data_obj[0]) {//遍历json对象的每个key/value对,p为key
            
            if (p != 'ST' && p != 'TT' && p != 'UT' && p != null) {
                g_FieldList[cnt] = p; //记录字段
                fieldNameList[cnt] = get_field_name(g_AllEssDataCache, p);    //获取字段名称
                fieldUnitList[cnt] = get_field_uint(g_AllEssDataCache, p);    //获取字段单位
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

        deviceData.nameList = fieldNameList;
        deviceData.unitList = fieldUnitList;
        deviceData.essData = obj_arr;

    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }

    return deviceData;
}

