

// 手机端列表icon配置在 Mobile_MainList 页面


// 全局修改项目显示信息
(function () {

    let userInfo = {
        title: '德希云·数据展示平台',
        iconSrc: '../../Images/title_logo.png',
        version: 'v1.0'
    }

    // 网站左上角项目名字
    document.title = userInfo.title;
    // 主页欢迎语
    let publicTitle = userInfo.title;
    // 网站左上角图标
    let publicIconSrc = userInfo.iconSrc;
    // 网站左上角版本号  
    let publicVersion = userInfo.version;

    // 图标
    if ($("#public_icon").length > 0) $("#public_icon").context.images[0].src = publicIconSrc;
    if ($("#public_title").length > 0) $("#public_title").html(publicTitle);
    if ($("#public_version").length > 0) $("#public_version").html(publicVersion);
    if ($("#welcome_text").length > 0) $("#welcome_text").html(publicTitle);
    if ($("#mobile_title").length > 0) $("#mobile_title").html(publicTitle);
    if ($("#mobile_footer_text").length > 0) $("#mobile_footer_text").html(publicTitle);

}());