
var g_AllEssDataCache = null;                       //所有要素数据缓存
var g_AllDeviceList = null;                         //所有设备列表基本数据
var g_AllGroupList = null;                          //所有的分组列表
var g_RealDataObj = null;                           //实时数据
var g_ListData;                                     //能被list显示的数据
var g_ThisDevice = {
    ST: null,                                       //当前设备编号
    NAME: null,                                     //当前设备名称
};
var g_DataStartTime;                                //当前搜索框历史数据开始时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_DataEndTime;                                  //当前搜索框历史数据结束时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_PicStartTime;                                 //当前搜索框图片数据开始时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_PicEndTime;                                   //当前搜索框图片数据结束时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_CharsList = [];                               //chars实例列表

var g_FieldList = [];                               //字段英文列表
var g_FieldNameList = [];                           //字段中文列表
var g_FieldUintList = [];                           //字段单位
var g_FieldDataArr = null;                          //要素数据
var g_TT = [];                                      //观测时间-横轴
var g_LastSelectST = null;                          //上次显示的ST，查看是否切换，如果切换了才清除历史数据与图片
var g_HistPicDataObj = [];                          //当前历史图片数据
var g_ThisShowCount = 0;                            //当前已经显示的图片数量
var g_AlarmConfigObj = null;                            //当前设备的报警配置数据



//初始化加载执行
window.onload = function () {   //要执行的js代码段  
    try {
                
        //延时0.5秒初始化
        setTimeout('CacheInit()', 500);

                

        //初始化事件监听
        var obj = document.getElementById('tool_bar_id');       //获取工具栏整个对象
        var tab_item = obj.querySelectorAll('.tab-item');       //选取含tab-item样式的对象集合
        var TabArray = Array.prototype.slice.call(tab_item,0);  //获取tab标签集合

        TabArray.forEach(function (e1) {                        //遍历
            //console.log(e1.className);
            e1.onclick = function(event)                        //为当前对象添加点击事件-为工具栏图标添加点击事件
            {
                var obj = document.getElementById('tool_bar_id'); //首先获取工具栏整个对象
                var tab_item = obj.querySelectorAll('.tab-item');   //选取含tab-item样式的对象
                var tabs_obj = document.getElementById('tab_content_id'); //获取tab页面content对象
                var tab_content = tabs_obj.querySelectorAll('.tab'); //选取含tab样式的对象集合
                for (var i = 0; i < tab_item.length; i++)           //循环处理所有按钮与content（按钮与content要一一对应）
                {
                    if (event.currentTarget.id == tab_item[i].id)       //找到了当前选择的按钮id，则激活按钮与对应的content
                    {
                        tab_content[i].classList.add('active'); //激活content
                        tab_item[i].classList.add('active');    //激活按钮
                    }
                    else
                    {
                        tab_content[i].classList.remove('active');//移除激活状态
                        tab_item[i].classList.remove('active');//移除激活状态
                    }
                }
            }
        });

                
        //时间初始化
        time_init();                                 //初始化时间控件

    } catch (e) {
        //layer.msg("处理数据发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
        window.location.href = "Mobile_Index"; //跳转到主页
    }
}


//浏览器窗口大小变化事件
$(window).resize(function () {          //当浏览器大小变化时
    //echar宽度自适应
    if (g_CharsList != null && g_CharsList.length > 0) {
        for (var i = 0; i < g_CharsList.length; i++) {
            g_CharsList[i].resize();
        }
    }
});


//初始化
function CacheInit()
{
    try {
        //获取缓存的要素数据信息
        g_AllEssDataCache = parent.Read_AllEssDataCache();
        if (g_AllEssDataCache == null) {
            g_AllEssDataCache = parent.GetAllEssData();
            parent.Write_AllEssDataCache(g_AllEssDataCache);//写入到父缓存
        }
        //获取缓存的要素数据信息
        g_AllDeviceList = parent.Read_AllDeviceListCache();
        if (g_AllDeviceList == null) {
            g_AllDeviceList = parent.ajax_sync_get_device_list();
            parent.Write_AllDeviceListCache(g_AllDeviceList);//写入到父缓存
        }
        //获取缓存的要素数据信息
        g_AllGroupList = parent.Read_AllGroupListCache();
        if (g_AllGroupList == null) {
            g_AllGroupList = parent.ajax_sync_get_all_group_list();
            parent.Write_AllGroupListCache(g_AllGroupList);//写入到父缓存
        }
    } catch (e) {
        layer.msg("处理数据发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
        window.location.href = "Mobile_Index"; //跳转到主页
    }
}

//刷新实时数据
function RefreshRealData()
{
    try {
        g_ThisDevice = parent.Read_ThisDevice(); //获取当前选中的设备信息
        if (g_LastSelectST != g_ThisDevice.ST)  //如果ST发生了切换，清除历史数据
        {
            clear_echart();
            clear_pic();
        }
        g_LastSelectST = g_ThisDevice.ST;       //记录上一次的ST
        //刷新实时数据
        SelectAndGetDeviceRealData(g_ThisDevice.ST, g_ThisDevice.NAME);
        layer.msg("刷新成功", { icon: 6, scrollbar: false, time: 500 }); //5：失败；6：成功
    } catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

       

//返回
function back_onclick()
{
    try {
        parent.iframe_show_main_list(); //显示主设备列表
    } catch (e) {
        layer.msg("处理数据发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}


//将获取到的设备数据转换为能被list显示的数据 DeviceRealData:需要显示的详细设备信息
function conversion_data_list(DeviceRealData, DeviceAlarmConfig) {
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
            //强制第1个为名称
            var obj = new Object();
            obj.ID = (cnt + 1) + '';
            obj.ESS = '名称';                                        //获取要素名称
            obj.DATA = g_ThisDevice.NAME;
            // obj.UINT = get_field_uint(g_AllEssDataCache, 'TT');       //获取要素单位
            DeviceTableData[cnt] = obj;
            cnt++;

            //强制第2个编号
            var obj = new Object();
            obj.ID = (cnt + 1) + '';
            obj.ESS = '编号';                                        //获取要素名称
            obj.DATA = g_ThisDevice.ST;
            // obj.UINT = get_field_uint(g_AllEssDataCache, 'TT');       //获取要素单位
            DeviceTableData[cnt] = obj;
            cnt++;

            return DeviceTableData;
        }
        else {

            //强制第1个为名称
            var obj = new Object();
            obj.ID = (cnt + 1) + '';
            obj.ESS = '名称';                                        //获取要素名称
            obj.DATA = g_ThisDevice.NAME;                        
            // obj.UINT = get_field_uint(g_AllEssDataCache, 'TT');       //获取要素单位
            DeviceTableData[cnt] = obj;
            cnt++;

            //强制第2个编号
            var obj = new Object();
            obj.ID = (cnt + 1) + '';
            obj.ESS = '编号';                                        //获取要素名称
            obj.DATA = g_ThisDevice.ST;
            // obj.UINT = get_field_uint(g_AllEssDataCache, 'TT');       //获取要素单位
            DeviceTableData[cnt] = obj;
            cnt++;

            //强制第3个为采集时间
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
                if (p != 'ST' && p != 'TT' && p != 'UT' && p != null) {
                    EssList[cnt] = p; //记录字段

                    var obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = get_field_name(g_AllEssDataCache, p);    //获取要素名称
                    obj.DATA = DeviceRealData[0][p];                    //获取字段年对于的值
                    obj.UINT = get_field_uint(g_AllEssDataCache, p);    //获取要素单位
                    DeviceTableData[cnt] = obj;

                    cnt++;
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

        if (DeviceAlarmConfig != null) {
            //水位1-总开关
            if (DeviceAlarmConfig.Z != undefined && DeviceAlarmConfig.Z.ALARM != undefined && DeviceAlarmConfig.Z.ALARM == 1) {
                //显示水位1-低报警预置
                if (DeviceAlarmConfig.Z != undefined && DeviceAlarmConfig.Z.AL != undefined && DeviceAlarmConfig.Z.AL > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '水位1下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Z.AL + ' 米';    //获取要素单位
                    obj.color = '#947a17'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

                //显示水位1-高报警预置
                if (DeviceAlarmConfig.Z != undefined && DeviceAlarmConfig.Z.AH != undefined && DeviceAlarmConfig.Z.AH > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '水位1上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Z.AH + ' 米';    //获取要素单位
                    obj.color = '#ff7a00'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

            }

            //水位2-总开关
            if (DeviceAlarmConfig.ZB != undefined && DeviceAlarmConfig.ZB.ALARM != undefined && DeviceAlarmConfig.ZB.ALARM == 1) {

                //显示水位2-低报警预置
                if (DeviceAlarmConfig.ZB != undefined && DeviceAlarmConfig.ZB.AL != undefined && DeviceAlarmConfig.ZB.AL > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '水位2下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.ZB.AL + ' 米';    //获取要素单位
                    obj.color = '#947a17'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

                //显示水位2-高报警预置
                if (DeviceAlarmConfig.ZB != undefined && DeviceAlarmConfig.ZB.AH != undefined && DeviceAlarmConfig.ZB.AH > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '水位2上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.ZB.AH + ' 米';    //获取要素单位
                    obj.color = '#ff7a00'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

            }

            //瞬时流量1-总开关
            if (DeviceAlarmConfig.Q1 != undefined && DeviceAlarmConfig.Q1.ALARM != undefined && DeviceAlarmConfig.Q1.ALARM == 1) {
                //显示瞬时流量1-低报警预置
                if (DeviceAlarmConfig.Q1 != undefined && DeviceAlarmConfig.Q1.AL != undefined && DeviceAlarmConfig.Q1.AL > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '流量1下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Q1.AL + ' 立方米/秒';    //获取要素单位
                    obj.color = '#947a17'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

                //显示瞬时流量1-高报警预置
                if (DeviceAlarmConfig.Q1 != undefined && DeviceAlarmConfig.Q1.AH != undefined && DeviceAlarmConfig.Q1.AH > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '流量1上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Q1.AH + ' 立方米/秒';    //获取要素单位
                    obj.color = '#ff7a00'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

            }


            //瞬时流量2-总开关
            if (DeviceAlarmConfig.Q2 != undefined && DeviceAlarmConfig.Q2.ALARM != undefined && DeviceAlarmConfig.Q2.ALARM == 1) {
                //显示瞬时流量2-低报警预置
                if (DeviceAlarmConfig.Q2 != undefined && DeviceAlarmConfig.Q2.AL != undefined && DeviceAlarmConfig.Q2.AL > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '流量2下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Q2.AL + ' 立方米/秒';    //获取要素单位
                    obj.color = '#947a17'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

                //显示瞬时流量2-高报警预置
                if (DeviceAlarmConfig.Q2 != undefined && DeviceAlarmConfig.Q2.AH != undefined && DeviceAlarmConfig.Q2.AH > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '流量2上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Q2.AH + ' 立方米/秒';    //获取要素单位
                    obj.color = '#ff7a00'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

            }


            //小时水量1-总开关
            if (DeviceAlarmConfig.SBL1 != undefined && DeviceAlarmConfig.SBL1.ALARM != undefined && DeviceAlarmConfig.SBL1.ALARM == 1) {
                //显示小时水量1-低报警预置
                if (DeviceAlarmConfig.SBL1 != undefined && DeviceAlarmConfig.SBL1.AL != undefined && DeviceAlarmConfig.SBL1.AL > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '水量1下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.SBL1.AL + ' 立方米/小时';    //获取要素单位
                    obj.color = '#947a17'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

                //显示小时水量1-高报警预置
                if (DeviceAlarmConfig.SBL1 != undefined && DeviceAlarmConfig.SBL1.AH != undefined && DeviceAlarmConfig.SBL1.AH > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '水量1上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.SBL1.AH + ' 立方米/小时';    //获取要素单位
                    obj.color = '#ff7a00'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

            }


            //小时水量2-总开关
            if (DeviceAlarmConfig.SBL2 != undefined && DeviceAlarmConfig.SBL2.ALARM != undefined && DeviceAlarmConfig.SBL2.ALARM == 1) {
                //显示小时水量2-低报警预置
                if (DeviceAlarmConfig.SBL2 != undefined && DeviceAlarmConfig.SBL2.AL != undefined && DeviceAlarmConfig.SBL2.AL > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '水量2下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.SBL2.AL + ' 立方米/小时';    //获取要素单位
                    obj.color = '#947a17'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

                //显示小时水量2-高报警预置
                if (DeviceAlarmConfig.SBL2 != undefined && DeviceAlarmConfig.SBL2.AH != undefined && DeviceAlarmConfig.SBL2.AH > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '水量2上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.SBL2.AH + ' 立方米/小时';    //获取要素单位
                    obj.color = '#ff7a00'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

            }


            //电源电压预警-总开关
            if (DeviceAlarmConfig.VT != undefined && DeviceAlarmConfig.VT.ALARM != undefined && DeviceAlarmConfig.VT.ALARM == 1) {
                //显示电池电压-低报警预置
                if (DeviceAlarmConfig.VT != undefined && DeviceAlarmConfig.VT.AL != undefined && DeviceAlarmConfig.VT.AL > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '电压下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.VT.AL + ' 立方米/小时';    //获取要素单位
                    obj.color = '#947a17'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

                //显示电池电压-高报警预置
                if (DeviceAlarmConfig.VT != undefined && DeviceAlarmConfig.VT.AH != undefined && DeviceAlarmConfig.VT.AH > 0) {
                    obj = new Object();
                    obj.ID = (cnt + 1) + '';
                    obj.ESS = '电压上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.VT.AH + ' 立方米/小时';    //获取要素单位
                    obj.color = '#ff7a00'; //颜色
                    DeviceTableData[cnt] = obj;

                    cnt++;
                }

            }

        }

    }
    catch (e) {
        layer.msg("处理数据发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }

    //alert(JSON.stringify(DeviceTableData, 4));        //调试显示信息
    return DeviceTableData;
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

//显示list的一条数据,返回html字符串
function FormatOneList(title, text, color)
{
            
    try {
        var html;
        
            if(color == null)   //不设置颜色
            {
                html = '<li class="item-content">\
                <div class="item-inner">\
                    <div class="item-title">' + title + '</div>\
                    <div class="item-after"">' + text + '</div>\
                </div>\
                </li>';
            }
            else
            {
                html = '<li class="item-content">\
                <div class="item-inner">\
                    <div class="item-title" style="color:' + color + '">' + title + '</div>\
                    <div class="item-after" style="color:' + color + '">' + text + '</div>\
                </div>\
                </li>';
            }
            

        return html;
    } catch (e) {
        return null;
    }

}

//显示实时数据list
function ShowRealDataList(id, RealListData)
{ 
    var htmlString = [];

            
    try {
        htmlString.push('<ul>');
        if (RealListData == null || RealListData.length == 0) //无数据
        {

        }
        else
        {
            //循环添加li
            for (i = 0; i < RealListData.length; i++) {
                if (RealListData[i].DATA == -9999.999)
                {
                    htmlString.push(FormatOneList(RealListData[i].ESS, '数据无效'));
                }
                else if (RealListData[i].DATA == null)
                {
                    htmlString.push(FormatOneList(RealListData[i].ESS, '无数据'));
                }
                else
                {
                    htmlString.push(FormatOneList(RealListData[i].ESS, RealListData[i].DATA + ((RealListData[i].UINT == null) ? '' : (' ' + RealListData[i].UINT)), RealListData[i].color));
                }
                        
            }
        }
        htmlString.push('</ul>');
        var obj = document.getElementById(id);
        obj.innerHTML = htmlString.join("");
    } catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//刷新某个站点数据
function SelectAndGetDeviceRealData(ST, NAME) {
    try {
        //刷新站点编号与名称
        document.getElementById('title_st_id').innerHTML = ST;

        //下载当前设备的实时数据
        g_RealDataObj = ajax_sync_get_real_data(ST);
        //alert(JSON.stringify(g_RealDataObj), 4);
     
        g_AlarmConfigObj = ajax_sync_get_device_alarm_data(ST);//获取当前设备的报警配置
        g_ListData = conversion_data_list(g_RealDataObj, g_AlarmConfigObj);   //将获取到的实时数据转换为list能显示的数据
        ShowRealDataList('real_list_id', g_ListData);
               
    }
    catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}
      
//获取当前设备的实时数据
//获取指定设备的实时数据（ajax同步模式）DeviceListObj:设备基础信息列表；StartIndex：开始索引，0开始；Count：要读取的数量
//会将当前页要显示的设备ST与NAME写入到 g_ThisPageDeviceList
function ajax_sync_get_real_data(ST) {
    var obj = JSON.parse('[]');

    try {
        //请求服务器
        var jsonData = {
            GetFun: 'GetDeviceRealData',
            ST_List: ST,
        };
        //alert('ST_List:'+ST_List);         //调试显示信息

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
                    obj = JSON.parse(response.obj);  //转换为对象
                }
            }
            else if (response.rel == -1) //需要登录
            {
                layer.alert(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
                parent.JumpLogon();
            }
            else {

                layer.alert(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
            }
        })
        .fail(function () {
            layer.alert('通信错误，请求数据失败！', { icon: 5, scrollbar: false }); //5：失败；6：成功
        })
    }
    catch (e) {
        layer.alert("发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }


    return obj;
}

//快捷搜索
function quick_search_onclick()
{
    try {
        var buttons1 = [
            {
                text: '请选择查询时间段',
                label: true
            },
            {
                text: '最近1天',
                onClick: function () {
                    //$.toast("你选择了1天");
                    setTimeout('quick_search(1)', 300);//快捷搜索
                }
            },
            {
                text: '最近3天',
                onClick: function () {
                    // $.toast("你选择了3天");
                    setTimeout('quick_search(3)', 300);//快捷搜索
                }
            },
            {
                text: '最近5天',
                onClick: function () {
                    //$.toast("你选择了5天");
                    setTimeout('quick_search(5)', 300);//快捷搜索
                }
            },
            {
                text: '最近7天',
                onClick: function () {
                    //$.toast("你选择了7天");
                    setTimeout('quick_search(7)', 300);//快捷搜索
                }
            },
            {
                text: '最近15天',
                onClick: function () {
                    //$.toast("你选择了15天");
                    setTimeout('quick_search(15)', 300);//快捷搜索
                }
            },
            {
                text: '最近30天',
                onClick: function () {
                    //$.toast("你选择了30天");
                    setTimeout('quick_search(30)', 300);//快捷搜索
                }
            },
        ];
        var buttons2 = [
            {
                text: '取消',
                bg: 'danger'
            }
        ];
        var groups = [buttons1, buttons2];
        $.actions(groups);
    } catch (e) {
        $.toast("错误：" + e.message); //提示
    }
}

//快捷搜索
function quick_search(day)
{
    try {

        //快速查询处理
        if (day == 0) return;   //取消了选择

        if (day <= 0 || day > 60) return; //时间
        var EndDate = new Date();    //获取当前系统时间
        var StartDate = new Date();    //获取当前系统时间
        StartDate.setDate(StartDate.getDate() - day); //获取n天前时间

        g_DataStartTime = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate() + ' ' + StartDate.getHours() + ':' + StartDate.getMinutes() + ':' + StartDate.getSeconds();
        g_DataEndTime = EndDate.getFullYear() + '-' + (EndDate.getMonth() + 1) + '-' + EndDate.getDate() + ' ' + EndDate.getHours() + ':' + EndDate.getMinutes() + ':' + EndDate.getSeconds();
        console.log('快捷搜索时间：' + g_DataStartTime + ' ' + g_DataEndTime);


        $.alert();
        $.showPreloader();  //显示加载中
        SelectAndGetDeviceHistData(g_ThisDevice.ST, g_DataStartTime, g_DataEndTime);
                
    } catch (e) {
        $.toast("错误："+e.message); //提示
    }
    $.hidePreloader();  //加载结束
}

//搜索数据
function search_onclick()
{
    try {

        $.alert();
        $.showPreloader();  //显示加载中
        SelectAndGetDeviceHistData(g_ThisDevice.ST, g_DataStartTime, g_DataEndTime);
                
    } catch (e) {
        $.toast("错误："+e.message); //提示
    }
    $.hidePreloader();  //加载结束
}

//时间初始化
function time_init() {
    try {
        //初始化时间
        var myDate = new Date();    //获取当前系统时间
        var LastDate = new Date();    //获取当前系统时间
        LastDate.setDate(LastDate.getDate() - 1); //获取2天前时间

        var TempStartTime = {
            year: LastDate.getFullYear(), month: (LastDate.getMonth() + 1), date: LastDate.getDate(), hours: 0, minutes: 0, seconds: 0
        };
        var TempEndTime = {
            year: myDate.getFullYear(), month: (myDate.getMonth() + 1), date: myDate.getDate(), hours: 0, minutes: 0, seconds: 0
        };
      
        //开始时间
        var value1 = [LastDate.getFullYear() + '-'+ (LastDate.getMonth() + 1) + '-'+ LastDate.getDate()];
        //结束时间
        var value2 = [myDate.getFullYear() + '-'+(myDate.getMonth() + 1) + '-'+myDate.getDate()];

        //初始化开始时间
        g_DataStartTime = value1[0] + ' 00:00:00';
        //初始化结束时间
        g_DataEndTime = value2[0] + ' 23:59:59';

        //初始化图片开始时间
        g_PicStartTime = value1[0] + ' 00:00:00';
        //初始化图片结束时间
        g_PicEndTime = value2[0] + ' 23:59:59';
        $("#start_time_id").calendar({
            value: value1,
            onChange: (function (p, values, displayValues) { //时间选择
                // $.alert(values[0]);
                g_DataStartTime = displayValues[0] + ' 00:00:00';  //开始时间
            }),

        });
        $("#end_time_id").calendar({
            value: value2,
            onChange: (function (p, values, displayValues) { //时间选择
                g_DataEndTime = displayValues[0] + ' 23:59:59';  //结束时间
            }),
        });

        $("#start_time_id").val(value1); //显示初值
        $("#end_time_id").val(value2); //显示初值

        //图片时间初始化
        $("#pic_start_time_id").calendar({
            value: value1,
            onChange: (function (p, values, displayValues) { //时间选择
                // $.alert(values[0]);
                g_PicStartTime = displayValues[0] + ' 00:00:00';  //开始时间
            }),

        });
        $("#pic_end_time_id").calendar({
            value: value2,
            onChange: (function (p, values, displayValues) { //时间选择
                g_PicEndTime = displayValues[0] + ' 23:59:59';  //结束时间
            }),
        });

        $("#pic_start_time_id").val(value1); //显示初值
        $("#pic_end_time_id").val(value2); //显示初值
                
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//获取当前设备的历史数据细信（历史）
//ST:设备编号；StartTime：开始时间，YYYY-MM-DD hh:mm:ss格式；EndTime：结束时间，YYYY-MM-DD hh:mm:ss格式；isASC：是否为顺序查询；
function ajax_sync_get_hist_data(ST, StartTime, EndTime, isASC, StartIndex, ReadCnt) {
    var obj = [];

    //alert('请求历史数据信息');
    try {
        //请求服务器
        var jsonData = {
            GetFun: 'GetHistData',
            ST: ST,
            StartTime: StartTime, //YYYY-MM-DD hh:mm:ss格式
            EndTime: EndTime, //YYYY-MM-DD hh:mm:ss格式
            isASC: isASC,
            StartIndex: StartIndex,
            ReadCnt: ReadCnt,
        };
        //alert('ST_List:'+ST_List);         //调试显示信息

        $.ajax({
            url: '/Home/Index',
            type: 'POST',
            dataType: 'json',
            async: false,                                       //同步执行
            data: jsonData,
        })
        .done(function (response) {
            if (response.rel == 1) { //获取成功
                //alert(JSON.stringify(response.obj, 4));         //调试显示信息
                if (response.obj == null)                       //没有数据
                {

                }
                else {
                    obj = JSON.parse(response.obj);  //转换为对象
                }
            }
            else if (response.rel == -1) //需要登录
            {
                layer.alert(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
                parent.JumpLogon();
            }
            else {

                layer.msg(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
            }
        })
        .fail(function () {
            layer.msg('通信错误，请求数据失败！', { icon: 5, scrollbar: false }); //5：失败；6：成功
        })
    }
    catch (e) {
        layer.msg("发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }


    return obj;
}


//清除历史数据，当切换了站点时清除
function clear_echart()
{
    try {
        //没有数据清除页面，并显示没有数据
        $('#smallbox').empty('');
        $('#echart_div_id').empty('');
        document.getElementById('no_data_info_id').style.display = "";//显示提示
    } catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//清除图片数据，当切换了站点时清除
function clear_pic() {
    try {
        //没有数据清除页面，并显示没有数据
        $('#pic_list_div_id').empty('');
        document.getElementById('no_pic_data_info_id').style.display = "";//显示提示
    } catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}


//刷新某个站点历史数据
function SelectAndGetDeviceHistData(ST, StartTime, EndTime) {
    try {
        g_CharsList = [];           //清除波形
        g_SelectPageIndex = 0;      //页索引为0
        //下载当前设备的历史数据
        g_HistDataObj = ajax_sync_get_hist_data(ST, StartTime, EndTime, true, 0, 86400);   //获取第一页数据
        if (g_HistDataObj != null && g_HistDataObj.length > 0) {
            document.getElementById('no_data_info_id').style.display = "none";//隐藏提示
            data_handle(g_HistDataObj);         //整理数据
            //alert(JSON.stringify(g_FieldDataArr[0], 4));         //调试显示信息
            //echart_button_init(g_FieldNameList);                //初始化显示顶部按钮
            echart_div_init(g_FieldNameList.length);            //初始化echar div 

            for (var i = 0; i < g_FieldNameList.length; i++)    //循环显示echar
            {
                $('#card_div_id_' + i).append(g_FieldNameList[i] + '(' + g_FieldUintList[i] + ')'); //显示名称
                g_CharsList[i] = ShowChars('echart_div_id_' + i, g_FieldNameList[i] + '(' + g_FieldUintList[i] + ')', g_TT, g_FieldDataArr[i]);
            }

        }
        else {
            clear_echart(); //清除数据
            setTimeout('delay_toast("错误：没有数据！")', 500);        //延时提示
        }

        //alert(JSON.stringify(g_table_cols, 4));        //调试显示信息
        //alert(JSON.stringify(g_DeviceInfoDataPage, 4));        //调试显示信息
    }
    catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//如果读取失败了，延时1秒弹出提示
function delay_toast(text)
{
    $.toast(text); //提示
}


//格式化一个卡片echart 所需的容器，返回字符串
function Format_Card_Echart(index)
{
    try {
        var html = '<div class="card">\
                <div class="card-header"   id=\"card_div_id_' + index + '\"></div>\
                <div class="card-content">\
                    <div class="card-content-inner"  id=\"echart_div_id_' + index + '\" style=\"width:100%;height:320px;margin-top:-40px;\"></div>\
                </div>\
                </div>';

        return html;
    } catch (e) {
    
    }

    return null;
}

//初始化echar div id
function echart_div_init(cnt) {
    try {
                

        $('#echart_div_id').empty('');

        if (cnt == 0) return;
        for (var i = 0; i < cnt; i++) {
            //$('#echart_div_id').append('<li><div class="item-content"><div class="item-inner" id=\"echart_div_id_' + i + '\" style=\"width:100%;height:500px;margin-top:50px;\"></div></div></li>');
            $('#echart_div_id').append(Format_Card_Echart(i));
        }
    } catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//处理下载的数据，获取要素名称信息，要素单位信息，时间列表，要素数据列表
function data_handle(all_data_obj) {
    var cnt;
    try {

        //先获取所有字段的字段名-不算时间与ST等
        cnt = 0;
        g_FieldList = [];
        g_FieldNameList = [];
        g_FieldUintList = [];
        g_FieldDataArr = null;                                //要素数据
        g_TT = [];                                          //观测时间-横轴
        if (all_data_obj == null || all_data_obj.length == 0) return;
        for (var p in all_data_obj[0]) {//遍历json对象的每个key/value对,p为key

            //alert(p + " " + DeviceHistData[0][p]);
            if (p != 'ST' && p != 'TT' && p != 'UT' && p != null) {
                g_FieldList[cnt] = p; //记录字段
                g_FieldNameList[cnt] = get_field_name(g_AllEssDataCache, p);    //获取字段名称
                g_FieldUintList[cnt] = get_field_uint(g_AllEssDataCache, p);    //获取字段单位
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
                // obj_arr[j][i] = all_data_obj[i][g_FieldList[j]];
                //  对异常的负数 数据处理
                if (all_data_obj[i][g_FieldList[j]] < -30) {
                    obj_arr[j][i] = '无效';
                } else {
                    obj_arr[j][i] = all_data_obj[i][g_FieldList[j]];
                }
            }
        }

        g_FieldDataArr = obj_arr;
    }
    catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//在要素字段总表中查找当前字段名-中文名称
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

// 基于准备好的dom，初始化echarts实例
function ShowChars(chartId, dataName, dataX, dataY) {
    if (dataY == undefined)
        return;

    if (dataY.length < 0)
        return;

    // 处理数据， 获取最大值和最小值
    var essData = publicSetEssData(dataY, 1.1);

    var myChart = null;
    // myChart = echarts.getInstanceByDom(document.getElementById(chartId));
    if (myChart == null) {
        myChart = echarts.init(document.getElementById(chartId));
    }

    //myChart.showLoading();//显示载入图标
    option = {
        grid: {
            bottom: 80,
            left: '15%',
            right: '5%',
        },
        tooltip: { 
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 40,
                end: 60
            },
            {
                type: 'inside',
                realtime: true,
                start: 0,
                end: 100
            }
        ],
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                axisLine: { onZero: false },
                data: dataX.map(function (str) {
                    return str.replace(' ', '\n')
                })
            }
        ],
        yAxis: [
            {
                //name: dataName,
                type: 'value',
                max: essData.maxData,
                min: essData.minData
            }
        ],
        series: [
            {
                name: dataName,
                type: 'line',
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
                lineStyle: {
                    normal: {
                        width: 0.1
                    }
                },
                data: dataY
            }

        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.clear();    //清除数据
    myChart.setOption(option);

    return myChart;
}



//格式化一个图片列表html字符串
function Format_Card_Pic(text1, text2, src) {
    try {
        var html = '<div class="card demo-card-header-pic">\
                    <div class="card-content">\
                        <div class="card-content-inner">\
                        <p class="color-gray">' + text1 + '</p>\
                        </div>\
                    </div>\
                    <div valign="bottom" class="card-header color-white no-border no-padding">\
                        <img class="card-cover"src=' + src + ' alt="">\
                    </div>\
                    <div class="card-content">\
                        <div class="card-content-inner">\
                        <p class="color-gray">' + text2 + '</p>\
                        </div>\
                    </div>\
                </div>';

        return html;
    } catch (e) {

    }
}


function layui_show_pic() {
    layui.use('flow', function () {
        var flow = layui.flow;

        flow.load({
            elem: '#pic_list_div_id' //流加载容器
          , scrollElem: '#pic_list_div_id' //滚动条所在元素，一般不用填，此处只是演示需要。
            , isAuto: true
          , done: function (page, next) { //执行下一页的回调
              var isNotEnd = true;          //标识是否没结束
              var index;
              if (g_ThisShowCount < g_HistPicDataObj.length) {
                  var lis = [];
                  for (var i = 0; i < 4; i++) {
                      index = (page - 1) * 4 + i; //索引
                      var obj = g_HistPicDataObj[index];
                      lis.push(Format_Card_Pic('时间：' + g_HistPicDataObj[index].TT, '序号：' + (g_ThisShowCount + 1), "/Home/GetImg?id=" + g_HistPicDataObj[index].ID));
                      g_ThisShowCount++;
                      if (g_ThisShowCount >= g_HistPicDataObj.length) { //结束了
                          isNotEnd = false;
                          break;
                      }
                  }
                  next(lis.join(''), isNotEnd);
              }
          }
        });

    });
}



//获取当前设备的历史图片数据细信（历史）
//ST:设备编号；StartTime：开始时间，YYYY-MM-DD hh:mm:ss格式；EndTime：结束时间，YYYY-MM-DD hh:mm:ss格式；
function ajax_sync_get_pic_data(ST, StartTime, EndTime) {
    var obj = [];

    //alert('请求历史数据信息');
    try {
        //请求服务器
        var jsonData = {
            GetFun: 'GetDeviceHistPicInfo',
            ST: ST,
            StartTime: StartTime,   //YYYY-MM-DD hh:mm:ss格式
            EndTime: EndTime,       //YYYY-MM-DD hh:mm:ss格式
        };
        //alert('ST_List:'+ST_List);         //调试显示信息

        $.ajax({
            url: '/Home/Index',
            type: 'POST',
            dataType: 'json',
            async: false,                                       //同步执行
            data: jsonData,
        })
        .done(function (response) {
            if (response.rel == 1) { //获取成功
                //alert(JSON.stringify(response.obj, 4));         //调试显示信息
                if (response.obj == null)                       //没有数据
                {

                }
                else {
                    obj = JSON.parse(response.obj);  //转换为对象
                }
            }
            else if (response.rel == -1) //需要登录
            {
                layer.alert(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
                parent.JumpLogon();
            }
            else {

                layer.alert(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
            }
        })
        .fail(function () {
            layer.alert('通信错误，请求数据失败！', { icon: 5, scrollbar: false }); //5：失败；6：成功
        })
    }
    catch (e) {
        layer.alert("发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }


    return obj;
}



//搜索图片数据
function pic_search_onclick() {
    try {

        $.alert();
        $.showPreloader();  //显示加载中
        SelectAndGetDevicePicData(g_ThisDevice.ST, g_PicStartTime, g_PicEndTime);

    } catch (e) {
        $.toast("错误：" + e.message); //提示
    }
    $.hidePreloader();  //加载结束
}


//刷新某个站点历史图片数据
function SelectAndGetDevicePicData(ST, StartTime, EndTime) {
    try {
        document.getElementById('pic_list_div_id').innerHTML = '';              //清除显示
        g_ThisShowCount = 0;                                                    //当前已经显示的图片数量
        //下载当前设备的历史数据
        g_HistPicDataObj = ajax_sync_get_pic_data(ST, StartTime, EndTime, true, 0, 500);   //获取第一页数据
        if (g_HistPicDataObj != null && g_HistPicDataObj.length > 0) {
            document.getElementById('no_pic_data_info_id').style.display = "none";//隐藏提示
            //开始显示图片数据
            layui_show_pic();
        }
        else {
            clear_pic(); //清除数据
            setTimeout('delay_toast("错误：没有数据！")', 500);        //延时提示
        }

        //alert(JSON.stringify(g_table_cols, 4));        //调试显示信息
        //alert(JSON.stringify(g_DeviceInfoDataPage, 4));        //调试显示信息
    }
    catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}


//快捷搜索
function pic_quick_search(day) {
    try {

        //快速查询处理
        if (day == 0) return;   //取消了选择

        if (day <= 0 || day > 60) return; //时间
        var EndDate = new Date();    //获取当前系统时间
        var StartDate = new Date();    //获取当前系统时间
        StartDate.setDate(StartDate.getDate() - day); //获取n天前时间

        g_PicStartTime = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate() + ' ' + StartDate.getHours() + ':' + StartDate.getMinutes() + ':' + StartDate.getSeconds();
        g_PicEndTime = EndDate.getFullYear() + '-' + (EndDate.getMonth() + 1) + '-' + EndDate.getDate() + ' ' + EndDate.getHours() + ':' + EndDate.getMinutes() + ':' + EndDate.getSeconds();
        console.log('快捷搜索时间：' + g_PicStartTime + ' ' + g_PicEndTime);


        $.alert();
        $.showPreloader();  //显示加载中
        SelectAndGetDevicePicData(g_ThisDevice.ST, g_PicStartTime, g_PicEndTime);

    } catch (e) {
        $.toast("错误：" + e.message); //提示
    }
    $.hidePreloader();  //加载结束
}


//快捷搜索
function pic_quick_search_onclick() {
    try {
        var buttons1 = [
            {
                text: '请选择查询时间段',
                label: true
            },
            {
                text: '最近1天',
                onClick: function () {
                    //$.toast("你选择了1天");
                    setTimeout('pic_quick_search(1)', 300);//快捷搜索
                }
            },
            {
                text: '最近3天',
                onClick: function () {
                    // $.toast("你选择了3天");
                    setTimeout('pic_quick_search(3)', 300);//快捷搜索
                }
            },
            {
                text: '最近5天',
                onClick: function () {
                    //$.toast("你选择了5天");
                    setTimeout('pic_quick_search(5)', 300);//快捷搜索
                }
            },
            {
                text: '最近7天',
                onClick: function () {
                    //$.toast("你选择了7天");
                    setTimeout('pic_quick_search(7)', 300);//快捷搜索
                }
            },
            {
                text: '最近15天',
                onClick: function () {
                    //$.toast("你选择了15天");
                    setTimeout('pic_quick_search(15)', 300);//快捷搜索
                }
            },
            {
                text: '最近30天',
                onClick: function () {
                    //$.toast("你选择了30天");
                    setTimeout('pic_quick_search(30)', 300);//快捷搜索
                }
            },
        ];
        var buttons2 = [
            {
                text: '取消',
                bg: 'danger'
            }
        ];
        var groups = [buttons1, buttons2];
        $.actions(groups);
    } catch (e) {
        $.toast("错误：" + e.message); //提示
    }
}

//</script>