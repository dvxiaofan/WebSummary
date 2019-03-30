//index主页面相关js代码
var g_UserInfoObj = null;       //当前登录的用户信息
var g_table_id_cnt = 1;         //tab标签 第0个固定为主页，每开启一次增长一次
var g_table_ul_cnt = 1;         //tab标签数量，新建一个+1，删除一个-1，默认为1个
var g_table_ul_offset = 96;     //ul最大偏移为96
var g_table_ul_width = 80;       //ul列表当前宽度-默认打开了一个标签
var g_left_right_butt_width = 50;//左右按钮宽度


//获取用户信息
function GetUserInfo() {
    //请求服务器进行登录
    var jsonData = {
        GetFun: 'GetLoginStatus',
    };
    
    $.ajax({
        url: '/Home/Login',
        type: 'POST',
        dataType: 'json',
        data: jsonData,
    })
    .done(function (response) {
        if (response.rel == 1) { //获取成功
            g_UserInfoObj = JSON.parse(response.obj);      //全局缓存用户信息
            //alert(JSON.stringify(response.obj, 4));       //调试显示信息
            //更新主界面用户信息
            var info = g_UserInfoObj[0];
            //显示用户信息             
            var NickName = new String(info.NICK_NAME); //获取用户昵称

            if (NickName == null) NickName = "未命名的用户";
            if (NickName.length > 20) //限制长度
            {
                NickName = NickName.substr(0, 20);
                NickName += "...";
            }

            if (IsPC()) {


            } else { //移动端
                window.location.href = "../Home/Mobile_Index";
                return;
            }


            document.getElementById('nickname_id').innerHTML = NickName;//用户昵称
            user_ShowNotice('登录成功', NickName+' 您好，欢迎登录！', 'success', 1500, false);
            if (info.ROLE == 64) //普通用户
            {
                document.getElementById('user_type_id').innerHTML = '普通用户';
            }
            else if (info.ROLE == 256) //管理员
            {
                document.getElementById('user_type_id').innerHTML = '管理员';
            }
            else {
                document.getElementById('user_type_id').innerHTML = '未知类型';
            }
        }
        else if (response.rel == -1) //需要登录
        {
            layer.alert(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
            parent.JumpLogon();
        }
        else if (response.msg != null) {
            user_message('sign_out_message_id', '登录失败', response.msg, 'default', 'error', null, null);
        }
        else {
            user_message('sign_out_message_id', '登录失败', '出现未知的错误，登录请求失败！', 'default', 'warning', null, null);
        }

    })
    .fail(function () {
        
        user_message('sign_out_message_id', '登录失败', '发送登录请求失败，请检查服务器连接状态！', 'default', 'warning', null, null);
        return;
    })
}

//获取用户菜单
function GetUserMenu() {
    //请求服务器进行登录
    var jsonData = {
        GetFun: 'GetUserInfo',
    };

    $.ajax({
        url: '/Home/Index',
        type: 'POST',
        dataType: 'json',
        data: jsonData,
    })
    .done(function (response) {
        if (response.rel == 1) { //获取成功

            if (response.obj != null) {
                var html = response.obj;
                //html = html.replace(/\"/g, '\\\"');
                // alert(html, 4);   //调试显示信息
                //document.getElementById('user_main_menu_id').innerHTML = html;//显示菜单

                $("#main-nav").append(html);  // 用append 方式添加拼接的标签

                $("#main-nav").trigger("create");  //必须调用重新刷新样式
                button_on_click('li_home_1_id', 'li_home_id');  //打开第一个界面

                return;
            }
        }
        else if (response.rel == -1) //需要登录
        {
            layer.alert(response.msg, { icon: 5, scrollbar: false }); //5：失败；6：成功
            parent.JumpLogon();
        }
        document.getElementById('user_main_menu_id').innerHTML = '菜单加载失败';//显示菜单
    })
    .fail(function () {
        document.getElementById('user_main_menu_id').innerHTML = '菜单加载失败';//显示菜单
    })
}

//获取缓存的用户信息
function GetUserInfoCache() {
    return g_UserInfoObj;
}
//查看用户信息-右上角图标
function button_user_info_click() {
    button_on_click('li_manage_1_id', 'li_manage_id');
}

//退出登录按钮处理
function button_exit_click() {
    user_message('sign_out_message_id', '警告', '确定退出吗?', 'default', 'warning', 'ExitLogin', null);
}

//请求退出
function ExitLogin() {
    //请求服务器进行登录
    var jsonData = {
        GetFun: 'LogoutLogin',
    };

    $.ajax({
        url: '/Home/Index',
        type: 'POST',
        dataType: 'json',
        data: jsonData,
    })
    .done(function (response) {
        if (response.rel == 1) { //退出成功
            window.location.href = "/Home/Login"
        }
        else {
            user_message('sign_out_message_id', '退出登录失败', '出现未知的错误，登录请求失败！', 'default', 'warning', null, null);
        }

    })
    .fail(function () {

        user_message('sign_out_message_id', '退出登录失败', '发送登录请求失败，请检查服务器连接状态！', 'default', 'warning', null, null);
        return;
    })
}

//删除一个标签
function deleteTab(id) {
    alert('删除标签页');
}


/*****************************************************************************************************/


//获取最后面一个标签的x坐标偏移，如果大于父div，则认为右侧溢出
function get_end_li_offset() {
    var arr = document.querySelectorAll("#user_tabs_id li");            //循环所有的 li
   
    if (arr == null || arr.length == 0) return 0;

    var temp = arr[arr.length - 1].offsetLeft - g_table_ul_offset + arr[arr.length - 1].clientWidth;   //-96是减掉前面2个按钮占用的位置
   // alert('最后标签偏移：' + temp);
    return temp;
}

//tab相关操作
//激活某一个tab，会取消掉其他的
function active_tab(id_num) {
    try {
        $('#user_tabs_id a[href=\#tab_href_' + id_num + ']').tab('show');

        //
        var li = document.getElementById('tab_li_id_' + id_num);
        var Content = document.getElementById('main_content_id');
        //alert('坐标：' + (li.offsetLeft - 96) + '  宽度：' + li.clientWidth + '  总宽度：' + (Content.clientWidth - 96));
        var offset = (li.offsetLeft - 96 + li.clientWidth) - (Content.clientWidth - 96);
        if(offset > 0) //超出了范围
        {
            g_table_ul_offset -= offset;
            var div = document.getElementById('tab_ul_div_id');

            div.style['margin-left'] = g_table_ul_offset + 'px';
 

        }
        
    } catch (e) {

    }
}

//获取当前标签前面的标签宽度
function get_left_ul_width(this_li_id)
{
    var width = 0;
    try {
        //循环所有的 li
        var arr = document.querySelectorAll("#user_tabs_id li");
        for (var i = 0; i < arr.length; i++) {
            //alert("id：" + arr[i].id + ' 宽度：' + arr[i].clientWidth);
            if (arr[i].id == this_li_id) //找到了，直接激活 name:存放URL
            {
                //alert("前面标签宽度：" + width);
                return width;
            }
            else
            {
                width += arr[i].clientWidth;    //加上前面的宽度
            }
        }
    } catch (e) {

    }

    return 0;
}


//获取当前激活的标签信息
function get_active_li_info() {
    var obj = new Object();
    var offset = 0;

    obj.offset = 0; //当前标签偏移
    obj.width = 0;  //当前标签宽度
    obj.index = 0;  //当前标签索引
    obj.id = '';    //当前标签id
    obj.obj = null; //当前标签对象
    try {
        //循环所有的 li
        var arr = document.querySelectorAll("#user_tabs_id li");
        for (var i = 0; i < arr.length; i++) {
            //alert("id：" + arr[i].id + ' 宽度：' + arr[i].clientWidth);
            var ClassName = arr[i].className; //获取class
            //alert(JSON.stringify(isClass, 4));     //调试显示信息
            if (ClassName != null && ClassName == 'active')
            {
                //alert("id：" + arr[i].id + ' 宽度：' + arr[i].clientWidth);
                //alert("前面标签宽度：" + width);

                obj.offset = offset; //当前标签偏移
                obj.width = arr[i].clientWidth;  //当前标签宽度
                obj.index = i;  //当前标签索引
                obj.id = arr[i].id;    //当前标签id
                obj.obj = arr[i]; //当前标签对象
                return obj;
            }

            offset += arr[i].clientWidth;    //加上前面的宽度
        }
    } catch (e) {

    }

    return obj;
}


//增加一个标签页-先判断页面是否打开过，如果打开过则直接激活之前打开的页面
function user_add_tabs(id, value, isDeleteButton, isActive, iframe_scr) {
    // var TabHtml = "<li id=\"tab_li_id_" + id + "\"><a href=\"#tab_href_" + id + "\" data-toggle=\"tab\"><i class=\"fa fa-file-o\" aria-hidden=\"true\">&nbsp</i>页面n<i>&nbsp</i><i id=\"delete_tab_id_" + id + "\" class=\"fa fa-times glyphicon-remove-sign\" onclick=\"deleteTab(this.id)\"></i> </a></li>";
    //带删除的
    var TabHtml1 = "<a href=\"#tab_href_" + id + "\" data-toggle=\"tab\" style=\"color:#000000;\"><i class=\"fa fa-file-o\" aria-hidden=\"true\">&nbsp</i>" + value + "<i>&nbsp</i><i id=\"delete_tab_id_" + id + "\" class=\"fa fa-times glyphicon-remove-sign\" onclick=\"user_delete_tabs(" + id + ")\"></i> </a>";
    //不带删除的
    var TabHtml2 = "<a href=\"#tab_href_" + id + "\" data-toggle=\"tab\" style=\"color:#000000;\"><i class=\"fa fa-file-o\" aria-hidden=\"true\">&nbsp</i>" + value + "</a>";
    //tab对应的页面div
    var DivHtml1 = "<div class=\"tab-pane fade in \" id=\"tab_href_" + id + "\"  style=\"height:100%;width:100%\"><iframe id=\"iframe_id_" + id + "\" src=\"" + iframe_scr + "\" name=\"" + iframe_scr + "\"style=\"height:inherit;width:100%;\" frameborder=0 ></iframe></div>";
    //循环所有的 iframe
    var arr = document.querySelectorAll("#tab_content_id iframe");

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == iframe_scr) //找到了，直接激活 name:存放URL
        {
            var str = arr[i].id;        //去掉前面的9个字符，只要后面的数字
            active_tab(str.substr(10)); //激活
            //alert('坐标：'+arr[i].offsetLeft);

            RefreshTabWidth();  //刷新标签页宽度
            return;
        }
    }
    //active -激活选中属性

    //先添加标签
    var ul = document.getElementById('user_tabs_id');
    //添加 li
    var li = document.createElement("li");
    //设置 li 属性，如 id
    li.setAttribute("id", "tab_li_id_" + id);
    //设置 li 属性，如 class
    li.setAttribute("style", "word-break:keep-all;");


    

    if (isDeleteButton == true) //需要删除按钮
    {
        li.innerHTML = TabHtml1;
    }
    else //不带删除按钮
    {
        li.innerHTML = TabHtml2;
    }
    ul.appendChild(li);

    //再添加标签对应的tab页面div
    $('#tab_content_id').append(DivHtml1);
    
    
    g_table_ul_width += (document.getElementById("tab_li_id_" + id).clientWidth);//获取当前添加的标签宽度
    

    if (isActive)   //需要激活
    {
        active_tab(id);
    }
    g_table_ul_cnt++;   ///标签数量增加

    RefreshTabWidth();  //刷新标签页宽度

    // 获取已激活的标签页的名称
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        //var activeTab = $(e.target).text();
        //alert('adsfasdfdasdfa');
        RefreshTabWidth();  //刷新标签页宽度
    });
    //alert("当前索引：" + get_active_tab_index());
}

//删除一个标签页-如果当前页面为激活状态，删除后激活前面一个页面-
function user_delete_tabs(id_num) {

    var li = $("li.active").attr('id');
    var str;
    if (li == ("tab_li_id_" + id_num)) { //当前处于选中状态
        li = $("#tab_href_" + id_num).prev(); //找到前面的集合
        if (li != null && li.length > 0) {
            str = li[0].id.substr(9); //获取id,id无效跳转到主页
            if (str != null)//非空
            {

            }
            else {
                str = '0';
            }
            //要先删除，再激活，否则可能会有问题
            $("#tab_li_id_" + id_num).remove();
            $("#tab_href_" + id_num).remove();

            g_table_ul_cnt--;   ///标签数量减少
            active_tab(str);    //激活
            RefreshTabWidth();  //刷新标签页宽度

            return;
        }
    }

   

    $("#tab_li_id_" + id_num).remove();
    $("#tab_href_" + id_num).remove();

    g_table_ul_cnt--;   ///标签数量减少
    RefreshTabWidth();  //刷新标签页宽度
}


//左移动
function user_left_tabs() {
    try {
        //循环所有的 li
        var arr = document.querySelectorAll("#user_tabs_id li");
        for (var i = 0; i < arr.length; i++) {
            //alert("id：" + arr[i].id + ' 宽度：' + arr[i].clientWidth);
            if (arr[i].className == 'active') //找到了，激活的标签
            {
                if (i == 0) return;
                var id_num = parseInt(arr[i - 1].id.substring(10), 10);
                $('#user_tabs_id a[href=\#tab_href_' + id_num + ']').tab('show');
                break;
            }
        }
    } catch (e) {

    }
}

//右移动
function user_right_tabs() {
    try {
        //循环所有的 li
        var arr = document.querySelectorAll("#user_tabs_id li");
        for (var i = 0; i < arr.length; i++) {
            //alert("id：" + arr[i].id + ' 宽度：' + arr[i].clientWidth);
            if (arr[i].className == 'active') //找到了，激活的标签
            {
                if (i == (arr.length-1)) return;
                var id_num = parseInt(arr[i + 1].id.substring(10),10);
                $('#user_tabs_id a[href=\#tab_href_' + id_num + ']').tab('show');
                break;
            }
        }
    } catch (e) {

    }
}
/*****************************************************************************************************/








