/* eslint-disable no-undef */


FindDeviceGroupIndex([], []);

function FindDeviceGroupIndex(GroupList, DeviceGroup) {
    try {
        if (GroupList == null || GroupList.length == 0 || DeviceGroup == null) return 0;
        for (let i = 0; i < GroupList.length; i++) {
            if (GroupList[i].GROUP == DeviceGroup) return i + 1;
        }
    } catch (e) {
        console.log("e: ", e);
    }

    return 0;
}

FindDeviceGroupIn();

// 取消搜索按钮处理
function FindDeviceGroupIn() {
    var gisSearchMode;
    try {
        if (gisSearchMode == false) return; // 不处于搜索模式的话，直接返回
        gisSearchMode = false; // 不处于搜索模式

        loadingmessage1("加载数据中..."); // 弹出提示框

        // 准备要显示的数据
        // eslint-disable-next-line no-undef
        const ObjArr = ConversionDataTreeNode(gAllGroupList, gAllDeviceList, 0); // 子列表数据源
        gTreeConfig.ParentData = ObjArr[0]; // 父标签数据源
        gTreeConfig.LiData = ObjArr[1];
        // alert(JSON.stringify(gTreeConfig.ParentData), 4);
        // alert(JSON.stringify(gTreeConfig.LiData), 4);
        gMyTree = new tree_list(gTreeConfig);
        gMyTree.render(); // 绘制列表

        layer.close(glayer_msgindex); // 关闭提示框

        document.getElementById("cancel_search_button_id").disabled = "true"; // 禁用取消搜索按钮
    } catch (e) {
        layer.alert("错误：" + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}

// 弹出加载框
(function loadingmessage() {
    glayer_msgindex = layer.msg("加载中", {
        icon: 16,
        shade: 0.5, // 越大界面越黑
        time: 60000, // 时间
        anim: 0, // 平滑放大
        scrollbar: false, // 锁定浏览器滑动
    });
}
)();
// 弹出加载框
function loadingmessage1() {
    glayer_msgindex = layer.msg("加载中", {
        icon: 16,
        shade: 0, // 越大界面越黑
        time: 6000, // 时间
        anim: 0, // 平滑放大
        scrollbar: false, // 锁定浏览器滑动
    });
}

