using DX_DataInterface.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Text;
using System.Web.Mvc;
using DataBaseClassLibrary;


namespace MVC01.Controllers
{
    public static class UserDataBase_SqlServer
    {
        const DATA_BASE_TYPE DataBaseSelect = DATA_BASE_TYPE.DATA_BASE_SQLSERVER;        //数据库选择
        private static DataBaseClassLibrary.DataBase mDataBase = new DataBaseClassLibrary.DataBase(DataBaseSelect, 60);


        /*************************************************************************************************************************
        * 功能			:	查询并返回适配器
        * 参数			:	DataSource：数据库路径；DataBase：库名；UserID：数据库用户名；Password：数据库密码；SqlString：执行的sql
        * 返回			:	是否设置成功
        * 依赖			:	底层宏定义
        * 作者			:	cp1300@139.com
        * 时间			:	2016-03-09
        * 最后修改时间 	: 	2016-03-09
        * 说明			:	2017-12-16：修改SqlConnection为空才建立连接，会提高连续查询效率
        *************************************************************************************************************************/
        public static System.Data.DataSet QueryAndRreturnAdapter(ref DataBaseConnection SqlConnection, string DataSource, string DataBase, string UserID, string Password, string SqlString, ref string pError)
        {
            try
            {
                if (SqlConnection == null) //只有没连接才重新建立连接
                {
                    SqlConnection = mDataBase.Connection(DataSource, 0, DataBase, UserID, Password, ref pError);  //连接数据库
                } 
                if (SqlConnection != null)
                {                                                                            //返回连接
                    return mDataBase.DataAdapter(SqlConnection, SqlString, ref pError);                                          //查询数据
                }
            }
            catch (Exception error)
            {
                pError = error.Message;
            }
            return null;
        }
        
        /*************************************************************************************************************************
       * 功能			:	查询并返回适配器
       * 参数			:	DataSource：数据库路径；DataBase：库名；UserID：数据库用户名；Password：数据库密码；SqlString：执行的sql
       * 返回			:	是否设置成功
       * 依赖			:	底层宏定义
       * 作者			:	cp1300@139.com
       * 时间			:	2016-03-09
       * 最后修改时间 	: 	2016-03-09
       * 说明			:	
       *************************************************************************************************************************/
        public static void Close(ref DataBaseConnection SqlConnection)
        {
            string pError = null;

            if (SqlConnection == null) return;

            try
            {
                mDataBase.Close(SqlConnection, ref pError);
                SqlConnection = null;   //清空
            }
            catch (Exception error)
            {
                return;
            }  
        }


        /*************************************************************************************************************************
       * 功能			:	执行一个非查询操作
       * 参数			:	DataSource：数据库路径；DataBase：库名；UserID：数据库用户名；Password：数据库密码；SqlString：执行的sql
       * 返回			:	状态
       * 依赖			:	底层宏定义
       * 作者			:	cp1300@139.com
       * 时间			:	2016-03-09
       * 最后修改时间 	: 	2017-12-16
       * 说明			:	
       *************************************************************************************************************************/
        public static int ExecuteNonQuery(ref DataBaseConnection SqlConnection, string DataSource, string DataBase, string UserID, string Password, string SqlString, ref string pError)
        {
            try
            {
                SqlConnection = mDataBase.Connection(DataSource, 0, DataBase, UserID, Password, ref pError);    //连接数据库
                if (SqlConnection != null)
                {                                                                                               //返回连接
                    return mDataBase.ExecuteNonQuery(SqlConnection, SqlString, ref pError);                       //查询数据
                }
            }
            catch (Exception error)
            {
                pError = error.Message;
            }
            return -1;
        }

    }
}