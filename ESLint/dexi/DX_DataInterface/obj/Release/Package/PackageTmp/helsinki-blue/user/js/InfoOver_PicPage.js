var g_RealDataObj = [];                 // 当前实时数据
var g_histDataObj = [];                 // 历史数据
var g_AllEssDataCache;                  // 所有要素数据列表-从父页面加载
var g_MyTree;                           // 左边站点列表
var g_ThisST;                           // 当前设备ST
var g_ThisName;                         // 当前设备Name
var g_StartTime;                        // 开始时间
var g_EndTime;                          // 结束时间
var g_IntervalTime = 1000 * 60 * 2;     // 每两分钟查看一次数据是否更细
var g_VideoList = [];                   // 视频信息
var myChart;                            // 折线图
var g_timer;                            // 定时器
var g_AlarmConfigObj = null;            // 当前设备的报警配置数据
var g_noDataStatus        = '未知';     // 无数据状态显示
var g_noDataNum           = 'N/A';      // 无数据数值显示
var g_outTimeStatus       = '离线';     // 超时状态显示
var g_defaultStatus       = '正常';     // 正常状态显示
var g_upLimitStatus       = '高报警';   // 高报警状态文字
var g_downLimitStatus     = '低报警'    // 低报警状态文字
var g_outTimeBgColor      = '#888';     // 离线 背景色
var g_overLimitBgColor    = '#E74C3C';  // 超限 背景颜色
var g_defaultBgColor      = '#6495ED';  // 正常背景颜色

// 水位固定信息
var g_levelEleObj = {
    infoName: 'level',
    ess: 'Z',
    unit: '(m)',
    ess2: '',
    unit2: '',
}
// 流量固定信息
var g_decEleObj = {
    infoName: 'dec',
    ess: 'Q1',
    unit: '(m³/s)',
    ess2: 'SBL1',
    unit2: '(m³/h)',
}
// 电压固定信息
var g_vEleObj = {
    infoName: 'v',
    ess: 'VT',
    unit: '(V)',
    ess2: '',
    unit2: '',
}

// 初始化加载执行
window.onload = function () {
    // 获取当前用户设备的经纬度

    $.ajaxSettings.async = false; // 由于有ajax，强制js为同步执行
    loading_message1('加载中...'); // 弹出提示框

    g_AllEssDataCache = AllDeviceEssInit(); // 初始化所有要素数据

    // 左侧列表
    var oDiv = document.getElementById('panel_id_1');
    oDiv.style.height = ($(window).height() - 12 - 30) + 'px';

    // 自动高度
    var oDiv = document.getElementById('div_scroll_id');
    oDiv.style.height = ($(window).height() - 2) + 'px';

    // 图标居中
    var oDiv = document.getElementById('scroll_ico_id');
    oDiv.style.marginTop = ($(window).height() - 100) / 2 + 'px';


    // 下载数据
    g_AllDeviceList = ajaxSyncGetDeviceList(); // 获取当前用户所有设备基本信息列表       
    // console.log('device:', g_AllDeviceList);            // 调试显示信息
    g_AllGroupList = ajaxSyncGetAllGroupList(); // 获取所有分组信息
    // console.log('GroupList:', g_AllGroupList);           // 调试显示信息

    // 获取当前用户绑定的所有视频数据
    g_VideoList = ajaxSyncGetVideoInfo();

    // 准备要显示的数据
    var ObjArr = conversion_data_tree_node(g_AllGroupList, g_AllDeviceList, 0); // 子列表数据源
    g_tree_config.ParentData = ObjArr[0]; // 父标签数据源 
    g_tree_config.LiData = ObjArr[1];
    g_tree_config.SelectionEvent = SelectionEvent; // 点击事件
    g_MyTree = new tree_list(g_tree_config);
    g_MyTree.render(); // 绘制列表
    // 侧边栏鼠标悬浮事件
    myTreeHoverEvent()

    document.getElementById('info_panel_id').style.display = '';

    g_ThisST = g_AllDeviceList[0].ST; // 当前设备ST
    g_ThisNAME = g_AllDeviceList[0].NAME; // 当前设备NAME

    //  设置第一次进入页面显示的默认设备信息
    setInitDeviceData();

    close_message(); // 关闭提示框 
    document.getElementById("cancel_search_button_id").disabled = "true"; // 禁用取消搜索按钮


}

//  设置第一次进入页面显示的默认设备信息
function setInitDeviceData() {
    SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME);
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

});

// 显示或隐藏左边栏
function scroll_btn_onclick() {
    try {
        var scrollDiv = document.getElementById('div_scroll_id');
        var oDiv = document.getElementById('right_panle_id');
        var oDiv_Ico = document.getElementById('scroll_ico_id');
        var theStatusValue = scrollDiv.getAttribute("data-user-flag"); //  获取自定义属性的值

        if (theStatusValue == 1) { // 需要隐藏
            $('#left_panle_id').hide();
            oDiv.style.marginLeft = 0 + 'px';
            oDiv_Ico.className = 'fa fa-chevron-right fa-2x';
            scrollDiv.setAttribute('data-user-flag', 0); // 标志设置为0

            //  重载折线图
            myChart.resize()
        } else { // 需要显示出来
            $('#left_panle_id').show();
            scrollDiv.setAttribute('data-user-flag', 1); // 标志设置为1
            oDiv_Ico.className = 'fa fa-chevron-left fa-2x';
            oDiv.style.marginLeft = cg_tree_width + 'px';

            //  重载折线图
            myChart.resize()
        }
    } catch (e) {
        alert("错误：" + e.message);
    }

}

// 刷新某个站点数据状态，标签栏状态
function set_title_status(TT) {
    var STATUS = null;
    var html = '实时数据';
    try {
        // var oDiv = document.getElementById('title_status_id');
        if (TT == null) { // 无数据
            STATUS = '无数据';
            html = '实时数据&nbsp<span class="layui-badge layui-bg-gray">' + STATUS + '</span>';

        } else {
            var date1 = new Date(TT.replace(/\-/g, "\/"));
            var date2 = new Date(); // 结束时间
            var date3 = date2.getTime() - date1.getTime(); // 时间差的毫秒数    
            // alert('当前时间：' + date2.getTime() + ' TT:' + date1.getTime() + ' 时间差：' + (date3 / 1000));
            var temp = date3 / 1000; // 转换为秒
            if (temp > 6 * 3600 || temp < -6 * 3600) { // 时间相差6小时以上显示为异常
                STATUS = '异常'; // 状态
                html = '实时数据&nbsp<span class="layui-badge">' + STATUS + '</span>';
            } else if (temp > 2 * 3600 || temp < -2 * 3600) { // 时间相差2小时以上显示为连接中
                STATUS = '连接中'; // 状态
                html = '实时数据&nbsp<span class="layui-badge layui-bg-orange">' + STATUS + '</span>';
            } else {
                STATUS = '正常'; // 状态
                html = '实时数据&nbsp<span class="layui-badge layui-bg-green">' + STATUS + '</span>';;
            }
        }
    } catch (e) {

    }
}

// 从缓存里查找当前设备是否有视频数据
function findVideoWithSt(ST) {
    try {
        for (var i = 0; i < g_VideoList.length; i++) {
            if (g_VideoList[i].ST == ST) { // 找到了
                return g_VideoList[i].URL;
            }
        }
        return nul;
    } catch (e) {}
    return null;
}

// 选择一个设备
function SelectAndGetDeviceRealData(ST, NAME) {
    try {
        // 刷新站点编号与名称
        document.getElementById('lable_st_id').innerHTML = '编号：' + ST;
        document.getElementById('lable_name_id').innerHTML = '名称：' + NAME;
        
        // 获取当前设备的报警配置
        g_AlarmConfigObj = ajax_sync_get_device_alarm_data(ST); 

        // 下载当前设备的实时数据
        if (g_tree_config.LiData != null && g_tree_config.LiData.length > 0) {
            // 获取当前设备最新数据
            g_RealDataObj = ajaxSyncGetRealData(ST);

            //  设置显示首页三个实时数据
            setDeviceInfoData (g_RealDataObj, g_levelEleObj);
            setDeviceInfoData (g_RealDataObj, g_decEleObj);
            setDeviceInfoData (g_RealDataObj, g_vEleObj);

            //获取当前系统时间
            var nowTime = new Date();
            var startTime = new Date();

            // 开始时间为当前时间往前24小时
            startTime = new Date(startTime.setDate(startTime.getDate() - 1));

            //　设置时间
            g_StartTime = startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate() + ' ' + startTime.getHours() + ':' + startTime.getMinutes() + ':' + startTime.getSeconds();
            g_EndTime = nowTime.getFullYear() + '-' + (nowTime.getMonth() + 1) + '-' + nowTime.getDate() + ' ' + nowTime.getHours() + ':' + nowTime.getMinutes() + ':' + nowTime.getSeconds();

            // 获取当前设备的历史数据
            g_histDataObj = ajaxSyncGetHistData(ST, g_StartTime, g_EndTime, false, 0, 1000);

            // 处理历史数据中的无效值
            var newHistData = dataProce(g_histDataObj);

            //  设置并显示折线图
            setEchartData('echart_item_id', newHistData, ST);

            //  获取视频数据   
            var deviceVideoUrl = findVideoWithSt(ST);
            setDeviceVideoData(deviceVideoUrl)
        }

    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); // 5：失败；6：成功
    }
}

// 数据处理，把无效负数修改为 无效
function dataProce(histData) {

    if (Object.keys(histData).length == 0) {
        return histData;
    }

    var newHistData = [];

    histData.forEach(function(item) {
        if (item.Z < -30) item.Z = '无效';
        if (item.Q1 < -30) item.Q1 = '无效';
        if (item.SBL1 < -30) item.SBL1 = '无效';

        newHistData.push(item);
        
    });
    return newHistData;
}

//  设置显示首页三个实时数据
function setDeviceInfoData (deviceRealData, essObj) {
    // 保存每个要素的所有数据
    var eleObj = {
        fatherEle: document.getElementById('info_' + essObj.infoName + '_id'),
        statusEle: document.getElementById('info_' + essObj.infoName + '_status_id'),
        numEle: document.getElementById('info_' + essObj.infoName + '_num_id'),
        timeEle: document.getElementById('info_' + essObj.infoName + '_time_id'),
        unit: essObj.unit,
        unit2: essObj.unit2,
        ess: essObj.ess,
        ess2: essObj.ess2
    }

    // 判断 要素 是否存在
    if (deviceRealData.length > 0 && deviceRealData[0][eleObj.ess] != null) {
        eleObj.numEle.innerHTML = deviceRealData[0][eleObj.ess] + eleObj.unit;
        eleObj.timeEle.innerHTML = deviceRealData[0].TT;
    } else if (deviceRealData.length > 0 && deviceRealData[0][eleObj.ess2] != null) {
        eleObj.numEle.innerHTML = deviceRealData[0][eleObj.ess2] + eleObj.unit2;
        eleObj.timeEle.innerHTML = deviceRealData[0].TT;
    } else {
        eleObj.statusEle.innerHTML = g_noDataStatus;
        eleObj.numEle.innerHTML = g_noDataNum;
        eleObj.timeEle.innerHTML = g_noDataNum;
        eleObj.fatherEle.style.background = g_defaultBgColor;

        return;
    }

    // 数据超过4小时没有更新， 状态显示超时
    if (judgeTimeDiffer(deviceRealData[0].TT) >= 4) {
        eleObj.statusEle.innerHTML = g_outTimeStatus;
        eleObj.fatherEle.style.background = g_outTimeBgColor;

        return;
    } else { // 不超时
        eleObj.statusEle.innerHTML = g_defaultStatus;
        eleObj.fatherEle.style.background = g_defaultBgColor;
    }

    // 判断并设置超限状态
    if (g_AlarmConfigObj != null && g_AlarmConfigObj[eleObj.ess] != null && g_AlarmConfigObj[eleObj.ess].ALARM == 1) {
        var essAlarm = g_AlarmConfigObj[eleObj.ess];                
        if (essAlarm.AH != 0 && deviceRealData[0][eleObj.ess] > essAlarm.AH) {
            eleObj.statusEle.innerHTML = g_upLimitStatus;
            eleObj.fatherEle.style.background = g_overLimitBgColor;
        } else if (essAlarm.AL != 0 && deviceRealData[0][eleObj.ess] < essAlarm.AL) {
            eleObj.statusEle.innerHTML = g_downLimitStatus;
            eleObj.fatherEle.style.background = g_overLimitBgColor;
        }
    } 
}

// 判断上次更新时间是否超过四个小时
function judgeTimeDiffer(startTime) {
    var endTime = new Date();
    endTime = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate() + ' ' + endTime.getHours() + ':' + endTime.getMinutes() + ':' + endTime.getSeconds();
    var StartTime = new Date(startTime.replace(/-/g, "/"));
    var EndTime = new Date(endTime.replace(/-/g, "/"));

    return parseInt((EndTime.getTime() - StartTime.getTime()) / 1000 / 60 / 60);
}

// 处理报警设置数据
function setAlarmConfigData(echartsData, ess) {

    // echart 的 markline 配置项
    var marklineConfig = {};

    // 确认有数据并且警戒限配置开启
    if (echartsData.length > 0 && g_AlarmConfigObj != null && g_AlarmConfigObj[ess] != null && g_AlarmConfigObj[ess].ALARM == 1) {
        var essAlarm = g_AlarmConfigObj[ess];          
        if (essAlarm.AL == 0 && essAlarm.AH != 0) {                         // 只设置了上限
            marklineConfig.data = [{
                name: '上限(' + essAlarm.AH + ')',
                yAxis: essAlarm.AH,
                lineStyle: {
                    color: '#E74C3C',
                }
            }]
        }
        else if (essAlarm.AH == 0 && essAlarm.AL != 0) {                    // 只设置了下限
            marklineConfig.data = [{
                name: '下限(' + essAlarm.AL + ')',
                yAxis: essAlarm.AL,
                lineStyle: {
                    color: '#888'
                }
            }]
        } 
        else if (essAlarm.AH != 0 && essAlarm.AL != 0){                                          // 上下限都有设置
            marklineConfig.data = [{
                name: '上限(' + essAlarm.AH + ')',
                yAxis: essAlarm.AH,
                lineStyle: {
                    color: '#E74C3C',
                }
            }, {
                name: '下限(' + essAlarm.AL + ')',
                yAxis: essAlarm.AL,
                lineStyle: {
                    color: '#888'
                }
            }]
        }
    } else {                                            // 无数据或者配置未开启
        marklineConfig.data = [];
    }
    return marklineConfig
}

//  设置echarts折线图数据
function setEchartData(echartId, echartsData, ST) {
    try {
        // 每个要素的报警配置数据
        var zMarklineConfig = setAlarmConfigData(echartsData, 'Z');
        var qMarklineConfig = setAlarmConfigData(echartsData, 'Q1');

        // 由于数据库返回数据顺序不一样，所以需要操作一次
        var realEchartsData = echartsData.reverse();

        var levelDatas = [];
        var decDatas = [];
        var dateDatas = [];

        for (var i = 0; i < realEchartsData.length; i++) {
            levelDatas.push(realEchartsData[i].Z);
            decDatas.push(realEchartsData[i].Q1);
            dateDatas.push(realEchartsData[i].TT.replace(' ', '\n'));
        }
        var levelEssData = publicSetEssData(levelDatas, 1.1);
        var decEssData = publicSetEssData(decDatas, 1.1);

        //  清除原有定时器
        clearInterval(g_timer);

        //  如果 echart 实例存在
        if (myChart != null && myChart != "" && myChart != undefined) {
            //  销毁实例
            myChart.dispose();
        }
        //  基于准备好的dom，初始化echarts实例
        myChart = echarts.init(document.getElementById(echartId))

        var levelTitle;
        var discTitle;

        if (echartsData == null || echartsData.length <= 0) {
            levelTitle = '水位图形（暂无历史数据）';
            discTitle = '流量图形（暂无历史数据）';
        } else {
            levelTitle = '水位图形';
            discTitle = '流量图形';
        }

        var option = {

            title: [{
                left: 'center', //  标题位置居中
                text: levelTitle
            }, {
                top: '52%', //  下面的折线图标题位置
                left: 'center',
                text: discTitle
            }],
            toolbox: {
                left: '70%',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            dataZoom: [{
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    top: '45%',
                    start: 96,
                    end: 100
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                },
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [1],
                    start: 96,
                    end: 100
                },
                {
                    type: 'inside',
                    xAxisIndex: [1],
                    start: 0,
                    end: 100
                }
            ],
            tooltip: {
                trigger: 'axis' //  悬浮到折点时候的上线标记线
            },
            xAxis: [{
                boundaryGap: false, //  默认为 true，此时刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。
                data: dateDatas //  数据
            }, {
                boundaryGap: false,
                data: dateDatas,
                gridIndex: 1 //  下面的折线图索引, (上面的索引为0)
            }],
            yAxis: [{
                name: '单位（m）',
                max: levelEssData.maxData,
                min: levelEssData.minData
            }, {
                gridIndex: 1,
                name: '流量（m³/s）',
                max: decEssData.maxData,
                min: decEssData.minData
            }],
            grid: [{
                bottom: '60%',
                right: '11%'
            }, {
                top: '60%',
                bottom: '10%',
                right: '11%'
            }],
            series: [{
                name: '水位',
                data: levelDatas,
                type: 'line',
                smooth: true, //  是否为平滑曲线
                itemStyle: {
                    normal: {
                        color: 'rgb(63, 167, 220)', //  折线颜色
                    }
                },
                areaStyle: { //  折线下是否填充
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
                markLine: {                 //  警戒线设置
                    silent: true,           //  不响应鼠标点击事件
                    itemStyle: {
                        normal:{
                            label:{
                                show:true,
                                formatter:function(param){
                                    return param.name
                                }
                            },
                            lineStyle:{
                                type:'solid',
                                width:2
                            }
                        }
                    },
                    data: zMarklineConfig.data
                }
            }, {
                name: '流量',
                data: decDatas,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: 'rgb(63, 167, 220)' //  折线折点颜色
                    }
                },
                areaStyle: { //  折现下是否填充
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
                markLine: {
                    silent: true,
                    itemStyle: {
                        normal:{
                            label:{
                                show:true,
                                formatter:function(param){
                                    return param.name
                                }
                            },
                            lineStyle:{
                                type:'solid',
                                width:2
                            }
                        }
                    },
                    data: qMarklineConfig.data
                },
                xAxisIndex: 1,
                yAxisIndex: 1
            }],
        };

        myChart.setOption(option);

        //  定时刷新数据 
        g_timer = setInterval(function () {

            // 获取最新数据
            var newDeviceData = ajaxSyncGetRealData(ST);
            // 更新三个实时数据
            setDeviceInfoData (newDeviceData, g_levelEleObj);
            setDeviceInfoData (newDeviceData, g_decEleObj);
            setDeviceInfoData (newDeviceData, g_vEleObj);

            if (realEchartsData != null && realEchartsData.length > 0) {
                // 与历史数据最后一条时间不一致， 就更新数据
                if (newDeviceData[0].TT != realEchartsData[realEchartsData.length - 1].TT) {
                    // 把最新数据添加到数组的最后面
                    realEchartsData.push(newDeviceData[0]);
                    // 移出最前面一个老数据
                    realEchartsData.shift();

                    var newLevelDatas = [];
                    var newDecDatas = [];
                    var newDateDatas = [];

                    for (var i = 0; i < realEchartsData.length; i++) {
                        newLevelDatas.push(realEchartsData[i].Z);
                        newDecDatas.push(realEchartsData[i].Q1);
                        newDateDatas.push(realEchartsData[i].TT.replace(' ', '\n'));
                    }

                    // 更新折线图
                    myChart.setOption({
                        xAxis: [{
                            data: newDateDatas
                        }, {
                            data: newDateDatas,
                            gridIndex: 1
                        }],
                        series: [{
                            data: newLevelDatas
                        }, {
                            data: newDecDatas,
                            xAxisIndex: 1,
                            yAxisIndex: 1
                        }],
                    });
                }
            }
        }, g_IntervalTime);

        //  用于使chart自适应高度和宽度, 因为初始隐藏的标签在初始化图表的时候因为获取不到容器的实际高宽，可能会绘制失败
        $(window).on('resize', function () {
            myChart.resize();
        });

    } catch (e) {

    }

}

// 设置当前设备视频数据
function setDeviceVideoData(url) {
    try {
        var noteInfo = document.getElementById('no_videoData_id');
        var video = document.getElementById('myVideo');

        if (url == null) {
            noteInfo.style.display = 'block'; // 显示提示
            video.style.display = 'none';
        } else {
            noteInfo.style.display = 'none';
            video.style.display = 'block'; // 显示视频

            //  支持HLS 
            if (Hls.isSupported) {
                var hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    video.play();
                });
            }
            //  不支持HLS, 可以直接播放
            else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                video.addEventListener('loadedmetadata', function () {
                    video.play();
                })
            }

        }

    } catch (e) {
        layer.msg("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
    close_message(); // 关闭提示框 
}

// 在要素字段总表中查找当前字段名
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

// 将获取到的设备数据转换为能被layui table显示的数据 DeviceRealData:需要显示的详细设备信息
function conversion_data_layui_table(DeviceRealData) {
    var DeviceTableData = JSON.parse('[]'); // 清空数据，创建一个对象数组   
    var cnt = 0;
    var FielName = ''; // 字段名称
    var DataObj;
    var EssList = []; // 要素字段列表
    var EssName = []; // 要素字段名称
    var EssUint = []; // 要素字段名称
    var EssData = []; // 字段对应值

    try {

        if (DeviceRealData == null || DeviceRealData.length == 0) // 没有数据
        {
            return DeviceTableData;
        } else {
            // 强制第一个为采集时间
            var obj = new Object();
            obj.ID = (cnt + 1) + '';
            obj.ESS = '采集时间'; // 获取要素名称
            obj.DATA = DeviceRealData[0]['TT']; // 获取字段年对于的值
            //  obj.UINT = get_field_uint(g_AllEssDataCache, 'TT');       // 获取要素单位
            DeviceTableData[cnt] = obj;
            cnt++;

            // 遍历json对象的每个key/value对,p为key-获取要素数据 ESS_ASCII
            for (var p in DeviceRealData[0]) {

                if (p != 'ST' && p != 'TT' && p != 'UT' && (p != null)) {

                    EssList[cnt] = p; // 记录字段

                    var obj = new Object();

                    obj.ESS = get_field_name(g_AllEssDataCache, p); // 获取要素名称
                    if (DeviceRealData[0][p] <= -30) // 无效值
                    {
                        obj.DATA = '无效'; // 获取字段年对于的值
                    } else {
                        obj.DATA = DeviceRealData[0][p] + ' ' + get_field_uint(g_AllEssDataCache, p); // 获取字段年对于的值
                    }

                    // alert(p + " " + DeviceRealData[0][p]);
                    if ((DeviceRealData[0][p] != null) && (DeviceRealData[0][p] != null)) {
                        // alert(p + " " + DeviceRealData[0][p]);
                        DeviceTableData[cnt] = obj;
                        cnt++;
                    }

                }
            }

            // 强制最后一个为上传时间
            var obj = new Object();
            obj.ID = (cnt + 1) + '';
            obj.ESS = '上传时间'; // 获取要素名称
            obj.DATA = DeviceRealData[0]['UT']; // 获取字段年对于的值
            //  obj.UINT = get_field_uint(g_AllEssDataCache, 'TT');       // 获取要素单位
            DeviceTableData[cnt] = obj;
            cnt++;
        }
    } catch (e) {
        layer.alert("处理数据发生了错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }

    // console.log('DeviceTableData:', DeviceTableData);        // 调试显示信息
    return DeviceTableData;
}

// 选择事件
function SelectionEvent(index, data_name, text) {
    loading_message1('加载中...'); // 弹出提示框

    g_ThisST = data_name; // 当前设备ST
    var str = text;
    str = str.substring(11, str.length); // 截取后面的名称
    g_ThisNAME = str; // 当前设备NAME
    SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME); // 获取并显示当前选择的设备的数据
}

// 初始化要素数据
function AllDeviceEssInit() {
    var obj = null;
    try {
        obj = parent.Read_AllEssDataCache(); // 读取父页面缓存的数据
    } catch (e) {

    }
    if (obj == null || obj.length == 0) // 缓存无效才从服务器获取
    {
        // alert("ajax获取要素表");
        obj = parent.GetAllEssData(); // 获取所有要素数据
        parent.Write_AllEssDataCache(obj); // 写入缓存到父页面
    }

    return obj;
}

// table表格配置
var g_table_config = {
    elem: '#demo',
    data: null,
    cols: [[
        {
            field: 'essname',
            width: 120,
            style: 'background-color: #f2f2f2;'
        },
        {
            field: 'essvalue',
            minWidth: 160,
        },
        {
            field: 'essname2',
            width: 120,
            style: 'background-color: #f2f2f2;'
        },
        {
            field: 'essvalue2',
            minWidth: 160,
        }
    ]],
};

var infoDatas = [
    {essName: '所属单位', essValue: '德希科技'},
    {essName: '装机容量', essValue: '500'},
    {essName: '库容', essValue: '999'},
    {essName: '水电站状态', essValue: '正常'},
    {essName: '通信畅通率', essValue: '89%'},
]

layui.use('table', function () {
    var table = layui.table;

    g_table_config.data = [{
        "essname": "所属单位",
        "essvalue": "德希科技",
        "essname2": "装机容量",
        "essvalue2": "500",
    }, {
        "essname": "库容",
        "essvalue": "999",
        "essname2": "水电站状态",
        "essvalue2": "正常",
    }, {
        "essname": "通信畅通率",
        "essvalue": "89%",
        "essname2": "",
        "essvalue2": "",
    }];

    table.render(g_table_config);

});