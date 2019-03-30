using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DX_DataInterface.Controllers
{
    public class TestController : Controller
    {
        //
        // GET: /Debug/

        public ActionResult Test()
        {
            return View();
        }

        public string log()
        {
            return "系统启动成功\r\n";
        }

        public ActionResult MD5_Test()
        {
            return View();
        }

        public ActionResult RealTimeDataInterface_Test()
        {
            return View();
        }

        //
        // GET: /Debug/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Debug/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Debug/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Debug/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Debug/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Debug/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Debug/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
