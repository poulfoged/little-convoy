using System;
using System.IO;
using System.Text;
using System.Web;

namespace LittleConvoy.Transports.HiddenFrame
{
    internal class HiddenFrameTransport : ITransport
    {
        public bool ShouldProcess(HttpContextBase httpContext, ILittleConvoyConfiguration configuration)
        {
            return !string.IsNullOrWhiteSpace(httpContext.Request["_callid"]); 
        }

        public void Send(Stream sourceStream, HttpContextBase httpContext, ILittleConvoyConfiguration configuration)
        {
            httpContext.Response.BufferOutput = false;
            httpContext.Response.ContentType = "text/html";

            var callId = httpContext.Request["_callId"];

            if (string.IsNullOrEmpty(callId))
                throw new ApplicationException("callId must be part of request");

            int delay;
            var delayString = httpContext.Request["_delay"];
            int.TryParse(delayString, out delay);
            
            sourceStream.Position = 0;

            using (var readStream = sourceStream)
            using (var streamReader = new StreamReader(readStream))
            using (var writer = new StreamWriter(httpContext.Response.OutputStream))
            using (var htmlWriter = new ChunkedJavascriptHtmlWriter(writer))
                htmlWriter.WriteChunks(callId, streamReader.ReadToEnd(), configuration.NumberOfChunks, configuration.StartPercent, delay);
        }

        public Stream Recieve(HttpContextBase httpContext, ILittleConvoyConfiguration configuration)
        {
            var data = httpContext.Request["_json"];

            if (string.IsNullOrWhiteSpace(data))
                return new MemoryStream();

            var bytes = Encoding.UTF8.GetBytes(data);
            return new MemoryStream(bytes);
        }
    }
}
