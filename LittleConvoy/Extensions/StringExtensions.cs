using System;
using System.Collections.Generic;
using System.Linq;

namespace LittleConvoy.Extensions
{
    internal static class StringExtensions
    {
        public static IEnumerable<string> Split(this string source, int numberOfChunks)
        {
            if (source == null)
                throw new ArgumentNullException("source");

            if (numberOfChunks <= 0)
            {
                yield return source;
                yield break;
            }
            
            var partSize = source.Length / numberOfChunks;
            var parts = Enumerable.Range(0, numberOfChunks);

            foreach (var part in parts)

                if (part != parts.Last())
                    yield return source.Substring(part * partSize, partSize);
                else
                    yield return source.Substring(part * partSize, source.Length - ((partSize * numberOfChunks) - partSize));
        }
    }
}
