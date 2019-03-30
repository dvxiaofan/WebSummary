using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.Data;
using System.IO;
using Newtonsoft.Json.Converters;


namespace DX_DataInterface.Models
{
    public static class StaticJson
    {
        //DataTable to Json
        public static string DataTableToJsonWithJsonNet(DataTable table)
        {
            try
            {
                string jsonString = string.Empty;

                //自定义时间格式，防止中间带了T
                IsoDateTimeConverter timeConverter = new IsoDateTimeConverter { DateTimeFormat = "yyyy'-'MM'-'dd HH':'mm':'ss" };
                jsonString = JsonConvert.SerializeObject(table, Formatting.Indented, timeConverter);

                //jsonString = JsonConvert.SerializeObject(table);
                return jsonString;
            }
            catch (Exception e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志
            }

            return "{}";
        }

        public static string DefaultResponseJsonStructPack(int Serial, string ST, string Time)
        {
            if ((ST == null) || (Time == null)) return null;

            
            try
            {
                DefaultResponseJsonStruct mJsonStruct = new DefaultResponseJsonStruct();
                mJsonStruct.FLAGE = 2;                      //通信标记，下传数据
                mJsonStruct.SERIAL = Serial;                //流水号
                mJsonStruct.ST = ST;                        //站点编号
                mJsonStruct.TIME = Time;                    //实时时间


                JsonSerializer serializer = new JsonSerializer();
                StringWriter sw = new StringWriter();
                sw = new StringWriter();
                serializer.Serialize(new JsonTextWriter(sw), mJsonStruct);
                return sw.GetStringBuilder().ToString();
            }
            catch (Exception e)
            {
                return null;
            }
        }

        
        // 从一个对象信息生成Json串       
        public static string ObjectToJson(object obj)        
        {   
            try
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(obj);        
            }
            catch (Exception e)
            {
                return null;
            }
            
        }   
     

        // 从一个Json串生成对象信息        
        public static object JsonToObject(string jsonString, object obj)
        {
            try
            {
                return Newtonsoft.Json.JsonConvert.DeserializeObject(jsonString, obj.GetType());
            }
            catch (Exception e)
            {
                return null;
            }

        }
    }

     //通用响应数据
    public class UniversalResponse
    {
        public int rel { get; set; }        //状态
        public string msg { get; set; }      //消息
        public Object obj { get; set; }     //对象
    }


    public class DefaultResponseJsonStruct
    {
        public int FLAGE;                   //通信标记-1：上传；2：下传数据；其他：非法
        public int SERIAL;                  //通信流水号
        public string ST;                   //站点编号，10位数字
        public string TIME;                 //当前时间-yyyy-MM-dd hh:mm:ss 格式
    }

}