using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Xml;


//用于初始化配置，在Global.asax.cs中进行调用，仅仅只能启动时调用一次
//数据都写入到了全局变量 StaticGlobal 中。
namespace DX_DataInterface.Models
{
    public static class StaticConfigInit
    {

        public static void Application_GetConfig(string ConfigXmlFileName, string ConfigDbFileName)
        {
            try
            {
                // 在应用程序启动时运行的代码
                // Application["Title"] = "Builder.com Sample";  
                XmlDocument XmlDoc = new XmlDocument();
                XmlDoc.Load(/*Server.MapPath("config.config")*/ ConfigXmlFileName);
                XmlNode node = XmlDoc.SelectSingleNode(@"configuration").SelectSingleNode(@"sysdbconfig");
                XmlNode node1;
                XmlNode node2;

                //系统用户数据库相关信息
                node1 = node.SelectSingleNode(@"DataSource");
                StaticGlobal.mHashTable_DbConfig["sys_DataSource"] = node1.InnerText;
                node1 = node.SelectSingleNode(@"Database");
                StaticGlobal.mHashTable_DbConfig["sys_Database"] = node1.InnerText;
                node1 = node.SelectSingleNode(@"db_UserId");
                StaticGlobal.mHashTable_DbConfig["sys_db_UserId"] = node1.InnerText;
                node1 = node.SelectSingleNode(@"db_Password");
                StaticGlobal.mHashTable_DbConfig["sys_db_Password"] = node1.InnerText;

                //用户相关配置表
                node1 = node.SelectSingleNode(@"user_table");
                StaticGlobal.mHashTable_DbConfig["user_table"] = node1.InnerText;        //用户列表
                node1 = node.SelectSingleNode(@"user_tel_table");
                StaticGlobal.mHashTable_DbConfig["user_tel_table"] = node1.InnerText;    //用户站点关系表
                node1 = node.SelectSingleNode(@"telinfo_table");
                StaticGlobal.mHashTable_DbConfig["tel_info_table"] = node1.InnerText;    //站点信息表
                node1 = node.SelectSingleNode(@"user_group_table");
                StaticGlobal.mHashTable_DbConfig["user_group_table"] = node1.InnerText;  //用户分组表
                node1 = node.SelectSingleNode(@"video_table");
                StaticGlobal.mHashTable_DbConfig["video_info_table"] = node1.InnerText;   //视频信息表
                node1 = node.SelectSingleNode(@"user_video_table");
                StaticGlobal.mHashTable_DbConfig["user_video_table"] = node1.InnerText;  //用户视频表

                node1 = node.SelectSingleNode(@"weixin_info_table");
                StaticGlobal.mHashTable_DbConfig["weixin_info"] = node1.InnerText;      //微信信息表
                node1 = node.SelectSingleNode(@"user_weixin_table");
                StaticGlobal.mHashTable_DbConfig["user_weixin"] = node1.InnerText;      //微信用户表
                node1 = node.SelectSingleNode(@"alarm_record_table");
                StaticGlobal.mHashTable_DbConfig["alarm_record_table"] = node1.InnerText;      //报警记录表
                
                //历史数据相关数据库信息
                node = XmlDoc.SelectSingleNode(@"configuration").SelectSingleNode(@"datadbconfig");
                //2019-03-05 增加数据库选择功能
                node1 = node.SelectSingleNode(@"datadbselect");
                StaticGlobal.SetDataDbSelect(node1.InnerText);      //设置当前历史数据库使用的数据库类型
                if (StaticGlobal.GetDataDbSelect() == "SQLSERVER")  //使用sqlserver数据库
                {
                    node = node.SelectSingleNode(@"sqlserver");     //选择sqlserver数据库配置标签
                }
                else //默认使用mysql数据库
                {
                    node = node.SelectSingleNode(@"mysql");         //选择mysql数据库配置标签
                }

                //历史数据库用户名等信息
                node1 = node.SelectSingleNode(@"DataSource");
                StaticGlobal.mHashTable_DbConfig["data_DataSource"] = node1.InnerText;
                node1 = node.SelectSingleNode(@"Database");
                StaticGlobal.mHashTable_DbConfig["data_Database"] = node1.InnerText;
                node1 = node.SelectSingleNode(@"db_UserId");
                StaticGlobal.mHashTable_DbConfig["data_db_UserId"] = node1.InnerText;
                node1 = node.SelectSingleNode(@"db_Password");
                StaticGlobal.mHashTable_DbConfig["data_db_Password"] = node1.InnerText;
               
                //历史数据库相关表名称
                node1 = node.SelectSingleNode(@"real_table");
                StaticGlobal.mHashTable_DbConfig["data_real_table"] = node1.InnerText;   //实时数据表
                node1 = node.SelectSingleNode(@"hist_table");
                StaticGlobal.mHashTable_DbConfig["data_hist_table"] = node1.InnerText;   //历史数据表
                node1 = node.SelectSingleNode(@"hour_table");
                StaticGlobal.mHashTable_DbConfig["data_hour_table"] = node1.InnerText;   //小时数据表
                node1 = node.SelectSingleNode(@"pic_table");
                StaticGlobal.mHashTable_DbConfig["data_pic_table"] = node1.InnerText;    //图片数据表

                //其它相关配置
                node = XmlDoc.SelectSingleNode(@"configuration").SelectSingleNode(@"config");
                node2 = node.SelectSingleNode(@"OnePageCnt");
                StaticGlobal.mHashTable_DbConfig["OnePageCnt"] = Convert.ToInt32(node2.InnerText);  //一个页面显示的历史数据条数

                //读取实时数据要素配置
                StaticGlobal.RealEssDataTable = GetRealDataEssConfig(ConfigDbFileName);             //存储到全局静态类中进行使用
                //读取要素编码总表
                StaticGlobal.EssDataTable = GetDataEssConfig(ConfigDbFileName);                     //存储要素数据总表
                //初始化要素名称与单位的哈希表，用于快速查找指定要素的名称与单位
                if(StaticGlobal.EssDataTable != null)
                {
                    string ess;
                    for (int i = 0; i < StaticGlobal.EssDataTable.Rows.Count;i ++ )
                    {
                        try 
                        {	        
                            ess = StaticGlobal.EssDataTable.Rows[i]["标识符ASCII码"].ToString();
                            StaticGlobal.mHashTable_EssNameList[ess] = StaticGlobal.EssDataTable.Rows[i]["编码要素"].ToString();  //站点要素名表哈希表-需要在初始化了EssDataTable中进行初始化
                            StaticGlobal.mHashTable_EssUintList[ess] = StaticGlobal.EssDataTable.Rows[i]["量和单位"].ToString();  //站点要素单位哈希表-需要在初始化了EssDataTable中进行初始化
                            StaticGlobal.mHashTable_EssIndexList[ess] = i;                                                       //获取索引
                            StaticGlobal.mHashTable_EssIsRealData[ess] = StaticGlobal.EssDataTable.Rows[i]["实时数据"].ToString(); //是否为实时数据，如果不是则不用显示
                        }
                        catch (Exception)
                        {
		
		                
                        }
                    
                    }
                }
                SystemLog.Write("加载配置成功\r\n");
            }
            catch (Exception e)
            {
                SystemLog.Write("\r\n加载配置错误：\r\n" + e.StackTrace + e.Message + "\r\n");              
            }       
        }


        //初始化实时数据字段配置，从sqlite3中读取
         public static DataTable GetRealDataEssConfig(string ConfigDbFileName)
        {
            SQLiteConnection SQLite_con;			//SQLite
            DataSet ds = new DataSet();

            try
	        {
                SQLite_con = new SQLiteConnection("Data Source=" + /*Server.MapPath("config.db")*/ConfigDbFileName);
		        SQLite_con.Open();

                //SELECT ess,name FROM "所有实时数据要素" ORDER BY id ASC;
                SQLiteDataAdapter command = new SQLiteDataAdapter("SELECT ess,name FROM \"实时数据列表要素并集\"  ORDER BY 'id' ASC;", SQLite_con);
		        command.Fill(ds, "ds");
		        return ds.Tables[0];

	        }
	        catch (Exception e)
	        {
                SystemLog.Write("从sqlite3初始化配置数据出错，"+e.Message);
                StaticGlobal.AddGlobalInitStatus(e.Message);    //写入初始化错误状态
                return null;
	        }
        }

        //要素字段总表，从sqlite3中读取
        //初始化要素总表
         public static DataTable GetDataEssConfig(string ConfigDbFileName)
        {
            SQLiteConnection SQLite_con;			//SQLite
            DataSet ds = new DataSet();

            try
            {
                SQLite_con = new SQLiteConnection("Data Source=" + /*Server.MapPath("config.db")*/ConfigDbFileName);
                SQLite_con.Open();

                SQLiteDataAdapter command = new SQLiteDataAdapter("SELECT * FROM \"要素标识符汇总表\" ORDER BY '序号' ASC;", SQLite_con);
                command.Fill(ds, "ds");
                return ds.Tables[0];

            }
            catch (Exception e)
            {
                SystemLog.Write("从sqlite3加载要素标识符汇总表出错，" + e.Message);
                StaticGlobal.AddGlobalInitStatus(e.Message);    //写入初始化错误状态
                return null;
            }
        }


        //加载用户菜单（HtmlDirectoryPath：目录路径）
        public static void Load_UserMenuHtml(string HtmlDirectoryPath)
        {
            string TextStr;
            
            //先加载普通用户的菜单
            try
            {
                TextStr = File.ReadAllText(HtmlDirectoryPath + "\\普通用户菜单.html");       //读取所有的文本并关闭文件
                if (TextStr == null || TextStr.Length < 10) StaticGlobal.SetNormalUserMenuHtml("菜单加载错误");
                else StaticGlobal.SetNormalUserMenuHtml(TextStr);
            }
            catch (IOException e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志
                StaticGlobal.SetNormalUserMenuHtml(e.Message);
            }
            //加载管理员用户菜单
            try
            {
                TextStr = File.ReadAllText(HtmlDirectoryPath + "\\管理员菜单.html");       //读取所有的文本并关闭文件
                if (TextStr == null || TextStr.Length < 10) StaticGlobal.SetAdminUserMenuHtml("菜单加载错误");
                else StaticGlobal.SetAdminUserMenuHtml(TextStr);
            }
            catch (IOException e)
            {
                SystemLog.Write(e.StackTrace + e.Message);  //日志
                StaticGlobal.SetAdminUserMenuHtml(e.Message);
            }
        }
        
    }
}
