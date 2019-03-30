using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace DX_DataInterface.Models
{
    public static class  StaticGlobal
    {
        public static ArrayList mGlobalInitStatus = new ArrayList();            //用于存放全局错误状信息，主要存放初始化错误信息
        public static DataTable RealEssDataTable = null;                        //实时数据要素定义
        public static DataTable EssDataTable = null;                            //数据要素总表
        public static string SuperAdminName = "system";                         //超级管理员用户名
        public static string SuperAdminPassword = "system123456";               //超级管理员密码
        public static Hashtable mHashTable_EssNameList = new Hashtable();       //站点要素名哈希总表-需要在初始化了EssDataTable中进行初始化
        public static Hashtable mHashTable_EssUintList = new Hashtable();       //站点要素单位哈希总表-需要在初始化了EssDataTable中进行初始化
        public static Hashtable mHashTable_EssIndexList = new Hashtable();      //站点要素索引偏移总表-需要在初始化了EssDataTable中进行初始化
        public static Hashtable mHashTable_EssIsRealData = new Hashtable();      //站点要素是否为实时数据-需要在初始化了EssDataTable中进行初始化
        public static Hashtable mHashTable_DbConfig = new Hashtable();          //数据库配置相关Hashtable
        private static string g_NormalUserMenuHtml = null;                      //普通用户菜单
        private static string g_AdminUserMenuHtml = null;                       //管理员用户菜单
        private static string g_DataDbSelect = "MYSQL";                         //存放数据的数据库选择可以是 MYSQL或SQLSERVER

        //获取当前使用的历史数据库类型
        public static string GetDataDbSelect()
        {
            return g_DataDbSelect;
        }

        //设置当前使用的历史数据库类型
        public static void SetDataDbSelect(String DbSelect)
        {

            g_DataDbSelect = DbSelect;
        }


        //存储普通用户的html菜单
        public static void SetNormalUserMenuHtml(string TtmlString)
        {
            StaticGlobal.g_NormalUserMenuHtml = TtmlString;
        }

        //获取普通用户的html菜单
        public static string GetNormalUserMenuHtml()
        {
            return StaticGlobal.g_NormalUserMenuHtml;
        }

        //存储管理员用户的html菜单
        public static void SetAdminUserMenuHtml(string TtmlString)
        {
            StaticGlobal.g_AdminUserMenuHtml = TtmlString;
        }

        //获取管理员用户的html菜单
        public static string GetAdminUserMenuHtml()
        {
            return StaticGlobal.g_AdminUserMenuHtml;
        }

        //获取数据库配置
        public static Hashtable GetDbConfig()
        {
            return StaticGlobal.mHashTable_DbConfig;        //从全局静态类进行返回数据
        }

        //获取实时数据要素定义
        public static DataTable GetRealEssDataTable()
        {
            return StaticGlobal.RealEssDataTable;           //从全局静态类进行返回数据
        }


        //获取要素总表
        public static DataTable GetEssDataTable()
        {
            return StaticGlobal.EssDataTable;               //从全局静态类进行返回数据
        }

        //获取要素的名称
        public static string GetEssName(string ess)
        {
            string Ess_Name;

            try
            {
                Ess_Name = mHashTable_EssNameList[ess].ToString();
                if(Ess_Name==null) return "未知要素";
                return Ess_Name;
            }
            catch (Exception)
            {
                return "未知要素";
            }           
        }

        //获取要素的单位
        public static string GetEssUint(string ess)
        {
            string Ess_Uint;

            try
            {
                Ess_Uint = mHashTable_EssUintList[ess].ToString();
                if (Ess_Uint == null) return "";
                return Ess_Uint;
            }
            catch (Exception)
            {
                return "";
            }
        }

        //获取要素的索引，用于按照指定顺序显示
        public static int GetEssIndex(string ess)
        {
            int index;

            try
            {

                index = int.Parse(mHashTable_EssIndexList[ess].ToString());
                return index;
            }
            catch (Exception)
            {
                return -1;
            }
        }
        //添加全局错误信息
        public static void AddGlobalInitStatus(string str)
        {
            mGlobalInitStatus.Add(str);
        }

        //清除全局错误信息
        public static void ClearGlobalInitStatus()
        {
            mGlobalInitStatus.Clear();
        }
        //获取全局错误信息
        public static ArrayList GetGlobalInitStatus()
        {
            return mGlobalInitStatus;
        }

    }
} 