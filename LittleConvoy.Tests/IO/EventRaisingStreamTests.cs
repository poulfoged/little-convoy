using System.IO;
using LittleConvoy.IO;
using NUnit.Framework;

namespace LittleConvoy.Tests.IO
{
    [TestFixture]
    public class EventRaisingStreamTests
    {
        [Test]
        public void Will_raise_event()
        {
            //Arrange
            bool wasCalled = false;

            //Act
            using (var stream = new EventRaisingStream())
            using (var writer = new StreamWriter(stream))
            {
                stream.BeforeClose += (sender, args) => wasCalled = true;
                writer.Write("this is a test");
            }

            //Assert
            Assert.That(wasCalled);
        }
    }
}
