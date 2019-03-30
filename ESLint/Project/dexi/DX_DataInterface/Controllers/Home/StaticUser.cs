using MVC01.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace DX_DataInterface.Controllers.Home
{
    public static class StaticUser
    {
       //验证用户名是否合法，如果不合法返回说明字符串，如果合法返回null
        public static string CheckUserName(string UserName)
        {
            if (UserName == null) return "用户名不能为空！";
            if (UserName.Length < 3 || UserName.Length > 32)
            {
                return "用户名限制长度为3-32个字符！";
            }
            if (check_other_char(UserName) == true)
            {
                return "用户名含有非法字符！";
            }
 
            return null;    //合法的用户名
        }

        //验证密码是否合法，如果不合法返回说明字符串，如果合法返回null
        public static string CheckPassword(string Password, string PasswordMD5)
        {
            if (Password == null) return "密码不能为空！";
            if (PasswordMD5 == null) return "密码MD5为空，请重新刷新网页再试！";
            if (Password.Length < 6 || Password.Length > 16)
            {
                return "密码长度必须为6-16个字符！";
            }
            if (check_other_char(Password) == true)
            {
                return "密码中不能含有特殊字符！";
            }
            //对密码进行md5运算
            string md5 = EncryptWithMD5(Password); //计算密码MD5结果
            if(md5 != PasswordMD5)
            {
                return "密码MD5验证失败，请重新刷新网页再试！";
            }

            return null;    //合法的用户名
        }


        //检查昵称是否输入合法
        public static string CheckNickName(string NickName)
        {
            if (NickName == null) return "昵称不能为空！";
            if (NickName.Length < 2 || NickName.Length > 64)
            {
                return "昵称必须为2-64个字符！";
            }

            if (check_other_char(NickName) == true)
            {
                return "昵称中不能含有特殊字符！";
            }

            return null;    //合法的用户名
        }

        //检查电话格式
        public static string CheckPhone(string Phone)
        {
            if (Phone == null) return null;
            if (Phone.Length == 0) return null;
            if (Phone.Length < 6 || Phone.Length > 16)
            {
                return "电话号码必须为6-16个数字！";
            }
            if (check_other_phone_number(Phone) == true)
            {
                return "电话号码必须为数字！";
            }
            
            return null;    //合法的电话号码
        }


        //检查email，只检查长度
        public static string CheckEmali(string Emali)
        {
            if (Emali == null) return null;
            if (Emali.Length == 0) return null;
            if (Emali.Length < 6 || Emali.Length > 64)
            {
                return "Email必须为6-64个字符！";
            }

            return null;    //合法的电话号码
        }


        //检查公司信息，只检查长度
        public static string CheckCompany(string Company)
        {
            if (Company == null) return null;
            if (Company.Length == 0) return null;
            if (Company.Length > 64)
            {
                return "公司名称限制64个字符！";
            }

            return null;    //合法的电话号码
        }


        //检查备注，只检查长度
        public static string CheckRemarks(string Remarks)
        {
            if (Remarks == null) return null;
            if (Remarks.Length == 0) return null;
            if (Remarks.Length > 64)
            {
                return "备注限制64个字符！";
            }

            return null;    //合法的电话号码
        }


        //检查URL,防止有特殊字符
        public static string CheckURL(string URL)
        {
            if (URL == null) return null;
            if (URL.Length == 0) return null;
            if (URL.Length > 120)
            {
                return "备注限制120个字符！";
            }

            char[] arr = { ';', '>', '<',  '!', '\"', '\'', ' ' };
            if (URL.IndexOfAny(arr) > 0)
            {
                return "含有非法字符"; //含有非法字符
            }

            return null;    //合法的电话号码
        }


        //检查站点编号是否合法
        public static string CheckDeviceNumber(string str)
        {
            if (str == null || str.Length != 10) return "编号必须为10为数字！";
            if(check_other_phone_number(str)==true) return "编号必须为数字";
            return null;
        }

        //检查站点名称是否合法
        public static string CheckDeviceName(string str)
        {
            if (str == null) return "名称不能为空！";
            if (str.Length < 2 || str.Length > 64)
            {
                return "名称限制长度为2-64个字符！";
            }
            if (check_other_char(str) == true)
            {
                return "名称含有非法字符！";
            }

            return null;    //合法
        }


        //检查站点地址是否合法
        public static string CheckDeviceAddr(string str)
        {
            if (str == null) return "地址不能为空！";
            if (str.Length < 1 || str.Length > 64)
            {
                return "地址限制长度为1-64个字符！";
            }

            return null;    //合法
        }

        //检查设备SIM卡号
        public static string CheckDeviceSIM(string str)
        {
            if (str == null) return null;
            if (str.Length == 0) return null;
            if (str.Length < 6 || str.Length > 16)
            {
                return "SIM号码必须为6-16个数字！";
            }
            if (check_other_phone_number(str) == true) return "SIM号码必须为数字";
            return null;    //合法
        }

        //检查经度
        public static string CheckDeviceLong(double value)
        {
            if (value == null) return null;
            if (value < -180 || value > 180)
            {
                return "经度限制±180度！";
            }
            return null;    //合法
        }

        //检查维度
        public static string CheckDeviceLat(double value)
        {
            if (value == null) return null;
            if (value < -90 || value > 90)
            {
                return "纬度限制±90度！！";
            }
            return null;    //合法
        }



        public static string EncryptWithMD5(string source)
        {
            byte[] sor = Encoding.UTF8.GetBytes(source);
            MD5 md5 = MD5.Create();
            byte[] result = md5.ComputeHash(sor);
            StringBuilder strbul = new StringBuilder(40);
            for (int i = 0; i < result.Length; i++)
            {
                strbul.Append(result[i].ToString("x2"));//加密结果"x2"结果为32位,"x3"结果为48位,"x4"结果为64位

            }
            return strbul.ToString();
        }

       


         // 验证是否含有特殊字符(有：返回true;无：返回false)
        public static bool check_other_char(string str)
        {
            if(str == null) return false;
            char []arr = {'&', '\\', '/', '*', '>', '<', '-', '!', '\"', '\'', ' '};
            if (str.IndexOfAny(arr) > 0)
            {
                return true; //含有非法字符
            }
        
            return false;
        }

        //检查是否含有非数字字符,可以含有-(有：返回true;无：返回false)
        public static bool check_other_phone_number(string str)
        {
            char mChar;

            if(str == null) return false;
            for(int i = 0;i < str.Length; i++)
            {
                mChar = str[i];
                if ((mChar < '0' || mChar > '9') && (mChar!='-')) return true;
            }
            return false;
        }


        //检查分组名是否合法
        public static string CheckGroupName(string GroupName)
        {
            if (GroupName == null) return "分组名不能为空！";
            if (GroupName.Length < 2 || GroupName.Length > 64)
            {
                return "分组名必须为2-64个字符！";
            }

            if (check_other_char(GroupName) == true)
            {
                return "分组名中不能含有特殊字符！";
            }

            return null;    //合法的分组名
        }


    }



}
