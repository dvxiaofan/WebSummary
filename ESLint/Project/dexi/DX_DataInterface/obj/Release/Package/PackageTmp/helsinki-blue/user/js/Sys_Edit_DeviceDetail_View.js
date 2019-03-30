let g_info;             //用于记录编辑之前的信息，用于对比查看是否修改了信息
let g_ThisST;           // 保存设备ST
let g_oldJsonDetail;    // 原有设备数据的json格式


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
        g_ThisST = g_info.ST;
        // 获取设备详细数据
        let details = getDeviceDetails(g_ThisST);
        // 保存json格式数据，便于提交新数据时对比
        g_oldJsonDetail = details[0].DETAILS;
        
        // 如果当前设备没有详细数据，则直接返回
        if (g_oldJsonDetail == null) return;

        // json 数据转成对象
        let detailsData = JSON.parse(g_oldJsonDetail);
        // 给输入框赋值
        setInitData(detailsData);
    }
}

// 设置输入框的值
function setInitData(detailsData) {
    let form = layui.form;

    //表单初始赋值
    form.val('layui-form', {
        "deviceName": detailsData.deviceName, 
        "area": detailsData.area,
        "principal": detailsData.principal,
        "mobilePhone": detailsData.mobilePhone,
        "fixedPhone": detailsData.fixedPhone,
        "address": detailsData.address,
        "total": detailsData.total,
        "damHeight": detailsData.damHeight,
        "capacity": detailsData.capacity,
        "deviceType": detailsData.deviceType,
        "watershed": detailsData.watershed,
        "deviceCount": detailsData.deviceCount,
        "heightLevel": detailsData.heightLevel,
        "lowLevel": detailsData.lowLevel,
    })

    form.render();
}

// layui 事件
layui.use(['form'], function () {
    let form = layui.form;

    // 验证是否含有特殊字符
    let charPattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    // 验证数值正则
    let numPattern = /^(\-|\+)?\d+(\.\d+)?$/;
    // 验证手机号正则
    let mobilePattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;

    //自定义验证
    form.verify({
        noChars: value => {
            if(charPattern.test(value)) return '不能含有特殊字符！';
        },
        textLength: value => {
            if(value.length > 64) return '文字长度限制2-64个字符！';
        },
        num: value => {
            if (!numPattern.test(value)) return '数值不能是非数字!';
        },
        mobilePhone: value => {
            if (value.length == 0) return;
            if (!mobilePattern.test(value)) return '手机格式不正确！';
        },
    });

    //监听提交
    form.on('submit(demo1)', function (data) {

        // 添加type字段， 默认为 0
        data.field.TYPE = "0";

        let dataObj = data.field;
        // 处理数据两头的空格
        for (const i in dataObj) dataObj[i] = dataObj[i].trim();

        // 数据转成json格式
        let newJsonData = JSON.stringify(data.field)

        let newDetails = {
            ST: g_ThisST,
            DETAILS: newJsonData
        }

        // 判断是否发生修改
        const result = eq(g_oldJsonDetail, newJsonData);

        // 如果数据未发生改变， 则关闭编辑窗口
        if (result) {
            parent.CloseLayer();
            return true;
        }
        
        // 设置详细信息
        let editResult = setDeviceDetails(newDetails);

        // 提交成功，弹窗提示并关闭编辑窗口
        if (editResult) {
            layer.confirm('信息编辑成功！', {
                btn: ['确定'], 
                icon: 6
            }, () => parent.CloseLayer());
        }

        return false;
    });

});

//取消按钮处理
function button_cancel_onclick() {
    parent.CloseLayer();
}
