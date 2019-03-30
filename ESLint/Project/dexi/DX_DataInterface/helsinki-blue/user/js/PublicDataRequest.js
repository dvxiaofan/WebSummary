
// 获取当前设备的实时数据
function ajaxSyncGetRealData(st) {
    // 请求服务器
    var jsonData = {
        GetFun: 'GetDeviceRealData',
        ST_List: st,
    };
    // 请求数据并并返回
    return ajaxRequestData(jsonData, true);
}

//获取当前用户所有设备的基本信息-所有设备列表（ajax同步模式）
function ajaxSyncGetDeviceList() {
    // 请求服务器
    var jsonData = {
        GetFun: 'GetUserDeviceList',
    };
    // 请求数据并并返回
    return ajaxRequestData(jsonData, true);
}

//获取所有分组的基本信息-所有分组列表（ajax同步模式）
function ajaxSyncGetAllGroupList() {
    // 请求服务器
    var jsonData = {
        GetFun: 'GetUserGroupList',
    };
    // 请求数据并并返回
    return ajaxRequestData(jsonData, false);
}

// 异步获取所有的视频设备信息
function ajaxSyncGetVideoInfo() {
    // 请求服务器
    var jsonData = {
        GetFun: 'GetUserVideoList',
    };
    // 请求数据并并返回
    return ajaxRequestData(jsonData, true);
}

//获取当前设备的历史数据细信（历史） 有开始索引和读取条数限制
function ajaxSyncGetHistData(ST, StartTime, EndTime, isASC, StartIndex, ReadCnt) {
    // 请求服务器
    var jsonData = {
        GetFun: 'GetHistData',
        ST: ST,
        StartTime: StartTime, //YYYY-MM-DD hh:mm:ss格式
        EndTime: EndTime, //YYYY-MM-DD hh:mm:ss格式
        isASC: isASC,
        StartIndex: StartIndex,
        ReadCnt: ReadCnt,
    };
    // 请求数据并并返回
    return ajaxRequestData(jsonData, true);
}

//获取当前用户所有设备的基本信息-所有图片设备列表（ajax同步模式）
function ajaxSyncGetPicDeviceList() {
    // 请求服务器
    var jsonData = {
        GetFun: 'GetUserPicDeviceList'
    };
    // 请求数据并并返回
    return ajaxRequestData(jsonData, true);
}

//获取所有设备的基本信息-所有设备列表（ajax同步模式）
function ajaxSyncGetAllList() {
    var jsonData = {
        GetFun: 'GetAllDeviceList',
    };
    // 请求数据并并返回
    return ajaxRequestData(jsonData, true);
}

// 设备人工置数
function manualSetData(data) {
    var jsonData = {
        GetFun: 'ManualSetData',
        TT: data.TT,
        ST: data.ST,
        Ess_List: data.Ess_List,
        Data_List: data.Data_List
    };
    // 请求添加数据
    return requestAddData(jsonData);
}

// 请求设备管理页面设备详细信息
function getDeviceInfoList(serial_list) {
    var jsonData = {
        GetFun: 'GetDeviceInfoList',
        SERIAL_List: serial_list,
    };
    // 返回请求数据
    return ajaxRequestData(jsonData, true);
}

// 获取水电站详细信息
function getDeviceDetails(ST) { 
    var jsonData = {
        GetFun: 'GetDeviceDetails',
        ST: ST
    }
    // 返回请求数据
    return ajaxRequestData(jsonData, true);
}

// 上传水电站详细信息
function setDeviceDetails(data) {
    var jsonData = {
        GetFun: 'EditDeviceDetails',
        ST: data.ST,
        DETAILS: data.DETAILS
    }
    // 请求添加数据
    return requestAddData(jsonData);
}

// 获取当前设备的历史数据条数
function p_ajaxGetHistDataCount(st, startTime, endTime, isASC) {
    let jsonData = {
        GetFun: 'GetHistDataInfo',
        ST: st,
        StartTime: startTime, // YYYY-MM-DD hh:mm:ss格式
        EndTime: endTime, // YYYY-MM-DD hh:mm:ss格式
        isASC: isASC,
    };

    return ajaxRequestData(jsonData, false);
}



// 通用请求数据方法
function ajaxRequestData(jsonData, isShowTips) {
    var obj;
    var resObj = new Object(); 
    
    try {
        $.ajax({
                url: '/Home/Index',
                type: 'POST',
                dataType: 'json',
                async: false, // 同步执行
                data: jsonData,
            })
            .done(function (response) {

                if (response.rel == 1) { // 获取成功
                    if (response.obj == null || response.obj <= 0) { // 没有数据
                        if (isShowTips == true) {
                            layer.alert("没有获取到数据！", {
                                icon: 5,
                                scrollbar: false
                            }); // 5：失败；6：成功
                        }
                    } else {
                        obj = JSON.parse(response.obj);
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
                obj=null;
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

// 通用请求添加数据方法
function requestAddData(jsonData) {
    var sta = 0;

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
            // layer.alert('提交成功！')
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










