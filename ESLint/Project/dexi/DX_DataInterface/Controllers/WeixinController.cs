using DX_DataInterface.Models;
using MVC01.Controllers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DX_DataInterface.Controllers
{
    public class WeixinController : Controller
    {
        //
        // GET: /Weixin/WeixinApi

        public ActionResult WeixinApi()
        {
            return View();
        }

       // GET: /Weixin/WeixinUserInfo
        public ActionResult WeixinUserInfo(String state,String p, String id)
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
                        return View();
                    }

                    DataTable mDataTable = mDbDataController.GetWeixinBindUserInfo(openid); //从数据库中读取指定的微信绑定的用户信息
                    if(mDataTable!=null && mDataTable.Rows.Count > 0)       //当前微信已经绑定过用户
                    {
                        //获取

                        String UserName = mDataTable.Rows[0]["USER"].ToString();    //获取用户名
                        String PasswordMD5 = mDataTable.Rows[0]["PASSWORD_MD5"].ToString();    //获取密码
                        //保存帐户登录名  
                        //SaveCookie("UserName", UserName, DateTime.Now.AddDays(30));  //保存cookie 30天
                        //保存密码
                        //SaveCookie("PasswordMD5", PasswordMD5, DateTime.Now.AddDays(30));  //保存cookie 30天
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
                        return View();
                    }
                }          
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志
            }

            return View();
        }


        [HttpPost]
        public ActionResult WeixinApi(WeixinModel model)
        {
           try
           {
                if (model.GetFun == "WeixinPayAttention") //关注微信公众号
                {
                    if(model.data != null)
                    {
                        return WeixinPayAttention(model.data);
                    }
                }
           }
           catch (Exception error)
           {
               SystemLog.Write("WeixinApi，" + error.Message + error.StackTrace);    //写入日志
           }

           
            return null;
        }



        //获取用户相关信息
        public ActionResult WeixinPayAttention(string json)
        {
            UniversalResponse resp = new UniversalResponse();
            DbDataController mDbDataController = new DbDataController();
            DataTable mDataTable;
            int status;

            resp.obj = null;
            try
            {
               

                WeixinUserInfo info = new WeixinUserInfo();

                info = (WeixinUserInfo)StaticJson.JsonToObject(json, info);
                if (info == null || info.openid == null)
                {
                    resp.rel = 0;
                    resp.msg = "无效的数据";
                }
                else
                {
                    mDataTable = mDbDataController.GetWeixinUser(info.openid);
                    if (mDataTable != null && mDataTable.Rows.Count>0) //已经存在
                    {
                        status = mDbDataController.UpdateWeixinUser(info);
                    }
                    else
                    {
                        status = mDbDataController.AddWeixinUser(info);
                    }
                    if(status <= 0)
                    {
                        resp.rel = 0;
                        resp.msg = "添加数据到数据库失败";
                    }
                    else
                    {
                        resp.rel = 1;
                        resp.msg = "添加/修改成功";
                    }
                }

                return Json(resp);
            }
            catch (Exception e)
            {

                SystemLog.Write(e.StackTrace + e.Message);  //日志

                resp.rel = 0;
                resp.msg = "发生了异常，"+e.Message;
                return Json(resp);
            }
        }



       
    }



    public class WeixinModel
    {
        public string GetFun { get; set; } //操作码
        public string data { get; set; } //数据
    }


}
