
var g_AllDeviceList;                                  //所有设备列表基本数据
var g_SearchDeviceList;                               //符合搜索条件的设备信息
var g_ThisPageDeviceList;                           //当前页要显示的设备编号与名称信息，链接到g_AllDeviceList或g_SearchDeviceList
var g_DeviceInfoDataPage = JSON.parse('[]');          //用于最终显示的设备列表数据，传递给tab-每次获取一页数据,数组
var g_SelectPageIndex = 0;                          //当前页索引，从0开始
var cg_OnePageDataCount = 50;                       //一页显示数据条数
var g_layer_msg_index;                              //加载框id
var g_layer_id;                                     //全局新窗口id
var g_tableIns;                                     //tableIns 来源于 table.render() 方法的实例-用于表格重载
var g_isSearchMode = false;                         //是否处于搜索模式
var g_SelectDeviceEssList;                          //当前选择的设备的要素列表，用于传递到子页面
var g_DeviceRealData;                                //当前显示的下载的原始数据
var g_AllEssDataCache = null;                       //所有要素数据缓存
   

var g_AllUsersDataCache = null;                     //所有用户的基本信息缓存
var g_FieldList = [];                               //当前页实时数据的字段列表，除去编号与采集时间

//当前正在编辑的设备信息
var g_ThisEditDeviceInfo = {
    isEdit: true,
    ST: '',
    NAME: '',
    ADDRESS: '',
    TEL: '',
    LONG: '',
    LAT:'',
    REMARKS: ''
};

//表头
var g_table_cols =[];

//table表格配置
var g_table_config = {
    elem: '#device_list_table_id'
    , data: g_DeviceInfoDataPage
    , limit: cg_OnePageDataCount   //每页显示50条
    , text: { none: '暂无相关数据' }
    , height: 500
    , cellMinWidth: 70 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
  , page: false //开启分页
  , cols: [g_table_cols]
    // , even: true //开启隔行背景
    , size: 'sm' //小尺寸的表格    
};
    
//底部分页栏配置
var g_table_limt = {
    elem: 'limt_butt_id',
    theme: '#3E79BB',                   //主题风格
    count: 0,              //总数
    limit: cg_OnePageDataCount,         //单页显示数据条数
    groups: 10,      //连续出现的页码个数
    curr: (g_SelectPageIndex + 1),             //当前页码
    layout: ['prev', 'page', 'next', 'count'],
    jump: function (obj, first) {//分页回调
        table_limt_jump_event(obj, first);  //翻页处理
    }
};
//用于记录当前滑动条位置
var g_scrollTop = {
    dev_obj: null,          //layui table 父div
    layuitable: null,       //当前的layui table
    scrollTop: 0            //记录位置
};

//初始化加载执行
window.onload = function () {   //要执行的js代码段  
    //自动高度
    var oDiv = document.getElementById('user_panel_id_1');
    oDiv.style.height = ($(window).height() - 40) + 'px';

    $.ajaxSettings.async = false;                   //由于有ajax，强制js为同步执行
    loading_message('加载数据中...');                    //弹出提示框

    g_AllEssDataCache = AllDeviceEssInit();             //初始化所有要素数据
    //alert(JSON.stringify(g_AllEssDataCache, 4));        //调试显示信息
    g_AllDeviceList = ajaxSyncGetDeviceList();      //获取当前用户所有设备基本信息列表   
    g_DeviceRealData = ajax_sync_get_real_data(g_AllDeviceList, 0, cg_OnePageDataCount);             //获取第一页要显示的实时数据

    //document.getElementById('lable_all_count_id').innerHTML = '设备总数：' + g_AllDeviceList.length; //显示所有设备数量
    //document.getElementById('lable_show_count_id').innerHTML = '当前显示：' + g_DeviceRealData.length; //显示当前页显示数量

    g_DeviceInfoDataPage = conversion_data_layui_table(g_DeviceRealData,g_ThisPageDeviceList, 1);                   //将获取的数据转换为layui table能显示的数据
    g_table_config.cols[0] = g_table_cols;                                                  //更新字段
    //alert(JSON.stringify(g_table_cols, 4));        //调试显示信息
    //alert(JSON.stringify(g_DeviceInfoDataPage, 4));        //调试显示信息
    data_table_init(g_DeviceInfoDataPage, g_AllDeviceList.length, cg_OnePageDataCount, 0);  //初始化表格，并显示数据
        
    close_message();                                    //关闭提示框 

    document.getElementById("cancel_search_button_id").disabled = "true";    //禁用取消搜索按钮
}

//刷新当前页面-点击刷新按钮
function RefreshPage_onClick()
{
    location.reload();
}


//在要素字段总表中查找当前字段名
function get_field_name(AllEssDataCache, field)
{

    try {
        for(var i = 0;i < AllEssDataCache.length;i ++)
        {
            if(AllEssDataCache[i].标识符ASCII码 == field)
            {
                return AllEssDataCache[i].编码要素 + '(' + AllEssDataCache[i].量和单位 + ')';
            }
        }
    } catch (e) {
            
    }
    return field;
}


//关闭新的小窗口
function CloseLayer()
{
    layer.close(g_layer_id);
}

//浏览器窗口大小变化事件
$(window).resize(function () {          //当浏览器大小变化时
    //自动高度
    var oDiv = document.getElementById('user_panel_id_1');
    oDiv.style.height = ($(window).height() - 40) + 'px';

    //表格高度自适应
    data_table_auto_height();                           //自动调节表格高度
});
    


   
//记录scrollTop位置，在表格重载之前调用（依赖全局g_scrollTop）
function RecordScrollTop()
{
    try
    {
        g_scrollTop.dev_obj = document.getElementById('table_and_page_div_id'); //table的父div
        if (g_scrollTop.dev_obj != null) {
            g_scrollTop.layuitable = g_scrollTop.dev_obj.getElementsByClassName("layui-table-main");
        }
        if (g_scrollTop.layuitable != null && g_scrollTop.layuitable.length > 0) {
            g_scrollTop.scrollTop = g_scrollTop.layuitable[0].scrollTop; //layuitable获取到的是 class=layui-table-main的集合
        }
    }
    catch (e)
    {
        g_scrollTop.scrollTop = 0;
        console.log(e.message);
    }   
}
   
//还原scrollTop位置，在表格重载之后调用（依赖全局g_scrollTop）
function RestoreScrollTop()
{
    try {
        //还原scroll位置
        if (g_scrollTop.layuitable != null && g_scrollTop.layuitable.length > 0) {
            g_scrollTop.layuitable[0].scrollTop = g_scrollTop.scrollTop;
        }
    }
    catch (e) {
        console.log(e.message);
    }
}
    
//重载表格
function table_reload(UserInfoDataPage)
{
    try
    {
        //刷新当前页
        g_table_config.data = UserInfoDataPage;
        g_tableIns.reload(g_table_config);//表格重载
    }
    catch (e)
    {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
       
}

//表格翻页处理
function table_limt_jump_event(obj, first)
{
    try
    {
        //obj包含了当前分页的所有参数，比如：
        //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数

        //首次不执行
        if (!first) {
            //alert(obj.curr + " " + obj.limit);
            if (g_AllDeviceList.length == 0)
            {
                layer.alert("没有数据", { icon: 5, scrollbar: false }); //5：失败；6：成功
                return;
            }


            //弹出提示框
            g_layer_msg_index = layer.msg('加载中',
            {
                icon: 16
                , shade: 0.5 //越大界面越黑
                , time: 60000,//时间
                anim: 0, //平滑放大
                scrollbar: false//锁定浏览器滑动
            });

            g_SelectPageIndex = obj.curr - 1;   //获取当前页索引

 
            if (g_isSearchMode == false)  //不处于搜索模式
            {
                g_DeviceRealData = ajax_sync_get_real_data(g_AllDeviceList, g_SelectPageIndex * cg_OnePageDataCount, cg_OnePageDataCount);  //获取第n页要显示的设备详细信息
            }
            else //处于搜索模式
            {
                g_DeviceRealData = ajax_sync_get_real_data(g_SearchDeviceList, g_SelectPageIndex * cg_OnePageDataCount, cg_OnePageDataCount);  //获取第n页要显示的设备详细信息
            }
            //document.getElementById('lable_show_count_id').innerHTML = '当前显示：' + g_DeviceRealData.length; //显示当前页显示数量
            g_DeviceInfoDataPage = conversion_data_layui_table(g_DeviceRealData, g_ThisPageDeviceList, g_SelectPageIndex * cg_OnePageDataCount + 1);                          //将获取的数据转换为layui table能显示的数据
            g_table_config.cols[0] = g_table_cols;                                                  //更新字段

                
            RecordScrollTop();      //记录scrollTop位置，在表格重载之前调用（依赖全局g_scrollTop）
            //刷新当前页
            table_reload(g_DeviceInfoDataPage);       //重载表格
            layer.close(g_layer_msg_index);      //关闭提示框
            RestoreScrollTop();      //还原scrollTop位置，在表格重载之后调用（依赖全局g_scrollTop）
        }
        else {
            g_SelectPageIndex = obj.curr - 1;
        }
    }
    catch (e)
    {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//表格工具条按钮处理
function table_tool_event(obj)
{
    var i;
    try
    {
        //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        SetEditDeviceInfo(data.ST, data.NAME, data.ADDRESS, data.TEL, data.LONG, data.LAT, data.REMARKS)//设置当前编辑的设备的基本信息到全局缓冲区，用于子设备调用

        if (layEvent === 'edit_ess') { //编辑要素
            SetSelectDeviceEssList('');//先清除
            for (i = 0; i < g_DeviceRealData.length; i++)
            {
                if(g_DeviceRealData[i].ST == data.ST) //寻找当前设备-获取ESS数据
                {
                    SetSelectDeviceEssList(g_DeviceRealData[i].REAL_ESS);           //写入要素列表到缓冲区中，用于子页面调用
                    break;
                }
            }
            //没有找到设备的信息或设备信息为空
            if (g_DeviceRealData == null || g_DeviceRealData.length == 0 || i == g_DeviceRealData.length)
            {
                layer.alert("错误：没有找到对应设备的信息！", { icon: 5, scrollbar: false }); //5：失败；6：成功
            }
                
            var title_name = '修改 '+ data.NAME+'('+data.ST+') 要素数据'; //子页面名称
 
            //iframe层
            g_layer_id = layer.open({
                type: 2,
                title: 'layer mobile页',
                //shadeClose: true, //空闲位置关闭
                fixed: false, //不固定
                maxmin: true,
                shade: 0.5,
                area: ['802px', '525px'],
                title: title_name,
                content: 'EditDeviceEssView', //iframe的url
                skin: 'layui-layer-lan'
            });
        } else if (layEvent === 'bind_user') //绑定用户
        {
            var title_name = '修改 ' + data.NAME + '(' + data.ST + ') 绑定用户'; //子页面名称

            //iframe层
            g_layer_id = layer.open({
                type: 2,
                title: 'layer mobile页',
                //shadeClose: true, //空闲位置关闭
                fixed: false, //不固定
                maxmin: true,
                shade: 0.5,
                area: ['852px', '625px'],
                title: title_name,
                content: 'EditDeviceCancelBindUsersView', //iframe的url
                skin: 'layui-layer-lan'
            });
            layer.full(g_layer_id); //全屏
        }
        else if (layEvent === 'del') { //删除
            layer.confirm('确定删除设备\'' + data.ST+'\'吗？', function (index) {
                layer.close(index);
                ajax_sync_delete_device(data.ST);
            });
        } else if (layEvent === 'edit') { //编辑
            //iframe层
            g_layer_id = layer.open({
                type: 2,
                title: 'layer mobile页',
                //shadeClose: true, //空闲位置关闭
                fixed: false, //不固定
                maxmin: true,
                shade: 0.5,
                area: ['802px', '525px'],
                title: '修改设备信息',
                content: 'EditDeviceInfoView', //iframe的url
                skin: 'layui-layer-lan'
            });
        }
    }
    catch (e)
    {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
        

}


//搜索按钮处理
function search_name_onclick()
{
    var Keyword = document.getElementById("search_user_name_id").value; //获取搜索框内容
    if (Keyword == null || Keyword.length < 1)
    {
        layer.alert("错误：搜索内容不能为空！", { icon: 5, scrollbar: false }); //5：失败；6：成功
        return;
    }
    //alert('搜索：' + Keyword);

    g_SearchDeviceList = search_user_list(g_AllDeviceList, Keyword);    //搜索
    if (g_SearchDeviceList.length == 0) return;                       //没有搜索到
    //开始获取搜索的内容，并进行显示
    try
    {
        g_isSearchMode = true;  //处于搜索模式
        document.getElementById("cancel_search_button_id").disabled = false;    //启用取消搜索按钮
        loading_message('加载数据中...');            //弹出提示框
        g_DeviceRealData = ajax_sync_get_real_data(g_SearchDeviceList, 0, cg_OnePageDataCount);        //获取第n页要显示的设备详细信息
        //document.getElementById('lable_all_count_id').innerHTML = '搜索设备总数：' + g_SearchDeviceList.length; //显示所有设备数量
        //document.getElementById('lable_show_count_id').innerHTML = '当前显示：' + g_DeviceRealData.length; //显示当前页显示数量
        g_DeviceInfoDataPage = conversion_data_layui_table(g_DeviceRealData, g_ThisPageDeviceList, 1);                //将获取的数据转换为layui table能显示的数据
        //刷新当前页
        table_reload(g_DeviceInfoDataPage);       //重载表格
        //刷新底部的分页栏
        table_limt_refresh(g_SearchDeviceList.length, cg_OnePageDataCount, 0);
        layer.close(g_layer_msg_index);         //关闭提示框
        if (g_SearchDeviceList.length >= 1000)
        {
            layer.alert("搜索到超过1000条，只显示" + g_SearchDeviceList.length + "条记录，请缩小搜索范围！", { icon: 6, scrollbar: false }); //5：失败；6：成功
        }
        else
        {
            layer.alert("搜索到" + g_SearchDeviceList.length + "条记录！", { icon: 6, scrollbar: false }); //5：失败；6：成功
        }
            
    }
    catch (e)
    {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
        


}
//取消搜索按钮处理
function search_cancel_onclick()
{
    try
    {
        if (g_isSearchMode == false) return;    //不处于搜索模式的话，直接返回
        g_isSearchMode = false;                 //不处于搜索模式

        loading_message('加载数据中...');            //弹出提示框
        g_DeviceRealData = ajax_sync_get_real_data(g_AllDeviceList, 0, cg_OnePageDataCount);        //获取第n页要显示的设备详细信息
        //document.getElementById('lable_all_count_id').innerHTML = '设备总数：' + g_AllDeviceList.length; //显示所有设备数量
        //document.getElementById('lable_show_count_id').innerHTML = '当前显示：' + g_DeviceRealData.length; //显示当前页显示数量
        g_DeviceInfoDataPage = conversion_data_layui_table(g_DeviceRealData, g_ThisPageDeviceList, 1);                //将获取的数据转换为layui table能显示的数据
        //刷新当前页
        table_reload(g_DeviceInfoDataPage);       //重载表格
        //刷新底部的分页栏
        table_limt_refresh(g_AllDeviceList.length, cg_OnePageDataCount, 0);
        layer.close(g_layer_msg_index);         //关闭提示框

        document.getElementById("cancel_search_button_id").disabled = "true";    //禁用取消搜索按钮
    }
    catch (e)
    {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
}

//设置当前正在编辑的设备信息到全局缓冲区中
function SetEditDeviceInfo(ST, NAME, ADDRESS, TEL, LONG, LAT, REMARKS) {
    try
    {
        g_ThisEditDeviceInfo.isEdit = true; //编辑状态有效
        g_ThisEditDeviceInfo.ST = ST;
        g_ThisEditDeviceInfo.NAME = NAME;
        g_ThisEditDeviceInfo.ADDRESS = ADDRESS;
        g_ThisEditDeviceInfo.TEL = TEL;
        g_ThisEditDeviceInfo.LONG = LONG;
        g_ThisEditDeviceInfo.LAT = LAT;
        g_ThisEditDeviceInfo.REMARKS = REMARKS;           
    }
    catch (e)
    {
        layer.alert("错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
       
}

//获取要修改的设备信息-如果isEdit有效则为编辑设备信息；否则为新建设备
function GetEditUserInfo() {
    return g_ThisEditDeviceInfo;
}

//清除编辑状态信息-意味着是新建设备
function ClearEditUserInfo() {
    g_ThisEditDeviceInfo.isEdit = false; //编辑状态无效，需要新建设备
    g_ThisEditDeviceInfo.ST = '';
    g_ThisEditDeviceInfo.NAME = '';
    g_ThisEditDeviceInfo.ADDRESS = '';
    g_ThisEditDeviceInfo.TEL = '';
    g_ThisEditDeviceInfo.LONG = '';
    g_ThisEditDeviceInfo.LAT = '';
    g_ThisEditDeviceInfo.REMARKS = '';
}

//添加设备按钮处理
function add_device_onclick() {
    ClearEditUserInfo();    //清除修改设备标记，需要新建设备
    //iframe层
    g_layer_id = layer.open({
        type: 2,
        title: 'layer mobile页',
        //shadeClose: true, //空闲位置关闭
        fixed: false, //不固定
        maxmin: true,
        shade: 0.5,
        area: ['802px', '525px'],
        title: '添加新设备',
        content: 'EditDeviceInfoView', //iframe的url
        skin: 'layui-layer-lan'
    });
    //layer.full(g_layer_id); //全屏
}

//刷新底部分页栏(AllDataCount:总的数据条数；OnePageCount：一页显示的数据条数；ThisPageIndex：当前页索引，从0开始,无需修改的参数可以为null)
function table_limt_refresh(AllDataCount, OnePageCount, ThisPageIndex)
{
    //刷新底部的分页栏
    layui.use('laypage', function () {
        var laypage = layui.laypage;
        //执行一个laypage实例-设置分页
        if (AllDataCount != null)
        {
            g_table_limt.count = AllDataCount;          //数总数
        }
        if (OnePageCount != null)
        {
            g_table_limt.limit = OnePageCount;          //单页显示数据条数
        }            
        if (ThisPageIndex != null)
        {
            g_table_limt.curr = ThisPageIndex + 1;      //当前页
        }
        laypage.render(g_table_limt);                   //重新刷新底部分页
    });
}

//表格高度自动调节（要在表格初始化之后进行调用）
function data_table_auto_height()
{
    //表格高度自适应
    if (g_tableIns != null) {
        g_table_config.height = $(window).height() - 180;
        g_tableIns.reload(g_table_config);              //表格重载
    }
}

//初始化表格(只能调用一次，并且会在调用后延时一段时间才能初始化完成)DataTableObj:当前要显示的数据；AllDataCount：总数据条数；OnePageCount：一页显示的数据条数；ThisPageIndex：当前页索引，从0开始
function data_table_init(DataTableObj, AllDataCount, OnePageCount, ThisPageIndex)
{
    layui.use('table', function () {
        var table1 = layui.table;
        //第一个实例
        g_table_config.data = DataTableObj;
        g_tableIns = table1.render(g_table_config);

        //监听工具条
        table1.on('tool(tabl_lay_filter)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
            table_tool_event(obj);                          //调用工具栏事件处理函数
        });
        data_table_auto_height();                           //自动调节表格高度
    });

    //刷新底部的分页栏
    table_limt_refresh(AllDataCount, OnePageCount, ThisPageIndex);
}

//获取指定设备的实时数据（ajax同步模式）DeviceListObj:设备基础信息列表；StartIndex：开始索引，0开始；Count：要读取的数量
//会将当前页要显示的设备ST与NAME写入到 g_ThisPageDeviceList
function ajax_sync_get_real_data(DeviceListObj, StartIndex, Count) {
    var obj = JSON.parse('[]');
    var ST_List = ""; //要查询的设备信息的主键列表集合，用逗号分开
    var cnt = 0;

    g_ThisPageDeviceList = [];

    if (DeviceListObj == null || DeviceListObj.length == 0 || Count == 0) {
        layer.alert("要获取的设备列表为空！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功

        return obj;
    }

    if (StartIndex >= DeviceListObj.length) StartIndex = DeviceListObj.length - 1; //限制

    //准备好要获取的设备的ST
    for (var i = StartIndex; i < DeviceListObj.length; i++) {
        g_ThisPageDeviceList[cnt] = DeviceListObj[i];
        if (i == (DeviceListObj.length - 1) || cnt == (Count - 1)) //最后一个
        {
            ST_List += DeviceListObj[i].ST;
            break; //完成了
        } else {
            ST_List += DeviceListObj[i].ST + ',';

        }

        cnt++;
    }
    // 返回请求的数据
    return ajaxSyncGetRealData(ST_List);
}


//在实时数据中寻找当前ST对应的数据
function find_read_data(DeviceRealData, ST)
{
    if(ST == null) return null;
    try {
        for(var i = 0;i < DeviceRealData.length;i ++)
        {
            if(ST == DeviceRealData[i].ST) //找到了
            {
                return DeviceRealData[i];
            }
        }
    } catch (e)
    {

    }
    return null;
}
//将获取到的设备数据转换为能被layui table显示的数据 DeviceRealData:需要显示的详细设备信息,StartRowNumber:当前显示的行号起始，从1开始；
//ThisPageDeviceList:当前要显示的设备ST与NAME列表
function conversion_data_layui_table(DeviceRealData, ThisPageDeviceList, StartRowNumber)
{
    var DeviceTableData = JSON.parse('[]');                  //清空数据，创建一个对象数组
    g_FieldList = [];
    var cnt = 0;
    var FielName = '';  //字段名称
    var DataObj;
    //表头
    g_table_cols =
    [
        { field: 'ID', title: '序号',width:60, fixed: 'left', align: 'center' }
        , { field: 'NAME', title: '名称', fixed: 'left', width: 200, align: 'center' }
        , { field: 'ST', title: '编号', fixed: 'left', width: 110, align: 'center' }
        , {
            field: 'STATUS', title: '通信状态', width: 80, align: 'center', templet: function (d) {
                //alert(JSON.stringify(d, 4));        //调试显示信息
                if (d.STATUS == '正常') {
                    //return '<span style=\"color: #3498DB;\">' + d.STATUS + '</span>';
                    return '<span class="layui-badge layui-bg-green">' + d.STATUS + '</span>';
                }
                else if(d.STATUS == '连接中')
                {
                    return '<span class="layui-badge layui-bg-orange">' + d.STATUS + '</span>';
                }
                else if(d.STATUS == '异常')
                {
                    return '<span class="layui-badge">' + d.STATUS + '</span>';
                }
                else //无数据
                {
                    return '<span class="layui-badge layui-bg-gray">' + d.STATUS + '</span>';
                }
            }

        }
        , { field: 'TT', title: '采集时间', width: 150, align: 'center' }
    ];


    try
    {
        if (ThisPageDeviceList == null || ThisPageDeviceList.length == 0)//没有数据
        {
            return DeviceTableData;
        }
        else
        {

            for (var p in DeviceRealData[0]) {//遍历json对象的每个key/value对,p为key

                //alert(p + " " + DeviceRealData[0][p]);
                if (p != 'ST' && p != 'TT' && p != 'UT' && p != null)
                {
                    g_FieldList[cnt] = p; //记录字段
                    FielName = get_field_name(g_AllEssDataCache, p);    //获取字段名称
                    var obj = { field: p, title: FielName,width:((FielName.length-1)*12+30), align: 'center' };
                    g_table_cols[5 + cnt] = obj;
                    cnt++;
                }
            }
            //在最后面添加上传时间
            g_table_cols[5 + cnt] = { field: 'UT', title: '上传时间', width: 150, align: 'center' };

                
            //alert(JSON.stringify(g_table_cols, 4));        //调试显示信息
            for (var i = 0; i < ThisPageDeviceList.length; i++)
            {
                var obj = new Object();                     //定义对象
                //给对象添加属性
                obj.ID = (StartRowNumber + i) + '';        //行号，加上起始行号
                obj.ST = ThisPageDeviceList[i].ST;
                obj.NAME = ThisPageDeviceList[i].NAME;

                DataObj = find_read_data(DeviceRealData, obj.ST); //寻找当前设备的实时数据
                if(DataObj == null) //没有找到，有数据
                {
                    obj.STATUS = '无数据';  //状态
                }
                else
                {
                    //循环显示普通要素数据
                    for (var j = 0; j < g_FieldList.length; j++) {
                        if (DataObj[g_FieldList[j]] == '-9999.999') //无效值
                        {
                            obj[g_FieldList[j]] = '-';                    //获取字段年对于的值
                        }
                        else
                        {
                            obj[g_FieldList[j]] = DataObj[g_FieldList[j]];
                        }
                            
                    }

          
                    var date1 = new Date(DataObj.TT.replace(/\-/g, "\/"));
                    var date2 = new Date();     //结束时间
                    var date3 = date2.getTime() - date1.getTime();   //时间差的毫秒数    
                    //alert('当前时间：' + date2.getTime() + ' TT:' + date1.getTime() + ' 时间差：' + (date3 / 1000));
                    var temp = date3 / 1000;//转换为秒
                    if (temp > 6 * 3600 || temp < -6 * 3600) //时间相差6小时以上显示为异常
                    {
                        obj.STATUS = '异常';  //状态
                    }
                    else if (temp > 2 * 3600 || temp < -2 * 3600) //时间相差2小时以上显示为连接中
                    {
                        obj.STATUS = '连接中';  //状态
                    }
                    else
                    {
                        obj.STATUS = '正常';  //状态
                    }
                        
                    obj.TT = DataObj.TT;
                    obj.UT = DataObj.UT;
                }

                DeviceTableData[i] = obj;                    //添加对象到数组

            }
        }
    }
    catch (e) {
        layer.alert("处理数据发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }

    //alert(JSON.stringify(DeviceTableData, 4));        //调试显示信息
    return DeviceTableData;
}

//搜索符合条件的设备基础信息列表(DeviceListObj:所有的设备基础信息列表；Keyword:搜索关键字，设备名与昵称）
function search_user_list(DeviceListObj, Keyword)
{
    var obj = JSON.parse('[]');
    var count = 0;

    if(DeviceListObj==null || DeviceListObj.length == 0)
    {
        layer.alert("错误：列表为空，无法搜索！", { icon: 5, scrollbar: false }); //5：失败；6：成功
        return obj;
    }
    if (Keyword == null || Keyword.length == 0)
    {
        layer.alert("错误：请输入搜索关键字！", { icon: 5, scrollbar: false }); //5：失败；6：成功
        return obj;
    }

    try 
    {
        //搜索
        for(var i = 0;i < DeviceListObj.length;i ++)
        {
            if ((DeviceListObj[i].ST.indexOf(Keyword) >= 0) || (DeviceListObj[i].NAME.indexOf(Keyword) >= 0))
            {
                obj[count++] = DeviceListObj[i];  //找到了
                if(count >= 1000)
                {
                    layer.alert("搜索到超过1000个满足条件的数据，提前结束搜索，请修改搜索条件缩小范围！", { icon: 6, scrollbar: false }); //5：失败；6：成功
                    break;
                }
            }                    
        }
        if(count == 0) //没有搜索到满足条件的数据
        {
            layer.alert("没有搜索到满足条件的设备数据！", { icon: 5, scrollbar: false }); //5：失败；6：成功
        }
    } 
    catch (e) 
    {
        layer.alert("搜索发生了错误：" + e.message, { icon: 5, scrollbar: false }); //5：失败；6：成功
    }
 
    return obj;
}


//更新下载的原始数据中的要素信息-编辑要素数据子页面调用,更新到 g_DeviceRealData
function update_ess_data(ST, REAL_ESS)
{
    try
    {
        for(var i = 0;i < g_DeviceRealData.length;i ++)
        {
            if(g_DeviceRealData[i].ST == ST) //找到了，更新ESS
            {
                g_DeviceRealData[i].REAL_ESS = REAL_ESS;
                break;
            }
        }
    }
    catch (e)
    {

    }
}

  

//读取所有用户基本信息缓存
function Read_AllUsersDataCache()
{
    return g_AllUsersDataCache;   
}

//写入所有用户基本信息缓存
function Write_AllUsersDataCache(AllUsersData)
{
    g_AllUsersDataCache = AllUsersData;
}

//弹出加载框
function loading_message(str)
{
    g_layer_msg_index = layer.msg('加载中',
    {
        icon: 16
      , shade: 0.5 //越大界面越黑
        , time: 60000,//时间
        anim: 0, //平滑放大
        scrollbar: false//锁定浏览器滑动
    });
}

//关闭所有弹出
function close_message()
{
    layer.close(g_layer_msg_index);         //关闭提示框   
}




//跳转到登录界面
function JumpLogon() {
    parent.JumpLogon();
}
    

//初始化要素数据
function AllDeviceEssInit()
{
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
