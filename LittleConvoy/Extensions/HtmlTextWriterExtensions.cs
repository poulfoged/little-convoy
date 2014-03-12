using System;
using System.Web.UI;
using Newtonsoft.Json;

namespace LittleConvoy.Extensions
{
    public static class HtmlTextWriterExtensions
    {
        public static HtmlTextWriter Begin(this HtmlTextWriter writer, HtmlTextWriterTag tag, string content = "")
        {
            writer.RenderBeginTag(tag);
            writer.Write(content);
            return writer;
        }

        public static HtmlTextWriter End(this HtmlTextWriter writer, string content = "")
        {
            writer.Write(content);
            writer.RenderEndTag();
            return writer;
        }

        public static HtmlTextWriter Attribute(this HtmlTextWriter writer, string attribute, string content = "")
        {
            writer.AddAttribute(attribute, content);
            return writer;
        }

        public static HtmlTextWriter Attribute(this HtmlTextWriter writer, HtmlTextWriterAttribute attribute, string content = "")
        {
            writer.AddAttribute(attribute, content);
            return writer;
        }

        public static HtmlTextWriter Full(this HtmlTextWriter writer, HtmlTextWriterTag tag, string content = "")
        {
            writer.RenderBeginTag(tag);
            writer.Write(content);
            writer.RenderEndTag();
            return writer;
        }

        public static HtmlTextWriter Serialize(this HtmlTextWriter writer, JsonSerializer serializer, object source)
        {
            serializer.Serialize(writer, source);
            return writer;
        }

        public static HtmlTextWriter Out(this HtmlTextWriter writer, string content)
        {
            writer.Write(content);
            return writer;
        }

        public static HtmlTextWriter NewLine(this HtmlTextWriter writer)
        {
            writer.Write("\n");
            return writer;
        }
    }
}
