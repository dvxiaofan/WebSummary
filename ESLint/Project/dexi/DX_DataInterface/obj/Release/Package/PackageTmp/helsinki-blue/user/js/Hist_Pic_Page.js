var g_DataAllCnt = 0;                                   //数据总数
var g_HistDataObj = [];                                 //当前历史数据
var g_ThisST;                                           //当前设备ST
var g_ThisName;                                         //当前设备Name
var g_layer_msg_index;                                  //加载框id
var g_SelectPageIndex = 0;
var g_StartTime;                                        //当前搜索框开始时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_EndTime;                                          //当前搜索框结束时间,字符串格式YYYY-MM-DD hh:mm:ss
var g_TempStartTime;                                    //临时存放时间控件的时间，格式为：{"year":2018,"month":7,"date":25,"hours":0,"minutes":0,"seconds":0}
var g_TempEndTime;                                      //临时存放时间控件的时间，格式为：{"year":2018,"month":7,"date":25,"hours":0,"minutes":0,"seconds":0}
var g_MyTree;
var cg_OnePageDataCount = 24;

//底部分页栏配置
var g_table_limt = {
    elem: 'limt_butt_id',
    theme: '#3E79BB',                   //主题风格
    count: 100,              //总数
    limit: cg_OnePageDataCount,         //单页显示数据条数
    groups: 10,      //连续出现的页码个数
    curr: (g_SelectPageIndex + 1),             //当前页码
    layout: ['prev', 'page', 'next', 'count'],
    jump: function (obj, first) {//分页回调
        table_limt_jump_event(obj, first);  //翻页处理
    }
};


//初始化加载执行
window.onload = function () {   //要执行的js代码段  

    $.ajaxSettings.async = false;                   //由于有ajax，强制js为同步执行
    //loading_message('加载数据中...');                 //弹出提示框


    //自动高度-右侧正文
    var oDiv = document.getElementById('user_content_id_1');
    oDiv.style.height = ($(window).height() - 2) + 'px';
    //左侧列表
    var oDiv = document.getElementById('panel_id_1');
    oDiv.style.height = ($(window).height() - 12 - 30) + 'px';

    //自动高度
    var oDiv = document.getElementById('div_scroll_id');
    oDiv.style.height = ($(window).height() - 2) + 'px';

    //图标居中
    var oDiv = document.getElementById('scroll_ico_id');
    oDiv.style.marginTop = ($(window).height() - 100) / 2 + 'px';

    //自动高度右侧panle
    var oDiv = document.getElementById('pic_list_div_id');
    oDiv.style.height = ($(window).height() - 191) + 'px';


    laydate_init();                                 //初始化时间控件


    //下载数据
    g_AllDeviceList = ajaxSyncGetPicDeviceList();    //获取当前用户所有图片设备基本信息列表   
    g_AllGroupList = ajaxSyncGetAllGroupList();   //获取所有分组信息
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

    setTimeout('DelayInitData()', 250);        //延时加载数据
    close_message();                            //关闭提示框 
}

//延时加载数据，先加载左侧的站点列表
function DelayInitData() {
    SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime);   //获取并显示当前选择的设备的数据
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

    //自动高度右侧panle
    var oDiv = document.getElementById('pic_list_div_id');
    oDiv.style.height = ($(window).height() - 191) + 'px';
});



//刷新底部分页栏(AllDataCount:总的数据条数；OnePageCount：一页显示的数据条数；ThisPageIndex：当前页索引，从0开始,无需修改的参数可以为null)
function table_limt_refresh(AllDataCount, OnePageCount, ThisPageIndex) {
    //刷新底部的分页栏
    layui.use('laypage', function () {
        var laypage = layui.laypage;
        //执行一个laypage实例-设置分页
        if (AllDataCount != null) {
            g_table_limt.count = AllDataCount;          //数总数
        }
        if (OnePageCount != null) {
            g_table_limt.limit = OnePageCount;          //单页显示数据条数
        }
        if (ThisPageIndex != null) {
            g_table_limt.curr = ThisPageIndex + 1;      //当前页
        }
        laypage.render(g_table_limt);                   //重新刷新底部分页
    });
}



//时间控件初始化
function laydate_init() {
    try {
        //时间控件初始化
        layui.use('laydate', function () {
            var myDate = new Date();    //获取当前系统时间
            var LastDate = new Date();    //获取当前系统时间
            LastDate.setDate(LastDate.getDate() - 1); //获取2天前时间
            //初始化时间
            g_TempStartTime = {
                year: LastDate.getFullYear(), month: (LastDate.getMonth() + 1), date: LastDate.getDate(), hours: 0, minutes: 0, seconds: 0
            };
            g_TempEndTime = {
                year: myDate.getFullYear(), month: (myDate.getMonth() + 1), date: myDate.getDate(), hours: 0, minutes: 0, seconds: 0
            };
            get_time_frame();   //更新一次时间

            var laydate = layui.laydate;
            //自定义格式
            laydate.render({
                elem: '#test11'
              , format: 'yyyy年MM月dd日'
              , value: LastDate.getFullYear() + '年' + (LastDate.getMonth() + 1) + '月' + LastDate.getDate() + '日'  //必须遵循format参数设定的格式
                , done: function (value, date, endDate) {//控件选择完毕后的回调---点击日期、清空、现在、确定均会触发。
                    g_TempStartTime = date;         //临时存放开始时间
                    // alert(JSON.stringify(date, 4)); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                }
                , theme: '#3E79BB' //颜色-蓝色
            });

            //自定义格式
            laydate.render({
                elem: '#test12'
              , format: 'yyyy年MM月dd日'
              , value: myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日'  //必须遵循format参数设定的格式
                , done: function (value, date, endDate) {//控件选择完毕后的回调---点击日期、清空、现在、确定均会触发。
                    g_TempEndTime = date;         //临时存放结束时间
                    //alert(JSON.stringify(date, 4)); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                }
                , theme: '#3E79BB' //颜色-蓝色
            });

        });
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}



//获取时间范围，时间存放到全局 g_StartTime，g_EndTime   
function get_time_frame() {
    try {
        g_StartTime = g_TempStartTime.year + '-' + g_TempStartTime.month + '-' + g_TempStartTime.date + ' 00:00:00';
        g_EndTime = g_TempEndTime.year + '-' + g_TempEndTime.month + '-' + g_TempEndTime.date + ' 23:59:59';

        //alert(g_StartTime + ' ' + g_EndTime);
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}


//刷新某个站点数据
function SelectAndGetDeviceHistData(ST, NAME, StartTime, EndTime) {
    try {

        //刷新站点编号与名称
        document.getElementById('lable_st_id').innerHTML = '编号：' + ST;
        document.getElementById('lable_name_id').innerHTML = '名称：' + NAME;


        g_SelectPageIndex = 0;      //页索引为0
        //下载当前设备的历史数据
        g_HistDataObj = ajax_sync_get_pic_data(ST, StartTime, EndTime);   //获取历史图片信息
        if (g_HistDataObj != null && g_HistDataObj.length > 0) {
            table_limt_refresh(g_HistDataObj.length, cg_OnePageDataCount, 0);//刷新底部栏
            document.getElementById('no_data_info_id').style.display = "none";//隐藏提示

            getPicture(g_HistDataObj, g_SelectPageIndex, cg_OnePageDataCount);           //显示图片数据

            /*data_handle(g_HistDataObj);         //整理数据
            //alert(JSON.stringify(g_FieldDataArr[0], 4));         //调试显示信息
            echart_button_init(g_FieldNameList);                //初始化显示顶部按钮
            echart_div_init(g_FieldNameList.length);            //初始化echar div 
            
            for (var i = 0; i < g_FieldNameList.length; i++)    //循环显示echar
            {
                g_CharsList[i] = ShowChars('echart_div_id_'+i, g_FieldNameList[i] + '(' + g_FieldUintList[i] + ')', g_TT, g_FieldDataArr[i]);
            }*/

        }
        else {
            table_limt_refresh(0, cg_OnePageDataCount, 0);//刷新底部栏

            //清除图片
            var ul = $(".listul");
            ul.empty();
            ul.append('');

            //没有数据清除页面，并显示没有数据
            $('#smallbox').empty('');
            $('#echart_div_id').empty('');
            document.getElementById('no_data_info_id').style.display = "";//显示提示
            layer.msg("错误：没有数据！", { icon: 5, scrollbar: false }); //5：失败；6：成功
        }


        //自动高度右侧panle
        var oDiv = document.getElementById('pic_list_div_id');
        oDiv.style.height = ($(window).height() - 191) + 'px';
        //alert(JSON.stringify(g_table_cols, 4));        //调试显示信息
        //alert(JSON.stringify(g_DeviceInfoDataPage, 4));        //调试显示信息
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//翻页处理
function table_limt_jump_event(obj, first) {
    try {
        //obj包含了当前分页的所有参数，比如：
        //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数

        //首次不执行
        if (!first) {
            //alert(obj.curr + " " + obj.limit);
            if (g_HistDataObj.length == 0) {
                layer.alert("没有数据", { icon: 5, scrollbar: false }); //5：失败；6：成功
                return;
            }
            g_SelectPageIndex = obj.curr - 1;   //获取当前页索引
            getPicture(g_HistDataObj, g_SelectPageIndex, cg_OnePageDataCount);           //显示图片数据
        }
        else {
            g_SelectPageIndex = obj.curr - 1;
        }
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//点击图片处理
function pic_onclick(id) {
    try {
        var index = parseInt(id.substring(7));
        open_pic_frame(g_ThisST + ' ' + g_ThisNAME + ' (' + g_HistDataObj[index].TT + ')', '/Home/GetImg?id=' + g_HistDataObj[index].ID);//后面的名称);
    } catch (e) {
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}


//弹窗子窗口-查看图片
function open_pic_frame(title, url) {
    try {
        //iframe层-多媒体
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
        layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}


//显示一页图片
//显示图片
function getPicture(All_PicInfoData, PageIndex, OnePageCount) {
    var ul = $(".listul");
    ul.empty();

    var e = "";
    if (All_PicInfoData == null || All_PicInfoData.length == 0) //没有图片
    {
        ul.append('<div class="layui-none fydiv">暂无图片数据</div>');
    }
    else {
        try {
            var StartIndex = PageIndex * OnePageCount;
            if (StartIndex >= All_PicInfoData.legend) return;

            //alert('图片数量：' + PicInfoData.length);
            for (var i = StartIndex; i < All_PicInfoData.length; i++) {
                var e = "<li ><a href=\"#\" id=\"pic_id_" + i + "\" onclick=\"pic_onclick(this.id)\"><div style=\"width:160px;height:160px;display: table-cell;vertical-align: middle;text-align: center;\"><img style=\"width:160px;height:160px;\" src=\"/Home/GetImg?id=" + All_PicInfoData[i].ID + "\"></div></a><p><span>" + All_PicInfoData[i].TT + "</span></p></li>";
                ul.append(e);
                if (i >= (StartIndex + OnePageCount - 1)) break;

            }
            //重新设置高度，如果超出了窗口大则进行限制
            //var oDiv1 = document.getElementById('tabl_panel_id1');
            //var oDiv2 = document.getElementById('tabl_panel_id2');

            //alert(oDiv1.clientHeight + ' ' + oDiv2.clientHeight);

            //oDiv2.style.height = oDiv1.clientHeight + 'px';
        } catch (e) {
            layer.msg("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
        }

    }
}



//选择事件
function SelectionEvent(index, data_name, text) {
    loading_message1('加载数据中...');                    //弹出提示框

    laydate_init();                                     //初始化时间控件
    g_ThisST = data_name;                            //当前设备ST
    var str = text;
    str = str.substring(11, str.length);                //截取后面的名称
    g_ThisNAME = str;                                   //当前设备NAME
    //延时先等等加载中...显示出来后再加载数据
    setTimeout(
          function () {
              SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime);   //获取并显示当前选择的设备的数据
              //alert(JSON.stringify(obj), 4);
              close_message();                                    //关闭提示框 
          }
           , 100);
}


//点击查询数据
function query_data_onclick() {
    try {
        loading_message1('加载数据中...');                    //弹出提示框
        get_time_frame();                                   //更新时间范围
        //延时先等等加载中...显示出来后再加载数据
        setTimeout(
              function () {
                  SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime);   //获取并显示当前选择的设备的数据
                  //alert(JSON.stringify(obj), 4);
                  close_message();                                    //关闭提示框 
              }
               , 100);


        //SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME,g_StartTime, g_EndTime);   //获取并显示当前选择的设备的数据
        //alert(JSON.stringify(obj), 4);
        //close_message();                                    //关闭提示框 
        //alert(JSON.stringify(obj), 4);
        //alert('选择索引：' + index);
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}


//快捷选择-查询历史数据
layui.use('form', function () {
    var form = layui.form;

    //g_StartTime = g_TempStartTime.year + '-' + g_TempStartTime.month + '-' + g_TempStartTime.date + ' 00:00:00';
    //g_EndTime = g_TempEndTime.year + '-' + g_TempEndTime.month + '-' + g_TempEndTime.date + ' 23:59:59';
    //各种基于事件的操作，下面会有进一步介绍
    form.on('select(select_filter)', function (data) {
        //alert(data.value + '天'); //得到被选中的值
        try {
            if (data.value <= 0 || data.value > 60) return; //时间
            var EndDate = new Date();    //获取当前系统时间
            var StartDate = new Date();    //获取当前系统时间
            StartDate.setDate(StartDate.getDate() - data.value); //获取n天前时间

            g_StartTime = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate() + ' ' + StartDate.getHours() + ':' + StartDate.getMinutes() + ':' + StartDate.getSeconds();
            g_EndTime = EndDate.getFullYear() + '-' + (EndDate.getMonth() + 1) + '-' + EndDate.getDate() + ' ' + EndDate.getHours() + ':' + EndDate.getMinutes() + ':' + EndDate.getSeconds();
            //alert(g_StartTime + ' ' + g_EndTime);


            loading_message1('加载数据中...');                    //弹出提示框
            SelectAndGetDeviceHistData(g_ThisST, g_ThisNAME, g_StartTime, g_EndTime);   //获取并显示当前选择的设备的数据
            //alert(JSON.stringify(obj), 4);
            close_message();                                    //关闭提示框 
        } catch (e) {
            layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
        }
    });
});




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


//获取当前设备的历史数据细信（历史）
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
                obj_arr[j][i] = all_data_obj[i][g_FieldList[j]];
            }
        }

        g_FieldDataArr = obj_arr;
    }
    catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//初始化按钮
function echart_button_init(FieldNameList) {
    try {
        $('#smallbox').empty('');

        if (FieldNameList == null || FieldNameList.length == 0) return;
        for (var i = 0; i < FieldNameList.length; i++) {
            //设置是否显示的按钮 
            $('#smallbox').append('<button class="mybutton fa fa-eye" id="mybutton_id_' + i + '" onclick="echar_button_onclick(' + i + ',this.id)" title="点击隐藏">' + FieldNameList[i] + '</button>');
        }
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//初始化echar div id
function echart_div_init(cnt) {
    try {
        $('#echart_div_id').empty('');

        if (cnt == 0) return;
        for (var i = 0; i < cnt; i++) {
            $('#echart_div_id').append('<div id=\"echart_div_id_' + i + '\" style=\"width:100%;height:500px;margin-top:50px;\">');
        }
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//按钮点击处理-显示或影藏波形
function echar_button_onclick(index, id) {
    try {
        if (index == null || id == null) return;
        var button = document.getElementById(id);
        if (button.title == '点击隐藏') //当前是显示的，变为影藏状态
        {
            //alert(button.title);
            button.setAttribute('class', 'mybutton fa fa-eye-slash');
            button.setAttribute('style', 'color:#ffc0c0'); //隐藏的用红色显示
            var oDiv = document.getElementById('echart_div_id_' + index); //获取echart所在div
            oDiv.style.display = "none";//隐藏

            button.title = '点击显示';
        }
        else //显示
        {
            button.title = '点击隐藏';
            button.setAttribute('class', 'mybutton fa fa-eye');
            button.setAttribute('style', 'color:#ffffff'); //正常显示白色字体
            var oDiv = document.getElementById('echart_div_id_' + index); //获取echart所在div
            oDiv.style.display = "";///显示
        }
        // alert(index + ' ' + id);

    } catch (e) {

    }
}



// 基于准备好的dom，初始化echarts实例
function ShowChars(chartId, dataName, dataX, dataY) {

    //alert(JSON.stringify(dataX, 4));         //调试显示信息
    //alert(JSON.stringify(dataY, 4));         //调试显示信息
    if (dataY == undefined)
        return;

    if (dataY.length < 0)
        return;

    var dataMin = Number(dataY[0]);
    var dataMax = dataY[0];

    for (var i = 0; i < dataY.length; i++) {
        if (Number(dataMin) > Number(dataY[i])) {
            dataMin = Number(dataY[i]);
        }
        if (Number(dataMax) < Number(dataY[i])) {
            dataMax = Number(dataY[i]);
        }
    }
    //var parentWidth = $("#" + chartId).parent().width();
    //$("#" + chartId).width(parentWidth+'px');


    //dataMin = Math.abs(dataMin);

    dataMin = dataMin.toFixed(3);

    if (Number(dataMin) == Number(dataMax)) {
        dataMax = Number(dataMax) + 1;
        dataMin = Number(dataMin) - 1;
        if (dataMin < 0) dataMin = -0.1;
    }
    else {
        dataMax = Number(dataMax) + 1;
        dataMin = Number(dataMin) - 1;
        if (dataMin < 0) dataMin = 0;
    }



    dataMax = dataMax.toFixed(3);

    var myChart = null;
    // myChart = echarts.getInstanceByDom(document.getElementById(chartId));
    if (myChart == null) {
        myChart = echarts.init(document.getElementById(chartId));
    }

    //myChart.showLoading();//显示载入图标
    option = {
        title: {
            text: dataName,
            subtext: '',
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
            axisPointer: {
                animation: false
            }
        },
        legend: {
            data: [dataName],
            x: 'left'
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
                name: dataName,
                type: 'value'
                ,
                max: dataMax,
                min: dataMin
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


//隐藏左边栏回调，专用接口
function scroll_button_onclick_callback() {
    try {
        scroll_button_onclick();

        setTimeout(function () {
            //echar宽度自适应
            if (g_CharsList != null && g_CharsList.length > 0) {
                for (var i = 0; i < g_CharsList.length; i++) {
                    g_CharsList[i].resize();
                }
            }
        }, 500);        //延时加载数据
    } catch (e) {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//监控滚动条
$('#user_content_id_1').on('scroll', function () {
    // div 滚动了
    /* alert('滚动了');*/
    if ($('#user_content_id_1').scrollTop() < 10) //到顶部了
    {
        document.getElementById('scroll_to_top_id').style.display = "none";//隐藏
    }
    else {
        document.getElementById('scroll_to_top_id').style.display = "inline";//显示
    }
    /*if ($('#user_content_id_1').scrollTop() >= (1000 - 200)) {
        // 滚动到底部了
        alert('滚动到底部了');
    }


    style = "display: inline;"
    return $("html, body").animate({
        scrollTop: 0
    }, 600), !1*/
});

//监控回到顶部按钮
$('#scroll_to_top_id').on('click', function () {
    //alert('滚动了');
    document.getElementById('user_content_id_1').scrollTop = 0;//通过scrollTop设置滚动到0位置


});