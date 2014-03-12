using System;
using System.Linq;
using System.Web.Mvc;
using LittleConvoy.TestSite.Utilities;

namespace LittleConvoy.TestSite.Controllers
{
    public class DemoController : Controller
    {
        [LittleConvoyAction(StartPercent = 0)]
        public ActionResult Echo(object source)
        {
            return new JsonNetResult { Data = source, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        [LittleConvoyAction(StartPercent = 0)]
        public ActionResult Sample()
        {
            var data = Enumerable.Range(0, 10000).Select(p => new
                                                              {
                                                                  Name = Guid.NewGuid()
                                                              });

            return new JsonNetResult { Data = data, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
	}
}