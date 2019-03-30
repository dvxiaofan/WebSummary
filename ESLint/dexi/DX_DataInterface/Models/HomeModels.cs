using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DX_DataInterface.Models
{
    public class HomeModels
    {
    }

    public class LoginInfo
    {

        /// <summary>   
        /// 获取操作定义   
        /// </summary>   
        public string GetFun { get; set; }

        /// <summary>   
        /// 用户名   
        /// </summary>   
        public string UserName { get; set; }
        /// <summary>   
        /// 密码   
        /// </summary>   
        public string PasswordMD5 { get; set; }
        /// <summary>   
        /// 记住我？   
        /// </summary>   
        public bool RememberMe { get; set; }
    }


    
//单个报警要素数据定义
public class one_ess_alarm
{
	public int ALARM { get; set; }	//报警使能开关
	public double AH{ get; set; }	//报警上限
	public double AL{ get; set; }	//报警下限
};


//单站点报警配置
public class DEVICE_ALARM_CONFIG
{
	public one_ess_alarm Z;
	public one_ess_alarm ZB;
	public one_ess_alarm Q1;
	public one_ess_alarm Q2;
	public one_ess_alarm SBL1;
	public one_ess_alarm SBL2;
	public one_ess_alarm VT;

	//构造
	public DEVICE_ALARM_CONFIG()
	{
		Z = new one_ess_alarm();
		ZB = new one_ess_alarm();
		Q1 = new one_ess_alarm();
		Q2 = new one_ess_alarm();
		SBL1 = new one_ess_alarm();
		SBL2 = new one_ess_alarm();
        VT = new one_ess_alarm();
	}
};
}