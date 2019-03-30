;//相关ajax通信请求


//获取一个设备的报警配置数据
function ajax_sync_get_device_alarm_data(ST) {
    var obj = JSON.parse('[]');
    var cnt = 0;

    try {
        if (ST == null) {
            layer.alert("要获取的设备列表为空！", { icon: 5, scrollbar: false });      //5：失败；6：成功

            return null;
        }



        //请求服务器
        var jsonData = {
            GetFun: 'GetDeviceAlarmConfigForST',
            ST_List: ST,
        };


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

    if (obj != null && obj.length == 1) {
        if (obj[0] != null) {
            try {
                return JSON.parse(obj[0].A_CONFIG);  //转换为对象
            }
            catch (e) {

            }
        }
    }
    return null;
}