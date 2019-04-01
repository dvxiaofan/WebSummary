/* eslint-disable no-unused-vars */

/**
 * 处理echart里的数据，获取y轴最大值和最小值, 外界直接调用publicSetEssData(essData, multiple)
 * @param {*} essData
 * @param {*} multiple
 * @return {*}
 */
function publicSetEssData(essData, multiple) {
    const newEssData = [];
    const essNum = {
        maxData: '',
        minData: '',
    };

    // 数据为空
    if (essData == undefined || essData.length <= 0) {
        essNum.maxData = '',
        essNum.minData = '';
        return essNum;
    };

    // 过滤无效数据
    for (let i = 0; i < essData.length; i++) {
        if (essData[i] == '无效') {
            continue;
        } else {
            newEssData.push(essData[i]);
        }
    }

    essNum.maxData = newEssData[0],
    essNum.minData = newEssData[0];

    // 获取最大和最小值
    for (let i = 0; i < newEssData.length; i++) {
        if (Number(essNum.maxData) < Number(newEssData[i])) {
            essNum.maxData = Number(newEssData[i]);
        }
        if (Number(essNum.minData) > Number(newEssData[i])) {
            essNum.minData = Number(newEssData[i]);
        }
    }

    // 如果最小值不为负数，那么最小值设置为0
    if (essNum.minData >= 0) {
        essNum.minData = 0;
        essNum.maxData = (Number(essNum.maxData) * multiple).toFixed(3);
    } else {
        // 最小值为负数，最大值
        essNum.maxData = (Number(essNum.maxData - essNum.minData) * multiple).toFixed(3);
    }

    return essNum;
}

/**
 * 导出当前页数据为Excel表格
 * @param {*} tableData
 */
function publicDownOnePageToExcel(tableData) {
    try {
        if (tableData == null || tableData.length == 0) {
            layer.msg('错误：没有数据需要导出，请先查询数据！', {
                icon: 5,
                scrollbar: false,
            });
            return;
        }

        const sheetFilter = [];
        const sheetHeader = [];
        const option = {};

        // 准备字段与字段别名
        for (let i = 0; i < g_table_config.cols[0].length; i++) {
            sheetFilter[i] = g_table_config.cols[0][i].field;
            sheetHeader[i] = g_table_config.cols[0][i].title;
        }
        // https:// www.cnblogs.com/kin-jie/p/6180707.html
        option.fileName = '报警记录数据导出';
        option.datas = [{
            sheetData: tableData,
            sheetName: 'sheet',
            sheetFilter: sheetFilter, // ['two', 'one'],
            sheetHeader: sheetHeader, // ['第一列', '第二列']
        }];
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}

/**
 * 导出所有数据为Excel表格
 * @param {array} tableData
 * @param {*} tableCols
 * @param {*} deviceName
 * @param {*} deviceSt
 * @param {*} AllData
 */
function publicDownAllPageToExcel(tableData, tableCols, deviceName, deviceSt, AllData) {
    try {
        if (tableData == null || tableData.length == 0) {
            layer.msg('错误：没有数据需要导出，请先查询数据！', {
                icon: 5,
                scrollbar: false,
            });
            return;
        }

        loading_message1('加载数据中...'); // 弹出提示框
        // 延时先等等加载中...显示出来后再加载数据
        setTimeout(
            function() {
                if (AllData == null || AllData.length == null) {
                    close_message(); // 关闭提示框
                    layer.msg('错误：没有数据需要导出，请先查询数据！', {
                        icon: 5,
                        scrollbar: false,
                    });
                    return;
                }
                const sheetFilter = [];
                const sheetHeader = [];
                // 准备字段与字段别名
                for (let i = 1; i < tableCols.length; i++) {
                    sheetFilter[i - 1] = tableCols[i].field;
                    sheetHeader[i - 1] = tableCols[i].title;
                }

                const option = {};
                // https:// www.cnblogs.com/kin-jie/p/6180707.html
                option.fileName = deviceName + '(' + deviceSt + ')' + '历史数据导出';
                option.datas = [{
                    sheetData: AllData,
                    sheetName: 'sheet',
                    sheetFilter: sheetFilter, // ['two', 'one'],
                    sheetHeader: sheetHeader, // ['第一列', '第二列']
                }];
                close_message(); // 关闭提示框
                const toExcel = new ExportJsonExcel(option);
                toExcel.saveExcel();
            }, 100);
    } catch (e) {
        layer.alert('错误：' + e.message, {
            icon: 5,
            scrollbar: false,
        }); // 5：失败；6：成功
    }
}
