//自定义layui相关操作

//设置layui datatable的某一行的颜色
//TabDivId:tab父div id;RowIndex:行序列号，从0开始；ColorString：颜色字符串，如'#123456'
function Layui_SetDataTableRowColor(TabDivId, RowIndex, ColorString) {
    try {
        var div = document.getElementById(TabDivId);
        if (div != null) //找到对象了
        {
            var table_main = div.getElementsByClassName('layui-table-main');   //通过class获取table_main
            if (table_main != null && table_main.length > 0) {
                var table = table_main[0].getElementsByClassName('layui-table');   //通过class获取table
                if (table != null && table.length > 0) {
                    var trs = table[0].querySelectorAll("tr");
                    if (trs != null && trs.length > 0) {
                        trs[RowIndex].style.color = ColorString;
                    }
                }
            }

        }
    }
    catch (e) {
        console.log(e.message);
    }
}


//获取layui table的行集合,TabDivId:table的父标签
function Layui_GetDataTableRows(TabDivId) {
    try {
        var div = document.getElementById(TabDivId);
        if (div != null) //找到对象了
        {
            var table_main = div.getElementsByClassName('layui-table-main');   //通过class获取table_main
            if (table_main != null && table_main.length > 0) {
                var table = table_main[0].getElementsByClassName('layui-table');   //通过class获取table
                if (table != null && table.length > 0) {
                    var trs = table[0].querySelectorAll("tr");
                    if (trs != null && trs.length > 0) {
                        return trs;
                    }
                }
            }

        }
    }
    catch (e) {
        console.log(e.message);
    }

    return null;
}

// 获取layui table 每一行的 td集合，TabDivId:table的父标签
function Layui_GetDataTableTds(TabDivId) {
    try {
        var div = document.getElementById(TabDivId);

        if (div != null) {
            var table_main = div.getElementsByClassName('layui-table-main');
            if (table_main != null && table_main.length > 0) {
                var table = table_main[0].getElementsByClassName('layui-table');
                if (table != null && table.length > 0) {
                    var trs = table[0].querySelectorAll("tr");
                    if (trs != null && trs.length > 0) {
                        for (var i = 0; i < trs.length; i++) {
                            var tds = trs.querySelectorAll('td');
                        }
                        return tds;
                    }
                }
            }
        }
    } catch (e) {
        
    }
    
    return null;
}





