/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
let gDataAllCnt = 0; // 数据总数
let gHistDataObj = []; // 当前历史数据
let gAllEssDataCache; // 所有要素数据列表-从父页面加载
let gTableData; // 当前表格显示的数据
const OnePageDataCount = 100;
let gThisST; // 当前设备ST
let gAlarmConfigObj = null; // 当前设备的报警配置数据
let gLayerMsgIndex; // 加载框id
let gSelectPageIndex = 0;
let gStartTime; // 当前搜索框开始时间,字符串格式YYYY-MM-DD hh:mm:ss
let gEndTime; // 当前搜索框结束时间,字符串格式YYYY-MM-DD hh:mm:ss
let gTempStartTime; // 临时存放时间控件的时间，
let gTempEndTime; // 临时存放时间控件的时间，
let gMyTree;
let gOverTdsIndexes = []; // 记录每一行超限的 td index 的数组

// 表头
let gTableCols = [];

// 底部分页栏配置
const gTableLimt = {
    elem: 'limt_butt_id',
    theme: '#3E79BB', // 主题风格
    count: 0, // 总数
    limit: OnePageDataCount, // 单页显示数据条数
    groups: 10, // 连续出现的页码个数
    curr: (gSelectPageIndex + 1), // 当前页码
    layout: ['prev', 'page', 'next', 'count'],
    jump: function(obj, first) {
        tableLimtJumpEvent(obj, first);
    },
};

// 用于记录当前滑动条位置
const gScrollTop = {
    dev_obj: null, // layui table 父div
    layuitable: null, // 当前的layui table
    scrollTop: 0, // 记录位置
};

// table表格配置
const gTableConfig = {
    elem: '#device_list_table_id',
    data: null,
    limit: OnePageDataCount, // 每页显示
    text: {none: '暂无相关数据'},
    height: 'full-200',
    cellMinWidth: 70, // 全局定义常规单元格的最小宽度，layui 2.2.1 新增
    page: false, // 开启分页
    cols: [gTableCols],
    even: true, // 开启隔行背景
    size: 'sm', // 小尺寸的表格
    done: function() {
        // eslint-disable-next-line new-cap
        const trs = Layui_GetDataTableRows('table_and_page_div_id');
        // console.log(gOverTdsIndexes);

        if (trs == null
            || trs.length <= 0
            || gOverTdsIndexes == null
            || gOverTdsIndexes.length <= 0) return;

        for (let i = 0; i < trs.length; i++) {
            for (let j = 0; j < trs[i].children.length; j++) {
                // gOverTdsIndexes[i] 里面是否包含 j， 如果有，则把对应要素字体颜色设置为超限颜色
                if (gOverTdsIndexes[i].indexOf(j) != -1) {
                    trs[i].children[j].style.color = '#fa0050';
                }
            }
        }
    },
};

// 初始化加载执行
window.onload = function() {
    $.ajaxSettings.async = false; // 由于有ajax，强制js为同步执行

    // 自动高度-右侧正文
    const oDiv = document.getElementById('user_content_id_1');
    oDiv.style.height = ($(window).height() - 2) + 'px';
    // 左侧列表
    const oDiv1 = document.getElementById('panel_id_1');
    oDiv1.style.height = ($(window).height() - 12 - 30) + 'px';

    // 自动高度
    const oDiv2 = document.getElementById('div_scroll_id');
    oDiv2.style.height = ($(window).height() - 2) + 'px';

    // 图标居中
    const oDiv3 = document.getElementById('scroll_ico_id');
    oDiv3.style.marginTop = ($(window).height() - 100) / 2 + 'px';

    // 自动高度右侧 panel
    const oDiv4 = document.getElementById('user_panel_id_1');
    oDiv4.style.height = ($(window).height() - 40 + 10) + 'px';

    laydateInit(); // 初始化时间控件
    gAllEssDataCache = allDeviceEssInit(); // 初始化所有要素数据
    // 下载数据
    gAllDeviceList = ajaxSyncGetDeviceList(); // 获取当前用户所有设备基本信息列表
    gAllGroupList = ajaxSyncGetAllGroupList(); // 获取所有分组信息
    // alert(JSON.stringify(gAllGroupList), 4);
    // 准备要显示的数据
    const ObjArr = conversion_data_tree_node(gAllGroupList, gAllDeviceList, 0); // 子列表数据源
    gTreeConfig.ParentData = ObjArr[0]; // 父标签数据源
    gTreeConfig.LiData = ObjArr[1];
    gTreeConfig.SelectionEvent = SelectionEvent; // 点击事件
    // eslint-disable-next-line new-cap
    gMyTree = new tree_list(gTreeConfig);
    gMyTree.render(); // 绘制列表
    // 侧边栏鼠标悬浮事件
    myTreeHoverEvent();

    gThisST = gAllDeviceList[0].ST; // 当前设备ST
    gThisNAME = gAllDeviceList[0].NAME; // 当前设备NAME

    setTimeout(function() {
        selectAndGetDeviceHistData(gThisST, gThisNAME, gStartTime, gEndTime); // 获取并显示当前选择的设备的数据
    }, 250);
    close_message(); // 关闭提示框
};

// 浏览器窗口大小变化事件
$(window).resize(function() { // 当浏览器大小变化时
    // 自动高度
    const oDivContent = document.getElementById('user_content_id_1');
    oDivContent.style.height = ($(window).height() - 2) + 'px';

    const oDiv = document.getElementById('panel_id_1');
    oDiv.style.height = ($(window).height() - 12 - 30) + 'px';

    // 自动高度
    const oDiv1 = document.getElementById('div_scroll_id');
    oDiv1.style.height = ($(window).height() - 2) + 'px';

    // 图标居中
    const oDiv2 = document.getElementById('scroll_ico_id');
    oDiv2.style.marginTop = ($(window).height() - 100) / 2 + 'px';

    // 自动高度右侧 panle
    const oDiv3 = document.getElementById('user_panel_id_1');
    oDiv3.style.height = ($(window).height() - 40 + 10) + 'px';
});

/**
 * 时间控件初始化
 */
function laydateInit() {
    try {
        // 时间控件初始化
        layui.use('laydate', function() {
            const myDate = new Date(); // 获取当前系统时间
            const LastDate = new Date(); // 获取当前系统时间
            LastDate.setDate(LastDate.getDate() - 1); // 获取2天前时间
            // 初始化时间
            gTempStartTime = {
                year: LastDate.getFullYear(),
                month: (LastDate.getMonth() + 1),
                date: LastDate.getDate(),
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
            gTempEndTime = {
                year: myDate.getFullYear(),
                month: (myDate.getMonth() + 1),
                date: myDate.getDate(),
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
            getTimeFrame(); // 更新一次时间

            const laydate = layui.laydate;
            // 自定义格式
            laydate.render({
                elem: '#test11',
                format: 'yyyy年MM月dd日',
                value: LastDate.getFullYear() + '年'
                    + (LastDate.getMonth() + 1) + '月'
                    + LastDate.getDate() + '日',
                done: function(value, date, endDate) { // 控件选择完毕后的回调---点击日期、清空、现在、确定均会触发。
                    gTempStartTime = date; // 临时存放开始时间
                },
                theme: '#3E79BB', // 颜色-蓝色
            });

            // 自定义格式
            laydate.render({
                elem: '#test12',
                format: 'yyyy年MM月dd日',
                value: myDate.getFullYear() + '年'
                    + (myDate.getMonth() + 1) + '月'
                    + myDate.getDate() + '日',
                done: function(value, date, endDate) {
                    gTempEndTime = date; // 临时存放结束时间
                },
                theme: '#3E79BB', // 颜色-蓝色
            });
        });
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}

/**
 * 获取时间范围，时间存放到全局 gStartTime，gEndTime
 */
function getTimeFrame() {
    try {
        gStartTime = gTempStartTime.year + '-'
            + gTempStartTime.month + '-'
            + gTempStartTime.date
            + ' 00:00:00';
        gEndTime = gTempEndTime.year + '-'
            + gTempEndTime.month + '-'
            + gTempEndTime.date
            + ' 23:59:59';
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}

// (allDataCount:总的数据条数；OnePageCount：一页显示的数据条数；ThisPageIndex：当前页索引，从0开始,无需修改的参数可以为null)
/**
 * 刷新底部分页栏
 * @param {*} allDataCount
 * @param {*} OnePageCount
 * @param {*} ThisPageIndex
 */
function tableLimtRefresh(allDataCount, OnePageCount, ThisPageIndex) {
    // 刷新底部的分页栏
    layui.use('laypage', function() {
        const laypage = layui.laypage;
        // 执行一个laypage实例-设置分页
        if (allDataCount != null) {
            gTableLimt.count = allDataCount; // 数总数
        } else {
            gTableLimt.count = 0;
        }
        if (OnePageCount != null) {
            gTableLimt.limit = OnePageCount; // 单页显示数据条数
        }
        if (ThisPageIndex != null) {
            gTableLimt.curr = ThisPageIndex + 1; // 当前页
        }
        laypage.render(gTableLimt); // 重新刷新底部分页
    });
}

/**
 * 刷新某个站点数据
 *
 * @param {*} ST
 * @param {*} NAME
 * @param {*} StartTime
 * @param {*} EndTime
 */
function selectAndGetDeviceHistData(ST, NAME, StartTime, EndTime) {
    try {
        // 刷新站点编号与名称
        document.getElementById('lable_st_id').innerHTML = '编号：' + ST;
        document.getElementById('lable_name_id').innerHTML = '名称：' + NAME;

        gSelectPageIndex = 0; // 页索引为0
        // 下载当前设备的历史数据
        gDataAllCnt = ajax_sync_get_hist_data_count(ST, StartTime, EndTime, false); // 获取数据条数
        if (gDataAllCnt > 0) {
            gHistDataObj = ajax_sync_get_hist_data(ST, StartTime, EndTime, false, 0, 100);
        } else {
            gHistDataObj = [];
        }
        // 获取当前设备的报警配置
        gAlarmConfigObj = ajax_sync_get_device_alarm_data(ST);
        // console.log(gAlarmConfigObj);

        // 将数据转换为能被显示的格式
        gTableData = conversion_data_layui_table(gHistDataObj, 1, gAlarmConfigObj);
        gTableConfig.cols[0] = gTableCols; // 更新字段
        // alert(JSON.stringify(gTableCols, 4));        // 调试显示信息
        // alert(JSON.stringify(gDeviceInfoDataPage, 4));        // 调试显示信息

        if (gtableIns != null) { // 表格重载
            gTableConfig.data = gTableData;
            gtableIns.reload(gTableConfig);
        } else {
            data_table_init(gTableData); // 初始化表格
        }
        tableLimtRefresh(gDataAllCnt, OnePageDataCount, gSelectPageIndex); // 刷新底部的分页栏
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}

// 表格翻页处理
// eslint-disable-next-line require-jsdoc
function tableLimtJumpEvent(obj, first) {
    try {
        // obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
        //  console.log(obj.limit); // 得到每页显示的条数

        // 首次不执行
        if (!first) {
            // alert(obj.curr + " " + obj.limit);
            if (gDataAllCnt == 0) {
                layer.alert('没有数据', {
                    icon: 5,
                    scrollbar: false,
                }); // 5：失败；6：成功
                return;
            }

            // 弹出提示框
            gLayerMsgIndex = layer.msg('加载中', {
                icon: 16,
                shade: 0.1, // 越大界面越黑
                time: 60000, // 时间
                anim: 0, // 平滑放大
                scrollbar: false, // 锁定浏览器滑动
            });

            gSelectPageIndex = obj.curr - 1; // 获取当前页索引

            // eslint-disable-next-line max-len
            gHistDataObj = ajax_sync_get_hist_data(gThisST, gStartTime, gEndTime, false, gSelectPageIndex * OnePageDataCount, OnePageDataCount); // 获取第n页数据

            // eslint-disable-next-line max-len
            gTableData = conversion_data_layui_table(gHistDataObj, gSelectPageIndex * OnePageDataCount + 1, gAlarmConfigObj); // 将数据转换为能被显示的格式
            gTableConfig.cols[0] = gTableCols; // 更新字段
            // alert(JSON.stringify(gTableCols, 4));        // 调试显示信息
            // alert(JSON.stringify(gDeviceInfoDataPage, 4));        // 调试显示信息

            // eslint-disable-next-line new-cap
            RecordScrollTop(); // 记录scrollTop位置，在表格重载之前调用（依赖全局gScrollTop）
            // 刷新当前页
            gTableConfig.data = gTableData;
            gTableConfig.cols[0] = gTableCols; // 更新字段
            gtableIns.reload(gTableConfig);

            layer.close(gLayerMsgIndex); // 关闭提示框
            // eslint-disable-next-line new-cap
            RestoreScrollTop(); // 还原scrollTop位置，在表格重载之后调用（依赖全局gScrollTop）
        } else {
            gSelectPageIndex = obj.curr - 1;
        }
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}

// eslint-disable-next-line max-len
// 初始化表格(只能调用一次，并且会在调用后延时一段时间才能初始化完成)DataTableObj:当前要显示的数据；allDataCount：总数据条数；OnePageCount：一页显示的数据条数；ThisPageIndex：当前页索引，从0开始
// eslint-disable-next-line require-jsdoc
function data_table_init(DataTableObj) {
    layui.use('table', function() {
        const table1 = layui.table;
        // 第一个实例
        gTableConfig.data = DataTableObj;
        gtableIns = table1.render(gTableConfig);
    });
}

// 在要素字段总表中查找当前字段名
// eslint-disable-next-line require-jsdoc
function get_field_name(AllEssDataCache, field) {
    try {
        for (let i = 0; i < AllEssDataCache.length; i++) {
            if (AllEssDataCache[i].标识符ASCII码 == field) {
                return AllEssDataCache[i].编码要素 + '(' + AllEssDataCache[i].量和单位 + ')';
            }
        }
    } catch (e) {

    }
    return field;
}

// 将获取到的设备数据转换为能被layui table显示的数据 DeviceHistData:历史数据,StartRowNumber:当前显示的行号起始，从1开始；
// eslint-disable-next-line require-jsdoc
function conversion_data_layui_table(DeviceHistData, StartRowNumber, DeviceAlarmConfig) {
    const DeviceTableData = JSON.parse('[]'); // 清空数据，创建一个对象数组
    gFieldList = [];
    let cnt = 0;
    let fileName = ''; // 字段名称
    let DataObj;
    // 表头
    gTableCols = [{
        field: 'ID',
        title: '序号',
        width: 60,
        fixed: 'left',
        align: 'center',
    }, {
        field: 'TT',
        title: '采集时间',
        width: 150,
        align: 'center',
    }];

    try {
        if (DeviceHistData == null || DeviceHistData.length == 0) { // 没有数据
            // 清除超限索引数组
            gOverTdsIndexes = [];

            return DeviceTableData;
        }
        // 有数据
        for (const p in DeviceHistData[0]) { // 遍历 json对象的每个 key/value对,p 为 key
            if (p != 'ST' && p != 'TT' && p != 'UT' && p != null) {
                gFieldList[cnt] = p; // 记录字段
                fileName = get_field_name(gAllEssDataCache, p); // 获取字段名称
                const obj = {
                    field: p,
                    title: fileName,
                    width: ((fileName.length - 1) * 12 + 30),
                    align: 'center',
                };
                gTableCols[2 + cnt] = obj;

                cnt++;
            }
        }

        // 在最后面添加上传时间
        gTableCols[2 + cnt] = {
            field: 'UT',
            title: '上传时间',
            width: 150,
            align: 'center',
        };
        // 初始化超限总数组
        gOverTdsIndexes = [];
        for (let i = 0; i < DeviceHistData.length; i++) {
            // 初始化每一行的超限索引
            const goverTdsIndexArray = [];

            const obj = {}; // 定义对象
            // 给对象添加属性
            obj.ID = (StartRowNumber + i) + ''; // 行号，加上起始行号

            DataObj = DeviceHistData[i];

            if (DataObj == null) { // 没有找到，有数据
                obj.STATUS = '无数据'; // 状态
            } else {
                // 循环显示普通要素数据
                for (let j = 0; j < gFieldList.length; j++) {
                    const essTitle = gFieldList[j];
                    if (DataObj[essTitle] < -30) { // 无效值
                        obj[essTitle] = '';
                    } else {
                        obj[essTitle] = DataObj[essTitle];
                    }

                    // 如果设置了报警值，设置对应数据的颜色和数据
                    // eslint-disable-next-line max-len
                    if (DeviceAlarmConfig != null && DeviceAlarmConfig[essTitle] != undefined && DeviceAlarmConfig[essTitle].ALARM != undefined && DeviceAlarmConfig[essTitle].ALARM == 1) {
                        const alarmConfigEss = DeviceAlarmConfig[essTitle];
                        // 设置了上限，判断是否超标
                        if (alarmConfigEss.AH != 0 && obj[essTitle] > alarmConfigEss.AH) {
                            goverTdsIndexArray.push(j + 2);
                        } else if (alarmConfigEss.AL != 0 && obj[essTitle] < alarmConfigEss.AL) {
                            goverTdsIndexArray.push(j + 2);
                        }
                    }
                }
                obj.TT = DataObj.TT;
                obj.UT = DataObj.UT;
            }
            // 保存每一行的超限索引到总数组
            gOverTdsIndexes.push(goverTdsIndexArray);

            DeviceTableData[i] = obj; // 添加对象到数组
        }
    } catch (e) {
        layer.alert('处理数据发生了错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }

    return DeviceTableData;
}

// 记录scrollTop位置，在表格重载之前调用（依赖全局gScrollTop）
// eslint-disable-next-line require-jsdoc
function RecordScrollTop() {
    try {
        gScrollTop.dev_obj = document.getElementById('table_and_page_div_id'); // table的父div
        if (gScrollTop.dev_obj != null) {
            gScrollTop.layuitable = gScrollTop.dev_obj.getElementsByClassName('layui-table-main');
        }
        if (gScrollTop.layuitable != null && gScrollTop.layuitable.length > 0) {
            // eslint-disable-next-line max-len
            gScrollTop.scrollTop = gScrollTop.layuitable[0].scrollTop; // layuitable获取到的是 class=layui-table-main的集合
        }
    } catch (e) {
        gScrollTop.scrollTop = 0;
        console.log(e.message);
    }
}

// 还原scrollTop位置，在表格重载之后调用（依赖全局gScrollTop）
// eslint-disable-next-line require-jsdoc
function RestoreScrollTop() {
    try {
        // 还原scroll位置
        if (gScrollTop.layuitable != null && gScrollTop.layuitable.length > 0) {
            gScrollTop.layuitable[0].scrollTop = gScrollTop.scrollTop;
        }
    } catch (e) {
        // console.log(e.message);
    }
}

// 选择事件
// eslint-disable-next-line require-jsdoc
function SelectionEvent(data_name, text) {
    loadingmessage1('加载数据中...'); // 弹出提示框

    laydateInit(); // 初始化时间控件
    gThisST = data_name; // 当前设备ST
    let str = text;
    str = str.substring(11, str.length); // 截取后面的名称
    gThisNAME = str; // 当前设备NAME
    // 延时先等等加载中...显示出来后再加载数据
    setTimeout(
        function() {
            selectAndGetDeviceHistData(gThisST, gThisNAME, gStartTime, gEndTime); // 获取并显示当前选择的设备的数据
            // alert(JSON.stringify(obj), 4);
            close_message(); // 关闭提示框
        }, 100);
}

// 点击查询数据
// eslint-disable-next-line require-jsdoc
function query_data_onclick() {
    try {
        loadingmessage1('加载数据中...'); // 弹出提示框
        getTimeFrame(); // 更新时间范围
        // 延时先等等加载中...显示出来后再加载数据
        setTimeout(
            function() {
                selectAndGetDeviceHistData(gThisST, gThisNAME, gStartTime, gEndTime); // 获取并显示当前选择的设备的数据
                // alert(JSON.stringify(obj), 4);
                close_message(); // 关闭提示框
            }, 100);
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}

// 快捷选择-查询历史数据
layui.use('form', function() {
    const form = layui.form;
    // 各种基于事件的操作，下面会有进一步介绍
    form.on('select(select_filter)', function(data) {
        // alert(data.value + '天'); // 得到被选中的值
        try {
            if (data.value <= 0 || data.value > 60) return; // 时间
            const EndDate = new Date(); // 获取当前系统时间
            const StartDate = new Date(); // 获取当前系统时间
            StartDate.setDate(StartDate.getDate() - data.value); // 获取n天前时间

            // eslint-disable-next-line max-len
            gStartTime = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate() + ' ' + StartDate.getHours() + ':' + StartDate.getMinutes() + ':' + StartDate.getSeconds();
            // eslint-disable-next-line max-len
            gEndTime = EndDate.getFullYear() + '-' + (EndDate.getMonth() + 1) + '-' + EndDate.getDate() + ' ' + EndDate.getHours() + ':' + EndDate.getMinutes() + ':' + EndDate.getSeconds();
            // alert(gStartTime + ' ' + gEndTime);


            loadingmessage1('加载数据中...'); // 弹出提示框
            // 延时先等等加载中...显示出来后再加载数据
            setTimeout(
                function() {
                    // eslint-disable-next-line max-len
                    selectAndGetDeviceHistData(gThisST, gThisNAME, gStartTime, gEndTime); // 获取并显示当前选择的设备的数据
                    // alert(JSON.stringify(obj), 4);
                    close_message(); // 关闭提示框
                }, 100);
        } catch (e) {
            layer.alert('错误：' + e.message, {
                icon: 5,
                scrollbar: false,
            }); // 5：失败；6：成功
        }
    });
});

// 初始化要素数据
// eslint-disable-next-line require-jsdoc
function allDeviceEssInit() {
    let obj = null;
    try {
        // eslint-disable-next-line new-cap
        obj = parent.Read_AllEssDataCache(); // 读取父页面缓存的数据
    } catch (e) {

    }
    if (obj == null || obj.length == 0) { // 缓存无效才从服务器获取
        // alert("ajax获取要素表");
        // eslint-disable-next-line new-cap
        obj = parent.GetAllEssData(); // 获取所有要素数据
        // eslint-disable-next-line new-cap
        parent.Write_AllEssDataCache(obj); // 写入缓存到父页面
    }

    return obj;
}

// 获取当前设备的历史数据数量（历史）
// ST:设备编号；StartTime：开始时间，YYYY-MM-DD hh:mm:ss格式；EndTime：结束时间，YYYY-MM-DD hh:mm:ss格式；isASC：是否为顺序查询；
// eslint-disable-next-line require-jsdoc
function ajax_sync_get_hist_data_count(ST, StartTime, EndTime, isASC) {
    let cnt = 0;

    // alert('请求历史数据信息');
    try {
        // 请求服务器
        const jsonData = {
            GetFun: 'GetIntegerHistDataInfo',
            ST: ST,
            StartTime: StartTime, // YYYY-MM-DD hh:mm:ss格式
            EndTime: EndTime, // YYYY-MM-DD hh:mm:ss格式
            isASC: isASC,
        };
        $.ajax({
            url: '/Home/Index',
            type: 'POST',
            dataType: 'json',
            async: false, // 同步执行
            data: jsonData,
        })
            .done(function(response) {
                if (response.rel == 1) { // 获取成功
                    if (response.obj == null) { // 没有数据
                    } else {
                        cnt = JSON.parse(response.obj); // 转换为对象
                    }
                } else if (response.rel == -1) { // 需要登录
                    layer.alert(response.msg, {
                        icon: 5,
                        scrollbar: false,
                    }); // 5：失败；6：成功
                    // eslint-disable-next-line new-cap
                    parent.JumpLogon();
                } else {
                    layer.alert(response.msg, {
                        icon: 5,
                        scrollbar: false,
                    }); // 5：失败；6：成功
                }
            })
            .fail(function() {
                layer.alert('通信错误，请求数据失败！', {
                    icon: 5,
                    scrollbar: false,
                }); // 5：失败；6：成功
            });
    } catch (e) {
        layer.alert('发生了错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }


    return cnt;
}

// 获取当前设备的历史数据（历史）
// ST:设备编号；StartTime：开始时间，YYYY-MM-DD hh:mm:ss格式；EndTime：结束时间，YYYY-MM-DD hh:mm:ss格式；isASC：是否为顺序查询；
// eslint-disable-next-line require-jsdoc
function ajax_sync_get_hist_data(ST, StartTime, EndTime, isASC, StartIndex, ReadCnt) {
    let obj = [];

    // alert('请求历史数据信息');
    try {
        // 请求服务器
        const jsonData = {
            GetFun: 'GetIntegerHistData',
            ST: ST,
            StartTime: StartTime, // YYYY-MM-DD hh:mm:ss格式
            EndTime: EndTime, // YYYY-MM-DD hh:mm:ss格式
            isASC: isASC,
            StartIndex: StartIndex,
            ReadCnt: ReadCnt,
        };
        // alert('ST_List:'+ST_List);         // 调试显示信息

        $.ajax({
            url: '/Home/Index',
            type: 'POST',
            dataType: 'json',
            async: false, // 同步执行
            data: jsonData,
        })
            .done(function(response) {
                if (response.rel == 1) { // 获取成功
                    if (response.obj == null) { // 没有数据

                    } else {
                        obj = JSON.parse(response.obj); // 转换为对象
                    }
                } else if (response.rel == -1) { // 需要登录
                    layer.alert(response.msg, {
                        icon: 5,
                        scrollbar: false,
                    }); // 5：失败；6：成功
                    // eslint-disable-next-line new-cap
                    parent.JumpLogon();
                } else {
                    layer.alert(response.msg, {
                        icon: 5,
                        scrollbar: false,
                    }); // 5：失败；6：成功
                }
            })
            .fail(function() {
                layer.alert('通信错误，请求数据失败！', {
                    icon: 5,
                    scrollbar: false,
                }); // 5：失败；6：成功
            });
    } catch (e) {
        layer.alert('发生了错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
    return obj;
}

// 导出当前页数据
// eslint-disable-next-line require-jsdoc
function down_this_page_onclick() {
    try {
        if (gTableData == null || gTableData.length == 0) {
            layer.msg('错误：没有数据需要导出，请先查询数据！', {
                icon: 5,
                scrollbar: false,
            });
            return;
        }

        const sheetFilter = [];
        const sheetHeader = [];
        const option = {};
        // 准备字段与字段别名
        for (let i = 0; i < gTableCols.length; i++) {
            sheetFilter[i] = gTableCols[i].field;
            sheetHeader[i] = gTableCols[i].title;
        }
        // https:// www.cnblogs.com/kin-jie/p/6180707.html
        option.fileName = gThisNAME + '(' + gThisST + ')' + '历史数据导出';
        option.datas = [{
            sheetData: gTableData,
            sheetName: 'sheet',
            sheetFilter: sheetFilter, // ['two', 'one'],
            sheetHeader: sheetHeader, // ['第一列', '第二列']
        }];
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}

// 导出所有页数据
// eslint-disable-next-line require-jsdoc
function down_all_page_onclick() {
    try {
        if (gTableData == null || gTableData.length == 0) {
            layer.msg('错误：没有数据需要导出，请先查询数据！', {
                icon: 5,
                scrollbar: false,
            });
            return;
        }

        loadingmessage1('加载数据中...'); // 弹出提示框
        // 延时先等等加载中...显示出来后再加载数据
        setTimeout(
            function() {
                // eslint-disable-next-line new-cap
                const AllData = DownAllData(); // 下载数据
                if (AllData == null || AllData.length == null) {
                    close_message(); // 关闭提示框
                    layer.msg('错误：没有数据需要导出，请先查询数据！', {
                        icon: 5,
                        scrollbar: false,
                    });
                    return;
                }
                const sheetFilter = [];
                const sheetHeader = [];
                const option = {};
                // 准备字段与字段别名
                for (let i = 1; i < gTableCols.length; i++) {
                    sheetFilter[i - 1] = gTableCols[i].field;
                    sheetHeader[i - 1] = gTableCols[i].title;
                }

                // https:// www.cnblogs.com/kin-jie/p/6180707.html
                option.fileName = gThisNAME + '(' + gThisST + ')' + '历史数据导出';
                option.datas = [{
                    sheetData: AllData,
                    sheetName: 'sheet',
                    sheetFilter: sheetFilter, // ['two', 'one'],
                    sheetHeader: sheetHeader, // ['第一列', '第二列']
                }];
                close_message(); // 关闭提示框
                const toExcel = new ExportJsonExcel(option);
                toExcel.saveExcel();
            }, 100);
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}

// 下载所有数据，用于本地数据导出，需要一个进度条
// eslint-disable-next-line require-jsdoc
function DownAllData() {
    const AllData_Obj = [];
    const page_count = Math.ceil(gDataAllCnt / 500); // 向上取整-获取页数

    try {
        for (let i = 0; i < page_count; i++) {
            const DataObj = ajax_sync_get_hist_data(gThisST, gStartTime, gEndTime, false, i * 500, 500);
            if (DataObj == null || DataObj.length == 0) {
                layer.alert('错误：获取数据失败，提前结束了数据下载！', {
                    icon: 5,
                    scrollbar: false,
                }); // 5：失败；6：成功
                break;
            } else {
                for (let j = 0; j < DataObj.length; j++) {
                    AllData_Obj[i * 500 + j] = DataObj[j];
                }
            }
        }
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }

    return AllData_Obj;
}
