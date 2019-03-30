using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace DX_DataInterface.Models
{
    public static class SystemLog
    {
        public static bool Write(string pLogString)
	    {
		    System.DateTime dt = System.DateTime.Now;							//系统时间
		    string Dir = System.Web.Hosting.HostingEnvironment.MapPath("\\系统日志");

		    try
		    {
			    if (Directory.Exists(Dir) == false)	//文件夹如果不存在则创建
			    {
				    Directory.CreateDirectory(Dir);
			    }
		    }
		    catch (Exception e)
		    {

			    return  false;
		    }
		

		    try
		    {
			    File.AppendAllText(Dir + "\\" + dt.ToString("yyyy-MM-dd") + ".log", "\r\n" + dt.ToString("yyyy-MM-dd HH:mm:ss") + " \t" + pLogString);
		    }
		    catch (Exception e)
		    {
			    return false;
		    }
		    return true;
	    }
    }
}