using System.IO;
using System.Web;

namespace LittleConvoy.Transports
{
    internal interface ITransport
    {
        bool ShouldProcess(HttpContextBase httpContext, ILittleConvoyConfiguration configuration);
        void Send(Stream sourceStream, HttpContextBase httpContext, ILittleConvoyConfiguration configuration);
        Stream Recieve(HttpContextBase httpContext, ILittleConvoyConfiguration configuration);
    }
}