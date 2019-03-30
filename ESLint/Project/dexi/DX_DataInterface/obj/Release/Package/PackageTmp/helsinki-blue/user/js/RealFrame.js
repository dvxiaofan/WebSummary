var g_RealDataObj = [];                                 //当前实时数据
var g_AllEssDataCache;                                  //所有要素数据列表-从父页面加载
var g_TableData = [];                                        //当前表格显示的数据

var g_ThisST;                                           //当前设备ST
var g_ThisName;                                         //当前设备Name
var g_tableIns = null;


var g_BlueRowIndexArray = null;                           //显示蓝色的行序号
var g_RedRowIndexArray = null;                            //显示红色的行序号


//table表格配置
var g_table_config = {
    elem: '#real_data_table_id'
    , data: null
    , limit: 100   //每页显示100条
    , text: { none: '暂无相关数据' }
  , page: false //开启分页
  , cols: [[ //表头
     { field: 'ESS', title: '要素', width: 100 }
    , { field: 'DATA', title: '值', width: 180 }
  ]]
    // , even: true //开启隔行背景
    , size: 'sm' //小尺寸的表格    
    , done: function (res, curr, count) { //刷新完成回调
        AutoTableHeight();
        SetRowsColor();                     //设置行颜色
    }


};

//设置行颜色
function SetRowsColor()
{
    try
    {
        //先获取当前table行集合
        var trs = Layui_GetDataTableRows('table_and_page_div_id');
        if (trs != null && trs.length > 0) {
            //设置蓝色
            if (g_BlueRowIndexArray != null && g_BlueRowIndexArray.length > 0) {
                for (var i = 0; i < g_BlueRowIndexArray.length; i++) //需要设置为蓝色的行序号
                {
                    if (g_BlueRowIndexArray[i] < (trs.length)) //没有超出范围
                    {
                        trs[g_BlueRowIndexArray[i]].style.color = "#2c08b1";
                    }

                }
            }
            //设置红色
            if (g_RedRowIndexArray != null && g_RedRowIndexArray.length > 0) {
                for (var i = 0; i < g_RedRowIndexArray.length; i++) //需要设置为红色的行序号
                {
                    if (g_RedRowIndexArray[i] < (trs.length)) //没有超出范围
                    {
                        trs[g_RedRowIndexArray[i]].style.color = "#ff7a00";
                    }

                }
            }
        }
    }
    catch(e)
    {

    }
    
    
}

function test() {
    alert('test');
}
//初始化加载执行
window.onload = function () {   //要执行的js代码段  
    //data_table_init(g_TableData);
}


//初始化表格(只能调用一次，并且会在调用后延时一段时间才能初始化完成)
function data_table_init(DataTableObj) {
    try {

        layui.use('table', function () {
            var table1 = layui.table;
            //第一个实例
            g_table_config.data = DataTableObj;
            g_tableIns = table1.render(g_table_config);
        });
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }

}

//将数据拷贝到能被table显示的对象中
function data_table_copy(obj_arr, DeviceAlarmConfig) {
    var newobj = [];
    var cnt = 0;
    for (cnt = 0; cnt < obj_arr.length; cnt++) {
        var obj = new Object();
        obj.ESS = obj_arr[cnt].ESS;
        obj.DATA = obj_arr[cnt].DATA;
        newobj[cnt] = obj;
    }

    g_BlueRowIndexArray = new Array();                           //显示蓝色的行序号
    g_RedRowIndexArray = new Array();                            //显示红色的行序号
    var bcnt = 0, rcnt = 0;
    //2018-12-07 增加预警上下限显示
    try
    {
        if (DeviceAlarmConfig != null) {
            //水位1-总开关
            if (DeviceAlarmConfig.Z != undefined && DeviceAlarmConfig.Z.ALARM != undefined && DeviceAlarmConfig.Z.ALARM == 1) {
                //显示水位1-低报警预置
                if (DeviceAlarmConfig.Z != undefined && DeviceAlarmConfig.Z.AL != undefined && DeviceAlarmConfig.Z.AL > 0) {
                    obj = new Object();
                    obj.ESS = '水位1下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Z.AL + ' 米';    //获取要素单位
                    newobj[cnt] = obj;
                    g_BlueRowIndexArray[bcnt++] = cnt;  //蓝色行号

                    cnt++;
                }

                //显示水位1-高报警预置
                if (DeviceAlarmConfig.Z != undefined && DeviceAlarmConfig.Z.AH != undefined && DeviceAlarmConfig.Z.AH > 0) {
                    obj = new Object();
                    obj.ESS = '水位1上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Z.AH + ' 米';    //获取要素单位
                    newobj[cnt] = obj;
                    g_RedRowIndexArray[rcnt++] = cnt;   //红色行号

                    cnt++;
                }

            }

            //水位2-总开关
            if (DeviceAlarmConfig.ZB != undefined && DeviceAlarmConfig.ZB.ALARM != undefined && DeviceAlarmConfig.ZB.ALARM == 1) {

                //显示水位2-低报警预置
                if (DeviceAlarmConfig.ZB != undefined && DeviceAlarmConfig.ZB.AL != undefined && DeviceAlarmConfig.ZB.AL > 0) {
                    obj = new Object();
                    obj.ESS = '水位2下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.ZB.AL + ' 米';    //获取要素单位
                    newobj[cnt] = obj;
                    g_BlueRowIndexArray[bcnt++] = cnt;  //蓝色行号

                    cnt++;
                }

                //显示水位2-高报警预置
                if (DeviceAlarmConfig.ZB != undefined && DeviceAlarmConfig.ZB.AH != undefined && DeviceAlarmConfig.ZB.AH > 0) {
                    obj = new Object();
                    obj.ESS = '水位2上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.ZB.AH + ' 米';    //获取要素单位
                    newobj[cnt] = obj;
                    g_RedRowIndexArray[rcnt++] = cnt;   //红色行号

                    cnt++;
                }

            }

            //瞬时流量1-总开关
            if (DeviceAlarmConfig.Q1 != undefined && DeviceAlarmConfig.Q1.ALARM != undefined && DeviceAlarmConfig.Q1.ALARM == 1) {
                //显示瞬时流量1-低报警预置
                if (DeviceAlarmConfig.Q1 != undefined && DeviceAlarmConfig.Q1.AL != undefined && DeviceAlarmConfig.Q1.AL > 0) {
                    obj = new Object();
                    obj.ESS = '流量1下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Q1.AL + ' 立方米/秒';    //获取要素单位
                    newobj[cnt] = obj;
                    g_BlueRowIndexArray[bcnt++] = cnt;  //蓝色行号

                    cnt++;
                }

                //显示瞬时流量1-高报警预置
                if (DeviceAlarmConfig.Q1 != undefined && DeviceAlarmConfig.Q1.AH != undefined && DeviceAlarmConfig.Q1.AH > 0) {
                    obj = new Object();
                    obj.ESS = '流量1上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Q1.AH + ' 立方米/秒';    //获取要素单位
                    newobj[cnt] = obj;
                    g_RedRowIndexArray[rcnt++] = cnt;   //红色行号

                    cnt++;
                }

            }


            //瞬时流量2-总开关
            if (DeviceAlarmConfig.Q2 != undefined && DeviceAlarmConfig.Q2.ALARM != undefined && DeviceAlarmConfig.Q2.ALARM == 1) {
                //显示瞬时流量2-低报警预置
                if (DeviceAlarmConfig.Q2 != undefined && DeviceAlarmConfig.Q2.AL != undefined && DeviceAlarmConfig.Q2.AL > 0) {
                    obj = new Object();
                    obj.ESS = '流量2下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Q2.AL + ' 立方米/秒';    //获取要素单位
                    newobj[cnt] = obj;
                    g_BlueRowIndexArray[bcnt++] = cnt;  //蓝色行号

                    cnt++;
                }

                //显示瞬时流量2-高报警预置
                if (DeviceAlarmConfig.Q2 != undefined && DeviceAlarmConfig.Q2.AH != undefined && DeviceAlarmConfig.Q2.AH > 0) {
                    obj = new Object();
                    obj.ESS = '流量2上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.Q2.AH + ' 立方米/秒';    //获取要素单位
                    newobj[cnt] = obj;
                    g_RedRowIndexArray[rcnt++] = cnt;   //红色行号

                    cnt++;
                }

            }


            //小时水量1-总开关
            if (DeviceAlarmConfig.SBL1 != undefined && DeviceAlarmConfig.SBL1.ALARM != undefined && DeviceAlarmConfig.SBL1.ALARM == 1) {
                //显示小时水量1-低报警预置
                if (DeviceAlarmConfig.SBL1 != undefined && DeviceAlarmConfig.SBL1.AL != undefined && DeviceAlarmConfig.SBL1.AL > 0) {
                    obj = new Object();
                    obj.ESS = '水量1下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.SBL1.AL + ' 立方米/小时';    //获取要素单位
                    newobj[cnt] = obj;
                    g_BlueRowIndexArray[bcnt++] = cnt;  //蓝色行号

                    cnt++;
                }

                //显示小时水量1-高报警预置
                if (DeviceAlarmConfig.SBL1 != undefined && DeviceAlarmConfig.SBL1.AH != undefined && DeviceAlarmConfig.SBL1.AH > 0) {
                    obj = new Object();
                    obj.ESS = '水量1上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.SBL1.AH + ' 立方米/小时';    //获取要素单位
                    newobj[cnt] = obj;
                    g_RedRowIndexArray[rcnt++] = cnt;   //红色行号

                    cnt++;
                }

            }


            //小时水量2-总开关
            if (DeviceAlarmConfig.SBL2 != undefined && DeviceAlarmConfig.SBL2.ALARM != undefined && DeviceAlarmConfig.SBL2.ALARM == 1) {
                //显示小时水量2-低报警预置
                if (DeviceAlarmConfig.SBL2 != undefined && DeviceAlarmConfig.SBL2.AL != undefined && DeviceAlarmConfig.SBL2.AL > 0) {
                    obj = new Object();
                    obj.ESS = '水量2下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.SBL2.AL + ' 立方米/小时';    //获取要素单位
                    newobj[cnt] = obj;
                    g_BlueRowIndexArray[bcnt++] = cnt;  //蓝色行号

                    cnt++;
                }

                //显示小时水量2-高报警预置
                if (DeviceAlarmConfig.SBL2 != undefined && DeviceAlarmConfig.SBL2.AH != undefined && DeviceAlarmConfig.SBL2.AH > 0) {
                    obj = new Object();
                    obj.ESS = '水量2上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.SBL2.AH + ' 立方米/小时';    //获取要素单位
                    newobj[cnt] = obj;
                    g_RedRowIndexArray[rcnt++] = cnt;   //红色行号

                    cnt++;
                }

            }


            //电源电压预警-总开关
            if (DeviceAlarmConfig.VT != undefined && DeviceAlarmConfig.VT.ALARM != undefined && DeviceAlarmConfig.VT.ALARM == 1) {
                //显示电池电压-低报警预置
                if (DeviceAlarmConfig.VT != undefined && DeviceAlarmConfig.VT.AL != undefined && DeviceAlarmConfig.VT.AL > 0) {
                    obj = new Object();
                    obj.ESS = '电压下限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.VT.AL + ' 立方米/小时';    //获取要素单位
                    newobj[cnt] = obj;
                    g_BlueRowIndexArray[bcnt++] = cnt;  //蓝色行号

                    cnt++;
                }

                //显示电池电压-高报警预置
                if (DeviceAlarmConfig.VT != undefined && DeviceAlarmConfig.VT.AH != undefined && DeviceAlarmConfig.VT.AH > 0) {
                    obj = new Object();
                    obj.ESS = '电压上限';    //获取要素名称
                    obj.DATA = DeviceAlarmConfig.VT.AH + ' 立方米/小时';    //获取要素单位
                    newobj[cnt] = obj;
                    g_RedRowIndexArray[rcnt++] = cnt;   //红色行号

                    cnt++;
                }

            }

        }
    }
    catch(e)
    {

    }

    return newobj;
}


//刷新实时数据-从父页面调用，必须将对象拷贝一份到本地
function refresh_data(obj) {
    try {
        //alert(JSON.stringify(obj), 4);

        //g_table_config.data = obj.TableData;
        // g_table_config.data = [{ESS:"编号",DATA:"1709080028"},{ESS:"名称",DATA:"DXRTU1709080028"}];
        //alert(JSON.stringify(g_table_config.data), 4);
        //alert(JSON.stringify(g_tableIns), 4);
        //alert(DataTableObj.TT);
        var data = data_table_copy(obj.TableData, obj.AlarmConfigObj);
        
        if (g_tableIns == null) {
            data_table_init(data);
        }
        else {
            g_table_config.data = data;
            g_tableIns.reload(g_table_config);
        }


        //alert(JSON.stringify(g_table_config), 4);
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//在layui table加载完成后，重新设置表格高度为100%,不限制表格高度，不会在表格上出现垂直滚动条
function AutoTableHeight() {

    var dev_obj = document.getElementById('table_and_page_div_id'); //table的父div



    var layuitable_main = dev_obj.getElementsByClassName("layui-table-main");   //在父div中找 layui-table-main 属性所在标签

    if (layuitable_main != null && layuitable_main.length > 0) {

        layuitable_main[0].style.height = '100%';
        layuitable_main[0].style.overflow = ''; //防止出现横向滑动条
    }



    var layuitable = dev_obj.getElementsByClassName("layui-form");   //在父div中找 layui-form 属性所在标签

    if (layuitable != null && layuitable.length > 0) {

        layuitable[0].style.height = '100%';

    }

}