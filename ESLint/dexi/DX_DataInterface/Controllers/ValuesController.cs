using DX_DataInterface.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Mvc;


namespace DX_DataInterface.Controllers
{
    public class ValuesController : DataApiController
    {
        // GET api/values
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

         
        // GET api/Tes/
        public JsonResult GetPerson()
        {
            var p = new Person();
            p.Name = "张三";
            p.Age = 18;//张三一直年轻

            var json = new JsonResult();
            json.Data = p;
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            return json;
        }



        // POST api/values
        public JsonResult Post([FromBody]string value)
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

              /* //响应数据
                return new HttpResponseMessage
                {
                    Content = new StringContent(
                        StaticJson.DefaultResponseJsonStructPack(1, "1510260128", DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss")),
                        System.Text.Encoding.UTF8, "application/json")
                };*/
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志
                throw;
            }
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }

    public class Person
    {
        public string Name { get; set; }

        public int Age { get; set; }
    }
}