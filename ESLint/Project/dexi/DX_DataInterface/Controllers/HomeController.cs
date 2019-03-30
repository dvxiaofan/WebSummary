using DX_DataInterface.Controllers.Home;
using DX_DataInterface.Models;
using MVC01.Controllers;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DX_DataInterface.Controllers
{
    public class HomeController : Controller   
    {
        public ActionResult Error()
        {
            return View();
        }
        public ActionResult Index()
        {
            if ((Session["UserName"] != null) && (Session["Password"] != null) && (Session["LoginStatus"] != null) && (Session["LoginStatus"].ToString() == "Login Success"))                 //获取全局用户名称
            {
                return View();
            }
            else //没有登录的检查cookie
            {
                string UserName = RetrieveCookie("UserName");           //获取用户名
                string PasswordMD5 = RetrieveCookie("PasswordMD5");     //获取密码

                if (UserName != null && PasswordMD5 != null)
                {
                    DbDataController mDbDataController = new DbDataController();

                    //使用用户名与密码MD5验证用户是否存在
                    DataTable mDataTable = mDbDataController.AuthenticationMD5(UserName, PasswordMD5);
                    if (mDataTable != null) //验证成功
                    {
                        //保存信息到session
                        Session["UserName"] = UserName;               //存储全局用户名称
                        Session["Password"] = PasswordMD5;             //存储全局用户密码MD5
                        Session["LoginStatus"] = "Login Success";           //登录状态
                        return View("Index");
                    }
                }
                return View("Login");
            }
            //return View();
        }

        public ActionResult Login()
        {
            string UserName = RetrieveCookie("UserName");           //获取用户名
            string PasswordMD5 = RetrieveCookie("PasswordMD5");     //获取密码

            if (UserName != null && PasswordMD5 != null)
            {
                DbDataController mDbDataController = new DbDataController();

                //使用用户名与密码MD5验证用户是否存在
                DataTable mDataTable = mDbDataController.AuthenticationMD5(UserName, PasswordMD5);
                if (mDataTable != null) //验证成功
                {
                    //保存信息到session
                    Session["UserName"] = UserName;               //存储全局用户名称
                    Session["Password"] = PasswordMD5;             //存储全局用户密码MD5
                    Session["LoginStatus"] = "Login Success";           //登录状态
                    return View("Index");
                }
            }
            return View();
        }
        //主页
        public ActionResult Home_Page()
        {
            return View();
        }
        //主页-信息总览
        public ActionResult InfoOver_Page()
        {
            return View();
        }
        //实时数据-全部站点
        public ActionResult Real_AllTelData_Page()
        {
            return View();
        }
        //实时数据-分组列表
        public ActionResult Real_GrouplData_Page()
        {
            return View();
        }
        //实时数据-站点详细
        public ActionResult Real_OneTelData_Page()
        {
            return View();
        }
        // 实时数据-动态总览
        public ActionResult InfoOver_PicPage()
        {
            return View();
        }
        //历史数据-历史报表
        public ActionResult Hist_ReportForm_Page()
        {
            return View();
        }
        //历史数据-整点报表
        public ActionResult Hist_HourReportForm_Page()
        {
            return View();
        }
        //历史数据-历史图形
        public ActionResult Hist_Graph_Page()
        {
            return View();
        }
        //历史数据-数据对比
        public ActionResult Hist_Contrast_Page()
        {
            return View();
        }
        //历史数据-多站对比
        public ActionResult Hist_MultiDeviceCont_Page()
        {
            return View();
        }
        //历史数据-导出测试
        public ActionResult ToExcel_Test_Page()
        {
            return View();
        }
        //管理界面-用户信息
        public ActionResult Setting_UserInfo_Page()
        {
            return View();
        }
        //管理界面-设备管理
        public ActionResult Setting_Device_Page()
        {
            return View();
        }
        //管理界面-断面管理
        public ActionResult Setting_Section_Page()
        {
            return View();
        }
        //管理界面-分组管理
        public ActionResult Setting_Group_Page()
        {
            return View();
        }
        //管理界面-添加数据
        public ActionResult Sys_Manual_SetData_page()
        {
            return View();
        }
        //关于我们-关于
        public ActionResult About_About_Page()
        {
            return View();
        }
        //关于我们-帮助
        public ActionResult About_Help_Page()
        {
            return View();
        }
        //404
        public ActionResult pages_error_404()
        {
            return View();
        }
        //管理员-用户管理
        public ActionResult Sys_Setting_User_Page()
        {
            return View();
        }
        //管理员-设备管理
        public ActionResult Sys_Setting_Device_Page()
        {
            return View();
        }
        //管理员-微信管理
        public ActionResult Sys_Setting_WeiXin_Page()
        {
            return View();
        }
        //编辑用户信息页面
        public ActionResult EditUserInfoView()
        {
            return View();
        }
        //编辑设备基本信息页面
        public ActionResult EditDeviceInfoView()
        {
            return View();
        }
        //编辑设备详细信息页面
        public ActionResult EditDeviceDetailView()
        {
            return View();
        }
        //编辑设备要素页面
        public ActionResult EditDeviceEssView()
        {
            return View();
        }
        //编辑设备 查看或删除绑定用户页面
        public ActionResult EditDeviceCancelBindUsersView()
        {
            return View();
        }

        //编辑设备 添加绑定用户页面
        public ActionResult EditDeviceAddBindUsersView()
        {
            return View();
        }

        //编辑用户，查看或删除绑定设备界面
        public ActionResult EditUserCancelBindDeviceView()
        {
            return View();
        }

        //编辑用户，添加绑定设备界面
        public ActionResult EditUserAddBindDeviceView()
        {
            return View();
        }

        //编辑当前设备所属分组
        public ActionResult EditDeviceGroup()
        {
            return View();
        }
        //分组绑定设备
        public ActionResult EditGroupBindDevice()
        {
            return View();
        }
        //地图实时数据
        public ActionResult RealFrame()
        {
            return View();
        }

        //视频界面
        public ActionResult video_page()
        {
            return View();
        }
        //视频弹窗网页
        public ActionResult VideoFrame()
        {
            return View();
        }
        //视频弹窗网页 HLS
        public ActionResult VideoFrame_HLS()
        {
            return View();
        }
        // 移动端 - 登录
        public ActionResult Mobile_Login()
        {
            return View();
        }
        //移动端 - 主页
        public ActionResult Mobile_Index1()
        {
            return View();
        }
        //移动端 - 主设备列表
        public ActionResult Mobile_MainList()
        {
            return View();
        }
        //移动端 - 设备详细数据
        public ActionResult Mobile_DeviceData()
        {
            return View();
        }
        //移动端 - 视频列表
        public ActionResult Mobile_VideoList()
        {
            return View();
        }
        //移动端 - 视频查看
        public ActionResult Mobile_VideoPlayer()
        {
            return View();
        }
        // 视频加载和返回的空页面, 解决视频返回时残留问题
        public ActionResult Video_LoadingTips_Page()
        {
            return View();
        }
        //设备预警设置
        public ActionResult Setting_DeviceAlarm_Page()
        {
            return View();
        }

        //编辑设备的预警信息
        public ActionResult EditDeviceAlarmConfig()
        {
            return View();
        }
        //摄像头添加绑定用户
        public ActionResult EditVideoAddBindUsersView()
        {
            return View();
        }
        //修改摄像头用户信息
        public ActionResult EditVideoBindUsersView()
        {
            return View();
        }
        //编辑摄像头信息
        public ActionResult EditVideoInfoView()
        {
            return View();
        }
        //设置摄像头-主列表
        public ActionResult Sys_Setting_Video_Page()
        {
            return View();
        }
        //视频设备绑定的用户显示界面-可以进行解绑
        public ActionResult EditVideoCancelBindUsersView()
        {
            return View();
        }

        //历史报警信息
        public ActionResult Hist_AlarmForm_Page()
        {
            return View();
        }



        public ActionResult Mobile_Index(String state,String p, String id)
        {
            try
            {
                if (state == "WeiXin" && id != null && id.Length > 10 && p!= null)
                {
                    DbDataController mDbDataController = new DbDataController();
                    id = id.Replace("2B%","+");  //还原转换的+
                    String openid = StaticAES.AESDecrypt(id);   //解密

                    //获取当前的时间戳
                    TimeSpan cha = (DateTime.Now - TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1)));
                    long count = (long)cha.TotalSeconds;
                    p = p.Replace("2B%", "+");  //还原转换的+
                    String time = StaticAES.AESDecrypt(p);   //解密
                    long time_count = 0;
                    try
                    {
                        time_count = Convert.ToInt32(time);
                    }
                    catch (Exception e)
                    {
                        time_count = 0;
                    } 

                    count -= time_count;
                    if (count < -7200 || count > 7200) //链接过期了
                    {
                        //去掉登录的状态
                        Session["UserName"] = "";               //存储全局用户名称
                        Session["Password"] = "";               //存储全局用户密码MD5
                        Session["LoginStatus"] = "";           //登录状态
                        Session["Openid"] = openid;              //存储openid
                        return View("Mobile_Login");
                    }

                    DataTable mDataTable = mDbDataController.GetWeixinBindUserInfo(openid); //从数据库中读取指定的微信绑定的用户信息
                    if(mDataTable!=null && mDataTable.Rows.Count > 0)       //当前微信已经绑定过用户
                    {
                        //获取

                        String UserName = mDataTable.Rows[0]["USER"].ToString();    //获取用户名
                        String PasswordMD5 = mDataTable.Rows[0]["PASSWORD_MD5"].ToString();    //获取密码
                        //保存帐户登录名  
                        SaveCookie("UserName", UserName, DateTime.Now.AddDays(30));  //保存cookie 30天
                        //保存密码
                        SaveCookie("PasswordMD5", PasswordMD5, DateTime.Now.AddDays(30));  //保存cookie 30天
                        //自动登录
                        Session["UserName"] = UserName;                     //存储全局用户名称
                        Session["Password"] = PasswordMD5;                  //存储全局用户密码MD5
                        Session["LoginStatus"] = "Login Success";           //登录状态
                        Session["Openid"] = openid;                          //存储openid
                    }
                    else //没有绑定过，则跳转到登录，登录成功后会进行绑定                   
                    {
                        //去掉登录的状态
                        Session["UserName"] = "";               //存储全局用户名称
                        Session["Password"] = "";               //存储全局用户密码MD5
                        Session["LoginStatus"] = "" ;           //登录状态
                        Session["Openid"] = openid;              //存储openid
                        return View("Mobile_Login");
                    }
                }          
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }

            return View();
        }
        //历史图片列表
        public ActionResult Hist_Pic_Page()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(LoginInfo model)
        {

            //是否为Ajax请求  
            if (!Request.IsAjaxRequest())  
                return View();
            if (model.GetFun == "LogonRequest") //登录请求
            {
                if (model.UserName == null)
                    return Json(GetResult(0, "用户名为空！", null));
                if (model.PasswordMD5 == null)
                    return Json(GetResult(0, "请输入密码！", null));
                if (UserLogonRequest(model.UserName, model.PasswordMD5) == false)
                {
                    return Json(GetResult(0, "用户名或密码错误！", null));
                }

                if (model.RememberMe == true)   //记录登录状态
                {
                    //保存帐户登录名  
                    SaveCookie("UserName", model.UserName, DateTime.Now.AddDays(30));  //保存cookie 30天
                    //保存密码
                    SaveCookie("PasswordMD5", model.PasswordMD5, DateTime.Now.AddDays(30));  //保存cookie 30天
                }
                Session["UserName"] = model.UserName;               //存储全局用户名称
                Session["Password"] = model.PasswordMD5;             //存储全局用户密码MD5
                Session["LoginStatus"] = "Login Success";           //登录状态
                //如果openid有效，则意味着是从微信登录的用户
                if (Session["Openid"] != null)
                {
                    String Openid = Session["Openid"].ToString();
                    if(Openid.Length > 10)
                    {
                        //进行用户绑定-先检查用户是否绑定过，如果绑定过则进行修改，否则进行添加
                        WeixinLogin(model.UserName, Openid);
                    }
                }

                return Json(GetResult(1, "登录成功！", null));
            }
            else if (model.GetFun == "GetLoginStatus")               //获取登录状态，返回用户的信息
            {
                if ((Session["UserName"] != null) && (Session["Password"] != null) && (Session["LoginStatus"] != null) && (Session["LoginStatus"].ToString() == "Login Success"))                 //获取全局用户名称
                {
                    //从session加载用户名称与密码
                    string UserName = Session["UserName"].ToString();
                    string PasswordMD5 = Session["Password"].ToString();
                    //根据用户名获取用户 信息 
                    return GetUserInfo(UserName, PasswordMD5);  //返回用户信息
                }
                else
                {
                    return Json(GetResult(0, "登录无效，请重新登录！", null));
                }
            }
            else
            {
                return Json(GetResult(0, "无效的请求！", null));  
            }
        }


        public ActionResult GetImg(int id)
        {
            try
            {
                //是否为Ajax请求  
                /*if (!Request.IsAjaxRequest())
                {
                    return Json(GetResult(-2, "非法的访问！", null)); 
                }*/
                 //首选验证登录
                if ((Session["UserName"] != null) && (Session["Password"] != null) && (Session["LoginStatus"] != null) && (Session["LoginStatus"].ToString() == "Login Success"))                 //获取全局用户名称
                {
                    switch(id)
                    {
                        case 0:return  null;
                        default:
                            {
                                DbDataController mDbDataController = new DbDataController();
                                string PicPath = mDbDataController.GetTelPicturePath(id);//获取图片路径
                                if (PicPath == null) //没有找到图片
                                {
                                    return null;
                                }
                                return File(PicPath, "image/jpeg");
                            }
                    }
                    
                }
                else
                {
                    return Json(GetResult(-1, "请登录！", null)); 
                }
            }
            catch (Exception e)
            {

                SystemLog.Write(e.StackTrace + e.Message);  //日志
                return null;
            }
            
        }

        [HttpPost]
        public ActionResult Index(RequestModelType model)
        {
            //是否为Ajax请求  
            if (!Request.IsAjaxRequest())
                return View();
           
            //首选验证登录
            if ((Session["UserName"] != null) && (Session["Password"] != null) && (Session["LoginStatus"] != null) && (Session["LoginStatus"].ToString() == "Login Success"))                 //获取全局用户名称
            {
                DbDataController mDbDataController = new DbDataController();
                string name = Session["UserName"].ToString();
                string pRights;
                int Rights = 0;

                //权限处理
                if (Session["Rights"] == null || Session["Rights"].ToString() == "0")
                {
                    pRights = mDbDataController.GetUserRights(name);
                    Session["Rights"] = pRights;
                }
                else
                {
                    pRights = Session["Rights"].ToString();
                }

                if (pRights == "256") //超级管理员
                {
                    Rights = 256;   //管理员
                }
                else if (pRights == "64")
                {
                    Rights = 64;    //普通用户
                }
                else return Json(GetResult(0, "无效的用户，请重新登录！", null));

                if(model.GetFun == "GetUserInfo")               //获取用户信息
                {
                    return GetUserMenu(Rights);
                }
                else if(model.GetFun == "LogoutLogin")          //退出登录请求
                {
                    return LogoutLogin();
                }
                else if (model.GetFun == "GetAllUserNameList")  //获取所有普通用户名称列表
                {
                    return GetAllUserNameList(Rights);
                }
                else if (model.GetFun == "GetUserInfoList")  //获取指定的普通用户的详细信息
                {
                    return GetUserInfoList(Rights, model.SERIAL_List);
                }
                else if(model.GetFun == "AddUsers") //添加用户
                {
                    return AddUsers(model.USER, model.NICK_NAME, model.COMPANY, model.TEL, model.EMAIL, model.REMARKS, model.PASSWORD, model.PASSWORD_MD5, Rights);
                }
                else if (model.GetFun == "EditUsers") //编辑用户
                {
                    return EditUsers(model.USER, model.NICK_NAME, model.COMPANY, model.TEL, model.EMAIL, model.REMARKS, model.PASSWORD, model.PASSWORD_MD5, Rights);
                }
                else if (model.GetFun == "DeleteUsers") //删除用户
                {
                    return DeleteUsers(model.USER, Rights);
                }
                else if (model.GetFun == "GetAllDeviceList") //获取所有设备基础信息
                {
                    return GetAllDeviceStList(Rights);
                }
                else if (model.GetFun == "GetDeviceInfoList")  //获取指定的设备详细信息
                {
                    return GetDeviceInfoList(model.SERIAL_List);
                }
                else if(model.GetFun == "AddDevice") //添加设备
                {
                    return AddDevice(model.ST, model.NAME, model.ADDRESS, model.TEL, model.LONG, model.LAT, model.REMARKS, Rights);
                }
                else if (model.GetFun == "EditDeviceBasicInfo") //编辑设备基本信息
                {
                    return EditDeviceBasicInfo(model.ST, model.NAME, model.ADDRESS, model.TEL, model.LONG, model.LAT, model.REMARKS, Rights);
                }
                else if (model.GetFun == "GetAllEssData") //获取所有要素列表
                {
                    return GetAllEssData(Rights);
                }
                else if (model.GetFun == "EditeDeviceEss") //编辑一个设备的要素数据
                {
                    return EditeDeviceEss(model.ST, model.REAL_ESS, Rights);
                }
                else if (model.GetFun == "GetBindUsers") //获取当前设备绑定的用户信息
                {
                    return GetBindUsers(model.ST, Rights);
                }
                else if (model.GetFun == "InsertBindUser") //绑定用户到设备
                {
                    return InsertBindUser(model.ST,model.User_List, Rights);
                }
                else if (model.GetFun == "InsertBindDevice") //添加设备绑定到用户
                {
                    return InsertBindDevice(model.USER, model.ST_List, Rights);
                }
                else if (model.GetFun == "DeleteBindUser") //解除绑定用户
                {
                    return DeleteBindUser(model.ST, model.User_List, Rights);
                }
                else if (model.GetFun == "DeleteBindDevice") //解除绑定设备
                {
                    return DeleteBindDevice(model.USER, model.ST_List, Rights);
                }
                else if (model.GetFun == "DeleteDevice") //删除设备
                {
                    return DeleteDevice(model.ST, Rights);
                }
                else if (model.GetFun == "GetUserDeviceList") //获取当前用户的所有设备列表
                {
                    return GetUserDeviceList(name, Rights);
                }
                else if (model.GetFun == "GetUserPicDeviceList") //获取当前用户的所有图片设备列表
                {
                    return GetUserPicDeviceList(name, Rights);
                }

                else if (model.GetFun == "GetDeviceRealData") //获取当前所选的设备的实时数据
                {
                    return GetDeviceRealData(model.ST_List);
                }
                else if (model.GetFun == "GetBindDevice") //获取当前用户绑定的所有设备列表
                {
                    return GetBindDevice(model.USER, Rights);
                }
                else if (model.GetFun == "GetDeviceInfoListForST") //获取所选的ST设备的详细信息
                {
                    return GetDeviceInfoListForST(model.ST_List);
                }
                else if (model.GetFun == "GetUserGroupList") //获取当前用户所有分组名称
                {
                    return GetUserGroupList(name, Rights);
                }
                else if (model.GetFun == "AddDeviceGroup") //给当前用户的设备添加分组
                {
                    return AddDeviceGroup(name,model.GROUP, Rights);
                }
                else if (model.GetFun == "UpdateGroupBindDevice") //更新当前用户分组的设备
                {
                    return UpdateGroupBindDevice(name, model.GROUP, model.ST_List,model.DST_List, Rights);
                }
                else if (model.GetFun == "DeleteUserGroup") //删除一个用户的分组
                {
                    return DeleteUserGroup(name, model.GROUP, Rights);
                }
                else if (model.GetFun == "UpdateDeviceBindGroup") //修改当前设备绑定的分组
                {
                    return UpdateDeviceBindGroup(name, model.ST, model.GROUP, Rights);              
                }
                else if (model.GetFun == "GetHistDataInfo") //获取历史数据条数
                {
                    return GetHistDataInfo(model.ST, model.StartTime, model.EndTime, model.isASC);            
                }
                else if (model.GetFun == "GetHistData") //获取历史数据
                {
                    return GetHistData(model.ST, model.StartTime, model.EndTime, model.isASC, model.StartIndex, model.ReadCnt);
                }
                else if (model.GetFun == "GetIntegerHistDataInfo") //获取整点历史数据条数 2019-02-19
                {
                    return GetIntegerHistDataInfo(model.ST, model.StartTime, model.EndTime, model.isASC);
                }
                else if (model.GetFun == "GetIntegerHistData") //获取整点历史数据 2019-02-19
                {
                    return GetIntegerHistData(model.ST, model.StartTime, model.EndTime, model.isASC, model.StartIndex, model.ReadCnt);
                }
                else if (model.GetFun == "GetUserVideoList") //获取当前用户所有视频信息
                {
                    return GetUserVideoList(name, Rights);
                }
                else if (model.GetFun == "GetDeviceRealPicInfo") //获取当前设备实时图片信息
                {
                    return GetDeviceRealPicInfo(model.ST);
                }
                else if (model.GetFun == "GetDeviceHistPicInfo") //获取当前设备历史图片信息
                {
                    return GetDeviceHistPicInfo(model.ST, model.StartTime, model.EndTime);
                }
                else if(model.GetFun == "WeixinUnbind") //解除当前微信绑定的用户
                {
                    return WeixinUnbind((Session["Openid"] == null)?null:Session["Openid"].ToString());
                }
                else if (model.GetFun == "GetWeixinPicture") //获取微信图片
                {
                    return GetWeixinPicture((Session["Openid"] == null) ? null : Session["Openid"].ToString());
                }
                else if (model.GetFun == "GetDeviceAlarmConfigForST") //获取指定的用户指定的ST设备的设备报警配置数据
                {
                    return GetDeviceAlarmConfigForST(name, model.ST_List);
                }
                else if (model.GetFun == "UpdateDeviceAlarmConfigForST") //更新取指定的用户指定的ST设备的设备报警配置数据
                {
                    return UpdateDeviceAlarmConfigForST(name, model.ST, model.A_ENABLE, model.A_INTERVAL, model.A_CONFIG);
                }
                else if (model.GetFun == "EditVideoBasicInfo") //编辑视频基本信息
                {
                    return EditVideoBasicInfo(model.SERIAL, model.NAME, model.URL, model.H5URL, model.REMARKS, model.ST, Rights);
                }
                else if (model.GetFun == "AddVideo") //添加视频
                {
                    return AddVideo(model.NAME, model.URL, model.H5URL, model.REMARKS, model.ST, Rights);
                }
                else if (model.GetFun == "DeleteVideo") //删除一个视频
                {
                    return DeleteVideo(model.SERIAL, Rights);
                }
                else if (model.GetFun == "GetVideoBindUsers") //获取一个视频设备绑定的用户
                {
                    return GetVideoUserList(model.SERIAL, Rights);
                }
                else if (model.GetFun == "DeleteVideoBindUser") //解除视频绑定用户
                {
                    return DeleteVideoBindUser(model.SERIAL, model.User_List, Rights);
                }
                else if (model.GetFun == "InsertVideoBindUser") //绑定用户到视频设备
                {
                    return InsertVideoBindUser(model.SERIAL, model.User_List, Rights);
                }
                else if (model.GetFun == "GetAlarmDataCount") //获取报警数据条数
                {
                    return GetAlarmDataCount(name,model.ST, model.REAL_ESS, model.StartTime, model.EndTime, model.isASC);
                }
                else if (model.GetFun == "GetAlarmData") //获取报警历史数据
                {
                    return GetAlarmData(name, model.ST, model.REAL_ESS, model.StartTime, model.EndTime, model.isASC, model.StartIndex, model.ReadCnt);
                }
                else if (model.GetFun == "ManualSetData") //人工置数
                {
                    return ManualSetData(model.ST, model.TT, model.Ess_List, model.Data_List, Rights);
                }
                else if (model.GetFun == "GetDeviceDetails")    //获取一个设备的详细信息
                {
                    return GetDeviceDetails(model.ST, Rights);
                }
                else if (model.GetFun == "EditDeviceDetails")    //设置一个设备的详细信息
                {
                    return EditDeviceDetails(model.ST, model.DETAILS, Rights);
                }
                return Json(GetResult(0, "无效的操作！", null));
            }
            else
            {
                return Json(GetResult(-1, "请登录！", null));  
            }


        }








        /**************************************************************************************/
        //相关函数接口

        //用户登录请求
        public bool UserLogonRequest(string UserName, string PasswordMD5)
        {
            try
            {
                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable;

                //使用用户名与密码MD5验证用户是否存在
                mDataTable = mDbDataController.AuthenticationMD5(UserName, PasswordMD5);
                if (mDataTable == null)
                {
                    return false;
                }
                else
                {
                    return true;
                }

            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return false;
            }
        }



        //获取用户相关信息
        public ActionResult GetUserInfo(string UserName, string PasswordMD5)
        {
            try
            {
                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable;

                //使用用户名与密码MD5验证用户是否存在
                mDataTable = mDbDataController.AuthenticationMD5(UserName, PasswordMD5);
                if (mDataTable == null)
                {
                    return Json(GetResult(0, "用户名或密码错误！", null));
                }
                else
                {
                    return Json(GetResult(1, "登录成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }   

            }
            catch (Exception e)
            {
                
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "获取登录状态异常！", null));
            }
        }

        //获取用户菜单-不会判断用户是否登录，但是会判断用户的权限
        public ActionResult GetUserMenu(int Rights)
        {
            try
            {
                if (Rights == 256) //管理员
                {
                    return Json(GetResult(1, "获取菜单成功", StaticGlobal.GetAdminUserMenuHtml()));
                }
                else if(Rights == 64) //普通用户
                {
                    return Json(GetResult(1, "获取菜单成功", StaticGlobal.GetNormalUserMenuHtml()));
                }
                else
                {
                    return Json(GetResult(1, "获取菜单成功", "无效的用户菜单"));
                }
            }
            catch (Exception e)
            {

                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "无效的菜单！", null));
            }
        }


        //退出登录处理，会删除掉se
        public ActionResult LogoutLogin()
        {
            try
            {
                if ((Session["UserName"] != null) && (Session["LoginStatus"] != null) && (Session["LoginStatus"].ToString() == "Login Success"))                 //获取全局用户名称
                {
                    Session.Abandon();  //删除Session
                    SaveCookie("UserName", "", DateTime.Now);     //删除cooking
                    return Json(GetResult(1, "退出成功", null));
                }
                else
                {
                    Session.Clear();    //清除数据
                    return Json(GetResult(1, "退出成功", null));
                }
            }
            catch (Exception e)
            {

                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "无效的菜单！", null));
            }
        }

        //获取所有普通用户名称列表
        public ActionResult GetAllUserNameList(int Rights)
        {
            try
            {
                if(Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetGeneralUserNameList(); //从数据库中读取所有的普通用户的名称信息，只有管理员才能读取
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有用户！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }               
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "发生了异常！", null));
            }
        }

        //获取指定的索引id的用户信息
        public ActionResult GetUserInfoList(int Rights, string SerialListString)
        {
            try
            {
                if(SerialListString == null)
                {
                    return Json(GetResult(1, "请求的用户信息为空！", null));
                }
                string[] SerialList = SerialListString.Split(',');

                if(Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetGeneralUserInfoListForSerial(SerialList); //从数据库中读取指定的用户的详细信息，只有管理员才能读取
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有用户！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }               
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }


        //添加用户
        public ActionResult AddUsers(string USER, string NICK_NAME, string COMPANY, string TEL, string EMAIL, string REMARKS, string PASSWORD, string PASSWORD_MD5, int Rights)    
        {
            string ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckPassword(PASSWORD, PASSWORD_MD5);          //检查密码
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckNickName(NICK_NAME);          //检查昵称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckPhone(TEL);          //检查电话号码
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckEmali(EMAIL);          //检查邮箱
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckCompany(COMPANY);          //检查公司信息
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckRemarks(REMARKS);          //检查备注
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                //在数据库中检查是否存在当前用户
                DbDataController mDbDataController = new DbDataController();
                if(mDbDataController.isGetUserName(USER) == true)
                {
                    return Json(GetResult(0, "当前用户已经存在！", null));      //返回错误
                }

                if (mDbDataController.AddUser(USER, PASSWORD, PASSWORD_MD5, NICK_NAME, COMPANY, EMAIL, TEL, REMARKS, 64) < 1)
                {
                    return Json(GetResult(0, "添加用户失败，写入数据库失败！", null));    
                }

                return Json(GetResult(1, "添加用户成功！", null));             
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }


        //修改一个用户信息
        public ActionResult EditUsers(string USER, string NICK_NAME, string COMPANY, string TEL, string EMAIL, string REMARKS, string PASSWORD, string PASSWORD_MD5, int Rights)
        {
            string ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckPassword(PASSWORD, PASSWORD_MD5);          //检查密码
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckNickName(NICK_NAME);          //检查昵称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckPhone(TEL);          //检查电话号码
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckEmali(EMAIL);          //检查邮箱
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckCompany(COMPANY);          //检查公司信息
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckRemarks(REMARKS);          //检查备注
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                //在数据库中检查是否存在当前用户
                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.isGetUserName(USER) == false)
                {
                    return Json(GetResult(0, "当前用户不存在，无法完成编辑！", null));      //返回错误
                }

                if (mDbDataController.UpdateUser(USER, PASSWORD, PASSWORD_MD5, NICK_NAME, COMPANY, EMAIL, TEL, REMARKS, 64) < 1)
                {
                    return Json(GetResult(0, "编辑用户失败，写入数据库失败！", null));
                }

                return Json(GetResult(1, "编辑用户成功！", null));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }



        //删除一个用户信息
        public ActionResult DeleteUsers(string USER, int Rights)
        {
            string ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
               
                //在数据库中检查是否存在当前用户
                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.isGetUserName(USER) == false)
                {
                    return Json(GetResult(0, "当前用户不存在，无法删除！", null));      //返回错误
                }

                if (mDbDataController.DeleteUser(USER) < 1)
                {
                    return Json(GetResult(0, "从数据库删除用户失败！", null));
                }

                return Json(GetResult(1, "删除用户成功！", null));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //添加设备
        public ActionResult AddDevice(string ST, string NAME, string ADDRESS, string TEL, double LONG, double LAT, string REMARKS, int Rights)    
        {
            string ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckDeviceName(NAME);          //检查名称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckDeviceAddr(ADDRESS);          //检查地址
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckDeviceSIM(TEL);          //检查SIM卡号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckDeviceLong(LONG);          //检查经度
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckDeviceLat(LAT);          //检查纬度
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckRemarks(REMARKS);          //检查备注
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                //在数据库中检查是否存在当前设备
                DbDataController mDbDataController = new DbDataController();
                if(mDbDataController.isCheckDevice(ST) == true)
                {
                    return Json(GetResult(0, "当前设备已经存在！", null));      //返回错误
                }

                if (mDbDataController.AddDevice(ST, NAME, ADDRESS, TEL, LONG, LAT, REMARKS, "13") < 1) //13是默认添加设备温度要素
                {
                    return Json(GetResult(0, "添加设备失败，写入数据库失败！", null));    
                }

                return Json(GetResult(1, "添加设备成功！", null));             
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //修改一个设备的基本信息
        public ActionResult EditDeviceBasicInfo(string ST, string NAME, string ADDRESS, string TEL, double LONG, double LAT, string REMARKS, int Rights)
        {
            string ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckDeviceName(NAME);          //检查名称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckDeviceAddr(ADDRESS);          //检查地址
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckDeviceSIM(TEL);          //检查SIM卡号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckDeviceLong(LONG);          //检查经度
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckDeviceLat(LAT);          //检查纬度
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckRemarks(REMARKS);          //检查备注
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                //在数据库中检查是否存在当前设备
                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.isCheckDevice(ST) == false)
                {
                    return Json(GetResult(0, "当前设备不存在，无法编辑，请刷新设备列表！", null));      //返回错误
                }

                if (mDbDataController.UpdateDeviceBasicInfo(ST, NAME, ADDRESS, TEL, LONG, LAT, REMARKS) < 1) //编辑设备基本信息
                {
                    return Json(GetResult(0, "编辑设备信息失败，写入数据库失败！", null));
                }

                return Json(GetResult(1, "编辑设备信息成功！", null));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //修改一个设备的详细信息
        public ActionResult EditDeviceDetails(string ST, string DETAILS, int Rights)
        {
            string ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
               
                //在数据库中检查是否存在当前设备
                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.isCheckDevice(ST) == false)
                {
                    return Json(GetResult(0, "当前设备不存在，无法编辑，请刷新设备列表！", null));      //返回错误
                }

                if (mDbDataController.UpdateDeviceDetails(ST, DETAILS) < 1) //编辑设备基本信息
                {
                    return Json(GetResult(0, "编辑设备详细信息失败，写入数据库失败！", null));
                }

                return Json(GetResult(1, "编辑设备详细信息成功！", null));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }
        //获取所有要素列表
        public ActionResult GetAllEssData(int Rights)
        {
            try
            {
                if (Rights != 256 && Rights != 64)   //非法
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                return Json(GetResult(1, "获取全部编码要素表成功！", StaticJson.DataTableToJsonWithJsonNet(StaticGlobal.EssDataTable)));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //修改一个设备要素信息
        public ActionResult EditeDeviceEss(string ST, string REAL_ESS, int Rights)
        {
            string ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                
                //在数据库中检查是否存在当前设备
                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.isCheckDevice(ST) == false)
                {
                    return Json(GetResult(0, "当前设备不存在，无法编辑，请刷新设备列表！", null));      //返回错误
                }

                if (mDbDataController.UpdateDeviceEss(ST, REAL_ESS) < 1) //编辑设备要素信息
                {
                    return Json(GetResult(0, "编辑设备要素失败，写入数据库失败！", null));
                }

                return Json(GetResult(1, "编辑设备要素成功！", null));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        
        //获取当前设备绑定的用户信息
        public ActionResult GetBindUsers(String ST, int Rights)
        {
            String ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetDeviceUserList(ST); //从数据库中读取指定的用户的详细信息，只有管理员才能读取
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有绑定用户数据！", "[]"));
                }
                else
                {
                    return Json(GetResult(1, "获取数据成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                } 
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //获取当前用户绑定的设备信息
        public ActionResult GetBindDevice(string USER, int Rights)
        {
            String ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名是否合法
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetUserBindDeviceList(USER); //获取当前用户绑定的设备
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有绑定用户数据！", "[]"));
                }
                else
                {
                    return Json(GetResult(1, "获取数据成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                } 
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }
        //添加绑定用户
        public ActionResult InsertBindUser(String ST,String UserListString, int Rights)
        {
            String ErrorStr;
            string[] UserList;
            ArrayList ary = new ArrayList();
            int i, j;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                if(UserListString == null || UserListString.Length < 3)
                {
                    return Json(GetResult(0, "要绑定的用户无效", null));      //返回错误
                }
                //转换字符串为数组
                string[] StrBuff = UserListString.Split(',');
                if (StrBuff == null || StrBuff.Length == 0)
                {
                    return Json(GetResult(0, "要绑定的用户无效1", null));      //返回错误
                }

                UserList = UserListString.Split(',');
                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetDeviceUserList(ST); //从数据库中读取指定的用户的详细信息，只有管理员才能读取
                //如果当前用户已经被绑定过，则不允许再次绑定
                for (i = 0; i < StrBuff.Length; i++)
                {
                    if (mDataTable != null && mDataTable.Rows.Count > 0)
                    {
                        //寻找当前要绑定的设备是否绑定过
                        for (j = 0; j < mDataTable.Rows.Count; j++)
                        {
                            if (mDataTable.Rows[j][0].ToString() == StrBuff[i]) break; //找到了重复了
                        }
                        if (j == mDataTable.Rows.Count) //没有找到，可以添加
                        {
                            ary.Add(StrBuff[i]);
                        }
                    }
                    else
                    {
                        ary.Add(StrBuff[i]);
                    }
                }


                if (ary.Count == 0)
                {
                    return Json(GetResult(0, "要绑定的用户已经绑定过！", null));      //返回错误
                }

                UserList = new string[ary.Count];
                for (i = 0; i < ary.Count; i++)
                {
                    UserList[i] = ary[i].ToString();
                }

                if(mDbDataController.AddUserToDevice(ST, UserList) == false)    //从数据库中读取指定的用户的详细信息，只有管理员才能读取
                {
                    return Json(GetResult(1, "绑定用户失败，未知的错误！", null));
                }
                else
                {
                    return Json(GetResult(1, "绑定用户成功！", null));
                } 
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //添加绑定设备
        public ActionResult InsertBindDevice(String USER, String STListString, int Rights)
        {
            String ErrorStr;
            string[] STList;
            ArrayList ary = new ArrayList();
            int i,j;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                ErrorStr = StaticUser.CheckUserName(USER);          //检查名称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                if (STListString == null || STListString.Length < 10)
                {
                    return Json(GetResult(0, "要绑定的设备无效", null));      //返回错误
                }
                //转换字符串为数组
                string[] StrBuff = STListString.Split(',');
                if(StrBuff == null || StrBuff.Length == 0)
                {
                    return Json(GetResult(0, "要绑定的设备无效1", null));      //返回错误
                }
                DbDataController mDbDataController = new DbDataController();
                //先获取当前用户所有绑定的设备，防止重复绑定
                DataTable mDataTable = mDbDataController.GetUserBindDeviceList(USER); //获取当前用户绑定了哪些设备
                //如果当前设备已经被绑定过，则不允许再次绑定
                for (i = 0;i < StrBuff.Length; i++)
                {
                    if(mDataTable!= null && mDataTable.Rows.Count > 0) 
                    {
                        //寻找当前要绑定的设备是否绑定过
                        for(j = 0;j < mDataTable.Rows.Count;j ++)
                        {
                            if(mDataTable.Rows[j][0].ToString() == StrBuff[i]) break; //找到了重复了
                        }
                        if(j == mDataTable.Rows.Count) //没有找到，可以添加
                        {
                            ary.Add(StrBuff[i]);
                        }
                    }
                    else
                    {
                        ary.Add(StrBuff[i]);
                    }
                }


                if (ary.Count == 0)
                {
                    return Json(GetResult(0, "要绑定的设备已经绑定过！", null));      //返回错误
                }
                
                STList = new string[ary.Count];
                for (i = 0; i < ary.Count;i ++ )
                {
                    STList[i] = ary[i].ToString();
                }
                if (mDbDataController.AddBindDeviceToUser(USER, STList) == false) //添加到数据库
                {
                    return Json(GetResult(1, "绑定设备失败，未知的错误！", null));
                }
                else
                {
                    return Json(GetResult(1, "绑定设备成功！", null));
                } 
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //删除绑定用户
        public ActionResult DeleteBindUser(String ST, String UserListString, int Rights)
        {
            String ErrorStr;
            string[] UserList; 

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                if(UserListString == null || UserListString.Length < 3)
                {
                    return Json(GetResult(0, "要解除绑定的用户无效", null));      //返回错误
                }
                //转换字符串为数组
                UserList = UserListString.Split(',');
                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.DeleteUserToDevice(ST, UserList) == false) //从数据库中删除指定的用户的详细信息，只有管理员才能读取
                {
                    return Json(GetResult(1, "解除绑定用户失败，未知的错误！", null));
                }
                else
                {
                    return Json(GetResult(1, "解除绑定用户成功！", null));
                } 
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //删除绑定设备
        public ActionResult DeleteBindDevice(String USER, String STListString, int Rights)
        {
            String ErrorStr;
            string[] STList;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                if (STListString == null || STListString.Length < 10)
                {
                    return Json(GetResult(0, "要解除绑定的设备无效", null));      //返回错误
                }
                //转换字符串为数组
                STList = STListString.Split(',');
                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.DeleteDeviceToUser(USER, STList) == false) //从数据库中删除指定的用户的详细信息，只有管理员才能读取
                {
                    return Json(GetResult(1, "解除绑定设备失败，未知的错误！", null));
                }
                else
                {
                    return Json(GetResult(1, "解除绑定设备成功！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }


        //获取所有设备的编号与名称信息
        public ActionResult GetAllDeviceStList(int Rights)
        {
            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetGeneralDeviceStList(); //从数据库中读取所有的普通用户的名称信息，只有管理员才能读取
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有设备！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "发生了异常！", null));
            }
        }


        //删除一个设备
        public ActionResult DeleteDevice(String ST, int Rights)
        {
            String ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.DeleteDevice(ST) < 0) //从数据库中删除指定的设备，并且会删除对应的用户绑定数据
                {
                    return Json(GetResult(1, "删除设备失败，未知的错误！", null));
                }
                else
                {
                    return Json(GetResult(1, "删除设备成功！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

       
        //获取当前用户所有设备列表
         public ActionResult GetUserDeviceList(string USER, int Rights)
        {
            string ErrorStr;

            try
            {
                ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable;
                if (Rights == 256)   //非管理员
                {
                    mDataTable = mDbDataController.GetAllDeviceList(); //获取所有的设备列表，包含设备所属分组 [0]:站点编号；[1]:站点名称；[2]:站点分组
                }
                else //普通用户
                {
                    mDataTable = mDbDataController.GetUserDeviceList(USER); //获取用户的设备列表，包含设备所属分组 [0]:站点编号；[1]:站点名称；[2]:站点分组
                }

                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有设备！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "发生了异常！", null));
            }
        }

         //获取当前用户所有图片设备列表
         public ActionResult GetUserPicDeviceList(string USER, int Rights)
         {
             string ErrorStr;

             try
             {
                 ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名
                 if (ErrorStr != null)
                 {
                     return Json(GetResult(0, ErrorStr, null));      //返回错误
                 }

                 DbDataController mDbDataController = new DbDataController();
                 DataTable mDataTable;
                 if (Rights == 256)   //非管理员
                 {
                     mDataTable = mDbDataController.GetAllPicDeviceList(); //获取所有的图片设备列表，包含设备所属分组 [0]:站点编号；[1]:站点名称；[2]:站点分组
                 }
                 else //普通用户
                 {
                     mDataTable = mDbDataController.GetUserPicDeviceList(USER); //获取用户的图片设备列表，包含设备所属分组 [0]:站点编号；[1]:站点名称；[2]:站点分组
                 }

                 if (mDataTable == null)
                 {
                     return Json(GetResult(1, "没有设备！", null));
                 }
                 else
                 {
                     return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                 }
             }
             catch (Exception e)
             {
                 SystemLog.Write(e.StackTrace + e.Message);  //日志

                 return Json(GetResult(0, "发生了异常！", null));
             }
         }

         //获取指定设备的实时数据
         public ActionResult GetDeviceRealData(string ST_List)
         {
             try
             {
                 if(ST_List==null || ST_List.Length < 10)
                 {
                     return Json(GetResult(0, "无效的编号列表", null));      //返回错误
                 }
                 String[] STArray = ST_List.Split(',');                     //获取ST
                 DbDataController mDbDataController = new DbDataController();
                 DataTable mDataTable = mDbDataController.GetRealData(STArray); //从数据库中读取当前设备实时数据
                 if (mDataTable == null)
                 {
                     return Json(GetResult(1, "没有数据！", null));
                 }
                 else
                 {
                     return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                 }
             }
             catch (Exception e)
             {
                 SystemLog.Write(e.StackTrace + e.Message);  //日志

                 return Json(GetResult(0, "发生了异常！", null));
             }
         }


        //获取指定的索引id的设备信息
        public ActionResult GetDeviceInfoList(string SerialListString)
        {
            try
            {
                if (SerialListString == null)
                {
                    return Json(GetResult(1, "请求的信息为空！", null));
                }
                string[] SerialList = SerialListString.Split(',');

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetGeneralDeviceInfoListForSerial(SerialList); //从数据库中读取指定的设备信息，使用主键读取
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有数据！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

         //获取指定的ST设备的设备信息
        public ActionResult GetDeviceInfoListForST(string STListString)
        {
            try
            {
                if (STListString == null)
                {
                    return Json(GetResult(1, "请求的信息为空！", null));
                }
                string[] ST_List = STListString.Split(',');

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetDeviceInfo(ST_List); //从数据库中读取指定的设备信息，使用ST读取
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有数据！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }





        //获取指定用户的所有分组列表
        public ActionResult GetUserGroupList(string USER, int Rights)
        {
            string ErrorStr;

            try
            {
                ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                if (Rights == 256)
                {
                    return Json(GetResult(1, "没有数据", null));
                }

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetUserGroupList(USER); //从数据库中读取指定的用户分组列表
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有数据！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }


        //给指定用户添加分组
        public ActionResult AddDeviceGroup(string USER,string GROUP,int Rights)
        {
            string ErrorStr;
            int status;

            try
            {
                if(Rights == 256)
                {
                    return Json(GetResult(0, "不允许添加用户分组！", null));
                }
                ErrorStr = StaticUser.CheckGroupName(GROUP);          //检查分组名称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }


                DbDataController mDbDataController = new DbDataController();
                //检查数据库中是否含有当前用户分组
                status = mDbDataController.FindDeviceUserGroup(USER, GROUP);
                if(status < 0)
                {
                    return Json(GetResult(0, "数据库错误！", null));
                }
                else if(status > 0)
                {
                    return Json(GetResult(0, "当前分组已经存在！", null));
                }
                status = mDbDataController.AddUserGroup(USER, GROUP);           //添加用户分组
                if (status < 1)
                {
                    return Json(GetResult(0, "添加用户失败！", null));
                }
                else
                {
                    return Json(GetResult(1, "添加用户成功！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }


        //修改用户分组绑定的设备
        public ActionResult UpdateGroupBindDevice(string USER, string GROUP, string ST_List,string DST_List, int Rights)
        {
            string ErrorStr;
            int status;
            string[] AddBindSTList = null; 
            string[] DeleteBindSTList = null; 

            try
            {
                if(Rights == 256)
                {
                    return Json(GetResult(0, "不允许修改分组设备！", null));
                }
                ErrorStr = StaticUser.CheckGroupName(GROUP);          //检查分组名称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                if(GROUP==null || (ST_List==null && DST_List==null))
                {
                    return Json(GetResult(0, "无效的参数", null));      //返回错误
                }

                DbDataController mDbDataController = new DbDataController();
                //检查数据库中是否含有当前用户分组
                status = mDbDataController.FindDeviceUserGroup(USER, GROUP);
                if(status < 0)
                {
                    return Json(GetResult(0, "数据库错误！", null));
                }
                else if(status == 0)
                {
                    return Json(GetResult(0, "当前分组不存在！", null));
                }

                if (ST_List != null && ST_List.Length > 0) //获取需要添加绑定的设备列表
                {
                    AddBindSTList = ST_List.Split(',');
                }
                if (DST_List != null && DST_List.Length > 0) //获取需要解除绑定的设备列表
                {
                    DeleteBindSTList = DST_List.Split(',');
                }

                 //批量修改用户的某个分组的设备列表
                if (mDbDataController.UpdateDevicesBindingGroup(USER, GROUP, AddBindSTList, DeleteBindSTList) == false)
                {
                    return Json(GetResult(0, "修改分组设备列表失败！", null));
                }
                else
                {
                    return Json(GetResult(1, "修改分组设备列表成功！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }
        
        //删除一个分组
        public ActionResult DeleteUserGroup(string USER, string GROUP, int Rights)
        {
            string ErrorStr;
            int status;
          
            try
            {
                if(Rights == 256)
                {
                    return Json(GetResult(0, "不允许删除分组！", null));
                }
                if (GROUP == null)
                {
                    return Json(GetResult(0, "无效的参数", null));      //返回错误
                }
                ErrorStr = StaticUser.CheckGroupName(GROUP);          //检查分组名称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                

                DbDataController mDbDataController = new DbDataController();
                //检查数据库中是否含有当前用户分组
                status = mDbDataController.FindDeviceUserGroup(USER, GROUP);
                if(status < 0)
                {
                    return Json(GetResult(0, "数据库错误！", null));
                }
                else if(status == 0)
                {
                    return Json(GetResult(0, "当前分组不存在！", null));
                }


                //删除分组
                if (mDbDataController.DeleteDeviceUserGroup(USER, GROUP) < 0)
                {
                    return Json(GetResult(0, "删除分组失败！", null));
                }
                else
                {
                    return Json(GetResult(1, "删除分组成功！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //获取历史数据信息
        public ActionResult GetHistDataInfo(string ST, string StartTime, string EndTime, bool isASC)
        {
            string ErrorStr;
            uint cnt;
          
            try
            {
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }


                DbDataController mDbDataController = new DbDataController();
                //获取历史数据条数
                cnt = mDbDataController.GetHistDataCnt(ST, StartTime, EndTime);
                return Json(GetResult(1, "返回数据成功", cnt));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }
 
        //获取历史数据
        public ActionResult GetHistData(string ST, string StartTime, string EndTime, bool isASC, UInt32 StartIndex, UInt32 ReadCnt)
        {
            string ErrorStr;
          
            try
            {
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }


                DbDataController mDbDataController = new DbDataController();
                //获取历史数据
                //2019-01-14 增加一次获取的历史数据条数限制
                if (ReadCnt > 20000) ReadCnt = 20000;
                DataTable mDataTable = mDbDataController.GetHistData(ST, StartTime, EndTime, StartIndex, ReadCnt, isASC); //获取历史数据
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有数据！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //获取整点历史数据信息2019-02-19
        public ActionResult GetIntegerHistDataInfo(string ST, string StartTime, string EndTime, bool isASC)
        {
            string ErrorStr;
            uint cnt;

            try
            {
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }


                DbDataController mDbDataController = new DbDataController();
                //获取历史数据条数
                cnt = mDbDataController.GetIntegerHistDataCnt(ST, StartTime, EndTime);
                return Json(GetResult(1, "返回数据成功", cnt));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //获取整点历史数据
        public ActionResult GetIntegerHistData(string ST, string StartTime, string EndTime, bool isASC, UInt32 StartIndex, UInt32 ReadCnt)
        {
            string ErrorStr;

            try
            {
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }


                DbDataController mDbDataController = new DbDataController();
                //获取历史数据
                //2019-01-14 增加一次获取的历史数据条数限制
                if (ReadCnt > 20000) ReadCnt = 20000;
                DataTable mDataTable = mDbDataController.GetIntegerHistData(ST, StartTime, EndTime, StartIndex, ReadCnt, isASC); //获取历史数据
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有数据！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //修改当前设备的分组
        public ActionResult UpdateDeviceBindGroup(string USER, string ST, string GROUP, int Rights)
        {
            string ErrorStr;
            int status;

            try
            {
                if(Rights == 256)
                {
                    return Json(GetResult(0, "不允许修改分组设备！", null));
                }

                ErrorStr = StaticUser.CheckGroupName(GROUP);          //检查分组名称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查设备编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                if (GROUP == null || ST == null)
                {
                    return Json(GetResult(0, "无效的参数", null));      //返回错误
                }

                DbDataController mDbDataController = new DbDataController();
                status = mDbDataController.UpdateBindingDeviceGroup(USER, ST, GROUP);   //编辑当前设备分组
                if (status > 0)
                {
                    return Json(GetResult(1, "修改设备分组成功！", null));
                    
                }
                else
                {
                    return Json(GetResult(0, "修改设备分组失败！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }



        //获取当前用户所有视频信息
        public ActionResult GetUserVideoList(string USER, int Rights)
        {
            string ErrorStr;

            try
            {
                ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable;
                if (Rights == 256)   //管理员
                {
                    mDataTable = mDbDataController.GetAllVideoList(); //获取所有的视频列表
                }
                else //普通用户
                {
                    mDataTable = mDbDataController.GetUserVideoList(USER); //获取用户的视频设备列表
                }

                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有视频设备！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "发生了异常！", null));
            }
        }


        //获取当前设备实时图片信息
        public ActionResult GetDeviceRealPicInfo(string ST)
        {
            string ErrorStr;


            try
            {
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable;
               
                mDataTable = mDbDataController.GetTelPicInfo(ST, DateTime.Now.AddDays(-30).ToString("yyyy-MM-dd HH:mm:ss"), DateTime.Now.AddMinutes(30).ToString("yyyy-MM-dd HH:mm:ss"), 24);//获取图片信息
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有图片数据！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "发生了异常！", null));
            }
        }

        //获取当前设备历史图片信息
        public ActionResult GetDeviceHistPicInfo(string ST, string StartTime, string EndTime)
        {
            string ErrorStr;


            try
            {
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable;

                mDataTable = mDbDataController.GetTelPicInfo(ST, StartTime, EndTime, 86400);//获取图片信息
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有图片数据！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "发生了异常！", null));
            }
        }

        //修改一个视频的基本信息
        public ActionResult EditVideoBasicInfo(UInt32 SERIAL,string NAME, string URL, string H5URL,  string REMARKS, string ST, int Rights)
        {
            string ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                ErrorStr = StaticUser.CheckDeviceName(NAME);          //检查名称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckURL(URL);                //检查URL
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                if (H5URL != null && H5URL.Length > 0) //如果设置了H5URL则进行验证
                {
                    ErrorStr = StaticUser.CheckURL(H5URL);                //检查URL
                    if (ErrorStr != null)
                    {
                        return Json(GetResult(0, ErrorStr, null));      //返回错误
                    }
                }
                ErrorStr = StaticUser.CheckRemarks(REMARKS);          //检查备注
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                //在数据库中修改当前设备信息
                DbDataController mDbDataController = new DbDataController();
                if(mDbDataController.UpdateVideoBasicInfo(SERIAL, NAME, URL,H5URL, REMARKS,ST) < 1)
                {
                    return Json(GetResult(0, "编辑设备信息失败，写入数据库失败！", null));
                }

                return Json(GetResult(1, "编辑设备信息成功！", null));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //添加一个视频
        public ActionResult AddVideo(string NAME, string URL, string H5URL, string REMARKS, string ST, int Rights)
        {
            string ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                ErrorStr = StaticUser.CheckDeviceName(NAME);          //检查名称
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                ErrorStr = StaticUser.CheckURL(URL);                //检查URL
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                if (H5URL != null && H5URL.Length > 0) //如果设置了H5URL则进行验证
                {
                    ErrorStr = StaticUser.CheckURL(H5URL);                //检查URL
                    if (ErrorStr != null)
                    {
                        return Json(GetResult(0, ErrorStr, null));      //返回错误
                    }
                }
                ErrorStr = StaticUser.CheckRemarks(REMARKS);          //检查备注
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                //在数据库中添加
                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.AddVideo(NAME, URL, H5URL, REMARKS, ST) < 1)
                {
                    return Json(GetResult(0, "编辑设备信息失败，写入数据库失败！", null));
                }

                return Json(GetResult(1, "编辑设备信息成功！", null));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }


        //删除一个视频设备
        public ActionResult DeleteVideo(UInt32 SERIAL, int Rights)
        {
            //String ErrorStr;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.DeleteVideo(SERIAL) < 0) //从数据库中删除指定的设备，并且会删除对应的用户绑定数据
                {
                    return Json(GetResult(1, "删除设备失败，未知的错误！", null));
                }
                else
                {
                    return Json(GetResult(1, "删除设备成功！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }




        //获取一个视频设备绑定的用户
        public ActionResult GetVideoUserList(UInt32 SERIAL, int Rights)
        {
            //String ErrorStr;
            DataTable mDataTable;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }

                DbDataController mDbDataController = new DbDataController();
                mDataTable = mDbDataController.GetVideoUserList(SERIAL);//获取当前视频绑定的用户
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有绑定用户！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //删除视频绑定用户
        public ActionResult DeleteVideoBindUser(UInt32 SERIAL, String UserListString, int Rights)
        {
            string[] UserList;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                if (SERIAL == 0)
                {
                    return Json(GetResult(0, "无效的SERIAL", null));      //返回错误
                }
                if (UserListString == null || UserListString.Length < 3)
                {
                    return Json(GetResult(0, "要解除绑定的用户无效", null));      //返回错误
                }
                //转换字符串为数组
                UserList = UserListString.Split(',');
                DbDataController mDbDataController = new DbDataController();
                if (mDbDataController.DeleteUserToVideoDevice(SERIAL, UserList) == false) //从数据库中删除指定的用户的详细信息，只有管理员才能读取
                {
                    return Json(GetResult(1, "解除绑定用户失败，未知的错误！", null));
                }
                else
                {
                    return Json(GetResult(1, "解除绑定用户成功！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }


        //添加视频绑定用户
        public ActionResult InsertVideoBindUser(UInt32 SERIAL, String UserListString, int Rights)
        {
            string[] UserList;
            ArrayList ary = new ArrayList();
            int i, j;

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                if (SERIAL == 0)
                {
                    return Json(GetResult(0, "无效的SERIAL", null));      //返回错误
                }
                if (UserListString == null || UserListString.Length < 3)
                {
                    return Json(GetResult(0, "要绑定的用户无效", null));      //返回错误
                }
                //转换字符串为数组
                string[] StrBuff = UserListString.Split(',');
                if (StrBuff == null || StrBuff.Length == 0)
                {
                    return Json(GetResult(0, "要绑定的用户无效1", null));      //返回错误
                }

                UserList = UserListString.Split(',');
                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetVideoUserList(SERIAL); //从数据库中读取指定的用户的详细信息，只有管理员才能读取
                //如果当前用户已经被绑定过，则不允许再次绑定
                for (i = 0; i < StrBuff.Length; i++)
                {
                    if (mDataTable != null && mDataTable.Rows.Count > 0)
                    {
                        //寻找当前要绑定的设备是否绑定过
                        for (j = 0; j < mDataTable.Rows.Count; j++)
                        {
                            if (mDataTable.Rows[j][0].ToString() == StrBuff[i]) break; //找到了重复了
                        }
                        if (j == mDataTable.Rows.Count) //没有找到，可以添加
                        {
                            ary.Add(StrBuff[i]);
                        }
                    }
                    else
                    {
                        ary.Add(StrBuff[i]);
                    }
                }


                if (ary.Count == 0)
                {
                    return Json(GetResult(0, "要绑定的用户已经绑定过！", null));      //返回错误
                }

                UserList = new string[ary.Count];
                for (i = 0; i < ary.Count; i++)
                {
                    UserList[i] = ary[i].ToString();
                }

                if (mDbDataController.AddUserToVideoDevice(SERIAL, UserList) == false)    //执行添加
                {
                    return Json(GetResult(1, "绑定用户失败，未知的错误！", null));
                }
                else
                {
                    return Json(GetResult(1, "绑定用户成功！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //人工置数
        public ActionResult ManualSetData(String ST,String TT, String Ess_List,String Data_List, int Rights)
        {
            string[] UserList;
            ArrayList ary = new ArrayList();
            int i, j;
            String ErrorStr;
            DbDataController mDbDataController = new DbDataController();

            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }
                //检查TT
                if (TT == null || TT.Length == 0)
                {
                    return Json(GetResult(0, "无效的观测时间", null));      //返回错误
                }

                uint cnt = mDbDataController.GetHistDataCnt(ST, TT, TT);    //先查询当前数据是否存在
                if(cnt > 0)
                {
                    return Json(GetResult(0, "当前数据已经存在！", null));      //返回错误
                }

                //要素转换字符串为数组
                string[] EssListBuff = Ess_List.Split(',');
                if (EssListBuff == null || EssListBuff.Length == 0)
                {
                    return Json(GetResult(0, "无有效的要素", null));      //返回错误
                }
                //数据转换字符串为数组
                string[] DataListBuff = Data_List.Split(',');
                if (DataListBuff == null || DataListBuff.Length == 0)
                {
                    return Json(GetResult(0, "无有效的要素", null));      //返回错误
                }
                if(EssListBuff.Length!=DataListBuff.Length)
                {
                    return Json(GetResult(0, "要素与数据种类不对应", null));      //返回错误
                }


                bool status = mDbDataController.InsertHistData(ST, TT, EssListBuff, DataListBuff); //从数据库中读取指定的用户的详细信息，只有管理员才能读取

                if (status == false)    //执行添加
                {
                    return Json(GetResult(1, "插入数据到数据库失败！", null));
                }
                else
                {
                    return Json(GetResult(1, "插入数据成功！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //获取报警记录数量
        public ActionResult GetAlarmDataCount(string USER,string ST,string AlarmEss, string StartTime, string EndTime, bool isASC)
        {
            string ErrorStr;
            uint cnt;

            try
            {
                ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }


                DbDataController mDbDataController = new DbDataController();
                //判断用户是否存在
                if (mDbDataController.isGetUserName(USER) == false)
                {
                    return Json(GetResult(0, "不存在的用户", null));      //返回错误
                }


                //获取报警数据条数
                cnt = mDbDataController.GetAlarmDataCnt(USER, ST, AlarmEss, StartTime, EndTime);
                return Json(GetResult(1, "返回数据成功", cnt));
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //获取报警数据
        public ActionResult GetAlarmData(string USER, string ST, string AlarmEss, string StartTime, string EndTime, bool isASC, UInt32 StartIndex, UInt32 ReadCnt)
        {
            string ErrorStr;

            try
            {
                ErrorStr = StaticUser.CheckUserName(USER);          //检查用户名
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }


                DbDataController mDbDataController = new DbDataController();
                //判断用户是否存在
                if (mDbDataController.isGetUserName(USER) == false)
                {
                    return Json(GetResult(0, "不存在的用户", null));      //返回错误
                }

                //获取报警历史数据
                DataTable mDataTable = mDbDataController.GetAlarmData(USER, ST, AlarmEss, StartTime, EndTime, StartIndex, ReadCnt, isASC); //获取历史数据
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有数据！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }





        //获取一个设备的详细信息
        public ActionResult GetDeviceDetails(String ST, int Rights)
        {
            try
            {
                if (Rights != 256)   //非管理员
                {
                    return Json(GetResult(0, "拒绝访问！", null));
                }
                String ErrorStr = StaticUser.CheckDeviceNumber(ST);          //检查站点编号
                if (ErrorStr != null)
                {
                    return Json(GetResult(0, ErrorStr, null));      //返回错误
                }

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetDeviceDetails(ST);      //获取当前ST的详细信息
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有数据！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "发生了异常！", null));
            }
        }










        //从session中判断用户是否登录<0:未登录，0：普通用户；1：管理员
        public int CheckUserLogin()
        {
            try
            {
                string pRights;

                if ((Session["UserName"] != null) && (Session["PasswordMD5"] != null) && (Session["LoginStatus"] != null) && (Session["LoginStatus"].ToString() == "Login Success"))                 //获取全局用户名称
                {
                    //权限处理
                    if (Session["Rights"] == null || Session["Rights"].ToString() == "0")
                    {
                        return -1;
                    }
                     pRights = Session["Rights"].ToString();
                    

                    if (pRights == "256") //超级管理员
                    {
                        return 1;
                    }
                    else if (pRights == "64")
                    {
                        return 0;
                    }
                }
            }
            catch (Exception e)
            {

                SystemLog.Write(e.StackTrace + e.Message);  //日志
            }

            return -1;
        }

        //微信用户登录，进行绑定判断
        public bool WeixinLogin(string UserName, string Openid)
        {
            try
            {
                int status = 0;
                DbDataController mDbDataController = new DbDataController();
                //DataTable mDataTable;

                
                String BindName = mDbDataController.GetWeixinBindUserName(Openid);
                if (BindName != null)           //先验证是否已经绑定过用户，并且绑定的用户发生了变化
                {
                    if (BindName != UserName)   //绑定的用户一样，直接返回
                    {
                        mDbDataController.DeleteWeixinBindUser(Openid); //先删除微信绑定的用户
                    }
                    else return true;
                }

                status = mDbDataController.SetWeixinBindUserName(Openid, UserName);//添加绑定
                
                
                if (status > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }

            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return false;
            }
        }


        //微信解除用户绑定
        public ActionResult WeixinUnbind(string Openid)
        {
            try
            {
                DbDataController mDbDataController = new DbDataController();
                //DataTable mDataTable;

                
                int status = mDbDataController.DeleteWeixinBindUser(Openid);
                if (status > 0)           //先验证是否已经绑定过用户，并且绑定的用户发生了变化
                {
                    //去掉登录的状态
                    Session["UserName"] = "";               //存储全局用户名称
                    Session["Password"] = "";               //存储全局用户密码MD5
                    Session["LoginStatus"] = "";           //登录状态
                    Session["Openid"] = "";                 //存储openid

                    return Json(GetResult(1, "解除绑定成功！", null));
                }
                else if(status == 0)
                {
                    //去掉登录的状态
                    Session["UserName"] = "";               //存储全局用户名称
                    Session["Password"] = "";               //存储全局用户密码MD5
                    Session["LoginStatus"] = "";           //登录状态
                    Session["Openid"] = "";                 //存储openid

                    return Json(GetResult(0, "解除绑定失败，当前用户不存在！", null));
                }
                else
                {
                    return Json(GetResult(0, "解除绑定失败，服务器异常！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "解除绑定失败，服务器异常！", null));
            }
        }


        //获取微信图片
        public ActionResult GetWeixinPicture(string Openid)
        {
            try
            {
                if(Openid == null)
                {
                    return Json(GetResult(0, "获取图片失败！", null));
                }

                DbDataController mDbDataController = new DbDataController();
                //DataTable mDataTable;


                string picture = mDbDataController.GetWeixinPicture(Openid);
                if (picture == null)          
                {
                    return Json(GetResult(0, "获取图片失败！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取图片成功！", picture));
                }
               
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "获取图片失败！", null));
            }
        }



        //获取指定的用户指定的ST设备的设备报警配置数据
        public ActionResult GetDeviceAlarmConfigForST(string USER, string STListString)
        {
            try
            {
                if (STListString == null || USER==null)
                {
                    return Json(GetResult(1, "请求的信息为空！", null));
                }
                string[] ST_List = STListString.Split(',');

                DbDataController mDbDataController = new DbDataController();
                DataTable mDataTable = mDbDataController.GetUserDeviceConfig(USER, ST_List); //从数据库中读取指定的设备信息，使用ST读取
                if (mDataTable == null)
                {
                    return Json(GetResult(1, "没有数据！", null));
                }
                else
                {
                    return Json(GetResult(1, "获取成功！", StaticJson.DataTableToJsonWithJsonNet(mDataTable)));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        //设置指定的用户指定的ST设备的设备报警配置数据
        public ActionResult UpdateDeviceAlarmConfigForST(string USER, string ST, int A_ENABLE, int A_INTERVAL, string A_CONFIG)
        {
            try
            {
                if (ST == null || USER == null || A_CONFIG == null)
                {
                    return Json(GetResult(1, "请求的信息为空！", null));
                }
      
                //测试一下A_CONFIG是否为正确的json
                if(StaticJson.JsonToObject(A_CONFIG, new DEVICE_ALARM_CONFIG()) == null)
                {
                    return Json(GetResult(0, "无效的配置数据！", null));
                }
                DbDataController mDbDataController = new DbDataController();
                int status = mDbDataController.UpdateUserDeviceConfig(USER, ST,A_ENABLE,A_INTERVAL,A_CONFIG); //更新到数据库
                if (status < 0)
                {
                    return Json(GetResult(1, "配置失败！", null));
                }
                else
                {
                    return Json(GetResult(1, "配置成功！", null));
                }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

                return Json(GetResult(0, "服务器发生了异常！", null));
            }
        }

        #region 辅助方法
        /// <summary>  
        /// 获取结果集  
        /// </summary>  
        /// <param name="rel">状态</param>  
        /// <param name="msg">提示信息</param>  
        /// <param name="data">数据集</param>  
        /// <returns></returns>  
        public static object GetResult(int rel, string msg, object data)
        {
            return new Dictionary<string, object> { { "rel", rel }, { "msg", msg }, { "obj", data } };
        }

        /// <summary>  
        /// 保存Cookie  
        /// </summary>  
        /// <param name="key">键</param>  
        /// <param name="value">值</param>  
        /// <param name="expires">过期时间</param>  
        public void SaveCookie(string key, string value, DateTime expires)
        {
            var httpCookie = System.Web.HttpContext.Current.Response.Cookies[key];
            if (httpCookie == null) return;
            httpCookie.Value = value;
            httpCookie.Expires = expires;
        }
        /// <summary>  
        /// 检索Cookie  
        /// </summary>  
        /// <param name="key">键</param>  
        /// <returns></returns>  
        public string RetrieveCookie(string key)
        {
            var cookie = System.Web.HttpContext.Current.Request.Cookies[key];
            var name = "";
            if (cookie != null)
                name = cookie.Value;
            return name;
        }
        #endregion  


    }

    

}
