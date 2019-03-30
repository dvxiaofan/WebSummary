using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DX_DataInterface.Models
{


    //数据查询模型
    public class RequestModelType
    {
        public string GetFun { get; set; }          //功能码
        public string ST_List { get; set; }         //需要查询的设备站点编号列表（仅仅用于实时数据查询）
        public string ST { get; set; }              //需要查询的设备站点编号
        public string StartTime { get; set; }       //开始时间
        public string EndTime { get; set; }         //结束时间
        public UInt32 StartIndex { get; set; }      //数据开始索引
        public UInt32 ReadCnt { get; set; }         //一次查询数据数量
        public bool isASC { get; set; }             //是否为顺序查询
        //用户信息相关
        public string USER { get; set; }        //用户id
        public string NICK_NAME { get; set; }   //用户昵称
        public string COMPANY { get; set; }     //用户公司信息
        public string EMAIL { get; set; }        //用户邮箱
        public string TEL { get; set; }          //用户电话
        public string PASSWORD { get; set; }     //用户密码
        public string REMARKS { get; set; }     //备注
        public string PASSWORD_MD5 { get; set; }     //用户密码MD5值
        public int ROLE { get; set; }            //用户权限
        public string Ess_List { get; set; }    //当前选择的要素列表
        //设备信息相关
        public string NAME { get; set; }        //设备名称
        public string ADDRESS { get; set; }     //设备地址
        public double LONG { get; set; }         //经度
        public double LAT { get; set; }          //纬度
        public string REAL_ESS { get; set; }      //要素列表
        //分组
        public string GROUP { get; set; }        //用户分组
        //用户列表
        public string User_List { get; set; }    //用户列表
        //主键列表
        public string SERIAL_List{ get; set; }              //查询数据用的主键列表
         //单个主键
        public UInt32 SERIAL { get; set; }  
        //需要解除绑定的ST列表
        public string DST_List{ get; set; }              //解除绑定的设备列表-用于从分组中解除某些设备的绑定
        //报警配置
        public int A_ENABLE { get; set; }       //报警总开关
        public int A_INTERVAL { get; set; }       //报警间隔，单位分钟
        public string A_CONFIG { get; set; }       //报警配置json
        //视频地址
        public string URL { get; set; }            //URL
        public string H5URL { get; set; }        //H5URL
        //详细信息
        public string DETAILS { get; set; }       //详细信息
        //数据列表
        public string Data_List { get; set; }       //数据列表
        //数据采集时间
        public string TT { get; set; }              //数据采集时间

    }

    //历史数据查询数据模型
    public class RequestHistData
    {
        public string GetFun { get; set; }      //功能标识
        public string TelNumber { get; set; }   //当前选择的设备编号
        public string StartTime { get; set; }   //开始时间
        public string EndTime { get; set; }     //结束时间
        public int StartIndex { get; set; }     //开始获取的索引
        public int DataCnt { get; set; }     //要获取的数据条数
    }


    //用户列表查询数据模型
    public class RequestUserList
    { 
        public string GetFun { get; set; }      //功能标识
        public int StartIndex { get; set; }     //开始获取的索引
        public int DataCnt { get; set; }        //要获取的数据条数
        public string TelNumber { get; set; }    //站点编号
        public string EssList { get; set; }    //要素列表
    }

    //站点操作数据模型
    public class RequestSetTelModels
    {
        public string GetFun { get; set; }      //功能标识
        public string TelNumber { get; set; }   //设备编号
        public string TelName { get; set; }     //设备名称
    }


}