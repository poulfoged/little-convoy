using LittleConvoy.Extensions;
using NUnit.Framework;
using System;
using System.Linq;

namespace LittleConvoy.Tests.Extensions
{
    [TestFixture]
    public class StringExtensionsTests
    {
        [Test]
        public void Split_string_is_same_after_join()
        {
            //Arrange
            var source = string.Join("-", Enumerable.Range(0, 10).Select(d => Guid.NewGuid().ToString()));

            //Act
            var result = source.Split(7).ToList();

            //Assert
            var reJoined = string.Join("", result);
            Assert.That(reJoined, Is.EqualTo(source));
        }

        [Test]
        public void Less_than_one_char_per_chunkg_gives_larger_ending()
        {
            //Arrange
            var source = "123";

            //Act
            var result = source.Split(10).ToList();

            //Assert
            Assert.That(result[0], Is.EqualTo(""));
            Assert.That(result[9], Is.EqualTo("123"));
        }

        [Test]
        public void Non_equal_parts_gives_longer_rest()
        {
            //Arrange
            var source = "1234";

            //Act
            var result = source.Split(3).ToList();

            //Assert
            Assert.That(result[0], Is.EqualTo("1"));
            Assert.That(result[2], Is.EqualTo("34"));
        }
    }
}
