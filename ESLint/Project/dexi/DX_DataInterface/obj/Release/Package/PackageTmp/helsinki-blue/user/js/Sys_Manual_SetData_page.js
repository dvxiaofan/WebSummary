
var g_RealDataObj = [];                 // 当前实时数据
var g_AllEssDataCache;                  // 所有要素数据列表-从父页面加载
var g_ThisST;                           // 当前设备ST
var g_ThisName;                         // 当前设备Name
var g_MyTree;

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

    // 初始化所有要素数据
    g_AllEssDataCache = AllDeviceEssInit(); 

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
}

// 延时加载数据，先加载左侧的站点列表
function DelayInitData() {
    SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME);   // 获取并显示当前选择的设备的数据
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

});

// 刷新某个站点数据
function SelectAndGetDeviceRealData(ST, NAME) {
    try {
        // 刷新站点编号与名称
        document.getElementById('lable_st_id').innerHTML = '编号：' + ST;
        document.getElementById('lable_name_id').innerHTML = '名称：' + NAME;

        // 获取设备的实时数据
        if (g_tree_config.LiData != null && g_tree_config.LiData.length > 0) {
            g_RealDataObj = ajaxSyncGetRealData(ST);

            // 显示到页面上
            conversion_data_layui_form(g_RealDataObj);
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

    g_ThisST = data_name;                               // 当前设备ST
    var str = text;
    str = str.substring(11, str.length);                // 截取后面的名称
    g_ThisNAME = str;                                   // 当前设备NAME
    // 延时先等等加载中...显示出来后再加载数据
    setTimeout(function () {
        SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME);   // 获取并显示当前选择的设备的数据

        close_message();                                    // 关闭提示框 
    }, 100);


}

// 处理设备的详情数据
function conversion_data_layui_form(DeviceRealData) {
    var deviceFormData = [];
    var cnt = 0;
    var essList = [];

    try {
        if (DeviceRealData == null || DeviceRealData.length == 0) {
            setInputData(deviceFormData, essList);
            return ;
        } 

        // 强制第一个为采集时间
        var obj = new Object();
        obj.ID = (cnt + 1) + '';
        obj.ESS = '采集时间'; // 获取要素名称
        obj.DATA = DeviceRealData[0]['TT']; // 获取字段年对于的值 
        obj.UINT = '';
        deviceFormData[cnt] = obj;
        essList[cnt] = 'TT';
        cnt++;

        // 遍历 json 对象的每个key/value对,p 为 key-获取要素数据 ESS_ASCII
        for (var p in DeviceRealData[0]) {
            
            if (p != 'ST' && p != 'TT' && p != 'UT' && p != null) {
                
                essList[cnt] = p; // 记录字段
                var obj = new Object();
                obj.ID = (cnt + 1) + '';
                obj.ESS = get_field_name(g_AllEssDataCache, p);     // 获取要素名称
                obj.DATA = DeviceRealData[0][p];                    // 获取字段对于的值
                obj.UINT = '(' + get_field_uint(g_AllEssDataCache, p) + ')';    // 获取要素单位
                deviceFormData[cnt] = obj;
                
                cnt++;
            }
        }

        setInputData(deviceFormData, essList);

    } catch (e) {
        
    }
}

// 设置新增数据输入框数据
function setInputData(deviceData, essList) {
    var $formEle = $('#layui_form_id');
    $formEle.empty();
    var form = layui.form;

    // 没有要素数据
    if (deviceData == null || deviceData.length == 0) {
        // $formEle.empty();
        $formEle.append(
            '<div style="line-height: 40px; margin-left: 35px; color: #999;">\
                当前设备无配置要素\
            </div>'
        );
        // 只有执行了这一步，部分表单元素才会自动修饰成功
        form.render('');
        return;
    }

    // 有数据 添加每一个元素和对应的输入框到页面中  
    $formEle.append(
        '<div class="layui-form-item">\
            <label class="layui-form-label">采集时间<span style="color: red;">*</span></label>\
            <div class="layui-input-inline">\
                <input type="text" name="TT" lay-verify="TT|required" class="layui-input" id="TT" placeholder="请选择数据采集时间">\
            </div>\
            <div class="layui-form-mid layui-word-aux"></div>\
        </div> '
    );

    for (let i = 1; i < deviceData.length; i++) {
        $formEle.append(
            '<div class="layui-form-item">\
                <label class="layui-form-label">' + deviceData[i].ESS + '<span style="color: red;">*</span></label>\
                <div class="layui-input-inline">\
                    <input type="text" name="' + essList[i] + '" lay-verify="' + essList[i] + '|required|number" class="layui-input" id="' + essList[i] + '" placeholder="请输入' + deviceData[i].ESS + '" value="0">\
                </div>\
                <div class="layui-form-mid layui-word-aux">' + deviceData[i].UINT + '</div>\
            </div> '
        );
    }

    // 添加按钮
    $formEle.append(
        '<div class="layui-form-item">\
            <div class="layui-input-block">\
                <button class="layui-btn" lay-submit="" lay-filter="submitBtn" style="background: #3E79BB; margin-right: 30px;">立即提交</button>\
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>\
            </div>\
        </div>'
    );

    // 表单事件
    formEvent();
    form.render();
}

// 表单事件
function formEvent() {
    layui.use(['form', 'laydate'], () => {
        var form = layui.form;
        var laydate = layui.laydate;
        // 日期
        laydate.render({
            elem: '#TT',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            theme: '#3E79BB'    // 颜色-蓝色
        });

        // 自定义验证规则
        form.verify({
            // num: value => {       // 水位数值验证
            //     if (!/^(\-|\+)?\d+(\.\d+)?$/.test(value)) {
            //         return '数值只能是正数、负数或者小数';
            //     }
            // }
        })

        // 表单提交事件
        form.on('submit(submitBtn)', data => {
            var deviceObj = data.field;

            var essList = [];
            var valList = [];

            for(var i in deviceObj) {
                essList.push(i);
                valList.push(deviceObj[i]);
            }
            // 移出第一个采集时间数据，因为需要单独一条
            essList.shift();
            valList.shift();

            var jsonData = {
                TT: deviceObj['TT'] + ':00',
                ST: g_ThisST,
                Ess_List: essList.join(','),
                Data_List: valList.join(',')
            }
            
            // 添加数据
            var editResult = manualSetData(jsonData);

            if (editResult) {
                layer.confirm('数据提交成功！', {
                    btn: ['确定'], 
                    icon: 6
                });
            }

            return false;
        });
    });
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
        }
        else {                          // 需要显示出来
            $('#left_panle_id').show();
            scrollDiv.setAttribute('data-user-flag', 1);                // 标志设置为1
            oDiv_Ico.className = 'fa fa-chevron-left fa-2x';
            oDiv.style.marginLeft = cg_tree_width + 'px';
        }
    }
    catch (e) {
        alert("错误：" + e.message);
    }
}

/* // 点击按钮刷新当前设备实时数据
function RefreshPage_onClick() {
    loading_message1('加载数据中...'); // 弹出提示框
    SelectAndGetDeviceRealData(g_ThisST, g_ThisNAME); // 获取并显示当前选择的设备的数据
    close_message(); // 关闭提示框 
}
 */