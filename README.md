<img src="https://raw.github.com/poulfoged/little-convoy/master/graphics/LittleConvoy%20Logo.png" />

*Drop-in replacement for your existing JsonP requests that provides progression callbacks.*

Introduction
------------
When performing cross-server JSONP requests today, there is little feedback on progress, timeouts and other errors.
Also there is limits to the amount of data that can be send when it all has to be packed into the request querystring.

This library provides server requests via real posts to a hidden frame and uses HTTP/1.1 chunked transfer encoding to
provide progression events duing send.

Requirements
------------
* .NET 4.0+ (reporting via HTTP available via `LittleConvoyActionAttribute` class)
* ASP.NET MVC 3+

How To Use
----------
**First**, specify LittleConvoy as a dependency:

PM> Install-Package LittleConvoy

**Second**, take your exiting JSON emitting controller methods and decorate them with this attribute:

```csharp
using LittleConvoy.TestSite.Utilities;

namespace LittleConvoy.TestSite.Controllers
{
  public class DemoController : Controller
  {
    [LittleConvoyAction(StartPercent = 0)]
    public ActionResult Echo(object source)
    {
      return new JsonNetResult {Data = source, JsonRequestBehavior = JsonRequestBehavior.AllowGet};
    }
  }
}
```

After that add the client to your project (included in the package) via require or by including build/client.js
and calling it from JavaScript:

```javascript
new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://littleconvoy.devchamp.com/demo/echo', delay: 0 }, { Hello: 'World'})
  .progressed(function (progress) {
      console.log('Progress from server: ' + progress + '%');
    })
    .then(function (data) {
      console.log('Done, recieved data: ' + data)
   })
    .catch(function (message) {
      return alert('unable to contact server:\n' + message);
    });
```

The string 'HiddenFrame' is the selected transport, only HiddenFrame is available for now.

Note that the default number of progression callbacks is 10. Hello world is the data that is send to the server. 

POST/GET method can be specified, default is POST.

The Library contains a small Promise library which can easy be converted to the promise lib of your choice. The dealy parameter can be used for 
debugging purposes, adding a number of milliseconds on the server side for each request.

Known limitations
-----------------
* Only works in Internet Explorer 10+ for now, 8 & 9 is work in progress.
* There is a ~600 bytes overhead compared to classic JSONP reqquests 