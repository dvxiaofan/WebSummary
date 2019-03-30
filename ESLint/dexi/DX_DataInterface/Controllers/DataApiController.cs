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
    public class DataApiController : Controller
    {
        //
        // GET: /Api/

        public ActionResult GetRealTimeData()
        {
            try
            {
                JsonResult jsonResult = new JsonResult();
                jsonResult.Data = StaticJson.DefaultResponseJsonStructPack(1, "测试编号1510260128", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                jsonResult.ContentEncoding = null;                                      //只能设置为null,不知为何，其它值会导致错误500
                jsonResult.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
                jsonResult.ContentType = "application/json";    //内容
                jsonResult.MaxJsonLength = int.MaxValue;       //最大长度
                jsonResult.RecursionLimit = 50;                 //递归限制

                return jsonResult;
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志
                throw;
            }
        }



        [HttpPost]
        public ActionResult GetRealTimeData(string value)
        {
            try
            {
                JsonResult jsonResult = new JsonResult();
                jsonResult.Data = StaticJson.DefaultResponseJsonStructPack(1, "测试编号1510260128", DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"));
                jsonResult.ContentEncoding = null;                                      //只能设置为null,不知为何，其它值会导致错误500
                jsonResult.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
                jsonResult.ContentType = "application/json";    //内容
                jsonResult.MaxJsonLength = int.MaxValue;       //最大长度
                jsonResult.RecursionLimit = 50;                 //递归限制

                return jsonResult;
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志

            }
            return null;
        }

        //获取一个用户所有的设备列表
      
        public ActionResult GetUserTelList(GetUserTelListModels modles)
        {
            DbDataController mDbDataController = new DbDataController();
            DataTable mDataTable;

            //是否为Ajax请求  
            if (!Request.IsAjaxRequest())  
                return null;

            try
            {
               if(modles.Operation == "GetUserTelList")
               {
                   //身份验证-使用用户名与密码md5进行验证
                   if(mDbDataController.AuthenticationMD5(modles.UserName, modles.PasswordMD5) != null)
                   {
                       mDataTable = mDbDataController.GetUserTelName(modles.UserName);  //获取指定用户的所有设备列表包含站点名称信息,[0]:站点名称；[1]:站点编号
                       return StaticActionResult.JsonActionResult(StaticJson.DataTableToJsonWithJsonNet(mDataTable));
                   }
                   else
                   {
                       return StaticActionResult.JsonActionResult("用户名与密码验证失败");
                   }
               }
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志
            }

            return null;
        }


        //
        // POST: /Api/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Api/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Api/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Api/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Api/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
