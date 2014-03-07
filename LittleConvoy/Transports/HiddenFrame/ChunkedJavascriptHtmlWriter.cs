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

        public ChunkedJavascriptHtmlWriter(TextWriter writer) : base(writer) { }
        public ChunkedJavascriptHtmlWriter(TextWriter writer, string tabString) : base(writer, tabString) { }

        public void WriteChunk(string chunk, int progress, string callId)
        {
            RenderBeginTag(HtmlTextWriterTag.Script);
            Write("window.parent.postMessage(");
            serialier.Serialize(this, new { CallId = callId, Progress = progress, Chunk = chunk });
            Write(", '*');");
            RenderEndTag();
            Write(NewLine);
           
            try
            {
                Flush();
            }
            catch (HttpException) { }
        }

        public void Header()
        {
            WriteLine("<!DOCTYPE html>");
            RenderBeginTag(HtmlTextWriterTag.Html);
            RenderBeginTag(HtmlTextWriterTag.Head);
            AddAttribute("charset", "utf-8");
            RenderFullTag(HtmlTextWriterTag.Meta);
            RenderBeginTag(HtmlTextWriterTag.Title);
            WriteLine("this is iframe");
            RenderEndTag(); //title
            RenderEndTag(); //head
            RenderBeginTag(HtmlTextWriterTag.Body);
        }

        private void RenderFullTag(HtmlTextWriterTag tag)
        {
            RenderBeginTag(tag);
            RenderEndTag();
        }

        public void Footer()
        {
            RenderEndTag(); //body
            RenderEndTag(); //html
        }

        public void WriteChunks(string callId, string content, int numberOfChunks, int startPercent, int delay = 0)
        {
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
        }
    }
}
