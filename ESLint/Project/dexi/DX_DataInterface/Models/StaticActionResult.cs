using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.Data;
using System.IO;
using System.Web.Mvc;


namespace DX_DataInterface.Models
{
    public static class StaticActionResult
    {
        public static JsonResult JsonActionResult(string JsonData)
        {

            try
            {
                JsonResult jsonResult = new JsonResult();
                jsonResult.Data = JsonData;
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

    }

}