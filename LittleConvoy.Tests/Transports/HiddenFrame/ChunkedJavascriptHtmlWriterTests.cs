using System.IO;
using System.Text;
using LittleConvoy.Transports.HiddenFrame;
using NUnit.Framework;

namespace LittleConvoy.Tests.Transports.HiddenFrame
{
    [TestFixture]
    public class ChunkedJavascriptHtmlWriterTests
    {
        [Test]
        public void Can_write_chunk()
        {
            //Arrange
            var builder = new StringBuilder();

            //Act
            using (var stringWriter = new StringWriter(builder))
            using (var writer = new ChunkedJavascriptHtmlWriter(stringWriter))
                writer.WriteChunk("test", 10, 123);
            
            //Assert
            StringAssert.Contains("test", builder.ToString());
        }

        [Test]
        public void Can_write_header()
        {
            //Arrange
            var builder = new StringBuilder();

            //Act
            using (var stringWriter = new StringWriter(builder))
            using (var writer = new ChunkedJavascriptHtmlWriter(stringWriter))
                writer.Header();

            //Assert
            StringAssert.Contains("body", builder.ToString());
        }

        [Test]
        public void Can_write_header_footer()
        {
            //Arrange
            var builder = new StringBuilder();

            //Act
            using (var stringWriter = new StringWriter(builder))
            using (var writer = new ChunkedJavascriptHtmlWriter(stringWriter))
            {
                writer.Header();
                writer.Footer();
            }
            
            //Assert
            StringAssert.Contains("</html>", builder.ToString());
        }

        [Test]
        public void Will_hit_percentage_of_all_chunks()
        {
            //Arrange
            var builder = new StringBuilder();

            //Act
            using (var stringWriter = new StringWriter(builder))
            using (var writer = new ChunkedJavascriptHtmlWriter(stringWriter))
            {
                writer.WriteChunks(123, "this is a test", 3, 70);
            }

            //Assert
            StringAssert.Contains("80", builder.ToString());
            StringAssert.Contains("90", builder.ToString());
            StringAssert.Contains("100", builder.ToString());
        }

    }
}
