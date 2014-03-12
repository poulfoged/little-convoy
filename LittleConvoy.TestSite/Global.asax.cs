using System.Web.Mvc;
using System.Web.Routing;

namespace LittleConvoy.TestSite
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            RouteTable.Routes.MapRoute("Default", "{controller}/{action}", new {controller = "Demo", action = "Index"});
        }
    }
}
