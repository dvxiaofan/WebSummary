var g_RealDataObj = [];                 // 当前实时数据
var g_AllEssDataCache;                  // 所有要素数据列表-从父页面加载
var g_TableData;                        // 当前表格显示的数据
var g_MyTree;
var g_ThisST;                           // 当前设备ST
var g_ThisName;                         // 当前设备Name
var g_PicInfoData;                      // 图片信息列表
var g_AlarmConfigObj = null;            // 当前设备的报警配置数据
var g_downLimitIndexArray = null;       // 下限的行序号
var g_upLimitIndexArray = null;         // 上限的行序号
var g_overIndexArray = null;            // 超限的行序号

// table表格配置
var g_table_config = {
    elem: '#real_data_table_id',
    data: null,
    limit: 100 ,            // 每页显示100条
    text: {
        none: '暂无相关数据'
    },
    height: 'full-200',
    cellMinWidth: 100 ,     // 全局定义常规单元格的最小宽度，layui 2.2.1 新增
    page: false ,           // 开启分页
    cols: [
        [ // 表头
            {
                field: 'ID',
                title: '序号',
                width: 70
            }, {
                field: 'ESS',
                title: '要素',
                width: 100,
                templet: '#sexTpl',
                color: '#'
            }, {
                field: 'DATA',
                title: '值'
            }, {
                field: 'UINT',
                title: '单位',
                width: 100
            }
        ]
    ],
        //  even: true,  // 开启隔行背景
    size: 'sm', // 小尺寸的表格
    done: function (res, curr, count) {
        // 先获取当前table行集合
        var trs = Layui_GetDataTableRows('table_panel_id1');
        if (trs != null && trs.length > 0) {
            // 设置下限颜色
            if (g_downLimitIndexArray != null && g_downLimitIndexArray.length > 0) {
                for (var i = 0; i < g_downLimitIndexArray.length; i++) { // 需要设置为蓝色的行序号
                    if (g_downLimitIndexArray[i] < (trs.length)) { // 没有超出范围
                        trs[g_downLimitIndexArray[i]].style.color = "#2c08b1";
                    }
                }
            }
            // 设置上限颜色
            if (g_upLimitIndexArray != null && g_upLimitIndexArray.length > 0) {
                for (var i = 0; i < g_upLimitIndexArray.length; i++) {   // 需要设置为红色的行序号
                    if (g_upLimitIndexArray[i] < (trs.length)) {         // 没有超出范围
                        trs[g_upLimitIndexArray[i]].style.color = "#ff7a00";
                    }
                }
            }
            
            // 设置超限颜色
            if (g_overIndexArray != null && g_overIndexArray.length > 0) {
                for (var i = 0; i < g_overIndexArray.length; i++) {
                    
                    trs[g_overIndexArray[i]].style.color = "#fa0050";
                    
                }
            }
        }
    }
};

// 显示图片
function getPicture(PicInfoData) {
    var ul = $(".listul");
    ul.empty();

    var e = "";
    if (PicInfoData == null || PicInfoData.length == 0) { // 没有图片
        ul.append('<div class="layui-none fydiv">暂无图片数据</div>');
    } else {
        try {
            for (var i = 0; i < PicInfoData.length; i++) {
                var e = "<li ><a href=\"#\" id=\"pic_id_" + i + "\" onclick=\"pic_onclick(this.id)\"><div style=\"width:160px;height:160px;display: table-cell;vertical-align: middle;text-align: center;\"><img style=\"width:160px;height:160px;\" src=\"/Home/GetImg?id=" + PicInfoData[i].ID + "\"></div></a><p><span>" + PicInfoData[i].TT + "</span></p></li>";
                ul.append(e);

            }
            // 重新设置高度，如果超出了窗口大则进行限制
            var oDiv1 = document.getElementById('table_panel_id1');
            var oDiv2 = document.getElementById('table_panel_id2');

            oDiv2.style.height = oDiv1.clientHeight + 'px';
        } catch (e) {
            layer.msg("错误：" + e.message, {
                icon: 5,
                scrollbar: false
            }); // 5：失败；6：成功
        }

    }
}

// 点击图片处理
function pic_onclick(id) {
    try {
        var index = parseInt(id.substring(7));
        open_pic_frame(g_ThisST + ' ' + g_ThisNAME + ' (' + g_PicInfoData[index].TT + ')', '/Home/GetImg?id=' + g_PicInfoData[index].ID); // 后面的名称);
    } catch (e) {
        layer.msg("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
}

// 弹窗子窗口-查看图片
function open_pic_frame(title, url) {
    try {
        // iframe层-多媒体
        layer.open({
            type: 2,
            title: title,
            area: ['660px', '540px'],
            shade: 0.8,
            closeBtn: 1,
            shadeClose: true,
            content: url,
        });
    } catch (e) {
        layer.msg("错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
}

// 初始化加载执行
window.onload = function () { // 要执行的js代码段

    $.ajaxSettings.async = false; // 由于有ajax，强制js为同步执行
    loading_message('加载数据中...'); // 弹出提示框

    g_AllEssDataCache = AllDeviceEssInit(); // 初始化所有要素数据
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

    // 下载数据
    g_AllDeviceList = ajaxSyncGetDeviceList(); // 获取当前用户所有设备基本信息列表
    g_AllGroupList = ajaxSyncGetAllGroupList(); // 获取所有分组信息
    
    // 准备要显示的数据
    var ObjArr = conversion_data_tree_node(g_AllGroupList, g_AllDeviceList, 0); // 子列表数据源
    g_tree_config.ParentData = ObjArr[0]; // 父标签数据源
    g_tree_config.LiData = ObjArr[1];
    g_tree_config.SelectionEvent = SelectionEvent; // 点击事件
    g_MyTree = new tree_list(g_tree_config);
    g_MyTree.render(); // 绘制列表
    // 调用侧边栏鼠标悬浮事件
    myTreeHoverEvent()
    g_ThisST = g_AllDeviceList[0].ST; // 当前设备ST
    g_ThisNAME = g_AllDeviceList[0].NAME; // 当前设备NAME

    SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME); // 获取并显示当前选择的设备的数据
    // 获取图片数据
    g_PicInfoData = ajax_sync_get_real_pic_info(g_ThisST); // 获取图片信息
    getPicture(g_PicInfoData); // 下载图片

    // 延时调整高度
    setTimeout('delay_auto_height()', 500);

    // myTreeHoverEvent();
    close_message(); // 关闭提示框

    document.getElementById("cancel_search_button_id").disabled = "true"; // 禁用取消搜索按钮
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

    // 延时调整高度
    setTimeout('delay_auto_height()', 500);
});

// 延时调整高度
function delay_auto_height() {
    try {
        // 重新设置高度，如果超出了窗口大则进行限制
        var oDiv1 = document.getElementById('table_panel_id1');
        var oDiv2 = document.getElementById('table_panel_id2');
        // alert(oDiv1.clientHeight + ' ' + oDiv2.clientHeight);

        oDiv2.style.height = oDiv1.clientHeight + 'px';
    } catch (e) {

    }
}

// 刷新某个站点数据状态，标签栏状态
function set_title_status(TT) {
    var STATUS = null;
    var html = '实时数据';
    try {
        var oDiv = document.getElementById('title_status_id');
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
    oDiv.innerHTML = html;
}

// 刷新某个站点数据
function SelectAndGetDeviceRealData(ST, NAME) {
    try {
        // 刷新站点编号与名称
        document.getElementById('lable_st_id').innerHTML = '编号：' + ST;
        document.getElementById('lable_name_id').innerHTML = '名称：' + NAME;

        g_AlarmConfigObj = ajax_sync_get_device_alarm_data(g_ThisST); // 获取当前设备的报警配置
        // 下载当前设备的实时数据
        if (g_tree_config.LiData != null && g_tree_config.LiData.length > 0) {
            g_RealDataObj = ajaxSyncGetRealData(ST);
        }
        g_TableData = conversion_data_layui_table(g_RealDataObj, g_AlarmConfigObj); // 将获取到的实时数据转换为表格能显示的数据
        set_title_status((g_RealDataObj == null || g_RealDataObj.length == 0) ? null : g_RealDataObj[0].TT); // 刷新实时数据上面的标签
        if (g_tableIns != null) { // 表格重载

            g_table_config.data = g_TableData;
            g_tableIns.reload(g_table_config);
        } else {
            data_table_init(g_TableData); // 初始化表格
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
// DeviceAlarmConfig:2018-12-05 增加设备报警配置数据显示
function conversion_data_layui_table(DeviceRealData, DeviceAlarmConfig) {
    var DeviceTableData = JSON.parse('[]'); // 清空数据，创建一个对象数组
    var cnt = 0;
    var FielName = ''; // 字段名称
    var DataObj;
    var EssList = []; // 要素字段列表
    var EssName = []; // 要素字段名称
    var EssUint = []; // 要素字段名称
    var EssData = []; // 字段对应值
    g_downLimitIndexArray = new Array(); // 显示蓝色的行序号
    g_upLimitIndexArray = new Array(); // 显示红色的行序号
    g_overIndexArray = new Array(); // 显示红色的行序号
    var downCnt = 0,
        upCnt = 0,
        overCnt = 0;

    try {

        if (DeviceRealData == null || DeviceRealData.length == 0) { // 没有数据
            return DeviceTableData;
        } else {
            // 强制第一个为采集时间
            var obj = new Object();
            obj.ID = (cnt + 1) + '';
            obj.ESS = '采集时间'; // 获取要素名称
            obj.DATA = DeviceRealData[0]['TT']; // 获取字段年对于的值 
            DeviceTableData[cnt] = obj;
            cnt++;

            // 遍历 json 对象的每个key/value对,p 为 key-获取要素数据 ESS_ASCII
            for (var p in DeviceRealData[0]) {

                // alert(p + " " + DeviceRealData[0][p]);
                if (p != 'ST' && p != 'TT' && p != 'UT' && p != null) {
                    EssList[cnt] = p; // 记录字段

                    var obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = get_field_name(g_AllEssDataCache, p);     // 获取要素名称
                    obj.DATA = DeviceRealData[0][p];                    // 获取字段对于的值
                    obj.UINT = get_field_uint(g_AllEssDataCache, p);    // 获取要素单位
                    DeviceTableData[cnt] = obj; 
                    
                    // 如果设置了报警值，设置对应数据的颜色和数据
                    if (DeviceAlarmConfig != null && DeviceAlarmConfig[p] != undefined && DeviceAlarmConfig[p].ALARM != undefined && DeviceAlarmConfig[p].ALARM == 1) {
                        if (DeviceAlarmConfig[p].AH != 0 && DeviceRealData[0][p] > DeviceAlarmConfig[p].AH) {
                            obj.DATA = DeviceRealData[0][p] + ' （高报警）';
                            g_overIndexArray.push(cnt);
                        } else if (DeviceAlarmConfig[p].AL != 0 && DeviceRealData[0][p] < DeviceAlarmConfig[p].AL) {
                            obj.DATA = DeviceRealData[0][p] + ' （低报警）';
                            g_overIndexArray.push(cnt);
                        }
                    }

                    cnt++;
                }
            }

            // 强制最后一个为上传时间
            var obj = new Object();
            obj.ID = (cnt + 1) + '';
            obj.ESS = '上传时间'; // 获取要素名称
            obj.DATA = DeviceRealData[0]['UT']; // 获取字段年对于的值
            DeviceTableData[cnt] = obj;
            cnt++;

            // console.log(DeviceRealData[0])

            // 2018-12-05 如果配置了报警阈值，则在此处显示
            if (DeviceAlarmConfig != null) {
                // 水位1-总开关
                if (DeviceAlarmConfig.Z != undefined && DeviceAlarmConfig.Z.ALARM != undefined && DeviceAlarmConfig.Z.ALARM == 1) {
                    
                    // 显示水位1-高报警预置
                    if (DeviceAlarmConfig.Z != undefined && DeviceAlarmConfig.Z.AH != undefined && DeviceAlarmConfig.Z.AH > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '水位1上限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.Z.AH;
                        obj.UINT = '米'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_upLimitIndexArray[upCnt++] = cnt; // 红色行号

                        cnt++;
                    }

                    // 显示水位1-低报警预置
                    if (DeviceAlarmConfig.Z != undefined && DeviceAlarmConfig.Z.AL != undefined && DeviceAlarmConfig.Z.AL > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '水位1下限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.Z.AL;
                        obj.UINT = '米'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_downLimitIndexArray[downCnt++] = cnt; // 蓝色行号
                        cnt++;
                    }

                }

                // 水位2-总开关
                if (DeviceAlarmConfig.ZB != undefined && DeviceAlarmConfig.ZB.ALARM != undefined && DeviceAlarmConfig.ZB.ALARM == 1) {
                    // 显示水位2-高报警预置
                    if (DeviceAlarmConfig.ZB != undefined && DeviceAlarmConfig.ZB.AH != undefined && DeviceAlarmConfig.ZB.AH > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '水位2上限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.ZB.AH;
                        obj.UINT = '米'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_upLimitIndexArray[upCnt++] = cnt; // 红色行号

                        cnt++;
                    }

                    // 显示水位2-低报警预置
                    if (DeviceAlarmConfig.ZB != undefined && DeviceAlarmConfig.ZB.AL != undefined && DeviceAlarmConfig.ZB.AL > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '水位2下限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.ZB.AL;
                        obj.UINT = '米'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_downLimitIndexArray[downCnt++] = cnt; // 蓝色行号

                        cnt++;
                    }
                }

                // 瞬时流量1-总开关
                if (DeviceAlarmConfig.Q1 != undefined && DeviceAlarmConfig.Q1.ALARM != undefined && DeviceAlarmConfig.Q1.ALARM == 1) {
                    // 显示瞬时流量1-高报警预置
                    if (DeviceAlarmConfig.Q1 != undefined && DeviceAlarmConfig.Q1.AH != undefined && DeviceAlarmConfig.Q1.AH > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '流量1上限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.Q1.AH;
                        obj.UINT = '立方米/秒'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_upLimitIndexArray[upCnt++] = cnt; // 红色行号

                        cnt++;
                    }

                    // 显示瞬时流量1-低报警预置
                    if (DeviceAlarmConfig.Q1 != undefined && DeviceAlarmConfig.Q1.AL != undefined && DeviceAlarmConfig.Q1.AL > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '流量1下限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.Q1.AL;
                        obj.UINT = '立方米/秒'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_downLimitIndexArray[downCnt++] = cnt; // 蓝色行号

                        cnt++;
                    }

                }

                // 瞬时流量2-总开关
                if (DeviceAlarmConfig.Q2 != undefined && DeviceAlarmConfig.Q2.ALARM != undefined && DeviceAlarmConfig.Q2.ALARM == 1) {
                    // 显示瞬时流量2-高报警预置
                    if (DeviceAlarmConfig.Q2 != undefined && DeviceAlarmConfig.Q2.AH != undefined && DeviceAlarmConfig.Q2.AH > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '流量2上限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.Q2.AH;
                        obj.UINT = '立方米/秒'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_upLimitIndexArray[upCnt++] = cnt; // 红色行号

                        cnt++;
                    }

                    // 显示瞬时流量2-低报警预置
                    if (DeviceAlarmConfig.Q2 != undefined && DeviceAlarmConfig.Q2.AL != undefined && DeviceAlarmConfig.Q2.AL > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '流量2下限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.Q2.AL;
                        obj.UINT = '立方米/秒'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_downLimitIndexArray[downCnt++] = cnt; // 蓝色行号

                        cnt++;
                    }

                }

                // 小时水量1-总开关
                if (DeviceAlarmConfig.SBL1 != undefined && DeviceAlarmConfig.SBL1.ALARM != undefined && DeviceAlarmConfig.SBL1.ALARM == 1) {
                    // 显示小时水量1-高报警预置
                    if (DeviceAlarmConfig.SBL1 != undefined && DeviceAlarmConfig.SBL1.AH != undefined && DeviceAlarmConfig.SBL1.AH > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '水量1上限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.SBL1.AH;
                        obj.UINT = '立方米/小时'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_upLimitIndexArray[upCnt++] = cnt; // 红色行号

                        cnt++;
                    }

                    // 显示小时水量1-低报警预置
                    if (DeviceAlarmConfig.SBL1 != undefined && DeviceAlarmConfig.SBL1.AL != undefined && DeviceAlarmConfig.SBL1.AL > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '水量1下限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.SBL1.AL;
                        obj.UINT = '立方米/小时'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_downLimitIndexArray[downCnt++] = cnt; // 蓝色行号

                        cnt++;
                    }

                }

                // 小时水量2-总开关
                if (DeviceAlarmConfig.SBL2 != undefined && DeviceAlarmConfig.SBL2.ALARM != undefined && DeviceAlarmConfig.SBL2.ALARM == 1) {
                    // 显示小时水量2-高报警预置
                    if (DeviceAlarmConfig.SBL2 != undefined && DeviceAlarmConfig.SBL2.AH != undefined && DeviceAlarmConfig.SBL2.AH > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '水量2上限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.SBL2.AH;
                        obj.UINT = '立方米/小时'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_upLimitIndexArray[upCnt++] = cnt; // 红色行号

                        cnt++;
                    }

                    // 显示小时水量2-低报警预置
                    if (DeviceAlarmConfig.SBL2 != undefined && DeviceAlarmConfig.SBL2.AL != undefined && DeviceAlarmConfig.SBL2.AL > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '水量2下限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.SBL2.AL;
                        obj.UINT = '立方米/小时'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_downLimitIndexArray[downCnt++] = cnt; // 蓝色行号

                        cnt++;
                    }

                }

                // 电源电压预警-总开关
                if (DeviceAlarmConfig.VT != undefined && DeviceAlarmConfig.VT.ALARM != undefined && DeviceAlarmConfig.VT.ALARM == 1) {
                    // 显示电池电压-高报警预置
                    if (DeviceAlarmConfig.VT != undefined && DeviceAlarmConfig.VT.AH != undefined && DeviceAlarmConfig.VT.AH > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '电压上限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.VT.AH;
                        obj.UINT = '立方米/小时'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_upLimitIndexArray[upCnt++] = cnt; // 红色行号
                        
                        cnt++;
                    }

                    // 显示电池电压-低报警预置
                    if (DeviceAlarmConfig.VT != undefined && DeviceAlarmConfig.VT.AL != undefined && DeviceAlarmConfig.VT.AL > 0) {
                        obj = new Object();
                        obj.ID = (cnt + 1) + '';
                        obj.ESS = '电压下限'; // 获取要素名称
                        obj.DATA = DeviceAlarmConfig.VT.AL;
                        obj.UINT = '立方米/小时'; // 获取要素单位
                        DeviceTableData[cnt] = obj;
                        g_downLimitIndexArray[downCnt++] = cnt; // 蓝色行号
    
                        cnt++;
                    }
                }
            }
        }
    } catch (e) {
        layer.alert("处理数据发生了错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }

    // alert(JSON.stringify(DeviceTableData, 4));        // 调试显示信息
    return DeviceTableData;
}

// 选择事件
function SelectionEvent(index, data_name, text) {
    loading_message1('加载数据中...'); // 弹出提示框

    g_ThisST = data_name; // 当前设备ST
    var str = text;
    str = str.substring(11, str.length); // 截取后面的名称
    g_ThisNAME = str; // 当前设备NAME
    SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME); // 获取并显示当前选择的设备的数据
    // 获取图片数据
    g_PicInfoData = ajax_sync_get_real_pic_info(g_ThisST); // 获取图片信息
    getPicture(g_PicInfoData); // 下载图片
    // alert(JSON.stringify(obj), 4);
    close_message(); // 关闭提示框 
    // alert(JSON.stringify(obj), 4);
    // alert('选择索引：' + index);
}

// 点击按钮刷新当前设备实时数据
function RefreshThisRealData_OnClick() {
    loading_message1('加载数据中...'); // 弹出提示框
    SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME); // 获取并显示当前选择的设备的数据
    close_message(); // 关闭提示框 
}

// 点击按钮刷新当前设备实时图片
function RefreshThisRealPicture_OnClick() {
    loading_message1('加载数据中...'); // 弹出提示框
    // 获取图片数据
    g_PicInfoData = ajax_sync_get_real_pic_info(g_ThisST); // 获取图片信息
    getPicture(g_PicInfoData); // 下载图片
    close_message(); // 关闭提示框 
}

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

// 获取当前设备的最近7天图片信息
function ajax_sync_get_real_pic_info(ST) {
    var obj = JSON.parse('[]');

    try {
        // 请求服务器
        var jsonData = {
            GetFun: 'GetDeviceRealPicInfo',
            ST: ST,
        };


        $.ajax({
                url: '/Home/Index',
                type: 'POST',
                dataType: 'json',
                async: false, // 同步执行
                data: jsonData,
            })
            .done(function (response) {
                if (response.rel == 1) { // 获取成功
                    obj = JSON.parse(response.obj); // 全局缓存设备信息
                    // alert(JSON.stringify(response.obj, 4));         // 调试显示信息
                    if (response.obj == null) { // 没有数据
                        layer.alert("没有获取到数据！", {
                            icon: 5,
                            scrollbar: false
                        }); // 5：失败；6：成功
                    } else {
                        obj = JSON.parse(response.obj); // 转换为对象
                    }
                } else if (response.rel == -1) { // 需要登录
                    layer.alert(response.msg, {
                        icon: 5,
                        scrollbar: false
                    }); // 5：失败；6：成功
                    parent.JumpLogon();
                } else {
                    layer.alert(response.msg, {
                        icon: 5,
                        scrollbar: false
                    }); // 5：失败；6：成功
                }
            })
            .fail(function () {
                layer.alert('通信错误，请求数据失败！', {
                    icon: 5,
                    scrollbar: false
                }); // 5：失败；6：成功
            })
    } catch (e) {
        layer.alert("发生了错误：" + e.message, {
            icon: 5,
            scrollbar: false
        }); // 5：失败；6：成功
    }
    return obj;
}