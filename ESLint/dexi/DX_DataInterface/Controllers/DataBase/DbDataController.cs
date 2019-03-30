using DX_DataInterface.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using DataBaseClassLibrary;
using Newtonsoft.Json;
using System.Text.RegularExpressions;



namespace MVC01.Controllers
{
    public class DbDataController : Controller
    {
        //身份验证-使用用户名与密码md5进行验证(返回用户信息）
        public DataTable AuthenticationMD5(string UserName, string PasswordMD5)
        {
            DataSet ds = new DataSet();
            DataTable mDataTable;
            Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
            // UserDataBase mUserDataBase = new UserDataBase();
            DataBaseConnection SqlConnection = null;
            string pError = null;

            try
            {
                //SELECT COUNT(*) FROM `UserInfo` where user='admin' and password='123456';
                StringBuilder SqlString = new StringBuilder("SELECT USER,NICK_NAME,COMPANY,EMAIL,TEL,ROLE,REMARKS FROM ", 128);
                SqlString.Append(mHashtableConfig["user_table"].ToString());
                SqlString.Append(" where user= \"");
                SqlString.Append(UserName);//用户名
                SqlString.Append("\"");
                SqlString.Append(" and ");
                SqlString.Append("password_md5=");
                SqlString.Append("'");
                SqlString.Append(PasswordMD5);//密码
                SqlString.Append("'");
                SqlString.Append(";");

                //查询数据
                ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                    ref SqlConnection,                                  //数据库实例
                    mHashtableConfig["sys_DataSource"].ToString(),
                    mHashtableConfig["sys_Database"].ToString(),
                    mHashtableConfig["sys_db_UserId"].ToString(),
                    mHashtableConfig["sys_db_Password"].ToString(),
                    SqlString.ToString(),
                    ref pError
                    );

                if (ds == null)
                {
                    SystemLog.Write("身份验证有误：" + pError + "\r\n");           //写入日志
                    return null;
                }

                mDataTable = ds.Tables[0];
                UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
                if (mDataTable != null && mDataTable.Rows.Count > 0)
                {

                    return mDataTable;
                }
                else
                {
                    SystemLog.Write("\r\n身份验证错误");           //写入日志
                    return null;
                }
            }
            catch (Exception error)
            {
                UserDataBase_MYSQL.Close(ref SqlConnection);                                                      //关闭数据库
                SystemLog.Write("\r\n身份验证错误,"+ pError + error.Message + error.StackTrace );             //写入日志
                return null;
            }
        }


        //身份验证-使用用户名与密码原文进行验证
        public DataTable Authentication(string UserName, string UserPassword)
        {
            DataSet ds = new DataSet();
            DataTable mDataTable;
            Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           // UserDataBase mUserDataBase = new UserDataBase();
            DataBaseConnection SqlConnection = null;
            string pError = null;

            try
            {
                 //SELECT COUNT(*) FROM `UserInfo` where user='admin' and password='123456';
                StringBuilder SqlString = new StringBuilder("SELECT * FROM ", 128);
                SqlString.Append(mHashtableConfig["user_table"].ToString());
                SqlString.Append(" where user= \"");
                SqlString.Append(UserName);//用户名
                SqlString.Append("\"");
                SqlString.Append(" and ");
                SqlString.Append("password=");
                SqlString.Append("'");
                SqlString.Append(UserPassword);//密码
                SqlString.Append("'");
                SqlString.Append(";");

                //查询数据
                ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                    ref SqlConnection,                                  //数据库实例
                    mHashtableConfig["sys_DataSource"].ToString(),
                    mHashtableConfig["sys_Database"].ToString(),
                    mHashtableConfig["sys_db_UserId"].ToString(),
                    mHashtableConfig["sys_db_Password"].ToString(),
                    SqlString.ToString(),
                    ref pError
                    );
               
                mDataTable = ds.Tables[0];
                UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
                if (mDataTable != null && mDataTable.Rows.Count>0)
                {
                   
                    return mDataTable;
                }
                else
                {
                    SystemLog.Write("身份验证错误," + pError);           //写入日志
                    return null;
                }
            }
            catch (Exception error)
            {
                UserDataBase_MYSQL.Close(ref SqlConnection);                      //关闭数据库
                SystemLog.Write("身份验证错误," + error.Message + error.StackTrace + pError);           //写入日志
                return null;
            }
        }


       //验证用户名是否存在
       public bool isGetUserName(string UserName)
       {
           DataSet ds = new DataSet();
           DataTable mDataTable;
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT COUNT(*) FROM `UserInfo` where user='admin' and password='123456';
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM ", 128);
               SqlString.Append(mHashtableConfig["user_table"].ToString());
               SqlString.Append(" where user= \"");
               SqlString.Append(UserName);//用户名
               SqlString.Append("\"");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               if (ds == null) return false;
               mDataTable = ds.Tables[0];
               if (mDataTable == null) return false;
               if (mDataTable.Rows[0][0].ToString() == "0")
               {
                   
                   return false;
               }
               else
               {
                  
                   return true;
               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("isGetUserName，" + error.Message + error.StackTrace);   //写入日志
               return false;
           }
       }

       //获取一个用户的权限
       public string GetUserRights(string UserName)
       {
           DataSet ds = new DataSet();
           DataTable mDataTable;
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT ROLE FROM `User_Info` where USER="admin";
               StringBuilder SqlString = new StringBuilder("SELECT ROLE FROM ", 128);
               SqlString.Append(mHashtableConfig["user_table"].ToString());
               SqlString.Append(" where user= \"");
               SqlString.Append(UserName);//用户名
               SqlString.Append("\"");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               mDataTable = ds.Tables[0];
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               return mDataTable.Rows[0][0].ToString();
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("isGetUserName，" + error.Message + error.StackTrace);   //写入日志
               return "-1";
           }
       }

       //获取用户的分组列表
       public DataTable GetUserGroupList(string UserName)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT `GROUP` FROM `user_group` WHERE USER="admin";
               StringBuilder SqlString = new StringBuilder("SELECT `GROUP` FROM ", 128);
               SqlString.Append(mHashtableConfig["user_group_table"].ToString());
               SqlString.Append(" where user= \"");
               SqlString.Append(UserName);//用户名
               SqlString.Append("\"");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetUserGroupList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //获取用户的设备列表，包含设备所属分组
        //[0]:站点编号；[1]:站点名称；[2]:站点分组；[3]:经度；[4]:纬度；
       public DataTable GetUserDeviceList(string UserName)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //select   `device_info`.`ST`,`device_info`.`NAME`,`user_device`.`GROUP`   from  `user_device` left   join   `device_info`   on  `device_info`.`ST`=`user_device`.`ST`  where `user_device`.`USER`='admin';
               StringBuilder SqlString = new StringBuilder("SELECT ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`.`ST`,");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`.`NAME`,");
               SqlString.Append("`");

               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`.`LONG`,");
               SqlString.Append("`");

               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`.`LAT`,");
               SqlString.Append("`");

               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`.`GROUP` ");
               SqlString.Append(" from ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" left   join   ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" on ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`.`ST`=");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`.`ST`");
               SqlString.Append(" where ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`.`USER`=\"");
               SqlString.Append(UserName);//用户名
               SqlString.Append("\"");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetUserDeviceList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

      
        //获取指定站点的实时数据-显示字段别名
        //STArray:站点字符串列表
       public DataTable GetRealDataFieldAlias(String[] STArray)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           String FieldString;   //设备要素字段
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择

           if(STArray == null || STArray.Length == 0) return null;
           FieldString = GetTelFieldAlias(STArray);                  //获取所选设备的要素集合    
           try
           {
               //SELECT ST AS "站点编号",UT AS "采集时间",PD AS "日雨量(mm)", VT AS "电压(V)", ZB "水位1(m)", UT AS "上传时间" FROM `temp_data` where ST='1510260261' OR ST='1705130004';
               StringBuilder SqlString = new StringBuilder("SELECT ST AS \"编号\",TT AS \"采集时间\",", 512);
               SqlString.Append(FieldString);
               SqlString.Append(", UT AS \"上传时间\" FROM");

               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append(" [");
                   SqlString.Append(mHashtableConfig["data_real_table"].ToString());
                   SqlString.Append("] ");
               }
               else //MYSQL
               {
                   SqlString.Append(" `");
                   SqlString.Append(mHashtableConfig["data_real_table"].ToString());
                   SqlString.Append("` ");
               }
    
              
               SqlString.Append(" where ");
               for(int i = 0;i < STArray.Length;i ++)   //循环增加站点
               {
                   if(STArray[i] == null || STArray[i].Length == 0) continue;
                    SqlString.Append(" ST='");
                    SqlString.Append(STArray[i]);
                    SqlString.Append("'");
                   if(i < STArray.Length-1)
                   {
                        SqlString.Append(" OR ");
                   }
               }
               SqlString.Append(";");

               //查询数据
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               



               if(ds == null) //没有读取到数据
               {
                   SystemLog.Write("GetRealData->QueryAndRreturnAdapter Error:" + pError);   //写入日志
                   SystemLog.Write("GetRealData->QueryAndRreturnAdapter:" + SqlString.ToString());   //写入日志
                   SystemLog.Write(mHashtableConfig["data_DataSource"].ToString());   //写入日志
                   SystemLog.Write(mHashtableConfig["data_Database"].ToString());   //写入日志
                   SystemLog.Write(mHashtableConfig["data_db_UserId"].ToString());   //写入日志
                   SystemLog.Write(mHashtableConfig["data_db_Password"].ToString());   //写入日志

                   return null;
               }
               
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               
               SystemLog.Write("GetRealData" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }


       //获取指定站点的实时数据-显示字段名
       //STArray:站点字符串列表
       public DataTable GetRealData(String[] STArray)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           String FieldString;   //设备要素字段
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择

           if (STArray == null || STArray.Length == 0) return null;
           FieldString = GetTelField(STArray);                  //获取所选设备的要素集合    
           try
           {
               //SELECT ST AS "站点编号",UT AS "采集时间",PD AS "日雨量(mm)", VT AS "电压(V)", ZB "水位1(m)", UT AS "上传时间" FROM `temp_data` where ST='1510260261' OR ST='1705130004';
               StringBuilder SqlString = new StringBuilder("SELECT ST,TT,", 512);
               SqlString.Append(FieldString);
               SqlString.Append(", UT FROM ");

               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append("[");
                   SqlString.Append(mHashtableConfig["data_real_table"].ToString());
                   SqlString.Append("]");
               }
               else //MYSQL
               {
                   SqlString.Append("`");
                   SqlString.Append(mHashtableConfig["data_real_table"].ToString());
                   SqlString.Append("`");
               }
               

               SqlString.Append(" where ");
               for (int i = 0; i < STArray.Length; i++)   //循环增加站点
               {
                   if (STArray[i] == null || STArray[i].Length == 0) continue;
                   SqlString.Append(" ST='");
                   SqlString.Append(STArray[i]);
                   SqlString.Append("' ");
                   if (i < STArray.Length - 1)
                   {
                       SqlString.Append(" OR ");
                   }
               }
               SqlString.Append(";");

               //查询数据
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               


               if (ds == null) //没有读取到数据
               {
                   SystemLog.Write("GetRealData->QueryAndRreturnAdapter Error:" + pError);   //写入日志
                   SystemLog.Write("GetRealData->QueryAndRreturnAdapter:" + SqlString.ToString());   //写入日志
                   SystemLog.Write(mHashtableConfig["data_DataSource"].ToString());   //写入日志
                   SystemLog.Write(mHashtableConfig["data_Database"].ToString());   //写入日志
                   SystemLog.Write(mHashtableConfig["data_db_UserId"].ToString());   //写入日志
                   SystemLog.Write(mHashtableConfig["data_db_Password"].ToString());   //写入日志

                   return null;
               }

               return ds.Tables[0];
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }

               SystemLog.Write("GetRealData" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

        /*
       //获取指定站点历史数据字段，并转化为 “字段” AS "别名" 格式，用于数据查询
       public String GetOneTelField(String ST)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           DataTable mDataTable;


           if(ST == null || ST.Length == 0) return null;
           try
           {

               //SELECT REAL_ESS FROM `device_info` WHERE ST="1705130005";
               StringBuilder SqlString = new StringBuilder("SELECT REAL_ESS FROM `", 256);
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("` where ST=\"");
               SqlString.Append(ST);
               SqlString.Append("\";");
             
               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                       //关闭数据库
               mDataTable = ds.Tables[0];
               if (mDataTable != null && mDataTable.Rows.Count > 0 && mDataTable.Rows[0][0] != null)     //搜索到数据
               {
                   String[] sourceStrArray;
                   int []FieldIndexBuff;
                   int len;
                   int temp;
                   int cnt = 0;

                   sourceStrArray = mDataTable.Rows[0][0].ToString().Split(',');
                   if(sourceStrArray.Length > 0)
                   {
                       len = sourceStrArray.Length;
                       if(len > 100) len = 100;         //限制最大支持100种要素
                       FieldIndexBuff = new int[len];   //申请内存
                       for(int i = 0;i < len;i ++)
                       {
                           try
                           {
                               temp = int.Parse(sourceStrArray[i]);
                               if (temp >= 0 && temp < StaticGlobal.EssDataTable.Rows.Count)
                               {
                                   FieldIndexBuff[cnt ++] = temp; //记录要素索引
                               } 
                           }
                           catch (Exception error)
                           {}                        
                       }
                       if(cnt > 0) //要素索引有效
                       {
                           StringBuilder FieldString = new StringBuilder(256);
                           for(int i = 0;i < cnt;i ++)
                           {
                               FieldString.Append(StaticGlobal.EssDataTable.Rows[i]["标识符ASCII码"]);
                               FieldString.Append(" AS \"");
                               FieldString.Append(StaticGlobal.EssDataTable.Rows[i]["编码要素"]);
                               FieldString.Append("(");
                               FieldString.Append(StaticGlobal.EssDataTable.Rows[i]["量和单位"]);
                               FieldString.Append(")\"");
                               if(i < (cnt-1))
                               {
                                   FieldString.Append(",");
                               }
                           }
                           return FieldString.ToString();
                       }

                   }

               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetOneTelField" + error.Message + error.StackTrace);   //写入日志            
           }
           return "VT AS \"电压\"";
       }
        */


       //获取指定站点站点历史数据字段别名（将不同站点列表的字段相或），并转化为 “字段” AS "别名" 格式，用于数据查询
       public String GetTelFieldAlias(String[] ST_List)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           DataTable mDataTable;


           if (ST_List == null || ST_List.Length == 0) return null;
           try
           {

               //SELECT REAL_ESS FROM `device_info` WHERE ST="1705130005" ||  ST="1705130006";
               StringBuilder SqlString = new StringBuilder("SELECT REAL_ESS FROM `", 256);
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("` where ");
               for (int i = 0; i < ST_List.Length; i++)
               {
                   SqlString.Append("ST=\"");
                   SqlString.Append(ST_List[i]);
                   SqlString.Append("\"");
                   if (i < (ST_List.Length - 1))
                   {
                       SqlString.Append(" || ");
                   }
               }
               SqlString.Append(";");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                       //关闭数据库
               mDataTable = ds.Tables[0];
               if (mDataTable != null && mDataTable.Rows.Count > 0 && mDataTable.Rows[0][0] != null)     //搜索到数据
               {
                   String[] sourceStrArray;
                   int[] FieldIndexBuff;
                   int len;
                   int temp;
                   int cnt = 0;
                   int row;
                   bool[] IndexBuff = new bool[StaticGlobal.EssDataTable.Rows.Count + 1];  //如果指定的索引要素需要显示，则对应字节为1
                   for (int i = 0; i < StaticGlobal.EssDataTable.Rows.Count; i++)
                   {
                       IndexBuff[i] = false;
                   }
                   //循环处理所有站点要素
                   for (row = 0; row < mDataTable.Rows.Count; row++)
                   {
                       sourceStrArray = mDataTable.Rows[row][0].ToString().Split(',');
                       if (sourceStrArray.Length > 0)
                       {
                           len = sourceStrArray.Length;
                           if (len > 100) len = 100;         //限制最大支持100种要素
                           FieldIndexBuff = new int[len];   //申请内存
                           for (int i = 0; i < len; i++)
                           {
                               try
                               {
                                   temp = int.Parse(sourceStrArray[i]);
                                   if (temp >= 0 && temp < StaticGlobal.EssDataTable.Rows.Count) //不能包含图片信息
                                   {
                                       IndexBuff[temp] = true; //指定的要素有效
                                       cnt++;
                                   }
                               }
                               catch (Exception error)
                               { }
                           }
                       }

                   }

                   if (cnt > 0)
                   {
                       StringBuilder FieldString = new StringBuilder(256);
                       for (int i = 0; i < StaticGlobal.EssDataTable.Rows.Count; i++)
                       {
                           if (IndexBuff[i] == true) //指定索引的要素有效
                           {
                               //必须是需要显示的实时数据才进行打包
                               if (StaticGlobal.EssDataTable.Rows[i]["实时数据"] == "1")
                               {
                                   FieldString.Append(StaticGlobal.EssDataTable.Rows[i]["标识符ASCII码"]);
                                   FieldString.Append(" AS \"");
                                   FieldString.Append(StaticGlobal.EssDataTable.Rows[i]["编码要素"]);
                                   FieldString.Append("(");
                                   FieldString.Append(StaticGlobal.EssDataTable.Rows[i]["量和单位"]);
                                   FieldString.Append(")\"");
                                   FieldString.Append(",");
                               }
                               
                           }

                       }
                       //去掉最后面的一个逗号
                       FieldString.Remove(FieldString.Length - 1, 1);

                       return FieldString.ToString();
                   }

               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetOneTelField" + error.Message + error.StackTrace);   //写入日志            
           }
           return "VT AS \"电压\"";
       }


       //获取指定站点站点历史数据字段（将不同站点列表的字段相或），并转化为 “字段” 用于数据查询
       public String GetTelField(String[] ST_List)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           DataTable mDataTable;


           if (ST_List == null || ST_List.Length == 0) return null;
           try
           {

               //SELECT REAL_ESS FROM `device_info` WHERE ST="1705130005" ||  ST="1705130006";
               StringBuilder SqlString = new StringBuilder("SELECT REAL_ESS FROM `", 256);
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("` where ");
               for (int i = 0; i < ST_List.Length;i ++ )
               {
                   SqlString.Append("ST=\"");
                   SqlString.Append(ST_List[i]);
                   SqlString.Append("\"");
                   if(i < (ST_List.Length-1))
                   {
                       SqlString.Append(" || ");
                   }
               }
               SqlString.Append(";");   
               

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                       //关闭数据库
               mDataTable = ds.Tables[0];
               if (mDataTable != null && mDataTable.Rows.Count > 0 && mDataTable.Rows[0][0] != null)     //搜索到数据
               {
                   String[] sourceStrArray;
                   int[] FieldIndexBuff;
                   int len;
                   int temp;
                   int cnt = 0;
                   int row;
                   bool[] IndexBuff = new bool[StaticGlobal.EssDataTable.Rows.Count+1];  //如果指定的索引要素需要显示，则对应字节为1
                   for (int i = 0; i < StaticGlobal.EssDataTable.Rows.Count; i++)
                   {
                       IndexBuff[i] = false;
                   }
                   //循环处理所有站点要素
                   for (row = 0; row < mDataTable.Rows.Count;row ++ )
                   {
                       sourceStrArray = mDataTable.Rows[row][0].ToString().Split(',');
                       if (sourceStrArray.Length > 0)
                       {
                           len = sourceStrArray.Length;
                           if (len > 100) len = 100;         //限制最大支持100种要素
                           FieldIndexBuff = new int[len];   //申请内存
                           for (int i = 0; i < len; i++)
                           {
                               try
                               {
                                   temp = int.Parse(sourceStrArray[i]);
                                   if (temp >= 0 && temp < StaticGlobal.EssDataTable.Rows.Count) //不包含图片字段
                                   {

                                       IndexBuff[temp] = true; //指定的要素有效
                                       cnt++;
                                   }
                               }
                               catch (Exception error)
                               { }
                           }
                       }

                   }

                   if(cnt > 0)
                   {
                       StringBuilder FieldString = new StringBuilder(256);
                       for (int i = 0; i < StaticGlobal.EssDataTable.Rows.Count; i++)
                       {
                           if (IndexBuff[i] == true) //指定索引的要素有效
                           {
                               //必须是需要显示的实时数据才进行打包
                               if (StaticGlobal.EssDataTable.Rows[i]["实时数据"]!=null && StaticGlobal.EssDataTable.Rows[i]["实时数据"].ToString() == "1")
                               {
                                   FieldString.Append(StaticGlobal.EssDataTable.Rows[i]["标识符ASCII码"]);
                                   /*FieldString.Append(" AS \"");
                                   FieldString.Append(StaticGlobal.EssDataTable.Rows[i]["编码要素"]);
                                   FieldString.Append("(");
                                   FieldString.Append(StaticGlobal.EssDataTable.Rows[i]["量和单位"]);
                                   FieldString.Append(")\"");*/
                                   FieldString.Append(",");
                               }
                              
                           }
                           
                       }
                       //去掉最后面的一个逗号
                       FieldString.Remove(FieldString.Length - 1,1);

                       return FieldString.ToString();
                   }
                   
               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetOneTelField" + error.Message + error.StackTrace);   //写入日志            
           }
           return "VT";
       }


       //获取指定站点的历史数据-中文字段
      /* public DataTable GetHistData(String ST,String StartTime, String EndTime, UInt32 StartIndex, UInt32 ReadCnt, bool isASC)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           string FieldString;

           if(ST == null || ST.Length == 0) return null;
           try
           {
               String[] ST_List = new string[1];
               ST_List[0] = ST;
               //先读取历史数据需要的字段
               FieldString = GetTelField(ST_List);            //查找需要显示的要素



               //SELECT TT AS "采集时间",PD AS "日雨量(mm)", VT AS "电压(V)", ZB "水位1(m)", UT AS "上传时间" FROM `hist_data` where ST="1510260261" AND TT >= "2016-10-08 13:20:00" AND TT < "2016-10-10 20:00:00" ORDER BY UT ASC LIMIT 0,100;  //升序
               //SELECT TT AS "采集时间",PD AS "日雨量(mm)", VT AS "电压(V)", ZB "水位1(m)", UT AS "上传时间" FROM `hist_data` where ST="1510260261" AND TT >= "2016-10-08 13:20:00" AND TT < "2016-10-10 20:00:00" ORDER BY UT DESC LIMIT 0,100;  //逆序
               StringBuilder SqlString = new StringBuilder("SELECT TT AS \"采集时间\"," , 512);
               SqlString.Append(FieldString);
               SqlString.Append(", UT AS \"上传时间\" FROM `");
               SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
               SqlString.Append("` where ST=\"");
               SqlString.Append(ST);
               SqlString.Append("\" AND TT >= \"");
               SqlString.Append(StartTime);
               SqlString.Append("\" AND TT <= \"");
               SqlString.Append(EndTime);
              if(isASC) //升序
              {
                SqlString.Append("\" ORDER BY UT ASC "); //升序
              }
              else
              {
                SqlString.Append("\" ORDER BY UT DESC "); //逆序
              }
               SqlString.Append(" LIMIT ");
               SqlString.Append(StartIndex);
               SqlString.Append(",");
               SqlString.Append(ReadCnt);
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetHistData" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }
        */
       //获取指定站点的整点历史数据数量2019-02-19
       public UInt32 GetIntegerHistDataCnt(String ST, String StartTime, String EndTime)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择

           if (ST == null || ST.Length == 0) return 0;
           try
           {
               //MYSQL      SELECT COUNT(*) FROM `SL651_2014` where ST='1510260261' AND TT >= '2016-10-08 13:20:00' AND TT <= '2016-10-10 20:00:00' AND RIGHT(TT,5)='00:00';
               //SQLSERVER  SELECT COUNT(*) FROM [SL651_2014] where ST='1510260261' AND TT >= '2016-10-08 13:20:00' AND TT <= '2016-10-10 20:00:00' AND DATEPART(MINUTE,[TT])=0 AND DATEPART(SECOND,[TT])=0;
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM ", 512);
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append("[");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("]");
               }
               else //MYSQL
               {
                   SqlString.Append("`");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("`");
               }
               
               
               SqlString.Append(" where ST='");
               SqlString.Append(ST);
               SqlString.Append("' AND TT >= '");
               SqlString.Append(StartTime);
               SqlString.Append("' AND TT <= '");
               SqlString.Append(EndTime);
               SqlString.Append("' ");

               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append("AND DATEPART(MINUTE,[TT])=0 AND DATEPART(SECOND,[TT])=0;");
               }
               else //MYSQL
               {
                   SqlString.Append("AND RIGHT(TT,5)='00:00';");
               }

               //查询数据
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
              
               int DataCnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());
               if (DataCnt < 0) DataCnt = 0;

               return (UInt32)DataCnt;
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);               //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               SystemLog.Write("GetIntegerHistDataCnt" + error.Message + error.StackTrace);   //写入日志
               return 0;
           }
       }

       //获取指定站点的整点历史数据-ASCII字段 2019-02-19
       public DataTable GetIntegerHistData(String ST, String StartTime, String EndTime, UInt32 StartIndex, UInt32 ReadCnt, bool isASC)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           string FieldString;
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择

           if (ST == null || ST.Length == 0) return null;
           try
           {
               String[] ST_List = new string[1];
               ST_List[0] = ST;
               //先读取历史数据需要的字段
               FieldString = GetTelField(ST_List);            //查找需要显示的要素


               //MYSQL
               //SELECT TT AS "采集时间",PD AS "日雨量(mm)", VT AS "电压(V)", ZB "水位1(m)", UT AS "上传时间" FROM `sl651_2014` where ST="1510260261" AND TT >= "2016-10-08 13:20:00" AND TT < "2016-10-10 20:00:00" AND RIGHT(TT,5)='00:00' ORDER BY UT ASC LIMIT 0,100;  //升序

               //SQLSERVER
               //SELECT TT AS "采集时间",PD AS "日雨量(mm)", VT AS "电压(V)", ZB "水位1(m)", UT AS "上传时间" 
                    //from (SELECT row_number() over (order by TT asc) as rownumber, 
                    //* FROM [sl651_2014] WHERE ST='1510260261' AND TT >= '2016-10-08 13:20:00' AND TT < '2016-10-10 20:00:00' AND DATEPART(MINUTE,[TT])=0 AND DATEPART(SECOND,[TT])=0 ) as t Where t.rownumber > 0 And t.rownumber <= 20;


               StringBuilder SqlString = new StringBuilder("SELECT TT,", 1024);
               SqlString.Append(FieldString);
              
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append(", UT from (SELECT row_number() over (order by TT ");
                   if (isASC) //升序
                   {
                       SqlString.Append(" ASC) "); //升序
                   }
                   else
                   {
                       SqlString.Append(" DESC) "); //逆序
                   }
                   SqlString.Append("as rownumber, * FROM ");
                   SqlString.Append("[");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("]");

                   SqlString.Append(" where ST='");
                   SqlString.Append(ST);
                   SqlString.Append("' AND TT >= '");
                   SqlString.Append(StartTime);
                   SqlString.Append("' AND TT <= '");
                   SqlString.Append(EndTime);
                   SqlString.Append("'  AND DATEPART(MINUTE,[TT])=0 AND DATEPART(SECOND,[TT])=0) as t Where t.rownumber > ");
                   SqlString.Append(StartIndex);
                   SqlString.Append(" AND t.rownumber <= ");
                   SqlString.Append(ReadCnt + StartIndex);
                   SqlString.Append(";");

                   //查询数据
                   ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                       ref SqlConnection,                                           //数据库实例
                       mHashtableConfig["data_DataSource"].ToString(),
                       mHashtableConfig["data_Database"].ToString(),
                       mHashtableConfig["data_db_UserId"].ToString(),
                       mHashtableConfig["data_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   SqlString.Append(", UT FROM ");
                   SqlString.Append("`");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("`");
                   SqlString.Append(" where ST='");
                   SqlString.Append(ST);
                   SqlString.Append("' AND TT >= '");
                   SqlString.Append(StartTime);
                   SqlString.Append("' AND TT <= '");
                   SqlString.Append(EndTime);
                   if (isASC) //升序
                   {
                       SqlString.Append("' ORDER BY UT ASC "); //升序
                   }
                   else
                   {
                       SqlString.Append("' AND RIGHT(TT,5)='00:00' ORDER BY UT DESC "); //逆序
                   }
                   SqlString.Append(" LIMIT ");
                   SqlString.Append(StartIndex);
                   SqlString.Append(",");
                   SqlString.Append(ReadCnt);
                   SqlString.Append(";");

                   //查询数据
                   ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                       ref SqlConnection,                                  //数据库实例
                       mHashtableConfig["data_DataSource"].ToString(),
                       mHashtableConfig["data_Database"].ToString(),
                       mHashtableConfig["data_db_UserId"].ToString(),
                       mHashtableConfig["data_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }

              

               

               return ds.Tables[0];
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               SystemLog.Write("GetHistData" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }


       //获取指定站点的历史数据数量
       public UInt32 GetHistDataCnt(String ST, String StartTime, String EndTime)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择

           if (ST == null || ST.Length == 0) return 0;
           try
           {
               //SELECT COUNT(*) FROM [SL651_2014] where ST='1510260261' AND TT >= '2016-10-08 13:20:00' AND TT <= '2016-10-10 20:00:00';
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM ", 512);
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append("[");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("]");
               }
               else //MYSQL
               {
                   SqlString.Append("`");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("`");
               }


               SqlString.Append(" where ST='");
               SqlString.Append(ST);
               SqlString.Append("' AND TT >= '");
               SqlString.Append(StartTime);
               SqlString.Append("' AND TT <= '");
               SqlString.Append(EndTime);
               SqlString.Append("';");

               //查询数据
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }

               int DataCnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());
               if (DataCnt < 0) DataCnt = 0;

               return (UInt32)DataCnt;
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);               //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               SystemLog.Write("GetHistData" + error.Message + error.StackTrace);   //写入日志
               return 0;
           }
       }

       //获取指定站点的历史数据-ASCII字段
       public DataTable GetHistData(String ST, String StartTime, String EndTime, UInt32 StartIndex, UInt32 ReadCnt, bool isASC)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           string FieldString;
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择

           if (ST == null || ST.Length == 0) return null;
           try
           {
               String[] ST_List = new string[1];
               ST_List[0] = ST;
               //先读取历史数据需要的字段
               FieldString = GetTelField(ST_List);            //查找需要显示的要素


               //MYSQL
               //SELECT TT AS "采集时间",PD AS "日雨量(mm)", VT AS "电压(V)", ZB "水位1(m)", UT AS "上传时间" FROM `hist_data` where ST="1510260261" AND TT >= "2016-10-08 13:20:00" AND TT < "2016-10-10 20:00:00" ORDER BY UT ASC LIMIT 0,100;  //升序
               //SELECT TT AS "采集时间",PD AS "日雨量(mm)", VT AS "电压(V)", ZB "水位1(m)", UT AS "上传时间" FROM `hist_data` where ST="1510260261" AND TT >= "2016-10-08 13:20:00" AND TT < "2016-10-10 20:00:00" ORDER BY UT DESC LIMIT 0,100;  //逆序
               //SQLSERVER
               //SELECT TT AS "采集时间",PD AS "日雨量(mm)", VT AS "电压(V)", ZB "水位1(m)", UT AS "上传时间" from (SELECT row_number() over (order by TT asc) as rownumber, * FROM [sl651_2014] WHERE ST='1510260261' AND TT >= '2016-10-08 13:20:00' AND TT < '2016-10-10 20:00:00') as t Where t.rownumber >= 1 And t.rownumber <= 20;

               StringBuilder SqlString = new StringBuilder("SELECT TT,", 1024);
               SqlString.Append(FieldString);

               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append(", UT from (SELECT row_number() over (order by TT ");
                   if (isASC) //升序
                   {
                       SqlString.Append(" ASC) "); //升序
                   }
                   else
                   {
                       SqlString.Append(" DESC) "); //逆序
                   }
                   SqlString.Append("as rownumber, * FROM ");
                   SqlString.Append("[");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("]");

                   SqlString.Append(" where ST='");
                   SqlString.Append(ST);
                   SqlString.Append("' AND TT >= '");
                   SqlString.Append(StartTime);
                   SqlString.Append("' AND TT <= '");
                   SqlString.Append(EndTime);
                   SqlString.Append("') as t Where t.rownumber > ");
                   SqlString.Append(StartIndex);
                   SqlString.Append(" AND t.rownumber <= ");
                   SqlString.Append(ReadCnt + StartIndex);
                   SqlString.Append(";");

                   //查询数据
                   ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                       ref SqlConnection,                                           //数据库实例
                       mHashtableConfig["data_DataSource"].ToString(),
                       mHashtableConfig["data_Database"].ToString(),
                       mHashtableConfig["data_db_UserId"].ToString(),
                       mHashtableConfig["data_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   SqlString.Append(", UT FROM ");
                   SqlString.Append("`");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("`");
                   SqlString.Append(" where ST='");
                   SqlString.Append(ST);
                   SqlString.Append("' AND TT >= '");
                   SqlString.Append(StartTime);
                   SqlString.Append("' AND TT <= '");
                   SqlString.Append(EndTime);
                   if (isASC) //升序
                   {
                       SqlString.Append("' ORDER BY UT ASC "); //升序
                   }
                   else
                   {
                       SqlString.Append("' ORDER BY UT DESC "); //逆序
                   }
                   SqlString.Append(" LIMIT ");
                   SqlString.Append(StartIndex);
                   SqlString.Append(",");
                   SqlString.Append(ReadCnt);
                   SqlString.Append(";");

                   //查询数据
                   ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                       ref SqlConnection,                                  //数据库实例
                       mHashtableConfig["data_DataSource"].ToString(),
                       mHashtableConfig["data_Database"].ToString(),
                       mHashtableConfig["data_db_UserId"].ToString(),
                       mHashtableConfig["data_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }





               return ds.Tables[0];
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               SystemLog.Write("GetHistData" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }


       //验证站点编号是否存在
       public bool isCheckTelNumber(string TelNumber)
       {
           DataBaseConnection SqlConnection = null;
           DataSet ds = new DataSet();
           DataTable mDataTable;
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           string pError = null;

           try
           {
               //SELECT COUNT(*) FROM `UserInfo` where user='admin' and password='123456';
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM ", 256);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //站点设备信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(" where ST=");
               SqlString.Append("'");
               SqlString.Append(TelNumber);//站点编号
               SqlString.Append("'");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               mDataTable = ds.Tables[0];
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               if (mDataTable.Rows[0][0].ToString() == "0")
               {
                   return false;
               }
               else
               {
                   return true;
               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("isCheckTelNumber，" + error.Message + error.StackTrace); //写入日志
               return false;
           }
       }


       //验证一个微信是否与一个站点进行了绑定
       public bool isCheckWeixinTelNumber(string WeixinId,string TelNumber)
       {
           DataSet ds = new DataSet();
           DataTable mDataTable;
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT COUNT(*) FROM `UserInfo` where user='admin' and password='123456';
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM ", 256);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //微信站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(" where telnumber=");
               SqlString.Append("'");
               SqlString.Append(TelNumber);//站点编号
               SqlString.Append("' ");
               SqlString.Append(" and weixin_id=");
               SqlString.Append("'");
               SqlString.Append(WeixinId);//微信ID
               SqlString.Append("' ");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               mDataTable = ds.Tables[0];
               if (mDataTable.Rows[0][0].ToString() == "0")
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   return false;
               }
               else
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   return true;
               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("isCheckWeixinTelNumber，" + error.Message + error.StackTrace); //写入日志
               return false;
           }
       }



       //新建一个微信ID与设备编号绑定数据
       public bool InsertWeixinTelNumber(string WeixinId, string TelNumber)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           int status;

           try
           {
               StringBuilder SqlString = new StringBuilder("INSERT INTO ", 256);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //微信站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("(weixin_id,telnumber) VALUES (");
               SqlString.Append("'");
               SqlString.Append(WeixinId);//微信ID
               SqlString.Append("' ");
               SqlString.Append(",");
               SqlString.Append("'");
               SqlString.Append(TelNumber);//站点编号
               SqlString.Append("')");
               SqlString.Append(";");
               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               if (status >= 0) return true;
               else return false;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("InsertWeixinTelNumber，" + error.Message + error.StackTrace); //写入日志
               return false;
           }
       }


       //获取weixin id绑定的设备编号列表
        //列[0]为设备编号
       public DataTable GetWeixinTel(string WeixinId)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT telnumber FROM `user_tel` where username='admin';
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT telnumber FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //微信站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where weixin_id='");
               SqlString.Append(WeixinId);
               SqlString.Append("';");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               if (ds == null) return null;
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("GetWeixinTel，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }




       //获取微信id绑定的所有设备列表包含站点名称信息,[0]:站点名称；[1]:站点编号
       public DataTable GetWeixinTelName(String WeixinId)
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mTelNumberTable;  //当前用户的站点编号列表
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //查询当前weixin客户的站点列表
               mTelNumberTable = this.GetWeixinTel(WeixinId);
               //分别查询每个站点的名称
                //SELECT `name` AS '名称', `number` AS '编号' FROM `telinfo` where number='0' || number='1'
               StringBuilder SqlString = new StringBuilder("SELECT `name` AS '名称', `number` AS '编号' FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(" where ");
               for (int i = 0; i < mTelNumberTable.Rows.Count; i++)
               {
                   SqlString.Append("number=");
                   SqlString.Append("'");
                   SqlString.Append(mTelNumberTable.Rows[i][0].ToString());
                   SqlString.Append("'");
                   if (i < (mTelNumberTable.Rows.Count - 1))
                   {
                       SqlString.Append(" || ");
                   }
               }

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               if (ds == null) return null;
               return ds.Tables[0];

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("GetWeixinTelName，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }


        //获取一个微信id是绑定的所有站点对应的实时要素列表
       public Hashtable GetWeixinTelRealEss(String WeixinId)
       {
           Hashtable mHashtableEss = new Hashtable();
           DataTable mDataTableTel;
           DataTable mDataTableEss;
           List<string> TelList = new List<string>();

           //先获取微信对应的设备列表
           mDataTableTel = GetWeixinTel(WeixinId);  //获取当前微信的设备编号列表
           if(mDataTableTel == null) return null;
           for (int i = 0; i < mDataTableTel.Rows.Count;i ++)
           {
               try
               {
                   TelList.Add(mDataTableTel.Rows[i][0].ToString());
               }
               catch (Exception)
               {
                   
                   
               }
               
           }
           if (TelList.Count == 0) return null; //没有设备返回空
           //循环查找要素列表
           mDataTableEss = GetTelRealEss(TelList);
           if (mDataTableEss == null) return null;
           for (int i = 0; i < mDataTableEss.Rows.Count;i ++ )
           {
               try
               {
                   mHashtableEss[mDataTableEss.Rows[i][0].ToString()] = mDataTableEss.Rows[i][1].ToString();
               }
               catch (Exception)
               {

               }
           }

           return mHashtableEss;
       }

       //获取指定站点的实时要素列表转换为哈希表
       public Hashtable GetTelRealEssToHashTable(List<string> TelNumberList)
       {
           Hashtable mHashtableEss = new Hashtable();
           DataTable mDataTableEss;

           if (TelNumberList==null || TelNumberList.Count == 0) return null; //没有设备返回空
           //循环查找要素列表
           mDataTableEss = GetTelRealEss(TelNumberList);
           if (mDataTableEss == null) return null;
           for (int i = 0; i < mDataTableEss.Rows.Count; i++)
           {
               try
               {
                   mHashtableEss[mDataTableEss.Rows[i][0].ToString()] = mDataTableEss.Rows[i][1].ToString();
               }
               catch (Exception)
               {

               }
           }

           return mHashtableEss;
       }

     

       

       //查询weixin id绑定的设备是否存在
       public bool isGetWeixinTelDoesIt(string WeixinId, string TelNumber)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;


           try
           {
               //SELECT COUNT(*) FROM `weixin_tel` where weixin_id='1234' and telnumber='1510260261';
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //微信站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where weixin_id='");
               SqlString.Append(WeixinId);
               SqlString.Append("' ");
               SqlString.Append("and telnumber='");
               SqlString.Append(TelNumber);
               SqlString.Append("';");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               if (ds == null) return false;
               DataTable mDataTable = ds.Tables[0];
               if (mDataTable.Rows[0][0].ToString() == "0")
               {
                   return false;
               }
               else
               {
                   return true;
               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("isGetWeixinTelDoesIt，" + error.Message + error.StackTrace); //写入日志
               return false;
           }
       }


       //删除一个微信与设备的绑定
       public bool isDeleteWeixinTel(string WeixinId, string TelNumber)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //DELETE FROM `weixin_tel` where weixin_id='1234' and telnumber='1510260261';
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("DELETE FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //微信站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where weixin_id='");
               SqlString.Append(WeixinId);
               SqlString.Append("' ");
               SqlString.Append("and telnumber='");
               SqlString.Append(TelNumber);
               SqlString.Append("'; select row_count();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
        
               DataTable mDataTable = ds.Tables[0];
               int DeleteCnt = int.Parse(mDataTable.Rows[0][0].ToString());
               if (DeleteCnt > 0)
               {
                   return true;
               }
               else
               {
                   return false;
               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("isDeleteWeixinTel，" + error.Message + error.StackTrace); //写入日志
               return false;
           }
       }

       //查询weixin id绑定的设备数量
       public int GetWeixinTelCnt(string WeixinId)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;


           try
           {
               //SELECT COUNT(*) FROM `weixin_tel` where weixin_id='1234';
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //微信站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where weixin_id='");
               SqlString.Append(WeixinId);
               SqlString.Append("' ");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               DataTable mDataTable = ds.Tables[0];
               int DeleteCnt = int.Parse(mDataTable.Rows[0][0].ToString());
               return DeleteCnt;            
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("isGetWeixinTelDoesIt，" + error.Message + error.StackTrace); //写入日志
               return -1;
           }
       }

       //删除一个微信与所有设备的绑定
       public bool isDeleteAllWeixinTel(string WeixinId)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //DELETE FROM `weixin_tel` where weixin_id='1234';
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("DELETE FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //微信站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where weixin_id='");
               SqlString.Append(WeixinId);
               SqlString.Append("' ");
               SqlString.Append("; select row_count();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               DataTable mDataTable = ds.Tables[0];
               int DeleteCnt = int.Parse(mDataTable.Rows[0][0].ToString());
               if (DeleteCnt > 0)
               {
                   return true;
               }
               else
               {
                   return false;
               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("isDeleteWeixinTel，" + error.Message + error.StackTrace); //写入日志
               return false;
           }
       }

       //获取用户的设备列表
       //2018-06-10 修改为新数据库表支持
       public DataTable GetUserTel(string UserName)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT ST FROM `user_device` where username='admin';
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT ST FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //微信站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where user='");
               SqlString.Append(UserName);
               SqlString.Append("';");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("GetUserTel，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }


       //获取指定站点的实时数据-用于web实时站点列表显示
       //TelInfoDataTable:站点信息列表[0]:站点名称；[1]:站点编号
       //mHashtableEss：对应站点编号的要素列表，要素列表为字符串，可以转换为json数组
       public DataTable GetTelRealData(DataTable TelInfoDataTable, Hashtable mHashtableEss)
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           DataTable mTempDataTable;
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataTable AllEssDataTable = StaticGlobal.GetEssDataTable();          //获取要素总表
           StringBuilder EssString = new StringBuilder(1024);
           List<string> SelectEssNameList = new List<string>();                 //当前用户选择的站点所有的要素名称列表
           string TelNumber;
           string EssList;
           string ess;
           string ess_name;
           string ess_uint;
           int EssCnt;
           int index;
           int[] EssIndex = new int[AllEssDataTable.Rows.Count];                //不同站点要素索引存放，用于去重，指定索引有要素，则为1，否则为0
           StringBuilder EssNameString = new StringBuilder(32);                 //要素列的名称
           Array.Clear(EssIndex, 0, EssIndex.Length);                           //数组清零
           DataBaseConnection SqlConnection = null;
           string pError = null;
           String DbSelect = StaticGlobal.GetDataDbSelect();                    //数据库选择

           if (TelInfoDataTable == null) return null;   //没有找到数据
           if (AllEssDataTable == null || AllEssDataTable.Rows.Count == 0)
           {
               SystemLog.Write("要素总表不存在，无法查询数据！");
               return null; //配置有误，直接返回错误
           }

           //循环获取所有站点要素的集合，并去重，排序
           for (int i = 0; i < TelInfoDataTable.Rows.Count; i++)
           {
               try
               {
                   TelNumber = TelInfoDataTable.Rows[i][1].ToString();          //获取站点编号
                   EssList = mHashtableEss[TelNumber].ToString();               //获取当前站点的实时要素列表
                   if (EssList == null || EssList == "" || EssList == "[]") continue;
                   Newtonsoft.Json.Linq.JArray json = Newtonsoft.Json.Linq.JArray.Parse(EssList);
                   if (json != null)
                   {
                       EssCnt = json.Count;
                       for (int j = 0; j < json.Count; j++)
                       {
                           try
                           {
                               ess = json[j].ToString();                        //循环获取要素标识符
                               index = StaticGlobal.GetEssIndex(ess);           //获取要素的索引
                               if (index >= 0)                                  //获取要素的索引
                               {
                                   if (index < AllEssDataTable.Rows.Count)
                                   {
                                       EssIndex[index] = 1;                     //对应索引要素有效
                                   }
                               }
                           }
                           catch (Exception e)
                           {
                               continue;
                           }
                       }
                   }
               }
               catch (Exception)
               {
                   continue;
               }
           }


           //循环添加要查询的要素
           for (int cnt = 0; cnt < AllEssDataTable.Rows.Count; cnt++)
           {
               if (EssIndex[cnt] == 1)    //添加站点选择的要素
               {
                   try
                   {
                       EssNameString.Clear();
                       ess = AllEssDataTable.Rows[cnt]["标识符ASCII码"].ToString();
                       ess_name = StaticGlobal.GetEssName(ess); //要素名称
                       ess_uint = StaticGlobal.GetEssUint(ess); //要素单位

                       EssNameString.Append(ess_name);           //要素名称，最终显示列表的列名称
                       if(ess_uint!=null && ess_uint!="")       //单位有效，则加上单位
                       {
                           EssNameString.Append("(");
                           EssNameString.Append(ess_uint);
                           EssNameString.Append(")");
                       }

                       EssString.Append(ess);
                       EssString.Append(" AS '");
                       EssString.Append(EssNameString.ToString());
                       EssString.Append("',");
 
                       SelectEssNameList.Add(EssNameString.ToString());
                       //SelectEssList.Add(ess);
                   }
                   catch (Exception e)
                   {
                       continue;
                   }

               }
           }
           if (EssString.Length < 1) return null;   //没有找到要素标识符，无法进行下一步的数据查询
           EssString.Remove(EssString.Length - 1, 1);//删除掉最后一个逗号   

           //前面3列固定
           mDataTable.Columns.Add(new DataColumn("序号"));	        //添加第1列
           mDataTable.Columns.Add(new DataColumn("名称"));	        //添加第2列
           mDataTable.Columns.Add(new DataColumn("编号"));	        //添加第3列
           //循环添加要查询的要素列-后面列可配置
           for (int cnt = 0; cnt < SelectEssNameList.Count; cnt++)
           {
               try
               {
                   mDataTable.Columns.Add(new DataColumn(SelectEssNameList[cnt]));	    //添加第n列
               }
               catch (Exception error)
               {

                   mDataTable.Columns.Add(new DataColumn("配置错误"));	    //添加第n列
               }

           }

           if (TelInfoDataTable.Rows.Count == 0)                    //没有数据
           {
               return mDataTable;
           }


           try
           {
               //SELECT Z,PJ,PD,PT,VT,TT FROM `tempdata`  where ST='0000000000' LIMIT 0,1;
               //循环获取每个站点的实时数据
               for (int i = 0; i < TelInfoDataTable.Rows.Count; i++)
               {
                   //拷贝站点名称与编号数据-前面3列固定
                   DataRow dr = mDataTable.NewRow();
                   dr[0] = "" + i;                             //序号
                   dr[1] = TelInfoDataTable.Rows[i][0];        //名称
                   dr[2] = TelInfoDataTable.Rows[i][1];        //站点编号

                   try
                   {
                       //查询实时数据
                       StringBuilder SqlString = new StringBuilder("SELECT ", 1024);
                       SqlString.Append(EssString.ToString());  //要查询的要素

                       if (DbSelect == "SQLSERVER") //SQLSERVER
                       {
                           SqlString.Append(" from (SELECT row_number() over (order by ST ");

                           SqlString.Append(" ASC) "); //升序
 
                           SqlString.Append("as rownumber, * FROM ");
                           SqlString.Append("[");
                           SqlString.Append(mHashtableConfig["data_real_table"].ToString());
                           SqlString.Append("]");

                           SqlString.Append(" where ST='");
                           SqlString.Append(TelInfoDataTable.Rows[i][1]);   //站点编号
        
                           SqlString.Append("') as t Where t.rownumber > 0  AND t.rownumber <= 1");
                           SqlString.Append(";");

                           //查询数据
                           ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                               ref SqlConnection,                                           //数据库实例
                               mHashtableConfig["data_DataSource"].ToString(),
                               mHashtableConfig["data_Database"].ToString(),
                               mHashtableConfig["data_db_UserId"].ToString(),
                               mHashtableConfig["data_db_Password"].ToString(),
                               SqlString.ToString(),
                               ref pError
                               );
                           UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
                       }
                       else //MYSQL
                       {
                           SqlString.Append(" FROM ");
                           SqlString.Append("`");   //注意这个符号不一样
                           SqlString.Append(mHashtableConfig["data_real_table"].ToString()); //站点信息表
                           SqlString.Append("` ");   //注意这个符号不一样
                           SqlString.Append("where ST=");
                           SqlString.Append("'");
                           SqlString.Append(TelInfoDataTable.Rows[i][1]);   //站点编号
                           SqlString.Append("' LIMIT 0,1;");

                           //查询数据
                           ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                               ref SqlConnection,                                  //数据库实例
                               mHashtableConfig["data_DataSource"].ToString(),
                               mHashtableConfig["data_Database"].ToString(),
                               mHashtableConfig["data_db_UserId"].ToString(),
                               mHashtableConfig["data_db_Password"].ToString(),
                               SqlString.ToString(),
                               ref pError
                               );
                       }

                      

                       if (ds == null) continue;
                       mTempDataTable = ds.Tables[0];
                       //循环拷贝有效数据-动态拷贝
                       for (int cnt = 0; cnt < SelectEssNameList.Count; cnt++)
                       {
                           dr[3 + cnt] = mTempDataTable.Rows[0][cnt];
                       }
                   }
                   catch (Exception error)
                   {
                       //没有则填充无效数据
                       for (int cnt = 0; cnt < SelectEssNameList.Count; cnt++)
                       {
                           dr[3 + cnt] = null;
                       }
                   }
                   mDataTable.Rows.Add(dr);
               }

               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }

               return mDataTable;
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }

               SystemLog.Write("GetTelRealData，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }


       //获取指定用户的所有设备列表包含站点名称信息,[0]:站点名称；[1]:站点编号
       //2018-06-10 修改为新数据库表支持
       public DataTable GetUserTelName(String UserName)
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mTelNumberTable;  //当前用户的站点编号列表
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择

           try
           {
               //查询当前用户的站点列表
               mTelNumberTable = this.GetUserTel(UserName);
               if (mTelNumberTable == null) return null;
               //分别查询每个站点的名称
               //SELECT `name` AS '名称', `ST` AS '编号' FROM `device_info` where ST='0' || ST='1'
               StringBuilder SqlString = new StringBuilder("SELECT `NAME` , `ST` FROM", 1024);


               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append("[");
                   SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //站点信息表
                   SqlString.Append("]");
                   SqlString.Append(" where ");
                   for (int i = 0; i < mTelNumberTable.Rows.Count; i++)
                   {
                       SqlString.Append("ST=");
                       SqlString.Append("'");
                       SqlString.Append(mTelNumberTable.Rows[i][0].ToString());
                       SqlString.Append("'");
                       if (i < (mTelNumberTable.Rows.Count - 1))
                       {
                           SqlString.Append(" || ");
                       }
                   }
                   //查询数据
                   ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                       ref SqlConnection,                                  //数据库实例
                       mHashtableConfig["sys_DataSource"].ToString(),
                       mHashtableConfig["sys_Database"].ToString(),
                       mHashtableConfig["sys_db_UserId"].ToString(),
                       mHashtableConfig["sys_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );

                   UserDataBase_SqlServer.Close(ref SqlConnection);                  //关闭数据库
               }
               else //MYSQL
               {
                   SqlString.Append("`");   //注意这个符号不一样
                   SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //站点信息表
                   SqlString.Append("` ");   //注意这个符号不一样
                   SqlString.Append(" where ");
                   for (int i = 0; i < mTelNumberTable.Rows.Count; i++)
                   {
                       SqlString.Append("ST=");
                       SqlString.Append("'");
                       SqlString.Append(mTelNumberTable.Rows[i][0].ToString());
                       SqlString.Append("'");
                       if (i < (mTelNumberTable.Rows.Count - 1))
                       {
                           SqlString.Append(" || ");
                       }
                   }
                   //查询数据
                   ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                       ref SqlConnection,                                  //数据库实例
                       mHashtableConfig["sys_DataSource"].ToString(),
                       mHashtableConfig["sys_Database"].ToString(),
                       mHashtableConfig["sys_db_UserId"].ToString(),
                       mHashtableConfig["sys_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );

                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               }

               
               
               
               return ds.Tables[0];

           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               SystemLog.Write("GetUserTelName，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }


       

       //获取指定用户的所有站点名称编号以及最新的实时数据
       public DataTable GetUserTelRealData(String UserName)
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           DataTable mTempDataTable;
           DataTable TelInfoDataTable = this.GetUserTelName(UserName);     //获取当前用户的设备信息列表
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataTable EssDataTable = StaticGlobal.GetRealEssDataTable();
           StringBuilder EssString = new StringBuilder(1024);
           DataBaseConnection SqlConnection = null;
           string pError = null;
           String DbSelect = StaticGlobal.GetDataDbSelect();            //数据库选择

           if (TelInfoDataTable == null) return null;   //没有找到数据
           if (EssDataTable == null || EssDataTable.Rows.Count == 0) return null; //配置有误，直接返回错误


           //循环添加要查询的要素
           for (int cnt = 0; cnt < EssDataTable.Rows.Count; cnt++)
           {
               EssString.Append(EssDataTable.Rows[cnt]["ess"]);
               EssString.Append(" AS '");
               EssString.Append(EssDataTable.Rows[cnt]["name"]);
               if (cnt == (EssDataTable.Rows.Count - 1))      //最后一个不用加逗号
                   EssString.Append("' ");
               else
                   EssString.Append("',");
           }

           //前面3列固定
           mDataTable.Columns.Add(new DataColumn("序号"));	        //添加第1列
           mDataTable.Columns.Add(new DataColumn("名称"));	        //添加第2列
           mDataTable.Columns.Add(new DataColumn("编号"));	        //添加第3列
           //循环添加要查询的要素列-后面列可配置
           for (int cnt = 0; cnt < EssDataTable.Rows.Count; cnt++)
           {
               try
               {
                   mDataTable.Columns.Add(new DataColumn(EssDataTable.Rows[cnt]["name"].ToString()));	    //添加第n列
               }
               catch (Exception error)
               {

                   mDataTable.Columns.Add(new DataColumn("配置错误"));	    //添加第n列
               }

           }

           if (TelInfoDataTable.Rows.Count == 0)                    //没有数据
           {
               return mDataTable;
           }


           try
           {

               //SELECT Z AS '水位1', PJ AS '日雨量' , TT AS '采集时间' FROM `sl651_2014` where ST='0000000000';
               //循环获取每个站点的实时数据
               for (int i = 0; i < TelInfoDataTable.Rows.Count; i++)
               {
                   //拷贝站点名称与编号数据-前面3列固定
                   DataRow dr = mDataTable.NewRow();
                   dr[0] = "" + i;                             //序号
                   dr[1] = TelInfoDataTable.Rows[i][0];        //名称
                   dr[2] = TelInfoDataTable.Rows[i][1];        //站点编号

                   try
                   {
                       //查询实时数据
                       StringBuilder SqlString = new StringBuilder("SELECT ", 1024);
                       SqlString.Append(EssString.ToString());  //要查询的要素

                       if (DbSelect == "SQLSERVER") //SQLSERVER
                       {
                           SqlString.Append(" from (SELECT row_number() over (order by ST ");

                           SqlString.Append(" ASC) "); //升序

                           SqlString.Append("as rownumber, * FROM ");
                           SqlString.Append("[");
                           SqlString.Append(mHashtableConfig["data_real_table"].ToString());
                           SqlString.Append("]");

                           SqlString.Append(" where ST='");
                           SqlString.Append(TelInfoDataTable.Rows[i][1]);   //站点编号

                           SqlString.Append("') as t Where t.rownumber > 0  AND t.rownumber <= 1");
                           SqlString.Append(";");

                           //查询数据
                           ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                               ref SqlConnection,                                           //数据库实例
                               mHashtableConfig["data_DataSource"].ToString(),
                               mHashtableConfig["data_Database"].ToString(),
                               mHashtableConfig["data_db_UserId"].ToString(),
                               mHashtableConfig["data_db_Password"].ToString(),
                               SqlString.ToString(),
                               ref pError
                               );
                           UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
                       }
                       else //MYSQL
                       {
                           SqlString.Append(" FROM ");
                           SqlString.Append("`");   //注意这个符号不一样
                           SqlString.Append(mHashtableConfig["data_real_table"].ToString()); //站点信息表
                           SqlString.Append("` ");   //注意这个符号不一样
                           SqlString.Append("where ST=");
                           SqlString.Append("'");
                           SqlString.Append(TelInfoDataTable.Rows[i][1]);   //站点编号
                           SqlString.Append("' LIMIT 0,1;");
                           //查询数据
                           ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                               ref SqlConnection,                                  //数据库实例
                               mHashtableConfig["data_DataSource"].ToString(),
                               mHashtableConfig["data_Database"].ToString(),
                               mHashtableConfig["data_db_UserId"].ToString(),
                               mHashtableConfig["data_db_Password"].ToString(),
                               SqlString.ToString(),
                               ref pError
                               );
                       }


                      

                       mTempDataTable = ds.Tables[0];
                       //循环拷贝有效数据-动态拷贝
                       for (int cnt = 0; cnt < EssDataTable.Rows.Count; cnt++)
                       {
                           dr[3 + cnt] = mTempDataTable.Rows[0][cnt];
                       }
                   }
                   catch (Exception error)
                   {
                       //没有则填充无效数据
                       for (int cnt = 0; cnt < EssDataTable.Rows.Count; cnt++)
                       {
                           dr[3 + cnt] = null;
                       }
                   }
                   mDataTable.Rows.Add(dr);
               }
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return mDataTable;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetUserTelRealData，" + error.Message + error.StackTrace); //写入日志
               return null;
           }



       }


       //获取所有设备列表包含站点名称信息,[0]:站点名称；[1]:站点编号
       public DataTable GetAllTelName()
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //分别查询每个站点的名称
               //SELECT `name` AS '名称', `number` AS '编号' FROM `telinfo`
               StringBuilder SqlString = new StringBuilder("SELECT `name` AS '名称', `number` AS '编号' FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetUserTelName，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }


       //获取所有站点名称编号以及最新的实时数据
       public DataTable GetAllTelRealData()
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           DataTable mTempDataTable;
           DataTable TelInfoDataTable = this.GetAllTelName();     //获取所有的设备信息列表
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataTable EssDataTable = StaticGlobal.GetRealEssDataTable();
           StringBuilder EssString = new StringBuilder(1024);
           DataBaseConnection SqlConnection = null;
           string pError = null;


           if (TelInfoDataTable == null) return null;   //没有找到数据
           if (EssDataTable == null || EssDataTable.Rows.Count == 0) return null; //配置有误，直接返回错误


           //循环添加要查询的要素
           for (int cnt = 0; cnt < EssDataTable.Rows.Count; cnt++)
           {
               EssString.Append(EssDataTable.Rows[cnt]["ess"]);
               EssString.Append(" AS '");
               EssString.Append(EssDataTable.Rows[cnt]["name"]);
               if (cnt == (EssDataTable.Rows.Count - 1))      //最后一个不用加逗号
                   EssString.Append("' ");
               else
                   EssString.Append("',");
           }

           //前面3列固定
           mDataTable.Columns.Add(new DataColumn("序号"));	        //添加第1列
           mDataTable.Columns.Add(new DataColumn("名称"));	        //添加第2列
           mDataTable.Columns.Add(new DataColumn("编号"));	        //添加第3列
           //循环添加要查询的要素列-后面列可配置
           for (int cnt = 0; cnt < EssDataTable.Rows.Count; cnt++)
           {
               try
               {
                   mDataTable.Columns.Add(new DataColumn(EssDataTable.Rows[cnt]["name"].ToString()));	    //添加第n列
               }
               catch (Exception error)
               {

                   mDataTable.Columns.Add(new DataColumn("配置错误"));	    //添加第n列
               }

           }

           if (TelInfoDataTable.Rows.Count == 0)                    //没有数据
           {
               return mDataTable;
           }


           try
           {
               //SELECT Z AS '水位1', PJ AS '日雨量' , TT AS '采集时间' FROM `sl651_2014` where ST='0000000000';
               //循环获取每个站点的实时数据
               for (int i = 0; i < TelInfoDataTable.Rows.Count; i++)
               {
                   //拷贝站点名称与编号数据-前面3列固定
                   DataRow dr = mDataTable.NewRow();
                   dr[0] = "" + i;                             //序号
                   dr[1] = TelInfoDataTable.Rows[i][0];        //名称
                   dr[2] = TelInfoDataTable.Rows[i][1];        //站点编号

                   try
                   {
                       //查询实时数据
                       StringBuilder SqlString = new StringBuilder("SELECT ", 1024);
                       SqlString.Append(EssString.ToString());  //要查询的要素

                       SqlString.Append(" FROM ");
                       SqlString.Append("`");   //注意这个符号不一样
                       SqlString.Append(mHashtableConfig["data_real_table"].ToString()); //站点信息表
                       SqlString.Append("` ");   //注意这个符号不一样
                       SqlString.Append("where ST=");
                       SqlString.Append("'");
                       SqlString.Append(TelInfoDataTable.Rows[i][1]);   //站点编号
                       SqlString.Append("' LIMIT 0,1;");

                       //查询数据
                       ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                           ref SqlConnection,                                  //数据库实例
                           mHashtableConfig["data_DataSource"].ToString(),
                           mHashtableConfig["data_Database"].ToString(),
                           mHashtableConfig["data_db_UserId"].ToString(),
                           mHashtableConfig["data_db_Password"].ToString(),
                           SqlString.ToString(),
                           ref pError
                           );

                       mTempDataTable = ds.Tables[0];
                       //循环拷贝有效数据-动态拷贝
                       for (int cnt = 0; cnt < EssDataTable.Rows.Count; cnt++)
                       {
                           dr[3 + cnt] = mTempDataTable.Rows[0][cnt];
                       }
                   }
                   catch (Exception error)
                   {
                       //没有则填充无效数据
                       for (int cnt = 0; cnt < EssDataTable.Rows.Count; cnt++)
                       {
                           dr[3 + cnt] = null;
                       }
                   }
                   mDataTable.Rows.Add(dr);
               }
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return mDataTable;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetUserTelRealData，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }











        //查询指定的站点指定时间段内整点数据,时间格式必须为YYYY-MM-DD
       public DataTable QueryIntegerDataData(String TelNumber, String StartDate, String EndDate, int StartNum, int ReadCnt, bool isOrder)
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataTable EssDataTable = StaticGlobal.GetRealEssDataTable();
           StringBuilder EssString = new StringBuilder(1024);
           DataBaseConnection SqlConnection = null;
           string pError = null;
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择


           if (EssDataTable == null || EssDataTable.Rows.Count == 0) return null; //配置有误，直接返回错误


           //循环添加要查询的要素
           for (int cnt = 0; cnt < EssDataTable.Rows.Count; cnt++)
           {
               EssString.Append(EssDataTable.Rows[cnt]["ess"]);
               EssString.Append(" AS '");
               EssString.Append(EssDataTable.Rows[cnt]["name"]);
               if (cnt == (EssDataTable.Rows.Count - 1))      //最后一个不用加逗号
                   EssString.Append("' ");
               else
                   EssString.Append("',");
           }



           try
           {
               //SELECT TT AS '采集时间',VT AS '电压(V)', Z AS '水位1(米)', ZB AS '水位2(米)',PJ AS '当前雨量(mm)',PT AS '累计雨量(mm)' , SBL1 AS '流量1(立方米/小时)', SBL2 AS '流量2(立方米/小时)',UT AS '上传时间' FROM `sl651_2014` WHERE ST='0000000000' AND TT >= '2016-09-27' AND TT <= '2016-10-1' LIMIT 10,10;
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT ", 1024);
               SqlString.Append(EssString.ToString());

               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append(" from (SELECT row_number() over (order by TT ");
                   if (isOrder) //倒序
                   {
                       SqlString.Append(" DESC) "); //逆序
                   }
                   else
                   {
                       SqlString.Append(" ASC) "); //升序
                   }

                   SqlString.Append("as rownumber, * FROM ");
                   SqlString.Append("[");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("]");

                   SqlString.Append(" WHERE ST='");
                   SqlString.Append(TelNumber);
                   SqlString.Append("' AND TT >= '");
                   SqlString.Append(StartDate);
                   if (StartDate.Length < 12)   //需要加上时间
                   {

                       SqlString.Append(" 00:00:00 ");
                   }

                   SqlString.Append("' AND TT <= '");
                   SqlString.Append(EndDate);
                   if (EndDate.Length < 12)   //需要加上时间
                   {
                       SqlString.Append(" 23:59:59 ");
                   }
                   
                   SqlString.Append("') as t Where t.rownumber > ");
                   SqlString.Append(StartNum);
                   SqlString.Append(" AND t.rownumber <= ");
                   SqlString.Append(ReadCnt+StartNum);
                   SqlString.Append(";");

                   //查询数据
                   ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                       ref SqlConnection,                                           //数据库实例
                       mHashtableConfig["data_DataSource"].ToString(),
                       mHashtableConfig["data_Database"].ToString(),
                       mHashtableConfig["data_db_UserId"].ToString(),
                       mHashtableConfig["data_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   SqlString.Append(" FROM ");
                   SqlString.Append(" `");   //注意这个符号不一样
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());  //历史数据库
                   SqlString.Append("` ");   //注意这个符号不一样
                   SqlString.Append("WHERE ST='");
                   SqlString.Append(TelNumber);
                   SqlString.Append("' AND TT >= '");
                   SqlString.Append(StartDate);
                   if (StartDate.Length < 12)   //需要加上时间
                   {

                       SqlString.Append(" 00:00:00 ");
                   }

                   SqlString.Append("' AND TT <= '");
                   SqlString.Append(EndDate);
                   if (EndDate.Length < 12)   //需要加上时间
                   {
                       SqlString.Append(" 23:59:59 ");
                   }
                   SqlString.Append("'");
                   if (isOrder) //倒序
                   {
                       SqlString.Append(" order by TT desc ");
                   }
                   else//循序
                   {
                       SqlString.Append(" order by TT asc ");
                   }

                   SqlString.Append(" LIMIT ");
                   SqlString.Append(StartNum);
                   SqlString.Append(",");
                   SqlString.Append(ReadCnt);
                   SqlString.Append(";");

                   //查询数据
                   ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                       ref SqlConnection,                                  //数据库实例
                       mHashtableConfig["data_DataSource"].ToString(),
                       mHashtableConfig["data_Database"].ToString(),
                       mHashtableConfig["data_db_UserId"].ToString(),
                       mHashtableConfig["data_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }

               

               mDataTable = ds.Tables[0];
               return mDataTable;
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               SystemLog.Write("QueryData，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }

       //指定站点的名称
       public string GetTelName(String TelNumber)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //分别查询每个站点的名称
               //SELECT `name` AS '名称', `number` AS '编号' FROM `telinfo` where number='0' || number='1'
               StringBuilder SqlString = new StringBuilder("SELECT `name` AS '名称' FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(" where ");
               SqlString.Append("number=");
               SqlString.Append("'");
               SqlString.Append(TelNumber);
               SqlString.Append("';");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               if (ds.Tables[0] == null || ds.Tables[0].Rows.Count == 0) return null;
               else if (ds.Tables[0].Rows[0][0] == null) return null;
               else return ds.Tables[0].Rows[0][0].ToString();

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("GetTelName，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }


       //获取用户数量
       public int GetAllUserCnt()
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           int cnt;
           DataBaseConnection SqlConnection = null;
           string pError = null;

           //打开历史数据库
           try
           {
               //SELECT COUNT(*) FROM `userinfo`;
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM ",1024);
               SqlString.Append(" `");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_table"].ToString());  //用户表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               cnt = Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString());
               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("GetAllUserCnt，" + error.Message + error.StackTrace); //写入日志
               return -1;
           }
       }


       //获取用户列表
       public DataTable GetUserList(int StartNum, int ReadCnt)
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;


           try
           {
               //SELECT * FROM `userinfo`  LIMIT 0,2;
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT ", 1024);
               SqlString.Append(" *FROM ");
               SqlString.Append(" `");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_table"].ToString());  //用户表
               SqlString.Append("` ");   //注意这个符号不一样            
               SqlString.Append(" LIMIT ");
               SqlString.Append(StartNum);
               SqlString.Append(",");
               SqlString.Append(ReadCnt);
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               mDataTable = ds.Tables[0];

               return mDataTable;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("QueryData，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }



       //获取所有普通用户名称列表
       public DataTable GetGeneralUserNameList()
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;


           try
           {
               //SELECT SERIAL,USER,NICK_NAME FROM `user_info` where ROLE=64 ORDER BY SERIAL ASC;
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT SERIAL,USER,NICK_NAME", 1024);
               SqlString.Append(" FROM ");
               SqlString.Append(" `");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_table"].ToString());  //用户表
               SqlString.Append("` ");   //注意这个符号不一样            
               SqlString.Append("where ROLE=64 ORDER BY SERIAL ASC;");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               mDataTable = ds.Tables[0];

               return mDataTable;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("QueryData，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }

       //获取指定用户的详细信息，使用主键id进行查询
       public DataTable GetGeneralUserInfoListForSerial(string[] SerialList)
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (SerialList == null || SerialList.Length == 0) return null;
           try
           {
               //SELECT SERIAL,USER,NICK_NAME,COMPANY,EMAIL,TEL,REMARKS FROM `user_info` where ROLE=64 AND (SERIAL=2 OR SERIAL=6);
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT SERIAL,USER,NICK_NAME,COMPANY,EMAIL,TEL,REMARKS,PASSWORD", 1024);
               SqlString.Append(" FROM ");
               SqlString.Append(" `");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_table"].ToString());  //用户表
               SqlString.Append("` ");   //注意这个符号不一样            
               SqlString.Append("where ROLE=64 AND (");
               for (int i = 0; i < SerialList.Length; i++)
               {
                   SqlString.Append("SERIAL=");
                   if (i == (SerialList.Length - 1)) //最后一个
                   {
                       SqlString.Append(SerialList[i]);
                   }
                   else
                   {
                       SqlString.Append(SerialList[i]);
                       SqlString.Append(" OR ");
                   }
               }
               SqlString.Append(")");

                   //查询数据
                   ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                       ref SqlConnection,                                  //数据库实例
                       mHashtableConfig["sys_DataSource"].ToString(),
                       mHashtableConfig["sys_Database"].ToString(),
                       mHashtableConfig["sys_db_UserId"].ToString(),
                       mHashtableConfig["sys_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               mDataTable = ds.Tables[0];

               return mDataTable;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("QueryData，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }



       //获取所有设备的编号与名称信息列表-管理员才能调用
       public DataTable GetGeneralDeviceStList()
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;


           try
           {
               //SELECT SERIAL,ST,NAME FROM `device_info`  ORDER BY SERIAL ASC;
               //查询所有的设备名称信息
               StringBuilder SqlString = new StringBuilder("SELECT SERIAL,ST,NAME", 1024);
               SqlString.Append(" FROM ");
               SqlString.Append(" `");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());  //用户表
               SqlString.Append("` ");   //注意这个符号不一样            
               SqlString.Append(" ORDER BY SERIAL ASC;");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               mDataTable = ds.Tables[0];

               return mDataTable;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("QueryData，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }


       //获取指定设备的基本信息，使用主键id进行查询
       public DataTable GetGeneralDeviceInfoListForSerial(string[] SerialList)
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (SerialList == null || SerialList.Length == 0) return null;
           try
           {
               //SELECT SERIAL,ST,`NAME`,ADDRESS,TEL,`LONG`,LAT,REAL_ESS,REMARKS FROM `device_info` where (SERIAL=2 OR SERIAL=6);
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT SERIAL,ST,`NAME`,ADDRESS,TEL,`LONG`,LAT,REAL_ESS,REMARKS", 1024);
               SqlString.Append(" FROM ");
               SqlString.Append(" `");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());  //用户表
               SqlString.Append("` ");   //注意这个符号不一样            
               SqlString.Append("where (");
               for (int i = 0; i < SerialList.Length; i++)
               {
                   SqlString.Append("SERIAL=");
                   if (i == (SerialList.Length - 1)) //最后一个
                   {
                       SqlString.Append(SerialList[i]);
                   }
                   else
                   {
                       SqlString.Append(SerialList[i]);
                       SqlString.Append(" OR ");
                   }
               }
               SqlString.Append(")");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               mDataTable = ds.Tables[0];

               return mDataTable;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("QueryData，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }


       //添加站点
       public int AddTel(string TelNumber, string TelName)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //分别查询每个站点的名称
               //INSERT INTO `telinfo` (number,name) VALUES('123','0123456789');SELECT ROW_COUNT(); 
               StringBuilder SqlString = new StringBuilder("INSERT INTO ", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("(number,name) VALUES(");
            
               SqlString.Append("'");
               SqlString.Append(TelNumber);
               SqlString.Append("',");

               SqlString.Append("'");
               SqlString.Append(TelName);
               SqlString.Append("'");

               SqlString.Append(");SELECT ROW_COUNT();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("AddTel，" + error.Message + error.StackTrace); //写入日志
               return -1;
           }
       }



       //获取某个设备的实时要素列表
       public DataTable GetTelRealEss(string TelNumber)
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (TelNumber == null) return null;
           try
           {
               //SELECT RTD_ESS FROM `telinfo` where number='0000000000';
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT ", 1024);
               SqlString.Append(" RTD_ESS FROM ");
               SqlString.Append(" `");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());  //设备信息表
               SqlString.Append("` ");   //注意这个符号不一样            
               SqlString.Append(" WHERE number='");
               SqlString.Append(TelNumber);
               SqlString.Append("';");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               mDataTable = ds.Tables[0];
               return mDataTable;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("GetTelRealEss，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }


       //批量获取设备的实时要素列表
        //返回列[0]:设备编号；列[1]:实时要素列表
       public DataTable GetTelRealEss(List<string> TelNumber)
       {
           //查询数据
           DataSet ds = new DataSet();
           DataTable mDataTable = new DataTable();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (TelNumber == null) return null;
           try
           {
               //SELECT number,RTD_ESS FROM `telinfo` where number='0000000000' || number = '0' || number='100';
               //查询当前用户的站点列表
               StringBuilder SqlString = new StringBuilder("SELECT ", 1024);
               SqlString.Append(" number,RTD_ESS FROM ");
               SqlString.Append(" `");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());  //设备信息表
               SqlString.Append("` ");   //注意这个符号不一样            
               SqlString.Append(" WHERE ");
               for(int i = 0;i < TelNumber.Count;i ++)  //循环添加需要查询的站点列表
               {
                   SqlString.Append("number=");
                   SqlString.Append("'");
                   SqlString.Append(TelNumber[i]);
                   SqlString.Append("'");
                   if(i < (TelNumber.Count-1))
                   {
                       SqlString.Append(" || ");
                   }
               }
               
               SqlString.Append(";");
               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               mDataTable = ds.Tables[0];
               return mDataTable;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("GetTelRealEss(List<string> TelNumber)，" + error.Message + error.StackTrace); //写入日志
               return null;
           }
       }



       //修改某个站点的实时数据要素编码列表
       public int SetTelRealEss(string TelNumber,string EssList)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //分别查询每个站点的名称
               //UPDATE `telinfo` SET RTD_ESS='"Z","TT"' where number='6';SELECT ROW_COUNT(); 
               StringBuilder SqlString = new StringBuilder("UPDATE ", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //站点信息表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(" SET RTD_ESS='");
               SqlString.Append(EssList);
               SqlString.Append("'");
               
               SqlString.Append(" WHERE number=");
               SqlString.Append("'");
               SqlString.Append(TelNumber);
               SqlString.Append("'");
               SqlString.Append(";SELECT ROW_COUNT();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
             
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("SetTelRealEss，" + error.Message + error.StackTrace); //写入日志
               return -1;
           }
       }

      


       //获取用户列表
        //USER,NICK_NAME,COMPANY,EMAIL,TEL,ROLE
       public DataTable GetUserList()
       {
           DataSet ds = new DataSet();
           DataTable mDataTable;
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT USER,NICK_NAME,COMPANY,EMAIL,TEL,ROLE FROM `user_info`;
               StringBuilder SqlString = new StringBuilder("SELECT USER,NICK_NAME,COMPANY,EMAIL,TEL,ROLE FROM ", 256);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_table"].ToString()); //用户表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               mDataTable = ds.Tables[0];
               return mDataTable;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("GetUserList，" + error.Message + error.StackTrace);    //写入日志
               return null;
           }
       }

       //添加一个用户
       public int AddUser(String USER, String PASSWORD, String PASSWORD_MD5, String NICK_NAME, String COMPANY, String EMAIL, String TEL, string REMARKS, int ROLE)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //INSERT INTO `user_info` (USER,PASSWORD,PASSWORD_MD5,NICK_NAME,COMPANY,EMAIL,TEL,ROLE) VALUES ("test1","123456","123456","测试添加用户1","没有公司","xxx@qq.com","02764875234",'64');

               StringBuilder SqlString = new StringBuilder("INSERT INTO ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_table"].ToString()); //用户表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(" (USER,PASSWORD,PASSWORD_MD5,NICK_NAME,COMPANY,EMAIL,TEL,REMARKS,ROLE) VALUES (");
               
               SqlString.Append("\"");
               SqlString.Append(USER); //USER
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(PASSWORD); //PASSWORD
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(PASSWORD_MD5); //PASSWORD_MD5
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(NICK_NAME); //NICK_NAME
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(COMPANY); //COMPANY
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(EMAIL); //EMAIL
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(TEL); //TEL
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(REMARKS); //REMARKS
               SqlString.Append("\",");
               
               SqlString.Append("'");
               SqlString.Append(ROLE); //ROLE
               SqlString.Append("')");
               SqlString.Append(";SELECT ROW_COUNT();");
                 

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("AddUser，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }


       //更新一个用户配置（不会检查用户是否存在）
       public int UpdateUser(String USER, String PASSWORD, String PASSWORD_MD5, String NICK_NAME, String COMPANY, String EMAIL, String TEL, string REMARKS, int ROLE)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //UPDATE `user_info` SET `PASSWORD`="1234567",`PASSWORD_MD5`="1234567",`NICK_NAME`="测试添加用户100",`COMPANY`="没有公司",`EMAIL`="xxx@qq.com",`TEL`="02764875234",`ROLE`='64' WHERE `user`="test1";SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder("UPDATE ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_table"].ToString()); //用户表
               SqlString.Append("` SET ");   //注意这个符号不一样
 
               SqlString.Append("`PASSWORD`=");
               SqlString.Append("\"");
               SqlString.Append(PASSWORD); //PASSWORD
               SqlString.Append("\",");

               SqlString.Append("`PASSWORD_MD5`=");
               SqlString.Append("\"");
               SqlString.Append(PASSWORD_MD5); //PASSWORD_MD5
               SqlString.Append("\",");

               SqlString.Append("`NICK_NAME`=");
               SqlString.Append("\"");
               SqlString.Append(NICK_NAME); //NICK_NAME
               SqlString.Append("\",");

               SqlString.Append("`COMPANY`=");
               SqlString.Append("\"");
               SqlString.Append(COMPANY); //COMPANY
               SqlString.Append("\",");
 
               SqlString.Append("`EMAIL`=");
               SqlString.Append("\"");
               SqlString.Append(EMAIL); //EMAIL
               SqlString.Append("\",");

               SqlString.Append("`TEL`=");
               SqlString.Append("\"");
               SqlString.Append(TEL); //TEL
               SqlString.Append("\",");

               SqlString.Append("`REMARKS`=");
               SqlString.Append("\"");
               SqlString.Append(REMARKS); //REMARKS
               SqlString.Append("\",");

               SqlString.Append("`ROLE`=");
               SqlString.Append("\"");
               SqlString.Append(ROLE); //ROLE
               SqlString.Append("\" ");

               SqlString.Append("WHERE `USER`=");
               SqlString.Append("\"");
               SqlString.Append(USER); //USER
               SqlString.Append("\"");

               SqlString.Append(";SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("UpdateUser，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }


       //删除一个用户-会删掉与之相关的用户-设备表-微信绑定用户表
       public int DeleteUser(String USER)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               DeleteUserBindWeixin(USER);          //2018-10-19 从微信绑定表中删除当前用户
               //DELETE FROM `user_info` WHERE `user`="test1";SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder("DELETE FROM ", 256);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_table"].ToString()); //用户表
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(" WHERE `user`=");
               SqlString.Append("\"");
               SqlString.Append(USER); //PASSWORD
               SqlString.Append("\"");
               SqlString.Append(";SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

                //DELETE FROM `USER_DEVICE` where `ST`="1234567890";SELECT ROW_COUNT();
                //从用户设备表中删除
                SqlString.Clear();
                SqlString.Append("DELETE FROM ");
                SqlString.Append("`");   //注意这个符号不一样
                SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //用户设备表
                SqlString.Append("` ");   //注意这个符号不一样
                SqlString.Append("where `USER`=\"");
                SqlString.Append(USER);
                SqlString.Append("\" ");
                SqlString.Append("; select row_count();");

                //SystemLog.Write(SqlString.ToString());    //写入日志
                //查询数据
                ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                    ref SqlConnection,                                  //数据库实例
                    mHashtableConfig["sys_DataSource"].ToString(),
                    mHashtableConfig["sys_Database"].ToString(),
                    mHashtableConfig["sys_db_UserId"].ToString(),
                    mHashtableConfig["sys_db_Password"].ToString(),
                    SqlString.ToString(),
                    ref pError
                    );

                //DELETE FROM `USER_DEVICE` where `ST`="1234567890";SELECT ROW_COUNT();
                //从用户分组表中删除
                SqlString.Clear();
                SqlString.Append("DELETE FROM ");
                SqlString.Append("`");   //注意这个符号不一样
                SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //用户分组表
                SqlString.Append("` ");   //注意这个符号不一样
                SqlString.Append("where `USER`=\"");
                SqlString.Append(USER);
                SqlString.Append("\" ");
                SqlString.Append("; select row_count();");

                //SystemLog.Write(SqlString.ToString());    //写入日志
                //查询数据
                ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                    ref SqlConnection,                                  //数据库实例
                    mHashtableConfig["sys_DataSource"].ToString(),
                    mHashtableConfig["sys_Database"].ToString(),
                    mHashtableConfig["sys_db_UserId"].ToString(),
                    mHashtableConfig["sys_db_Password"].ToString(),
                    SqlString.ToString(),
                    ref pError
                    );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               


               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write ("DeleteUser，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }

        //获取指定站点的详细信息
        //STArray:站点字符串列表
       public DataTable GetDeviceInfo(String[] STArray)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

            if(STArray == null || STArray.Length == 0) return null;
           try
           {
               //SELECT `ST`,`NAME`,`ADDRESS`,`TEL`,`LONG`,`LAT`,`REAL_ESS`,`TYPE` FROM `device_info` WHERE `ST`="1510260261" OR `ST`="1705130005" ;
               StringBuilder SqlString = new StringBuilder("SELECT `ST`,`NAME`,`ADDRESS`,`TEL`,`LONG`,`LAT`,`REAL_ESS`,`REMARKS`,`TYPE` FROM ", 512);
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append(" where ");
               for(int i = 0;i < STArray.Length;i ++)   //循环增加站点
               {
                   if(STArray[i] == null || STArray[i].Length == 0) continue;
                    SqlString.Append(" ST=\"");
                    SqlString.Append(STArray[i]);
                    SqlString.Append("\" ");
                   if(i < STArray.Length-1)
                   {
                        SqlString.Append(" OR ");
                   }
               }
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetDeviceInfo" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //获取指定用户的指定设备报警配置信息
       //USER:用户名；STArray:站点字符串列表
       public DataTable GetUserDeviceConfig(String USER, String[] STArray)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (USER == null || STArray == null || STArray.Length == 0) return null;
           try
           {
               //SELECT `ST`,`GROUP`,`A_ENABLE`,`A_CONFIG`,`A_INTERVAL` FROM `user_device` WHERE user='dexi' and (ST='8888888888'||ST='1707130010'||ST='1709080017');
               StringBuilder SqlString = new StringBuilder("SELECT `ST`,`GROUP`,`A_ENABLE`,`A_CONFIG`,`A_INTERVAL` FROM `", 512);
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("` where `USER`='");
               SqlString.Append(USER);
               SqlString.Append("' AND (");
               for (int i = 0; i < STArray.Length; i++)   //循环增加站点
               {
                   if (STArray[i] == null || STArray[i].Length == 0) continue;
                   SqlString.Append(" ST=\"");
                   SqlString.Append(STArray[i]);
                   SqlString.Append("\" ");
                   if (i < STArray.Length - 1)
                   {
                       SqlString.Append(" OR ");
                   }
               }
               SqlString.Append(");");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetDeviceInfo" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }


       //修改制定用户的指定设备的报警配置
       //USER:用户名；ST:站点编号；A_ENABLE:报警总开关状态；A_INTERVAL:报警间隔；A_CONFIG:报警配置
       public int UpdateUserDeviceConfig(string USER, string ST, int A_ENABLE, int A_INTERVAL, string A_CONFIG)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (USER == null || ST == null || A_CONFIG == null) return -1;
           try
           {
               //UPDATE  `user_device` SET A_ENABLE=1,A_INTERVAL=25,A_CONFIG='{}' WHERE `USER`='test3' AND ST='0000000031';SELECT COUNT(*);
               StringBuilder SqlString = new StringBuilder("UPDATE `", 512);
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("` SET A_ENABLE=");
               SqlString.Append(""+A_ENABLE);
               SqlString.Append(",A_INTERVAL=");
               SqlString.Append("" + A_INTERVAL);
               SqlString.Append(",A_CONFIG=");
               SqlString.Append("'" + A_CONFIG);
               SqlString.Append("' where `USER`='");
               SqlString.Append(USER);
               SqlString.Append("' AND ST='");
               SqlString.Append(ST);
               SqlString.Append("';SELECT COUNT(*);");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("UpdateUserDeviceConfig" + error.Message + error.StackTrace);   //写入日志
               return -1;
           }
       }


       //添加一个设备
       public int AddDevice(String ST, String NAME, String ADDRESS, String TEL, double LONG, double LAT, String REMARKS, String EssStrArray)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //INSERT INTO `device_info` (`ST`,`NAME`,`ADDRESS`,`TEL`,`LONG`,`LAT`,`REMARKS`,`REAL_ESS`) VALUES ("1712160001","测试添加","武汉","15878943654",'1.26548','2.54125','adsfadsf',"0,1,2,3,4,5,6");SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder("INSERT INTO ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //设备表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("  (`ST`,`NAME`,`ADDRESS`,`TEL`,`LONG`,`LAT`,`REMARKS`,`REAL_ESS`) VALUES (");

               SqlString.Append("\"");
               SqlString.Append(ST); //ST
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(NAME); //NAME
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(ADDRESS); //ADDRESS
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(TEL); //TEL
               SqlString.Append("\",");

               SqlString.Append("'");
               SqlString.Append(LONG); //LONG
               SqlString.Append("',");

               SqlString.Append("'");
               SqlString.Append(LAT); //LAT
               SqlString.Append("',");

                SqlString.Append("'");
                SqlString.Append(REMARKS); //REMARKS
               SqlString.Append("',");

               SqlString.Append("\"");
               SqlString.Append(EssStrArray); //REAL_ESS
               SqlString.Append("\"");
               SqlString.Append(");SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("AddDevice，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }



       //删除一个设备
        //0:不存在；-1：操作失败；>0删除的个数
        //20178-01-05 删除一个设备，会从设备列表与用户设备列表中全部进行删除
       public int DeleteDevice(String ST)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;


           try
           {

               //DELETE FROM `device_info` where `ST`="1234567890";SELECT ROW_COUNT();
               //从设备表中删除
               StringBuilder SqlString = new StringBuilder("DELETE FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //设备表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where `ST`=\"");
               SqlString.Append(ST);
               SqlString.Append("\" ");
               SqlString.Append("; select row_count();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               //DELETE FROM `USER_DEVICE` where `ST`="1234567890";SELECT ROW_COUNT();
               //从用户设备表中删除
               SqlString.Clear();
               SqlString.Append("DELETE FROM ");
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //用户设备表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where `ST`=\"");
               SqlString.Append(ST);
               SqlString.Append("\" ");
               SqlString.Append("; select row_count();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("DeleteDevice，" + error.Message + error.StackTrace); //写入日志
               return -1;
           }
       }

       //编辑一个设备的基本信息
       public int UpdateDeviceBasicInfo(String ST, String NAME, String ADDRESS, String TEL, double LONG, double LAT, String REMARKS)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //UPDATE `device_info` SET `NAME`="测试添加",`ADDRESS`="武汉",`TEL`="15878943654",`LONG`='1.26548',`LAT`='2.54125',`REAL_ESS`="0,1,2,3,4,5,6" WHERE `ST`="1712160001";SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder("UPDATE ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //设备表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("SET ");
              
               SqlString.Append("`NAME`=");
               SqlString.Append("\"");
               SqlString.Append(NAME); //NAME
               SqlString.Append("\",");

               SqlString.Append("`ADDRESS`=");
               SqlString.Append("\"");
               SqlString.Append(ADDRESS); //ADDRESS
               SqlString.Append("\",");

               SqlString.Append("`TEL`=");
               SqlString.Append("\"");
               SqlString.Append(TEL); //TEL
               SqlString.Append("\",");

               SqlString.Append("`LONG`=");
               SqlString.Append("'");
               SqlString.Append(LONG); //LONG
               SqlString.Append("',");

               SqlString.Append("`LAT`=");
               SqlString.Append("'");
               SqlString.Append(LAT); //LAT
               SqlString.Append("',");

               SqlString.Append("`REMARKS`=");
               SqlString.Append("\"");
               SqlString.Append(REMARKS); //REMARKS
               SqlString.Append("\" ");

               SqlString.Append("WHERE `ST`=");
               SqlString.Append("\"");
               SqlString.Append(ST); //ST
               SqlString.Append("\"");

               SqlString.Append(";SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("EditDevice，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }

       //编辑一个设备的详细信息
       public int UpdateDeviceDetails(String ST, String DETAILS)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //UPDATE `device_info` SET `DETAILS`="DETAILS" WHERE `ST`="1712160001";SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder("UPDATE ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //设备表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("SET ");

               SqlString.Append("`DETAILS`=");
               SqlString.Append("'");
               SqlString.Append(DETAILS); //DETAILS
               SqlString.Append("' ");

               SqlString.Append("WHERE `ST`=");
               SqlString.Append("\"");
               SqlString.Append(ST); //ST
               SqlString.Append("\"");

               SqlString.Append(";SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("UpdateDeviceDetails，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }


       //编辑一个设备的要素数据（EssStrArray：要素列表，逗号隔开的）
       public int UpdateDeviceEss(String ST, String EssStrArray)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           bool isPic = false;  //是否包含图片信息

           try
           {
               //UPDATE `device_info` SET `NAME`="测试添加",`ADDRESS`="武汉",`TEL`="15878943654",`LONG`='1.26548',`LAT`='2.54125',`REAL_ESS`="0,1,2,3,4,5,6" WHERE `ST`="1712160001";SELECT ROW_COUNT();
               if(EssStrArray.IndexOf(",25") >= 0) //是否含有25，如果含有意味着这是个图片站点
               {
                   isPic = true;
               }

               StringBuilder SqlString = new StringBuilder("UPDATE ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString()); //设备表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("SET ");

               SqlString.Append("`REAL_ESS`=");
               SqlString.Append("\"");
               SqlString.Append(EssStrArray); //REAL_ESS
               SqlString.Append("\",");

               SqlString.Append("`PICTURE`="); //图片信息支持
               SqlString.Append(isPic?1:0);

               SqlString.Append(" WHERE `ST`=");
               SqlString.Append("\"");
               SqlString.Append(ST); //ST
               SqlString.Append("\"");

               SqlString.Append(";SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("EditDevice，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }

        //获取某一个用户的分组是否存在
        public int FindDeviceUserGroup(string user, string group)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT COUNT(*) FROM `user_group` WHERE `USER`="admin" AND `GROUP`="管理分组1";

               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //用户分组表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(" WHERE ");
               
               SqlString.Append("`USER`=");
               SqlString.Append("\"");
               SqlString.Append(user); //USER
               SqlString.Append("\" AND ");

               SqlString.Append("`GROUP`=");
               SqlString.Append("\"");
               SqlString.Append(group); //GROUP
               SqlString.Append("\";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("FindDeviceUserGroup，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }


       //添加某个用户的一个分组
       public int AddUserGroup(string user, string group)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //INSERT INTO `user_group` (`USER`,`GROUP`) VALUES ("admin","测试分组10");SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder("INSERT INTO ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //设备表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("  (`USER`,`GROUP`) VALUES (");

               SqlString.Append("\"");
               SqlString.Append(user); //user
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(group); //group
               SqlString.Append("\"");

              
               SqlString.Append(");SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("AddDevice，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }


       //删除一个用户的分组-会清除掉与之相关的设备分组信息
       public int DeleteDeviceUserGroup(string user, string group)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //DELETE FROM `user_group` WHERE `USER`="admin" AND `GROUP`="测试分组10";SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder("DELETE FROM ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_group_table"].ToString()); //用户分组表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(" WHERE ");

               SqlString.Append("`USER`=");
               SqlString.Append("\"");
               SqlString.Append(user); //USER
               SqlString.Append("\" AND ");

               SqlString.Append("`GROUP`=");
               SqlString.Append("\"");
               SqlString.Append(group); //GROUP
               SqlString.Append("\";");
               SqlString.Append("SELECT ROW_COUNT();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());
               if(cnt > 0) //删除分组成功，删除掉与分组相关的设备分组信息
               {
                   SqlString.Clear();

                   SqlString.Append("UPDATE ");
                   SqlString.Append("`");   //注意这个符号不一样
                   SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //用户设备表
                   SqlString.Append("` ");   //注意这个符号不一样
                   SqlString.Append("SET ");


                   SqlString.Append("`GROUP`=");
                   SqlString.Append("null");

                   SqlString.Append(" WHERE `USER`='");
                   SqlString.Append(user);
                   SqlString.Append("' AND `GROUP`='");
                   SqlString.Append(group);
                   SqlString.Append("';");

                   //查询数据
                   if(UserDataBase_MYSQL.ExecuteNonQuery(
                       ref SqlConnection,                                  //数据库实例
                       mHashtableConfig["sys_DataSource"].ToString(),
                       mHashtableConfig["sys_Database"].ToString(),
                       mHashtableConfig["sys_db_UserId"].ToString(),
                       mHashtableConfig["sys_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       ) < 0)
                   {
                       SystemLog.Write("DeleteDeviceUserGroup，删除绑定到设备的分组信息失败" + pError);    //写入日志
                   }

                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               }

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("FindDeviceUserGroup，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }


       //获取所有设备列表（管理员获取所有设备信息）
       //[0]:站点编号；[1]:站点名称；[2]:站点分组,[3]:经度；[4]:纬度
       public DataTable GetAllDeviceList()
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT `ST`,`NAME`,'GROUP' FROM `device_info`;
               StringBuilder SqlString = new StringBuilder("SELECT `ST`,`NAME`,'GROUP',`LONG`,`LAT` FROM ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetUserDeviceList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }



       //获取指定的设备绑定了哪些用户
       public DataTable GetDeviceUserList(String ST)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT `USER` FROM `user_device` WHERE `ST`='1705160003';
               StringBuilder SqlString = new StringBuilder("SELECT `USER` FROM ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" WHERE `ST`='");
               SqlString.Append(ST);
               SqlString.Append("'");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetDeviceUserList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //获取指定的用户绑定了哪些设备
       public DataTable GetUserBindDeviceList(string USER)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT `ST` FROM `user_device` WHERE `USER`='admin';
               StringBuilder SqlString = new StringBuilder("SELECT `ST` FROM ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" WHERE `USER`='");
               SqlString.Append(USER);
               SqlString.Append("'");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetUserDeviceList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }


       //删除指定的设备绑定的用户
       public bool DeleteDeviceUserList(String ST)
       {
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           int status;

           try
           {
               //DELETE FROM `user_device` WHERE `ST`='1705160003';
               StringBuilder SqlString = new StringBuilder("DELETE FROM ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" WHERE `ST`='");
               SqlString.Append(ST);
               SqlString.Append("'");
               SqlString.Append(";");

               //执行
               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               if (status < 0) return false;
               else return true;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("DeleteDeviceUserList，" + error.Message + error.StackTrace);   //写入日志
               return false;
           }
       }



        //添加指定的设备绑定指定的用户(事务方式提交)
       public bool AddUserToDevice(string ST, String[] UserList)
       {
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           string user;
           int status;

           if (UserList == null || UserList.Length==0) return true;   //无需添加用户，直接退出
           try
           {

               StringBuilder SqlString = new StringBuilder("", 512);
               for(int i = 0;i < UserList.Length;i ++)
               {
                   //分别判断每个用户是否存在，存在则进行添加
                   user = UserList[i];
                   //if (isGetUserName(user) == false) continue;  //当前用户不存在，跳过

                   //INSERT INTO `user_device`  (`USER`,`ST`) VALUES ("admin10","1705160003");
                   SqlString.Append("INSERT INTO ");
                   SqlString.Append("`");   //注意这个符号不一样
                   SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //设备表
                   SqlString.Append("` ");   //注意这个符号不一样
                   SqlString.Append("  (`USER`,`ST`) VALUES (");

                   SqlString.Append("\"");
                   SqlString.Append(user); //user
                   SqlString.Append("\",");

                   SqlString.Append("\"");
                   SqlString.Append(ST); //ST
                   SqlString.Append("\"");
                   SqlString.Append(");");
               }

               //执行
               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "begin;", //开始一个事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("AddUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(), //插入数据
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("AddUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "commit;", //提交事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("AddUserToDevice，" + pError);    //写入日志
                   return false;
               }


               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               return true;

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("AddUserToDevice，" + error.Message + error.StackTrace);    //写入日志
               return false;
           }
       }


       //添加指定的设备绑定到用户
       public bool AddBindDeviceToUser(string USER, String[] STList)
       {
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           string ST;
           int status;

           if (STList == null || STList.Length == 0) return true;   //无需添加绑定设备，直接退出
           try
           {

               StringBuilder SqlString = new StringBuilder("", 512);
               for (int i = 0; i < STList.Length; i++)
               {
                   //分别判断每个用户是否存在，存在则进行添加
                   ST = STList[i];
                   //if (isGetUserName(user) == false) continue;  //当前用户不存在，跳过

                   //INSERT INTO `user_device`  (`USER`,`ST`) VALUES ("admin10","1705160003");
                   SqlString.Append("INSERT INTO ");
                   SqlString.Append("`");   //注意这个符号不一样
                   SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //设备表
                   SqlString.Append("` ");   //注意这个符号不一样
                   SqlString.Append("  (`USER`,`ST`) VALUES (");

                   SqlString.Append("\"");
                   SqlString.Append(USER); //user
                   SqlString.Append("\",");

                   SqlString.Append("\"");
                   SqlString.Append(ST); //ST
                   SqlString.Append("\"");
                   SqlString.Append(");");
               }

               //执行
               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "begin;", //开始一个事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("AddUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(), //插入数据
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("AddUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "commit;", //提交事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("AddUserToDevice，" + pError);    //写入日志
                   return false;
               }


               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               return true;

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("AddUserToDevice，" + error.Message + error.StackTrace);    //写入日志
               return false;
           }
       }


       //删除指定的设备绑定的用户(事务方式提交)
       public bool DeleteUserToDevice(string ST, String[] UserList)
       {
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           string user;
           int status;
           int cnt = 0; //记录添加成功的用户数量

           if (UserList == null || UserList.Length == 0) return true;   //无需添加用户，直接退出
           try
           {

               StringBuilder SqlString = new StringBuilder("", 512);
               for (int i = 0; i < UserList.Length; i++)
               {
                   //分别判断每个用户是否存在，存在则进行添加
                   user = UserList[i];
                   //if (isGetUserName(user) == false) continue;  //当前用户不存在，跳过

                   //DELETE FROM `user_device` WHERE ST='1709080017' AND USER='test';
                   SqlString.Append("DELETE FROM ");
                   SqlString.Append("`");   //注意这个符号不一样
                   SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //设备表
                   SqlString.Append("` ");   //注意这个符号不一样
                   SqlString.Append("WHERE ST=");

                   SqlString.Append("\"");
                   SqlString.Append(ST); //ST
                   SqlString.Append("\"");

                   SqlString.Append("AND `USER`=");

                   SqlString.Append("\"");
                   SqlString.Append(user); //user
                   SqlString.Append("\"");
                   SqlString.Append(";");
               }

               //执行
               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "begin;", //开始一个事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("DeleteUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(), //插入数据
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("DeleteUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "commit;", //提交事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("DeleteUserToDevice，" + pError);    //写入日志
                   return false;
               }


               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               return true;

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("DeleteUserToDevice，" + error.Message + error.StackTrace);    //写入日志
               return false;
           }
       }


       //删除指定的用户绑定的设备(事务方式提交)
       public bool DeleteDeviceToUser(string USER, String[] STList)
       {
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           string ST;
           int status;
           int cnt = 0; //记录添加成功的用户数量

           if (STList == null || STList.Length == 0) return true;   //无需添加用户，直接退出
           try
           {

               StringBuilder SqlString = new StringBuilder("", 512);
               for (int i = 0; i < STList.Length; i++)
               {
                   //分别判断每个设备是否存在，存在则进行添加
                   ST = STList[i];
                   //if (isGetUserName(user) == false) continue;  //当前用户不存在，跳过

                   //DELETE FROM `user_device` WHERE ST='1709080017' AND USER='test';
                   SqlString.Append("DELETE FROM ");
                   SqlString.Append("`");   //注意这个符号不一样
                   SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //设备表
                   SqlString.Append("` ");   //注意这个符号不一样
                   SqlString.Append("WHERE USER=");

                   SqlString.Append("\"");
                   SqlString.Append(USER); //USER
                   SqlString.Append("\"");

                   SqlString.Append(" AND `ST`=");

                   SqlString.Append("\"");
                   SqlString.Append(ST); //ST
                   SqlString.Append("\"");
                   SqlString.Append(";");
               }

               //执行
               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "begin;", //开始一个事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("DeleteUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(), //插入数据
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("DeleteUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "commit;", //提交事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("DeleteDeviceToUser，" + pError);    //写入日志
                   return false;
               }


               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               return true;

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("DeleteDeviceToUser，" + error.Message + error.StackTrace);    //写入日志
               return false;
           }
       }


        //获取一个设备所属分组
       public string GetDeviceGroup(String user, String ST)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if(user == null || ST == null) return null;
           try
           {
               //SELECT `GROUP` FROM `user_device` WHERE `USER`='admin' AND `ST`='1705130005';
               StringBuilder SqlString = new StringBuilder("SELECT `GROUP` FROM ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" WHERE `USER`='");
               SqlString.Append(user);
               SqlString.Append("'");
               SqlString.Append(" AND `ST`='");
               SqlString.Append(ST);
               SqlString.Append("'");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               if((ds.Tables[0]).Rows[0][0] == null) return null;
               return (ds.Tables[0]).Rows[0][0].ToString();
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetDeviceGroup，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //验证指定用户的指定设备是否存在
       public bool isGetUserDevice(string user, string ST)
       {
           DataSet ds = new DataSet();
           DataTable mDataTable;
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (user == null || ST == null) return false;
           try
           {
               //SELECT COUNT(*) FROM `user_device` WHERE `USER`='admin' AND `ST`='1705130005';
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM ", 128);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" WHERE `USER`='");
               SqlString.Append(user);
               SqlString.Append("'");
               SqlString.Append(" AND `ST`='");
               SqlString.Append(ST);
               SqlString.Append("'");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               mDataTable = ds.Tables[0];
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               if (mDataTable.Rows[0][0].ToString() == "0")
               {

                   return false;
               }
               else
               {

                   return true;
               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("isGetUserName，" + error.Message + error.StackTrace);   //写入日志
               return false;
           }
       }

       //检查设备表中是否存在当前设备
       public bool isCheckDevice(String ST)
       {
           DataSet ds = new DataSet();
           DataTable mDataTable;
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (ST == null) return false;
           try
           {
               //SELECT COUNT(*) FROM `device_info` WHERE `ST`='1705130005';
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM ", 128);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" WHERE `ST`='");
               SqlString.Append(ST);
               SqlString.Append("'");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               mDataTable = ds.Tables[0];
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               if (mDataTable.Rows[0][0].ToString() == "0")
               {

                   return false;
               }
               else
               {

                   return true;
               }
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("isCheckDevice，" + error.Message + error.StackTrace);   //写入日志
               return false;
           }

       }


       //编辑一个用户的设备到指定分组
       public int UpdateBindingDeviceGroup(string user,string ST, string group)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (user == null || ST == null) return -1;
           try
           {
               //UPDATE `user_device` SET `GROUP`='管理分组1' WHERE `USER`='admin' AND `ST`='1712160001';SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder("UPDATE ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //用户设备表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("SET ");

               SqlString.Append("`GROUP`=");
               SqlString.Append("'");
               SqlString.Append(group); //group
               SqlString.Append("'");

               SqlString.Append(" WHERE `USER`='");
               SqlString.Append(user);
               SqlString.Append("'");
               SqlString.Append(" AND `ST`='");
               SqlString.Append(ST);
               SqlString.Append("'");
               SqlString.Append(";SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("UpdateBindingDeviceGroup，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }



       //批量编辑一个用户的设备绑定到分组
       //user:用户名；group：分组名称；AddBindSTList：需要添加绑定的设备ST;DeleteBindSTList：需要删除绑定的设备ST
       public bool UpdateDevicesBindingGroup(string user, string group, string[] AddBindSTList, string[] DeleteBindSTList)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           string ST;
           int status;

           if (user == null || group == null || (AddBindSTList == null && DeleteBindSTList==null)) return false;
           try
           {

               //UPDATE `user_device` SET `GROUP`='管理分组1' WHERE `USER`='admin' AND `ST`='1712160001';SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder(512);
               //有设备需要绑定到分组
               if (AddBindSTList!=null && AddBindSTList.Length > 0)
               {
                   for (int i = 0; i < AddBindSTList.Length;i ++ ) //先生成需要绑定的设备列表SQL
                   {
                       ST = AddBindSTList[i];

                       SqlString.Append("UPDATE ");
                       SqlString.Append("`");   //注意这个符号不一样
                       SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //用户设备表
                       SqlString.Append("` ");   //注意这个符号不一样
                       SqlString.Append("SET ");


                       SqlString.Append("`GROUP`=");
                       SqlString.Append("'");
                       SqlString.Append(group); //group
                       SqlString.Append("'");

                       SqlString.Append(" WHERE `USER`='");
                       SqlString.Append(user);
                       SqlString.Append("'");
                       SqlString.Append(" AND `ST`='");
                       SqlString.Append(ST);
                       SqlString.Append("'");
                       SqlString.Append(";");
                   }      
               }
               //有设备需要从当前分组解绑
               if (DeleteBindSTList != null && DeleteBindSTList.Length > 0)
               {
                   for (int i = 0; i < DeleteBindSTList.Length; i++) //先生成需要绑定的设备列表SQL
                   {
                       ST = DeleteBindSTList[i];

                       SqlString.Append("UPDATE ");
                       SqlString.Append("`");   //注意这个符号不一样
                       SqlString.Append(mHashtableConfig["user_tel_table"].ToString()); //用户设备表
                       SqlString.Append("` ");   //注意这个符号不一样
                       SqlString.Append("SET ");


                       SqlString.Append("`GROUP`=");
                       SqlString.Append("null");

                       SqlString.Append(" WHERE `USER`='");
                       SqlString.Append(user);
                       SqlString.Append("'");
                       SqlString.Append(" AND `ST`='");
                       SqlString.Append(ST);
                       SqlString.Append("'");
                       SqlString.Append(";");
                   }
               }


               //执行
               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "begin;", //开始一个事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("UpdateDevicesBindingGroup，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(), //批量更新数据
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("UpdateDevicesBindingGroup，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "commit;", //提交事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("UpdateDevicesBindingGroup，" + pError);    //写入日志
                   return false;
               }


               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               return true;

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("UpdateDevicesBindingGroup，" + error.Message + error.StackTrace);    //写入日志
               return false;
           }
       }



       //获取所有视频设备列表（管理员获取所有设备信息）
       public DataTable GetAllVideoList()
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT * FROM `video_info`;
               StringBuilder SqlString = new StringBuilder("SELECT * FROM ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["video_info_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetAllVideoList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //获取用户的视频设备列表
       public DataTable GetUserVideoList(string UserName)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //select   `video_info`.*   from  `user_video` left   join   `video_info`   on  `video_info`.`SERIAL`=`user_video`.`VIDEO_ID`  where `user_video`.`USER`='dexi';;
               StringBuilder SqlString = new StringBuilder("SELECT ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["video_info_table"].ToString());
               SqlString.Append("`.* ");
               SqlString.Append(" from ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_video_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" left   join   ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["video_info_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" on ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["video_info_table"].ToString());
               SqlString.Append("`.`SERIAL`=");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_video_table"].ToString());
               SqlString.Append("`.`VIDEO_ID`");
               SqlString.Append(" where ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_video_table"].ToString());
               SqlString.Append("`.`USER`=\"");
               SqlString.Append(UserName);//用户名
               SqlString.Append("\"");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetUserVideoList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }


       //获取指定站点图片信息
       public DataTable GetTelPicInfo(string ST, string StartTime, string EndTime, int PicCount)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择

            try
            {
                //查询图片
                //SELECT ID,UT,TT,STT FROM `picdata` WHERE TT >= "2018-05-10 00:00:00" AND ST="2018030301" ORDER BY TT DESC LIMIT 0,3;
                StringBuilder SqlString = new StringBuilder("SELECT ID,UT,TT,STT FROM ", 1024);

                if (DbSelect == "SQLSERVER") //SQLSERVER
                {
                    SqlString.Append(" (SELECT row_number() over (order by TT  ASC) ");
                    SqlString.Append("as rownumber, * FROM ");
                    SqlString.Append("[");
                    SqlString.Append(mHashtableConfig["data_pic_table"].ToString());
                    SqlString.Append("]");

                    SqlString.Append(" where ST='");
                    SqlString.Append(ST);
                    SqlString.Append("' AND TT >= '");
                    SqlString.Append(StartTime);
                    SqlString.Append("' AND TT <= '");
                    SqlString.Append(EndTime);
                    SqlString.Append("') as t Where t.rownumber > ");
                    SqlString.Append(0);
                    SqlString.Append(" AND t.rownumber <= ");
                    SqlString.Append(PicCount);
                    SqlString.Append(";");

                    //查询数据
                    ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                        ref SqlConnection,                                           //数据库实例
                        mHashtableConfig["data_DataSource"].ToString(),
                        mHashtableConfig["data_Database"].ToString(),
                        mHashtableConfig["data_db_UserId"].ToString(),
                        mHashtableConfig["data_db_Password"].ToString(),
                        SqlString.ToString(),
                        ref pError
                        );
                    UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
                }
                else //MYSQL
                {
                    SqlString.Append("`");   //注意这个符号不一样
                    SqlString.Append(mHashtableConfig["data_pic_table"].ToString()); //图片表
                    SqlString.Append("` ");   //注意这个符号不一样
                    SqlString.Append("where ST=");
                    SqlString.Append("'");
                    SqlString.Append(ST);   //站点编号
                    SqlString.Append("' AND TT>='");
                    SqlString.Append(StartTime);   //时间
                    SqlString.Append("' AND TT<='");
                    SqlString.Append(EndTime);   //时间
                    SqlString.Append("'ORDER BY TT DESC LIMIT 0,");
                    SqlString.Append(PicCount);   //数量
                    SqlString.Append(";");

                    //查询数据
                    ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                        ref SqlConnection,                                  //数据库实例
                        mHashtableConfig["data_DataSource"].ToString(),
                        mHashtableConfig["data_Database"].ToString(),
                        mHashtableConfig["data_db_UserId"].ToString(),
                        mHashtableConfig["data_db_Password"].ToString(),
                        SqlString.ToString(),
                        ref pError
                        );

                    UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
                }

                
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               SystemLog.Write("GetTelPicture，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }


       //获取指定ID的图片路径
       public string GetTelPicturePath(int ID)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择

           try
           {
               //查询实时数据
               //SELECT PIC FROM `picdata` WHERE ID=138;
               StringBuilder SqlString = new StringBuilder("SELECT PIC FROM ", 1024);

               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append("["); 
                   SqlString.Append(mHashtableConfig["data_pic_table"].ToString()); //图片表
                   SqlString.Append("] ");  
                   SqlString.Append("where ID=");
                   SqlString.Append(ID);
                   SqlString.Append(";");

                   //查询数据
                   ds = UserDataBase_SqlServer.QueryAndRreturnAdapter(
                       ref SqlConnection,                                  //数据库实例
                       mHashtableConfig["data_DataSource"].ToString(),
                       mHashtableConfig["data_Database"].ToString(),
                       mHashtableConfig["data_db_UserId"].ToString(),
                       mHashtableConfig["data_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );

                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   SqlString.Append("`");   //注意这个符号不一样
                   SqlString.Append(mHashtableConfig["data_pic_table"].ToString()); //图片表
                   SqlString.Append("` ");   //注意这个符号不一样
                   SqlString.Append("where ID=");
                   SqlString.Append(ID);
                   SqlString.Append(";");

                   //查询数据
                   ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                       ref SqlConnection,                                  //数据库实例
                       mHashtableConfig["data_DataSource"].ToString(),
                       mHashtableConfig["data_Database"].ToString(),
                       mHashtableConfig["data_db_UserId"].ToString(),
                       mHashtableConfig["data_db_Password"].ToString(),
                       SqlString.ToString(),
                       ref pError
                       );

                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }

              

               if (ds.Tables[0] != null && ds.Tables[0].Rows[0][0]!=null)
               {
                   string path = ds.Tables[0].Rows[0][0].ToString();
                   return path;
               }
               return null;
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }

               SystemLog.Write("GetUserVideoList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //获取用户的图像设备列表，包含设备所属分组
       //[0]:站点编号；[1]:站点名称；[2]:站点分组；[3]:经度；[4]:纬度；
       public DataTable GetUserPicDeviceList(string UserName)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //select   `device_info`.`ST`,`device_info`.`NAME`,`user_device`.`GROUP`   from  `user_device` left   join   `device_info`   on  `device_info`.`ST`=`user_device`.`ST`  where `user_device`.`USER`='dexi' and `device_info`.`PICTURE`='1';
               StringBuilder SqlString = new StringBuilder("SELECT ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`.`ST`,");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`.`NAME`,");
               SqlString.Append("`");

               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`.`LONG`,");
               SqlString.Append("`");

               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`.`LAT`,");
               SqlString.Append("`");

               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`.`GROUP` ");
               SqlString.Append(" from ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" left   join   ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" on ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`.`ST`=");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`.`ST`");
               SqlString.Append(" where ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_tel_table"].ToString());
               SqlString.Append("`.`USER`=\"");
               SqlString.Append(UserName);//用户名
               SqlString.Append("\"");
               SqlString.Append("  and `device_info`.`PICTURE`='1';");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetUserPicDeviceList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //获取所有图片设备列表（管理员获取所有设备信息）
       //[0]:站点编号；[1]:站点名称；[2]:站点分组,[3]:经度；[4]:纬度
       public DataTable GetAllPicDeviceList()
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT `ST`,`NAME`,'GROUP' FROM `device_info` WHERE `PICTURE`='1';
               StringBuilder SqlString = new StringBuilder("SELECT `ST`,`NAME`,'GROUP',`LONG`,`LAT` FROM ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" WHERE `PICTURE`='1';");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetAllPicDeviceList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //添加一个微信用户到数据库（用户关注微信号时进行登记-目前只做记录用）
       public int AddWeixinUser(WeixinUserInfo UserInfo)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //INSERT INTO `weixin_user_info` (subscribe,openid,nickname,sex,city,country,province,`language`,headimgurl,subscribe_time,unionid,remark,groupid,tagid_list,subscribe_scene,qr_scene,qr_scene_str) 
               //VALUES('1', "openid", "nickname", '1', "city", "country", "province", "language", "headimgurl", "subscribe_time", "unionid", "remark", '0', "tagid_list", "subscribe_scene", '3', "qr_scene_str");

               StringBuilder SqlString = new StringBuilder("INSERT INTO ", 2048);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["weixin_info"].ToString()); //微信用户表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append(" (subscribe,openid,nickname,sex,city,country,province,`language`,headimgurl,subscribe_time,unionid,remark,groupid,tagid_list,subscribe_scene,qr_scene,qr_scene_str) VALUES (");

               SqlString.Append("'");
               SqlString.Append(UserInfo.subscribe); //subscribe
               SqlString.Append("',");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.openid); //openid
               SqlString.Append("\",");


               SqlString.Append("\"");
               SqlString.Append(Regex.Replace(UserInfo.nickname, @"\p{Cs}", "")); //nickname - 去掉Emoji表情
               SqlString.Append("\",");

               SqlString.Append("'");
               SqlString.Append(UserInfo.sex); //sex
               SqlString.Append("',");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.city); //city
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.country); //country
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.province); //province
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.language); //language
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.headimgurl); //headimgurl
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.subscribe_time); //subscribe_time
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.unionid); //unionid
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.remark); //remark
               SqlString.Append("\",");

               SqlString.Append("'");
               SqlString.Append(UserInfo.groupid); //groupid
               SqlString.Append("',");

               SqlString.Append("\"");
               if (UserInfo.tagid_list == null && UserInfo.tagid_list.Length > 0)
               {
                   for(int i= 0;i < UserInfo.tagid_list.Length;i ++)
                   {
                       SqlString.Append(UserInfo.tagid_list[i]); //tagid_list
                       if(i < (UserInfo.tagid_list.Length-1))
                       {
                           SqlString.Append(",");
                       }                       
                   }
               }
               else //没有
               {
                   //
               }              
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.subscribe_scene); //subscribe_scene
               SqlString.Append("\",");

               SqlString.Append("'");
               SqlString.Append(UserInfo.qr_scene); //qr_scene
               SqlString.Append("',");

               SqlString.Append("\"");
               SqlString.Append(UserInfo.qr_scene_str); //qr_scene_str
               SqlString.Append("\")");
               SqlString.Append(";SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("AddWeixinUser，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }


       //修改一个微信用户到数据库（用户关注微信号时进行登记-目前只做记录用）
       public int UpdateWeixinUser(WeixinUserInfo UserInfo)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //INSERT INTO `weixin_user_info` (subscribe,openid,nickname,sex,city,country,province,`language`,headimgurl,subscribe_time,unionid,remark,groupid,tagid_list,subscribe_scene,qr_scene,qr_scene_str) 
               //VALUES('1', "openid", "nickname", '1', "city", "country", "province", "language", "headimgurl", "subscribe_time", "unionid", "remark", '0', "tagid_list", "subscribe_scene", '3', "qr_scene_str");
               //UPDATE `user_device` SET `GROUP`='管理分组1' WHERE `USER`='admin' AND `ST`='1712160001';SELECT ROW_COUNT();
               StringBuilder SqlString = new StringBuilder("UPDATE ", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["weixin_info"].ToString()); //微信用户表
               SqlString.Append("` SET ");   //注意这个符号不一样

               SqlString.Append("subscribe='");
               SqlString.Append(UserInfo.subscribe); //subscribe
               SqlString.Append("',");
         
               SqlString.Append("nickname=\"");
               SqlString.Append(UserInfo.nickname); //nickname
               SqlString.Append("\",");

               SqlString.Append("sex='");
               SqlString.Append(UserInfo.sex); //sex
               SqlString.Append("',");

               SqlString.Append("city=\"");
               SqlString.Append(UserInfo.city); //city
               SqlString.Append("\",");

               SqlString.Append("country=\"");
               SqlString.Append(UserInfo.country); //country
               SqlString.Append("\",");

               SqlString.Append("province=\"");
               SqlString.Append(UserInfo.province); //province
               SqlString.Append("\",");

               SqlString.Append("language=\"");
               SqlString.Append(UserInfo.language); //language
               SqlString.Append("\",");

               SqlString.Append("headimgurl=\"");
               SqlString.Append(UserInfo.headimgurl); //headimgurl
               SqlString.Append("\",");

               SqlString.Append("subscribe_time=\"");
               SqlString.Append(UserInfo.subscribe_time); //subscribe_time
               SqlString.Append("\",");

               SqlString.Append("unionid=\"");
               SqlString.Append(UserInfo.unionid); //unionid
               SqlString.Append("\",");

               SqlString.Append("remark=\"");
               SqlString.Append(UserInfo.remark); //remark
               SqlString.Append("\",");

               SqlString.Append("groupid='");
               SqlString.Append(UserInfo.groupid); //groupid
               SqlString.Append("',");


               SqlString.Append("tagid_list=\"");
               if (UserInfo.tagid_list == null && UserInfo.tagid_list.Length > 0)
               {
                   for (int i = 0; i < UserInfo.tagid_list.Length; i++)
                   {
                       SqlString.Append(UserInfo.tagid_list[i]); //tagid_list
                       if (i < (UserInfo.tagid_list.Length - 1))
                       {
                           SqlString.Append(",");
                       }
                   }
               }
               else //没有
               {
                   //
               }
               SqlString.Append("\",");

               SqlString.Append("subscribe_scene=\"");
               SqlString.Append(UserInfo.subscribe_scene); //subscribe_scene
               SqlString.Append("\",");

               SqlString.Append("qr_scene='");
               SqlString.Append(UserInfo.qr_scene); //qr_scene
               SqlString.Append("',");

               SqlString.Append("qr_scene_str=\"");
               SqlString.Append(UserInfo.qr_scene_str); //qr_scene_str
               SqlString.Append("\"");
               SqlString.Append(" where openid=\"");
               SqlString.Append(UserInfo.openid); //openid
               SqlString.Append("\";SELECT ROW_COUNT();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("AddWeixinUser，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }

       //从微信用户登记表中读取一个用户信息
       public DataTable GetWeixinUser(String openid)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT * FROM `weixin_info` WHERE openid="openid";
               StringBuilder SqlString = new StringBuilder("SELECT * FROM ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["weixin_info"].ToString()); //微信用户表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where openid=");   //注意这个符号不一样
               SqlString.Append("\"");
               SqlString.Append(openid);
               SqlString.Append("\"");
               SqlString.Append(";");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
              
               if (ds == null)
               {
                   return null;
               }

               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("GetWeixinUser，" + error.Message + error.StackTrace);    //写入日志
               return null;
           }
       }


       //获取一个微信绑定的用户信息
       public DataTable GetWeixinBindUserInfo(string Openid)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //select   `user_info`.*   from  `user_weixin` left   join   `user_info`   on  `user_info`.`USER`=`user_weixin`.`USER`  where `user_weixin`.`openid`="oHjNi0c8t23D50M";
               StringBuilder SqlString = new StringBuilder("SELECT ", 512);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_table"].ToString());
               SqlString.Append("`.* ");
               SqlString.Append(" from ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_weixin"].ToString());
               SqlString.Append("`");
               SqlString.Append(" left   join   ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" on ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_table"].ToString());
               SqlString.Append("`.`USER`=");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_weixin"].ToString());
               SqlString.Append("`.`USER`");
               SqlString.Append(" where ");
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_weixin"].ToString());
               SqlString.Append("`.`openid`=\"");
               SqlString.Append(Openid);//openid
               SqlString.Append("\"");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetWeixinBindUserInfo，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //获取某个微信绑定的用户名称（不会判断当前这个用户是否真实存在）
       public String GetWeixinBindUserName(string Openid)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT `USER` FROM `user_weixin` WHERE openid="oHjNi0c8t2haR__mEPy4yZm3D50M";
               StringBuilder SqlString = new StringBuilder("SELECT  `USER` FROM ", 512);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_weixin"].ToString());
               SqlString.Append("` ");
               SqlString.Append("where openid=\"");
               SqlString.Append("\"");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0].Rows[0][0].ToString();
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetWeixinBindUserName，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //取消当前微信的绑定用户（解绑）
       public int DeleteWeixinBindUser(string Openid)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //DELETE FROM `user_weixin` WHERE openid="oHjNi0c8t2haR__mEPy4yZm3D50M";
               StringBuilder SqlString = new StringBuilder("DELETE FROM ", 512);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_weixin"].ToString());
               SqlString.Append("` ");
               SqlString.Append("where openid=\"");
               SqlString.Append(Openid);
               SqlString.Append("\"");
               SqlString.Append(";SELECT ROW_COUNT();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库

               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("DeleteWeixinBindUser，" + error.Message + error.StackTrace);   //写入日志
               return -1;
           }
       }

       //取消当前用户绑定的微信（解绑）
       public String DeleteUserBindWeixin(string USER)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //DELETE FROM `user_weixin` WHERE `USER`="admin";
               StringBuilder SqlString = new StringBuilder("DELETE FROM ", 512);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_weixin"].ToString());
               SqlString.Append("` ");
               SqlString.Append("where `USER`=\"");
               SqlString.Append(USER);
               SqlString.Append("\"");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0].Rows[0][0].ToString();
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("DeleteUserBindWeixin，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //微信绑定一个用户（不会判断当前这个用户是否真实存在）
       public int SetWeixinBindUserName(string Openid, string USER)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //INSERT INTO  `user_weixin` (`USER`,openid) VALUES ("system","oHjNi0D50M");
               StringBuilder SqlString = new StringBuilder("INSERT INTO ", 512);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_weixin"].ToString());
               SqlString.Append("` ");
               SqlString.Append("(`USER`,openid) VALUES (");
               SqlString.Append("\"");
               SqlString.Append(USER);
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(Openid);
               SqlString.Append("\")");
               SqlString.Append(";SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("SetWeixinBindUserName，" + error.Message + error.StackTrace);   //写入日志
               return -1;
           }
       }


       //获取微信图片
       public String GetWeixinPicture(string Openid)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT headimgurl FROM `weixin_info` WHERE openid="oHjNWiScU" LIMIT 0,1;
               StringBuilder SqlString = new StringBuilder("SELECT headimgurl FROM", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["weixin_info"].ToString());
               SqlString.Append("` ");
               SqlString.Append("where openid=\"");
               SqlString.Append(Openid);
               SqlString.Append("\" LIMIT 0,1");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               return ds.Tables[0].Rows[0][0].ToString();
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("SetWeixinBindUserName，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }



       //编辑一个视频的基本信息
       public int UpdateVideoBasicInfo(UInt32 SERIAL, String NAME, String URL, String H5URL, String REMARKS, string ST)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //UPDATE `video_info` SET `NAME`="测试添加",`URL`="武汉",`H5URL`="15878943654",`REMARKS`="0,1,2,3,4,5,6" WHERE `SERIAL`=17;SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder("UPDATE ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["video_info_table"].ToString()); //视频表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("SET ");

               SqlString.Append("`NAME`=");
               SqlString.Append("\"");
               SqlString.Append(NAME); //NAME
               SqlString.Append("\",");

               SqlString.Append("`URL`=");
               SqlString.Append("\"");
               SqlString.Append(URL); //URL
               SqlString.Append("\",");

               SqlString.Append("`H5URL`=");
               SqlString.Append("\"");
               SqlString.Append(H5URL); //H5URL
               SqlString.Append("\",");

               SqlString.Append("`ST`=");
               SqlString.Append("\"");
               SqlString.Append(ST);    //ST
               SqlString.Append("\",");

               SqlString.Append("`REMARKS`=");
               SqlString.Append("\"");
               SqlString.Append(REMARKS); //REMARKS
               SqlString.Append("\" ");

               SqlString.Append("WHERE `SERIAL`=");
               SqlString.Append(SERIAL);
      

               SqlString.Append(";SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("EditDevice，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }

       //添加一个视频设备
       public int AddVideo(String NAME, String URL, String H5URL, String REMARKS, string ST)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //INSERT INTO `video_info` (`NAME`,`URL`,`H5URL`,`REMARKS`) VALUES ("1712160001","测试添加","武汉","15878943654",'1.26548','2.54125'");SELECT ROW_COUNT();

               StringBuilder SqlString = new StringBuilder("INSERT INTO ", 512);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["video_info_table"].ToString()); //视频表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("  (`NAME`,`URL`,`H5URL`,`ST`,`TYPE`,`REMARKS`) VALUES (");
               SqlString.Append("\"");
               SqlString.Append(NAME); //NAME
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(URL); //URL
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(H5URL); //H5URL
               SqlString.Append("\",");

               SqlString.Append("\"");
               SqlString.Append(ST); //ST
               SqlString.Append("\",");

               SqlString.Append("\"HLS\","); //TYPE

               SqlString.Append("'");
               SqlString.Append(REMARKS); //REMARKS
               SqlString.Append("'");
               SqlString.Append(");SELECT ROW_COUNT();");


               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("AddVideo，" + error.Message + error.StackTrace);    //写入日志
               return -1;
           }
       }


       //删除一个视频设备
       //0:不存在；-1：操作失败；>0删除的个数
       //20178-01-05 删除一个设备，会从设备列表与用户设备列表中全部进行删除
       public int DeleteVideo(UInt32 SERIAL)
       {
           //查询数据
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;


           try
           {

               //DELETE FROM `video_info` where `SERIAL`="1234567890";SELECT ROW_COUNT();
               //从设备表中删除
               StringBuilder SqlString = new StringBuilder("DELETE FROM", 1024);
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["video_info_table"].ToString()); //视频设备表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where `SERIAL`=");
               SqlString.Append(SERIAL);
               SqlString.Append("; select row_count();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               int cnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());

               //DELETE FROM `USER_VIDEO` where `SERIAL`="1234567890";SELECT ROW_COUNT();
               //从用户视频表中删除
               SqlString.Clear();
               SqlString.Append("DELETE FROM ");
               SqlString.Append("`");   //注意这个符号不一样
               SqlString.Append(mHashtableConfig["user_video_table"].ToString()); //用户视频表
               SqlString.Append("` ");   //注意这个符号不一样
               SqlString.Append("where `VIDEO_ID`=");
               SqlString.Append(SERIAL);
               SqlString.Append("; select row_count();");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库

               return cnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("DeleteVideo，" + error.Message + error.StackTrace); //写入日志
               return -1;
           }
       }


       //获取指定的视频设备绑定了哪些用户
       public DataTable GetVideoUserList(UInt32 SERIAL)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           //UserDataBase mUserDataBase = new UserDataBase();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           try
           {
               //SELECT `USER` FROM `video_device` WHERE `SERIAL`='1705160003';
               StringBuilder SqlString = new StringBuilder("SELECT `USER` FROM ", 256);
               SqlString.Append("`");
               SqlString.Append(mHashtableConfig["user_video_table"].ToString());
               SqlString.Append("`");
               SqlString.Append(" WHERE `VIDEO_ID`=");
               SqlString.Append(SERIAL);
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetDeviceUserList，" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

       //删除指定的视频设备绑定的用户(事务方式提交)
       public bool DeleteUserToVideoDevice(UInt32 SERIAL, String[] UserList)
       {
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           string user;
           int status;
           int cnt = 0; //记录添加成功的用户数量

           if (UserList == null || UserList.Length == 0) return true;   //无需解除用户，直接退出
           try
           {

               StringBuilder SqlString = new StringBuilder("", 512);
               for (int i = 0; i < UserList.Length; i++)
               {
                   user = UserList[i];

                   //DELETE FROM `user_video` WHERE VIDEO_ID='1709080017' AND USER='test';
                   SqlString.Append("DELETE FROM ");
                   SqlString.Append("`");   //注意这个符号不一样
                   SqlString.Append(mHashtableConfig["user_video_table"].ToString()); //视频设备表
                   SqlString.Append("` ");   //注意这个符号不一样
                   SqlString.Append("WHERE VIDEO_ID=");


                   SqlString.Append(SERIAL); //ST


                   SqlString.Append(" AND `USER`=");

                   SqlString.Append("\"");
                   SqlString.Append(user); //user
                   SqlString.Append("\"");
                   SqlString.Append(";");
               }

               //执行
               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "begin;", //开始一个事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("DeleteUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(), //插入数据
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("DeleteUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "commit;", //提交事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("DeleteUserToVideoDevice，" + pError);    //写入日志
                   return false;
               }


               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               return true;

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("DeleteUserToVideoDevice，" + error.Message + error.StackTrace);    //写入日志
               return false;
           }
       }

       //添加指定的视频设备绑定指定的用户(事务方式提交)
       public bool AddUserToVideoDevice(UInt32 SERIAL, String[] UserList)
       {
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           string user;
           int status;

           if (UserList == null || UserList.Length == 0) return true;   //无需添加用户，直接退出
           try
           {

               StringBuilder SqlString = new StringBuilder("", 512);
               for (int i = 0; i < UserList.Length; i++)
               {
                   //分别判断每个用户是否存在，存在则进行添加
                   user = UserList[i];
                   //if (isGetUserName(user) == false) continue;  //当前用户不存在，跳过

                   //INSERT INTO `user_video`  (`USER`,`VIDEO_ID`) VALUES ("admin10","1705160003");
                   SqlString.Append("INSERT INTO ");
                   SqlString.Append("`");   //注意这个符号不一样
                   SqlString.Append(mHashtableConfig["user_video_table"].ToString()); //视频设备表
                   SqlString.Append("` ");   //注意这个符号不一样
                   SqlString.Append("  (`USER`,`VIDEO_ID`) VALUES (");

                   SqlString.Append("\"");
                   SqlString.Append(user); //user
                   SqlString.Append("\",");


                   SqlString.Append(SERIAL); //SERIAL

                   SqlString.Append(");");
               }

               //执行
               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "begin;", //开始一个事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("AddUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(), //插入数据
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("AddUserToDevice，" + pError);    //写入日志
                   return false;
               }

               status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   "commit;", //提交事务
                   ref pError
                   );
               if (status < 0)
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
                   SystemLog.Write("AddUserToVideoDevice，" + pError);    //写入日志
                   return false;
               }


               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               return true;

           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               SystemLog.Write("AddUserToVideoDevice，" + error.Message + error.StackTrace);    //写入日志
               return false;
           }
       }

       //获取指定用户的报警记录条数(AlarmEssSelect:报警要素选择，如果为NULL则获取所有报警要素)
       public UInt32 GetAlarmDataCnt(String USER, String ST, String AlarmEssSelect, String StartTime, String EndTime)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (USER == null || USER.Length == 0) return 0;
           try
           {
               //SELECT COUNT(*) FROM `alarm_record` where `USER`="dexi" AND `USER`="dexi"  AND TIME >= "2016-10-08 13:20:00" AND TIME <= "2019-10-10 20:00:00";
               StringBuilder SqlString = new StringBuilder("SELECT COUNT(*) FROM ", 512);
               SqlString.Append(mHashtableConfig["alarm_record_table"].ToString());
               SqlString.Append(" where `USER`=\"");
               SqlString.Append(USER);
               if(ST!=null)
               {
                   SqlString.Append("\" AND `ST` = \"");
                   SqlString.Append(ST);
               }
               if (AlarmEssSelect != null)
               {
                   SqlString.Append("\" AND `A_ESS` = \"");
                   SqlString.Append(AlarmEssSelect);
               }
               SqlString.Append("\" AND `TIME` >= \"");
               SqlString.Append(StartTime);
               SqlString.Append("\" AND `TIME` <= \"");
               SqlString.Append(EndTime);
               SqlString.Append("\";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                  mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );

               int DataCnt = int.Parse(ds.Tables[0].Rows[0][0].ToString());
               if (DataCnt < 0) DataCnt = 0;
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return (UInt32)DataCnt;
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetAlarmDataCnt" + error.Message + error.StackTrace);   //写入日志
               return 0;
           }
       }


       //获取指定站点的用户历史报警记录(AlarmEssSelect:报警要素选择，如果为NULL则获取所有报警要素)
       public DataTable GetAlarmData(String USER, String ST, String AlarmEssSelect, String StartTime, String EndTime, UInt32 StartIndex, UInt32 ReadCnt, bool isASC)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (USER == null || USER.Length == 0) return null;
           try
           {
               // SELECT `TIME`,`ST`,`TT`,`A_ESS`,`A_TYPE`,`VALUE`,`A_VALUE`,`A_INFO`,`STATUS` FROM alarm_record where `USER`="dexi" AND TIME >= "2018-11-16 00:00:00" AND TIME <= "2019-1-5 23:59:59" ORDER BY TT DESC  LIMIT 0,100;
               //SELECT `TIME`,`ST`,`TT`,`A_ESS`,`A_TYPE`,`VALUE`,`A_VALUE`,`A_INFO`,`STATUS` FROM `alarm_record` where `USER`="dexi" AND TIME >= "2016-10-08 13:20:00" AND TIME <= "2019-10-10 20:00:00" ORDER BY TIME ASC LIMIT 0,1;
               StringBuilder SqlString = new StringBuilder("SELECT `TIME`,`ST`,`TT`,`A_ESS`,`A_TYPE`,`VALUE`,`A_VALUE`,`A_INFO`,`STATUS` FROM `", 512);
               SqlString.Append(mHashtableConfig["alarm_record_table"].ToString());
               SqlString.Append("` where `USER`=\"");
               SqlString.Append(USER);
               if (ST != null)
               {
                   SqlString.Append("\" AND `ST` = \"");
                   SqlString.Append(ST);
               }
               if (AlarmEssSelect != null)
               {
                   SqlString.Append("\" AND `A_ESS` = \"");
                   SqlString.Append(AlarmEssSelect);
               }
               SqlString.Append("\" AND `TIME` >= \"");
               SqlString.Append(StartTime);
               SqlString.Append("\" AND `TIME` <= \"");
               SqlString.Append(EndTime);
               if (isASC) //升序
               {
                   SqlString.Append("\" ORDER BY `TIME` ASC "); //升序
               }
               else
               {
                   SqlString.Append("\" ORDER BY `TIME` DESC "); //逆序
               }
               SqlString.Append(" LIMIT ");
               SqlString.Append(StartIndex);
               SqlString.Append(",");
               SqlString.Append(ReadCnt);
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                  mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetAlarmData" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }




       //添加一条历史数据-用于人工置数
       public bool InsertHistData(String ST,String TT, string[] EssListBuff, string[] DataListBuff)
       {
       
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;
           int status;
           String DbSelect = StaticGlobal.GetDataDbSelect();         //数据库选择
           

           try
           {
               //INSERT INTO `sl651_2014` (TT,ST,STT,UT) VALUES('2019-03-05 12:15:00','0123456789','2019-03-05 12:15:00','2019-03-05 12:15:00');
               //INSERT INTO [sl651_2014] (TT,ST,STT,UT) VALUES('2019-03-05 12:15:00','0123456789','2019-03-05 12:15:00','2019-03-05 12:15:00');
               StringBuilder SqlString = new StringBuilder("INSERT INTO ", 1024);
              
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   SqlString.Append(" [");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("] ");
               }
               else //MYSQL
               {
                   SqlString.Append(" `");
                   SqlString.Append(mHashtableConfig["data_hist_table"].ToString());
                   SqlString.Append("` ");
               }
    
               //循环添加要素
               SqlString.Append("(ST,TT,");
               for(int i = 0;i < EssListBuff.Length;i ++)
               {
                   SqlString.Append(EssListBuff[i]);
                   SqlString.Append(",");
               }
               //添加UT,STT
               SqlString.Append("UT,STT) VALUES ('");
               //数据
               SqlString.Append(ST);
               SqlString.Append("','");
               SqlString.Append(TT);
               SqlString.Append("','");
               //循环添加其他数据
               for(int i = 0;i < DataListBuff.Length;i ++)
               {
                    SqlString.Append(DataListBuff[i]);
                    SqlString.Append("','");
               }
               SqlString.Append(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));  //UT
               SqlString.Append("','");
               SqlString.Append(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));  //STT
               SqlString.Append("');");
              

               //查询数据
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   status = UserDataBase_SqlServer.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   status = UserDataBase_MYSQL.ExecuteNonQuery(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["data_DataSource"].ToString(),
                   mHashtableConfig["data_Database"].ToString(),
                   mHashtableConfig["data_db_UserId"].ToString(),
                   mHashtableConfig["data_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
                   UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               }
               if (status >= 0) return true;
               else return false;
           }
           catch (Exception error)
           {
               if (DbSelect == "SQLSERVER") //SQLSERVER
               {
                   UserDataBase_SqlServer.Close(ref SqlConnection);                   //关闭数据库
               }
               else //MYSQL
               {
                   UserDataBase_MYSQL.Close(ref SqlConnection);                  //关闭数据库
               }
               

               SystemLog.Write("InsertHistData，" + error.Message + error.StackTrace); //写入日志
               return false;
           }
       }






       //获取指定设备的详细信息
       public DataTable GetDeviceDetails(string ST)
       {
           DataSet ds = new DataSet();
           Hashtable mHashtableConfig = StaticGlobal.GetDbConfig();
           DataBaseConnection SqlConnection = null;
           string pError = null;

           if (ST == null || ST.Length == 0) return null;
           try
           {
               //SELECT `ST`,`DETAILS` FROM `device_info` WHERE `ST`="1510260261" OR `ST`="1705130005" ;
               StringBuilder SqlString = new StringBuilder("SELECT `ST`,`DETAILS`,`TYPE` FROM `", 512);
               SqlString.Append(mHashtableConfig["tel_info_table"].ToString());
               SqlString.Append("` where ");
               SqlString.Append("ST=\"");
               SqlString.Append(ST);
               SqlString.Append("\"");
               SqlString.Append(";");

               //查询数据
               ds = UserDataBase_MYSQL.QueryAndRreturnAdapter(
                   ref SqlConnection,                                  //数据库实例
                   mHashtableConfig["sys_DataSource"].ToString(),
                   mHashtableConfig["sys_Database"].ToString(),
                   mHashtableConfig["sys_db_UserId"].ToString(),
                   mHashtableConfig["sys_db_Password"].ToString(),
                   SqlString.ToString(),
                   ref pError
                   );
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               return ds.Tables[0];
           }
           catch (Exception error)
           {
               UserDataBase_MYSQL.Close(ref SqlConnection);                   //关闭数据库
               SystemLog.Write("GetDeviceDetails" + error.Message + error.StackTrace);   //写入日志
               return null;
           }
       }

















	}

       

    //微信用户详细信息
    public class WeixinUserInfo
    {
        public int subscribe { get; set; }   //用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息。 
        public string openid { get; set; }      //用户的标识，对当前公众号唯一 
        public string nickname { get; set; }   //用户的昵称 
        public int sex { get; set; }         //用户的性别，值为1时是男性，值为2时是女性，值为0时是未知 
        public string city { get; set; }        //用户所在城市 
        public string country { get; set; }     //用户所在国家 
        public string province { get; set; }    //用户所在省份 
        public string language { get; set; }     //用户的语言，简体中文为zh_CN 
        public string headimgurl { get; set; }   //用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。 
        public string subscribe_time { get; set; }   //用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间 
        public string unionid { get; set; }     //只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。 
        public string remark { get; set; }      //公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注 
        public int groupid { get; set; }     //用户所在的分组ID（兼容旧的用户分组接口） 
        public int[] tagid_list { get; set; }   //用户被打上的标签ID列表 int[] ,转换为字符串，使用逗号隔开
        public string subscribe_scene { get; set; }   //返回用户关注的渠道来源，ADD_SCENE_SEARCH 公众号搜索，ADD_SCENE_ACCOUNT_MIGRATION 公众号迁移，ADD_SCENE_PROFILE_CARD 名片分享，ADD_SCENE_QR_CODE 扫描二维码，ADD_SCENEPROFILE LINK 图文页内名称点击，ADD_SCENE_PROFILE_ITEM 图文页右上角菜单，ADD_SCENE_PAID 支付后关注，ADD_SCENE_OTHERS 其他 
        public int qr_scene { get; set; }            //二维码扫码场景（开发者自定义） 
        public string qr_scene_str { get; set; }        //二维码扫码场景描述（开发者自定义） 
    }

}