using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DX_DataInterface.Models
{
    public class DataApiModels
    {
    }

    //获取一个用户所有设备列表模型
    public class GetUserTelListModels
    {

        /// <summary>   
        /// 操作码
        /// </summary>   
        public string Operation { get; set; }

        /// <summary>   
        /// 用户名   
        /// </summary>   
        public string UserName { get; set; }
        /// <summary>   
        /// 密码   
        /// </summary>   
        public string PasswordMD5 { get; set; }
    }
}