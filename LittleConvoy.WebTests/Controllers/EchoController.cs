using LittleConvoy.WebTests.Utilities;
using System.Web.Mvc;

namespace LittleConvoy.WebTests.Controllers
{
    public class EchoController : Controller
    {
        [LittleConvoyAction(StartPercent = 50)]
        public ActionResult Index(object source)
        {
            return new JsonNetResult { Data = source, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
	}
}