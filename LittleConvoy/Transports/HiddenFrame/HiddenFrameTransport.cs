using System.IO;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI;
using LittleConvoy.Extensions;

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
            //httpContext.Response.AddHeader("P3P", "CP=\"ALL DSP CURa ADMa DEVa TAIa OUR BUS IND UNI COM NAV INT\""); // make ie happy
            httpContext.Response.BufferOutput = false;
            httpContext.Response.ContentType = "text/html";

            int callId;

            if (!int.TryParse(httpContext.Request["_callId"], out callId))
                ShowError(httpContext, "Numeric _callId must be part of request");
            
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

        private void ShowError(HttpContextBase httpContext, string message)
        {
            var response = httpContext.Response;
            response.StatusCode = (int)HttpStatusCode.BadRequest;

            using (var writer = new HtmlTextWriter(response.Output))
            {
                writer
                    .Attribute(HtmlTextWriterAttribute.Style, "font-family:helvetica; padding:20px;")
                    .Begin(HtmlTextWriterTag.Div)
                    .Attribute(HtmlTextWriterAttribute.Src, "https://raw.github.com/poulfoged/little-convoy/master/graphics/LittleConvoy%20Logo.png")
                    .Attribute(HtmlTextWriterAttribute.Alt, "LittleConvoy")
                    .Full(HtmlTextWriterTag.Img)
                    .Full(HtmlTextWriterTag.H3, "This service should be called via a LittleConvoy-client.")
                    .Full(HtmlTextWriterTag.P, "The request did not succeed:")
                    .Attribute(HtmlTextWriterAttribute.Style, "background-color:#ddd;padding:10px")
                    .Full(HtmlTextWriterTag.Code, message)
                    .Begin(HtmlTextWriterTag.P, "See more at ")
                        .Attribute(HtmlTextWriterAttribute.Href, "https://github.com/poulfoged/little-convoy")
                        .Full(HtmlTextWriterTag.A, "GitHub")
                    .End(".");
            }
            response.End();
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
