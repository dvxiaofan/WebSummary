(function() {
    let obj;
    let my_dropdown;
    let my_dropdownArray;
    let last_li;
    let select_li;
    let liArray1;
    let options;

    let tree_list = function (config) {
        options = new Object();
        options.id = config.id;
        options.ParentData = config.ParentData, //父标签数据源
        options.LiData = config.LiData, //子列表数据源
        options.SelectionEvent = config.SelectionEvent, //选择某一项后回调
        this.init();
    };

    //构造函数
    tree_list.prototype.init = function () {
        //alert("x是"+this.options.x+" y是"+this.options.y+" z是"+this.options.z);
        try {

        } catch (error) {

        }

    };


    //初始化事件
    function event_init() {
        //alert("x是"+this.options.x+" y是"+this.options.y+" z是"+this.options.z);
        try {
            obj = document.getElementById(options.id); //获取整个对象
            if (obj == null) {
                my_dropdown = null; //无效
                my_dropdownArray = null; //无效
            } else {
                my_dropdown = obj.querySelectorAll('.my_dropdown');
                my_dropdownArray = Array.prototype.slice.call(my_dropdown, 0);

                my_dropdownArray.forEach(function (el) {
                    let button = el.querySelector('a[data-toggle="my_dropdown"]'),
                        menu = el.querySelector('.my_dropdown-menu'),
                        arrow = button.querySelector('i.icon-arrow');

                    button.onclick = function (event) {
                        if (!menu.hasClass('show')) {
                            menu.classList.add('show');
                            menu.classList.remove('hide');
                            arrow.classList.add('open');
                            arrow.classList.remove('close');
                            event.preventDefault();
                        } else {
                            menu.classList.remove('show');
                            menu.classList.add('hide');
                            arrow.classList.remove('open');
                            arrow.classList.add('close');
                            event.preventDefault();
                        }
                    };
                })


                // console.log('hello');
				


                // select li
                select_li = obj.querySelectorAll('.select_li');
                liArray1 = Array.prototype.slice.call(select_li, 0);
                liArray1.forEach(function (el) {
                    let li = el.querySelector('a[data-toggle="select_li"]'),
                        menu = el.querySelector('.select_li');
                    li.onclick = function (event) {
                        //after('adfaf');
                        //select_li_class
                        li.classList.remove('default_a_class');
                        li.classList.add('select_a_class');
                        if (last_li != null) {
                            last_li.classList.add('default_a_class');
                            last_li.classList.remove('select_a_class');
                        }
                        last_li = li;

                        let text = li.text;
                        let index = li.getAttribute('data-index');
                        let data_name = li.getAttribute('data-name');
                        if (options.SelectionEvent != null) {
                            options.SelectionEvent(index, data_name, text);
                        }
                    };


                })

            }
        } catch (error) {

        }

    };

    tree_list.prototype.render = TreeInit;

    //生成一个列表，返回字html符串
    function SpliceOneNode(ParentNodeId, ParentNodeText, parent_data_arr) {
        let time_id = Date.now(); //获取时间戳，用于生成唯一id
        //alert(JSON.stringify(TreeConfig, 4));
        //父标签div,独立的
        let div_parent_div = //
			' <li class="my_dropdown"><a href="#" data-toggle="my_dropdown">' + ParentNodeText + '<i class="icon-arrow"></i></a>\
				<ul class="my_dropdown-menu show">';
        //  </ul>
        //</li>'

        let htmlString = [];
        let id;
        //循环生成子列
        for (let i = 0; i < parent_data_arr.length; i++) {
            if (parent_data_arr[i].ParentNodeId == ParentNodeId) {
                id = 'li_' + time_id + '_' + i;
                let li = document.createElement("li");
                //设置 li 属性
                li.setAttribute("id", id);
                //设置 li 属性
                li.setAttribute("data-attribute", i); //自定义属性，存放索引
                //设置 li 属性
                li.setAttribute("class", 'select_li');
                li.innerHTML = '<a href="#" class="default_a_class" data-toggle="select_li" data-index=' + i + ' data-name="' + parent_data_arr[i].NodeName + '">' + parent_data_arr[i].NodeText + '</a>'

                //循环添加li到ul
                htmlString.push(li.outerHTML); //添加到ul
            }
        }
        div_parent_div += htmlString.join("");
        div_parent_div += '</ul></li>';

        //alert(div_parent_div);
        return div_parent_div;
    }

    //初始化tree界面
    function TreeInit() {
        try {
            let Tree = document.getElementById(options.id); //获取容器
            if (Tree != null) {
                //顶层ul
                let ul = document.createElement("ul");
                // ul.setAttribute("class", "panel-group"); //添加属性     
                let htmlString = [];
                //循环生成列表
                for (let i = 0; i < options.ParentData.length; i++) {
                    htmlString.push(SpliceOneNode(options.ParentData[i].ParentNodeId, options.ParentData[i].NodeText, options.LiData));
                }
                ul.innerHTML = htmlString.join("");
                //alert(ul.outerHTML);
                Tree.innerHTML = ul.outerHTML; //添加到父div中-预留在html中的div

                event_init(); //重新绑定事件
            }
        } catch (e) {
            alert("错误：" + e.message);
        }
    }

    window.tree_list = tree_list; //把这个函数暴露给外部，以便全局调用

    Element.prototype.hasClass = function (className) {
        return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
    };

}());


// 鼠标悬浮显示当前设备名称事件
var differentIndex = 999;

function myTreeHoverEvent() {
    $(document).ready(function () {

        let ele = $(".select_li");

        for (let i = 0; i < ele.length; i++) {
            const element = ele[i];

            $("#" + element.id).hover(function () {
                openMsg(element.id);
            }, function () {
                layer.close(differentIndex);
            });
        }
    });
}
// 悬浮显示信息-利用的layer里 tips
function openMsg(eleId) {
    let showTitle = $("#" + eleId)[0].innerText;
    differentIndex = layer.tips(showTitle, "#" + eleId, {
        tips: [1, '#888'],
        time: 30000
    });
}