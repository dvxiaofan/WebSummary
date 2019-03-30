
//弹出消息框
//div_id:div id
//Title:标题；Text：内容
//size = long:长；default:中；small:小；
//Type = success：操作成功绿色；warning：警告黄色；error：失败红色；info：淡蓝色消息；primary：深蓝色消息
function user_message(div_id, Title, Text, Size, Type, butt_ok_callback_string, butt_close_callback_string) {

    //大小
    if (Size == "long") Size = 'modal-lg';
    else if (Size == "small") Size = 'modal-sm';
    else Size = 'default';
    //类型
    if (Type == 'success') Type = 'modal-success';           //操作成功绿色提示框
    else if (Type == 'warning') Type = 'modal-warning';     //警告黄色提示框
    else if (Type == 'error') Type = 'modal-danger';        //红色失败提示框
    else if (Type == 'info') Type = 'modal-info';           //淡蓝色信息提示框
    else if (Type == 'primary') Type = 'modal-primary';     //深蓝色提示框
    else Type = 'modal-info';                               //淡蓝色信息提示框

    var html = '\
<!-- Modal -->\
<div class=\"modal fade\" id=\"message-window-modal-2168574548\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-warning-label\">\
<div class=\"modal-dialog '+
Size
+
'\" role=\"document\">\
<div class=\"modal-content\">\
<div class=\"modal-header state ' + Type + '\">\
<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\
<h4 class=\"modal-title\" id=\"modal-warning-label\"><i class=\"fa fa-exclamation\"></i>' + Title + '</h4>\
</div>\
<div class=\"modal-body\">'
+ Text +
'</div>\
<div class=\"modal-footer\">\
<button type=\"button\" id=\"button_ok_id215423745420512\" class=\"btn btn-warning\" onclick=\"' + butt_ok_callback_string + '()\" data-dismiss=\"modal\">Ok</button>\
<button type=\"button\" id=\"button_close_id215423740542512\" class=\"btn btn-default\" onclick=\"' + butt_close_callback_string + '()\"data-dismiss=\"modal\">Close</button>\
</div>\
</div>\
</div>\
</div>';
    document.getElementById(div_id).innerHTML = html;
    $('#message-window-modal-2168574548').modal();
};



//Notice消息展示
//title：标题；text：提示内容；type：提示类型（颜色不一样）'success'，'warning'，'Error'，'info'，'Primary'，'Dark'
//delay：自动关闭延时，单位ms;is_mouse_reset:true:鼠标悬浮时时间重置
//<link rel="stylesheet" href="../../helsinki-blue/vendor/pnotify/pnotify.custom.css">
//<script src="../../helsinki-blue/vendor/pnotify/pnotify.custom.js"></script>
//<script src="../../helsinki-blue/javascripts/examples/ui-elements/notifications-pnotify.js"></script>
function user_ShowNotice(Title, Text, Type, Delay, is_mouse_reset) {
    PNotify.prototype.options.styling = "bootstrap3";
    new PNotify({
        title: Title,
        text: Text,
        type: Type,
        delay: Delay,
        hide: true, //是否自动关闭
        mouse_reset: is_mouse_reset,   //鼠标悬浮的时候，时间重置
    });
};


//判断是否为PC（true:PC,false:非PC端）
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}



