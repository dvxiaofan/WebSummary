// 左侧设备分组列表-设备与分组列表

let gAllDeviceList; // 所有设备列表基本数据
let gSearchDeviceList; // 符合搜索条件的设备信息
let gisSearchMode = false; // 是否处于搜索模式
let gAllGroupList; // 所有的分组列表
const gTreeWidth = 253;

const gTreeConfig = {
    id: 'panel_id_1', // 容器id
    ParentData: treeParentData, // 父标签数据源
    LiData: treeParentData, // 子列表数据源
    SelectionEvent: null, // 选择某一项后回调
};

// 父标签
const treeParentData = [{
    ParentNodeId: 1,
    NodeName: '1',
    NodeText: '分组1',
}];

// 自动调整列表宽度，用于初始化时延时200ms再调整宽度，防止有时候页面没有渲染完成，导致获取的长度为0
/* function DelayAutoWidth() {
    //自动宽度
    let oDiv = document.getElementById('panel_content_di_1');
    let fDiv = document.getElementById('panel_id_1'); //父div

    let width = (oDiv.scrollWidth + 20);

    //alert(fDiv.scrollWidth + ' ' + fDiv.offsetWidth);

    if (width < fDiv.scrollWidth) width = fDiv.scrollWidth;

    oDiv.style.width = width + 'px';

}*/


/**
 *
 * @param {*} GroupList
 * @param {*} DeviceGroup
 * @return {*}
 */
function FindDeviceGroupIndex(GroupList, DeviceGroup) {
    try {
        if (GroupList == null || GroupList.length == 0 || DeviceGroup == null) return 0;
        for (let i = 0; i < GroupList.length; i++) {
            if (GroupList[i].GROUP == DeviceGroup) return i + 1;
        }
    } catch (e) {

    }

    return 0;
}

/**
 * 将原始数据转换为能被tree显示的数据-正常显示时调用
 * @param {*} GroupList
 * @param {*} DeviceList
 * @param {*} SelectIndex
 * @return {*}
 */
function ConversionDataTreeNode(GroupList, DeviceList, SelectIndex) {
    const ObjArr = [
        [],
        [],
    ]; // 0：父标签数据；1：子标签数据
    let GroupDeviceCount; // 记录每个分组的设备数量
    let GroupCount = 0; // 分组数量-永远都有一个默认分组
    let temp;

    try {
        // 先生成父标签
        // 默认分组
        ObjArr[0][0] = {
            ParentNodeId: 0,
            NodeName: '0',
            NodeText: '默认分组',
        };
        if (GroupList == null || GroupList.length == 0) // 没有分组
        {
            GroupCount = 1;
        } else {
            for (let i = 0; i < GroupList.length; i++) {
                const obj = new Object;
                obj.ParentNodeId = i + 1;
                obj.NodeName = (i + 1) + '';
                obj.NodeText = GroupList[i].GROUP;
                obj.expansion = true; // 展开

                ObjArr[0][i + 1] = obj;
            }
            GroupCount = GroupList.length + 1;
        }
        GroupDeviceCount = new Array(GroupCount); // 分组设备记录初始化
        for (let i = 0; i < GroupCount; i++) {
            GroupDeviceCount[i] = 0;
        }

        // 子标签
        if (DeviceList == null || DeviceList.length == 0) {
            return ObjArr;
        }
        for (let i = 0; i < DeviceList.length; i++) {
            const obj = new Object;
            temp = FindDeviceGroupIndex(GroupList, DeviceList[i].GROUP); // 获取分组id-父标签id
            obj.ParentNodeId = temp;
            obj.NodeName = DeviceList[i].ST;
            obj.NodeText = DeviceList[i].ST + ' ' + DeviceList[i].NAME;
            obj.Select = false;

            ObjArr[1][i] = obj;

            // 记录每个分组设备数量
            GroupDeviceCount[temp]++; // 对应分组设备数量+1
        }

        for (let i = 0; i < ObjArr[0].length; i++) {
            ObjArr[0][i].NodeText += '(' + GroupDeviceCount[i] + ')'; // 在父标签后面加上分组设备数量
        }
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }

    if (SelectIndex >= 0 && SelectIndex < ObjArr.length) {
        ObjArr[1][SelectIndex].Select = true; // 默认选择项目
    }

    return ObjArr;
}

// 将原始数据转换为能被tree显示的数据-搜索时调用
function ConversionDataTreeNode_search(DeviceList, SelectIndex) {
    const ObjArr = [
        [],
        [],
    ]; // 0：父标签数据；1：子标签数据

    try {
        // 先生成父标签
        // 默认分组
        ObjArr[0][0] = {
            ParentNodeId: 0,
            NodeName: '0',
            NodeText: '搜索设备(' + DeviceList.length + ')',
        };

        // 子标签
        if (DeviceList == null || DeviceList.length == 0) {
            return ObjArr;
        }
        for (let i = 0; i < DeviceList.length; i++) {
            const obj = new Object;
            obj.ParentNodeId = 0;
            obj.NodeName = DeviceList[i].ST;
            obj.NodeText = DeviceList[i].ST + ' ' + DeviceList[i].NAME;
            obj.Select = false;

            ObjArr[1][i] = obj;
        }
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }

    if (SelectIndex >= 0 && SelectIndex < ObjArr.length) {
        ObjArr[1][SelectIndex].Select = true; // 默认选择项目
    }

    return ObjArr;
}

// 显示或影藏左边栏
function scroll_button_onclick() {
    try {
        const theValue = document.getElementById('div_scroll_id').getAttribute('data-user-flag'); // 获取自定义属性
        // alert(theValue);
        if (theValue == 1) // 需要影藏
        {
            $('#left_panle_id').hide(); // 影藏div
            const oDiv = document.getElementById('right_panle_id');
            oDiv.style.marginLeft = 0 + 'px';
            const oDiv_Ico = document.getElementById('scroll_ico_id');
            oDiv_Ico.className = 'fa fa-chevron-right fa-2x';
            document.getElementById('div_scroll_id').setAttribute('data-user-flag', 0); // 标志设置为0
        } else // 需要显示出来
        {
            $('#left_panle_id').show(); // 显示div
            document.getElementById('div_scroll_id').setAttribute('data-user-flag', 1); // 标志设置为1
            const oDiv_Ico = document.getElementById('scroll_ico_id');
            oDiv_Ico.className = 'fa fa-chevron-left fa-2x';
            const oDiv = document.getElementById('right_panle_id');
            oDiv.style.marginLeft = gTreeWidth + 'px';
        }
    } catch (e) {
        alert('错误：' + e.message);
    }
}

// 搜索符合条件的设备基础信息列表(DeviceListObj:所有的设备基础信息列表；Keyword:搜索关键字，设备名与昵称）
function search_user_list(DeviceListObj, Keyword) {
    const obj = JSON.parse('[]');
    let count = 0;

    if (DeviceListObj == null || DeviceListObj.length == 0) {
        layer.alert('错误：列表为空，无法搜索！', {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
        return obj;
    }
    if (Keyword == null || Keyword.length == 0) {
        layer.alert('错误：请输入搜索关键字！', {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
        return obj;
    }

    try {
        // 搜索
        for (let i = 0; i < DeviceListObj.length; i++) {
            if ((DeviceListObj[i].ST.indexOf(Keyword) >= 0) || (DeviceListObj[i].NAME.indexOf(Keyword) >= 0)) {
                obj[count++] = DeviceListObj[i]; // 找到了
                if (count >= 500) {
                    layer.alert('搜索到超过500个满足条件的数据，提前结束搜索，请修改搜索条件缩小范围！', {
                        icon: 6,
                        scrollbar: false,
                    }); // 5：失败；6：成功
                    break;
                }
            }
        }
        if (count == 0) // 没有搜索到满足条件的数据
        {
            layer.alert('没有搜索到满足条件的设备数据！', {
                icon: 5,
                scrollbar: false,
            }); // 5：失败；6：成功
        }
    } catch (e) {
        layer.alert('搜索发生了错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }

    return obj;
}


// 搜索按钮处理
function search_name_onclick() {
    const Keyword = document.getElementById('search_user_name_id').value; // 获取搜索框内容
    if (Keyword == null || Keyword.length < 1) {
        layer.msg('错误：搜索内容不能为空！', {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
        return;
    }
    // alert('搜索：' + Keyword);

    gSearchDeviceList = search_user_list(gAllDeviceList, Keyword); // 搜索
    if (gSearchDeviceList.length == 0) return; // 没有搜索到
    // 开始获取搜索的内容，并进行显示
    try {
        gisSearchMode = true; // 处于搜索模式
        document.getElementById('cancel_search_button_id').disabled = false; // 启用取消搜索按钮
        loadingmessage1('加载数据中...'); // 弹出提示框
        // 此处重新刷新列表
        // 准备要显示的数据
        const arr = ConversionDataTreeNode_search(gSearchDeviceList, -1); // 子列表数据源-搜索模式时调用
        gTreeConfig.ParentData = arr[0]; // 父标签
        gTreeConfig.LiData = arr[1]; // 子标签
        gMyTree = new tree_list(gTreeConfig);
        gMyTree.render(); // 绘制列表

        layer.close(glayer_msgindex); // 关闭提示框
        if (gSearchDeviceList.length >= 500) {
            layer.msg('搜索到超过500条，只显示' + gSearchDeviceList.length + '条记录，请缩小搜索范围！', {
                icon: 6,
                scrollbar: false,
            }); // 5：失败；6：成功
        } else {
            layer.msg('搜索到' + gSearchDeviceList.length + '条记录！', {
                icon: 6,
                scrollbar: false,
            }); // 5：失败；6：成功
        }
    } catch (e) {
        layer.msg('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}


// 取消搜索按钮处理
function search_cancel_onclick() {
    try {
        if (gisSearchMode == false) return; // 不处于搜索模式的话，直接返回
        gisSearchMode = false; // 不处于搜索模式

        loadingmessage1('加载数据中...'); // 弹出提示框

        // 准备要显示的数据
        const ObjArr = ConversionDataTreeNode(gAllGroupList, gAllDeviceList, 0); // 子列表数据源
        gTreeConfig.ParentData = ObjArr[0]; // 父标签数据源
        gTreeConfig.LiData = ObjArr[1];
        // alert(JSON.stringify(gTreeConfig.ParentData), 4);
        // alert(JSON.stringify(gTreeConfig.LiData), 4);
        gMyTree = new tree_list(gTreeConfig);
        gMyTree.render(); // 绘制列表

        layer.close(glayer_msgindex); // 关闭提示框

        document.getElementById('cancel_search_button_id').disabled = 'true'; // 禁用取消搜索按钮
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}

// 弹出加载框
function loadingmessage(str) {
    glayer_msgindex = layer.msg('加载中', {
        icon: 16,
        shade: 0.5, // 越大界面越黑
        time: 60000, // 时间
        anim: 0, // 平滑放大
        scrollbar: false, // 锁定浏览器滑动
    });
}

// 弹出加载框
function loadingmessage1(str) {
    glayer_msgindex = layer.msg('加载中', {
        icon: 16,
        shade: 0, // 越大界面越黑
        time: 6000, // 时间
        anim: 0, // 平滑放大
        scrollbar: false, // 锁定浏览器滑动
    });
}

// 关闭所有弹出
function close_message() {
    layer.close(glayer_msgindex); // 关闭提示框
}

// 刷新当前页面-点击刷新按钮
function RefreshPage_onClick() {
    location.reload();
}
