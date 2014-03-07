using System.Web.Mvc;
using System.Web.Routing;
using LittleConvoy.WebTests.App_Start;

namespace LittleConvoy.WebTests
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }

        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            //filters.Add(new LittleConvoyActionAttribute());
        }

    }
}
