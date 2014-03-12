using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.UI;
using LittleConvoy.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace LittleConvoy.Transports.HiddenFrame
{
    internal class ChunkedJavascriptHtmlWriter : HtmlTextWriter
    {
        private JsonSerializer serialier = new JsonSerializer
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            StringEscapeHandling = StringEscapeHandling.EscapeHtml,
            Formatting = Formatting.None
        };

        public ChunkedJavascriptHtmlWriter(TextWriter writer) : base(writer, "")
        {
            NewLine = "";
        }

        public ChunkedJavascriptHtmlWriter(TextWriter writer, string tabString) : this(writer) { }

        public void WriteChunk(string chunk, int progress, int callId)
        {
            this
                .Begin(HtmlTextWriterTag.Script, "window.parent.postMessage(")
                    .Serialize(serialier,  new { CallId = callId, Progress = progress, Chunk = chunk })
                .End(", '*');")
                .NewLine();
            try
            {
                Flush();
            }
            catch (HttpException) { }
        }

        public void Header()
        {
            this.Out("<!DOCTYPE html>").NewLine()
                .Begin(HtmlTextWriterTag.Html).NewLine()
                .Begin(HtmlTextWriterTag.Head).NewLine()
                    .Attribute("charset", "utf-8")
                    .Full(HtmlTextWriterTag.Meta).NewLine()
                    .Full(HtmlTextWriterTag.Title, "LittleConvoy").NewLine()
                .End().NewLine()
                .Begin(HtmlTextWriterTag.Body).NewLine();
        }

        public void Footer()
        {
            this
                .End().NewLine()    //body
                .End().NewLine();   //html

        }

        public void WriteChunks(int callId, string content, int numberOfChunks, int startPercent, int delay = 0)
        {
            Header();
            if (string.IsNullOrWhiteSpace(content))
                WriteChunk(string.Empty, 100, callId);
           
            var parts = content
                            .Split(numberOfChunks)
                            .ToList();

            var iteration = 1;

            parts.ForEach(part =>
            {
                int progress;
                if (iteration == numberOfChunks)
                    progress = 100;
                else
                    progress = startPercent + (((100 - startPercent) / numberOfChunks) * iteration++);

                WriteChunk(part, progress, callId);

                Thread.Sleep(delay);
            });
            Footer();
        }
    }
}
