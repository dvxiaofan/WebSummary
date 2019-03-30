var g_info;
//用于记录编辑之前的信息，用于对比查看是否修改了信息
var g_LastInfo = {
    ST: '',
    NAME: '',
    ADDRESS: '',
    TEL: '',
    LONG: '',
    LAT: '',
    REMARKS: '',
};


//初始化加载执行
window.onload = function () { //要执行的js代码段  
    //获取编辑或新建设备信息
    g_info = parent.GetEditUserInfo();
    if (g_info == null) {
        layer.alert("无效的参数！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
    } else {
        if (g_info.isEdit == true) //编辑设备
        {
            //将之前对象拷贝一份
            g_LastInfo.ST = g_info.ST;
            g_LastInfo.NAME = g_info.NAME;
            g_LastInfo.ADDRESS = g_info.ADDRESS;
            g_LastInfo.TEL = g_info.TEL;
            g_LastInfo.LONG = g_info.LONG;
            g_LastInfo.LAT = g_info.LAT;
            g_LastInfo.REMARKS = g_info.REMARKS;

            //alert('g_info.REMARKS:' + g_info.REMARKS);
            $("#input_number_id").attr("readOnly", "true"); //编号只读
            //初始化显示信息
            document.getElementById("input_number_id").value = g_info.ST;
            document.getElementById("input_name_id").value = g_info.NAME;
            document.getElementById("input_addr_id").value = g_info.ADDRESS;
            document.getElementById("input_sim_id").value = g_info.TEL;
            document.getElementById("input_long_id").value = g_info.LONG;
            document.getElementById("input_lat_id").value = g_info.LAT;
            document.getElementById("input_remarks_id").value = g_info.REMARKS;


        } else //新建，无需初始化显示
        {

        }
    }
}

// 验证是否含有特殊字符
function check_other_char(str) {
    var arr = ["&", "\\", "/", "*", ">", "<", "-", "!", "\"", "\'", " "];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < str.length; j++) {
            if (arr[i] == str.charAt(j)) {
                return true;
            }
        }
    }
    return false;
}

//检查是否有非数字
function check_other_number(str) {
    for (var i = 0; i < str.length; i++) {
        if (str[i] < '0' || str[i] > '9') {
            return true;
        }
    }
    return false;
}


//检查输入的内容是否合法
function check_input_data() {
    var str;

    //检查编号
    str = document.getElementById("input_number_id").value;
    if (str == null || str.length != 10) {
        layer.alert("编号必须为10位数字！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
        document.getElementById("useinput_number_idrname").focus(); //激活焦点
        return false;
    }
    if (check_other_number(str) == true) {
        layer.alert("编号必须为数字！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
        document.getElementById("useinput_number_idrname").focus(); //激活焦点
        return false;
    }


    //检查名称
    str = document.getElementById("input_name_id").value;
    if (str == null || str.length < 2 || str.length > 64) {
        document.getElementById("input_name_id").focus(); //激活焦点
        layer.alert("名称长度限制2-64个字符！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
        return false;
    }
    if (check_other_char(str) == true) {
        document.getElementById("input_name_id").focus(); //激活焦点
        layer.alert("名称不能含有特殊字符！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
        return false;
    }

    //检查地址
    str = document.getElementById("input_addr_id").value;
    if (str == null || str.length < 1 || str.length > 64) {
        layer.alert("地址限制1-64个字符！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
        document.getElementById("input_addr_id").focus(); //激活焦点
        return false;
    }

    //检查SIM卡号
    str = document.getElementById("input_sim_id").value;
    if (str != null && str.length > 0) {
        if (str.length < 6 || str.length > 16) {
            layer.alert("SIM卡号码长度限制6-16个数字！", {
                icon: 5,
                scrollbar: false
            }); //5：失败；6：成功
            document.getElementById("input_sim_id").focus(); //激活焦点
            return false;
        }
        if (check_other_number(str) == true) {
            layer.alert("SIM卡号必须为数字！", {
                icon: 5,
                scrollbar: false
            }); //5：失败；6：成功
            document.getElementById("input_sim_id").focus(); //激活焦点
            return false;
        }
    }

    //检查经度
    str = document.getElementById("input_long_id").value;
    if (str != null && str.length > 0) {
        if (str.length > 10) {
            layer.alert("经度长度不能超过10位数字(含符号)！", {
                icon: 5,
                scrollbar: false
            }); //5：失败；6：成功
            document.getElementById("input_long_id").focus(); //激活焦点
            return false;
        }
        //检查经度范围正负180°
        var result = parseFloat(str);
        if (result < -180 || result > 180) {
            layer.alert("经度限制±180度！", {
                icon: 5,
                scrollbar: false
            }); //5：失败；6：成功
            document.getElementById("input_long_id").focus(); //激活焦点
            return false;
        }
    }

    //检查纬度
    str = document.getElementById("input_lat_id").value;
    if (str != null && str.length > 0) {
        if (str.length > 10) {
            layer.alert("纬度长度不能超过10位数字(含符号)！", {
                icon: 5,
                scrollbar: false
            }); //5：失败；6：成功
            document.getElementById("input_lat_id").focus(); //激活焦点
            return false;
        }
        //检查纬度范围正负90°
        var result = parseFloat(str);
        if (result < -90 || result > 90) {
            layer.alert("纬度限制±90度！", {
                icon: 5,
                scrollbar: false
            }); //5：失败；6：成功
            document.getElementById("input_lat_id").focus(); //激活焦点
            return false;
        }
    }

    //检查备注信息
    str = document.getElementById("input_remarks_id").value;
    if (str != null && str.length > 0) {
        if (str.length < 1 || str.length > 64) {
            layer.alert("备注信息限制1-64个字符！", {
                icon: 5,
                scrollbar: false
            }); //5：失败；6：成功
            document.getElementById("input_remarks_id").focus(); //激活焦点
            return false;
        }
    }
    return true;
}


//确定按钮
function button_ok_onclick() {
    if (g_info == null) {
        layer.alert("无效的参数,无法完成请求的操作！", {
            icon: 5,
            scrollbar: false
        }); //5：失败；6：成功
    }
    if (g_info.isEdit == true) //当前请求编辑设备信息
    {

        //比较是否发生了修改
        if (
            document.getElementById("input_number_id").value != g_LastInfo.ST ||
            document.getElementById("input_name_id").value != g_LastInfo.NAME ||
            document.getElementById("input_addr_id").value != g_LastInfo.ADDRESS ||
            document.getElementById("input_sim_id").value != g_LastInfo.TEL ||
            document.getElementById("input_long_id").value != g_LastInfo.LONG ||
            document.getElementById("input_lat_id").value != g_LastInfo.LAT ||
            (document.getElementById("input_remarks_id").value != g_LastInfo.REMARKS && document.getElementById("input_remarks_id").value != '')) {
            //发生了修改
        } else //没有发生过修改
        {

            parent.CloseLayer(); //关闭页面
            return true; //无需修改
        }

        //alert(document.getElementById("input_remarks_id").value + "->" + g_LastInfo.REMARKS);

        if (check_input_data() == true) //设备信息合法
        {
            if (EditDeviceBasicInfo(
                    document.getElementById("input_number_id").value,
                    document.getElementById("input_name_id").value,
                    document.getElementById("input_addr_id").value,
                    document.getElementById("input_sim_id").value,
                    document.getElementById("input_long_id").value,
                    document.getElementById("input_lat_id").value,
                    document.getElementById("input_remarks_id").value) == true) {

                parent.UpdateUser(
                    document.getElementById("input_number_id").value,
                    document.getElementById("input_name_id").value,
                    document.getElementById("input_addr_id").value,
                    document.getElementById("input_sim_id").value,
                    document.getElementById("input_long_id").value,
                    document.getElementById("input_lat_id").value,
                    document.getElementById("input_remarks_id").value
                ); //刷新数据
                //修改成功了，请求父页面接口添加相应的数据到本地缓冲区
                //询问框
                layer.confirm('编辑设备信息成功！', {
                    btn: ['确定'], //按钮
                    icon: 6
                }, function () {
                    parent.CloseLayer(); //关闭页面
                });
            }
        }
    } else //当前请求添加设备
    {
        if (check_input_data() == true) //设备信息合法
        {
            if (AddDevice(
                    document.getElementById("input_number_id").value,
                    document.getElementById("input_name_id").value,
                    document.getElementById("input_addr_id").value,
                    document.getElementById("input_sim_id").value,
                    document.getElementById("input_long_id").value,
                    document.getElementById("input_lat_id").value,
                    document.getElementById("input_remarks_id").value) == true) {

                parent.RefreshDeviceData(); //刷新数据
                //设备添加成功了，请求父页面接口添加相应的数据到本地缓冲区
                //询问框
                layer.confirm('添加设备成功！', {
                    btn: ['确定'], //按钮
                    icon: 6
                }, function () {

                    parent.CloseLayer(); //关闭页面
                });
            }
        }
    }
}
//取消按钮处理
function button_cancel_onclick() {
    parent.CloseLayer();
}

//请求添加设备(需要自己检查输入的数据合法性)
function AddDevice(ST, NAME, ADDRESS, TEL, LONG, LAT, REMARKS) {
    var sta = 0;
    //请求服务器进行登录
    var jsonData = {
        GetFun: 'AddDevice',
        ST: ST,
        NAME: NAME,
        ADDRESS: ADDRESS,
        TEL: TEL,
        LONG: LONG,
        LAT: LAT,
        REMARKS: REMARKS,
    };


    $.ajax({
            url: '/Home/Index',
            type: 'POST',
            dataType: 'json',
            async: false, //同步模式，等待结果再返回
            data: jsonData,
        })
        .done(function (response) {
            if (response.rel == 1) { //成功
                sta = 1;
            } else if (response.rel == 0) {
                layer.alert(response.msg, {
                    icon: 5,
                    scrollbar: false
                }); //5：失败；6：成功
            } else if (response.rel == -1) //需要登录
            {
                layer.alert(response.msg, {
                    icon: 5,
                    scrollbar: false
                }); //5：失败；6：成功
                parent.JumpLogon();
            } else {
                layer.alert('未知错误！', {
                    icon: 5,
                    scrollbar: false
                }); //5：失败；6：成功
            }
        })
        .fail(function () {
            layer.alert('通信错误，请求数据失败！', {
                icon: 5,
                scrollbar: false
            }); //5：失败；6：成功
        })
    if (sta == 1) return true;

    return false;
}



//请求编辑信息(需要自己检查输入的数据合法性)
function EditDeviceBasicInfo(ST, NAME, ADDRESS, TEL, LONG, LAT, REMARKS) {
    var sta = 0;

    //请求服务器进行登录
    var jsonData = {
        GetFun: 'EditDeviceBasicInfo',
        ST: ST,
        NAME: NAME,
        ADDRESS: ADDRESS,
        TEL: TEL,
        LONG: LONG,
        LAT: LAT,
        REMARKS: REMARKS,
    };


    $.ajax({
            url: '/Home/Index',
            type: 'POST',
            dataType: 'json',
            async: false, //同步模式，等待结果再返回
            data: jsonData,
        })
        .done(function (response) {
            if (response.rel == 1) { //成功
                sta = 1;
            } else if (response.rel == 0) {
                layer.alert(response.msg, {
                    icon: 5,
                    scrollbar: false
                }); //5：失败；6：成功
            } else if (response.rel == -1) //需要登录
            {
                layer.alert(response.msg, {
                    icon: 5,
                    scrollbar: false
                }); //5：失败；6：成功
                parent.JumpLogon();
            } else {
                layer.alert('未知错误！', {
                    icon: 5,
                    scrollbar: false
                }); //5：失败；6：成功
            }
        })
        .fail(function () {
            layer.alert('通信错误，请求数据失败！', {
                icon: 5,
                scrollbar: false
            }); //5：失败；6：成功
        })
    if (sta == 1) return true;

    return false;
}
