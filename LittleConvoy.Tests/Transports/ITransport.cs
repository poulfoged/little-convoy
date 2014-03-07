using System.IO;
using System.Web;

namespace LittleConvoy.Transports
{
    internal interface ITransport
    {
        void Send(Stream sourceStream, HttpContextBase httpContext, ILittleConvoyConfiguration configuration);
    }
}