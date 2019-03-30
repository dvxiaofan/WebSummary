;

//生成一个列表，返回字html符串 isExpansion:是否展开
function SpliceOneNode(TreeConfig, ParentNodeId, ParentNodeText, isExpansion, parent_data_arr) {
    var time_id = Date.now();   //获取时间戳，用于生成唯一id
    //alert(JSON.stringify(TreeConfig, 4));
    //父标签div,独立的
    var div_parent_div = //
'<div class=\"panel-header bg-scale-0 panel-info border\">\
<a class=\"panel-title\" data-toggle=\"collapse\" href=\"#accordion_' + time_id + '_' + +ParentNodeId + '\">' + ParentNodeText + '</a>\
</div>';

    //列表子项的div,3个
    var div_html =
'<div id=\"accordion_' + time_id + '_' + +ParentNodeId + '\" class=\"panel-collapse collapse ' + ((isExpansion == true) ? 'in' : '') + '\">\
<div class=\"panel-content\">\
<div class=\"widget-list list-left-element list-sm\">';

    var htmlString = [];
    var id;
    //生成ul
    var ul = document.createElement("ul");
    //循环生成子列
    for (var i = 0; i < parent_data_arr.length; i++) {
        if (parent_data_arr[i].ParentNodeId == ParentNodeId) {
            id = 'li_' + time_id + '_' + i;
            var li = document.createElement("li");
            //设置 li 属性，如 onclick
            li.setAttribute("onclick", "li_onclick(this,\'" + TreeConfig.id + '\',\'' + TreeConfig.config_val_name + "\')");
            li.setAttribute("id", id);
            //设置 li 属性
            li.setAttribute("data-name", parent_data_arr[i].NodeName);
            //设置 li 属性
            li.setAttribute("data-attribute", i);   //自定义属性，存放索引
            //设置 li 属性
            if (parent_data_arr[i].Select == true) //选中
            {
                li.setAttribute("style", "background-color:" + TreeConfig.scolor); //选中的背景颜色
                //设置li内容
                li.innerHTML = '<a href=\"#\" style=\"color:#fff;\"><span style=\"white-space: nowrap;font-size:11.5px;padding: 0px 0px;\" class=\"title\">' + parent_data_arr[i].NodeText + '</span></a>';
            }
            else
            {
                li.setAttribute("style", "background-color:" + TreeConfig.dcolor); //默认背景颜色
                //设置li内容
                li.innerHTML = '<a href=\"#\" style=\"color:#333;\"><span style=\"white-space: nowrap;font-size:11.5px;padding: 0px 0px;\" class=\"title\">' + parent_data_arr[i].NodeText + '</span></a>';
            }
            
            //循环添加li到ul
            htmlString.push(li.outerHTML); //添加到ul
            //ul.innerHTML += li.outerHTML;

            /*li.click = function () {
                alert("hello world!");
            }*/
        }
    }
    ul.innerHTML = htmlString.join("");
    div_html += ul.outerHTML;           //添加ul
    div_html += '</div></div></div>';   //添加结束div,3个
    div_parent_div += div_html;         //拼接到一起
    //单个标签顶层的div
    var div = document.createElement("div");
    div.setAttribute("class", "panel panel-accordion"); //添加属性
    div.innerHTML = div_parent_div;

    //alert(div.outerHTML);
    return div.outerHTML;
}

//初始化tree界面
function TreeInit(TreeConfig) {
    try {
        var Tree = document.getElementById(TreeConfig.id);  //获取容器
        if (Tree != null) {
            //单个标签顶层的div
            var div = document.createElement("div");
            div.setAttribute("class", "panel-group"); //添加属性     
            var htmlString = [];
            //循环生成列表
            for (var i = 0; i < TreeConfig.ParentData.length; i++) {
                htmlString.push(SpliceOneNode(TreeConfig, TreeConfig.ParentData[i].ParentNodeId, TreeConfig.ParentData[i].NodeText, TreeConfig.ParentData[i].expansion, TreeConfig.LiData));
            }
            div.innerHTML = htmlString.join("");
            //alert(div.outerHTML);
            Tree.innerHTML = div.outerHTML;         //添加到父div中-预留在html中的div
        }
        TreeConfig.LastSelectLiObj = null;
    }
    catch (e) {
        alert("错误：" + e.message);
    }
}

//内部点击回调
function li_onclick(li_obj, div_id, config_name) {
    try {
        var config = eval(config_name); //获取当前配置对象-从字符串名称转换为对象
        var index = 0;

        
        //先清除上一次的选项
        if(config.LastSelectLiObj==null) //第一次先去掉所有的选中状态
        {
            var arr = document.querySelectorAll('#' + div_id + ' li');
            for (var i = 0; i < arr.length; i++)
            {
                index = arr[i].getAttribute("data-attribute");      // 获取自定义属性-当前索引
                if (config.LiData[index].Select == true) {
                    arr[i].removeAttribute("style", "background-color:" + config.dcolor + ";");
                    config.LiData[index].Select = false;                    //去除选中状态

                    var obj = arr[i].getElementsByTagName('a');
                    if (obj != null && obj.length > 0) {
                        obj[0].setAttribute("style", "color:#333;");
                    }
                }
            }
        }
        else //之后只需要去掉上次的选中状态即可-优化速度
        {
            //alert(config.LastSelectLiObj);
            index = config.LastSelectLiObj.getAttribute("data-attribute");      // 获取自定义属性-当前索引
            config.LastSelectLiObj.removeAttribute("style", "background-color:" + config.dcolor + ";");
            config.LiData[index].Select = false;                                //去除选中状态      
            var obj = config.LastSelectLiObj.getElementsByTagName('a');
            if (obj != null && obj.length > 0){
                obj[0].setAttribute("style", "color:#333;");
            }
        }
        config.LastSelectLiObj = li_obj;//记录本次选择的li

        //本次选择的li
        li_obj.setAttribute("style", "background-color:" + config.scolor + ";");
        index = li_obj.getAttribute("data-attribute");      // 获取自定义属性-当前索引
        config.LiData[index].Select = true;                     //选择状态有效
        var obj = li_obj.getElementsByTagName('a');
        if (obj != null && obj.length > 0) {
            obj[0].setAttribute("style", "color:#fff;");
        }

        //调用应用层事件
        config.SelectionEvent(index, config.LiData[index]);

        //alert(JSON.stringify(eval(config_name), 4));
        //先循环所有的li-去掉选中状态
        /*var arr = document.querySelectorAll('#' + div_id + ' li');
        var index;
        for (var i = 0; i < arr.length; i++) {
            index = arr[i].getAttribute("data-attribute");      // 获取自定义属性-当前索引
            if (config.LiData[index].Select == true)
            {
                arr[i].removeAttribute("style", "background-color:" + config.dcolor + ";");
                config.LiData[index].Select = false;                    //去除选中状态
            }
            
        }

        //设置 li 属性，添加选中状态
        li_obj.setAttribute("style", "background-color:" + config.scolor + ";");

        index = li_obj.getAttribute("data-attribute");      // 获取自定义属性-当前索引
        config.LiData[index].Select = true;                     //选择状态有效
        config.SelectionEvent(index, config.LiData[index]);*/
        //alert('选择索引：' + index);
        //var obj = tree_config.LiData[index];                 //获取数据
        //tree_config.SelectionEvent(obj);
    }
    catch (e) {
        alert("错误：" + e.message);
    }

}
