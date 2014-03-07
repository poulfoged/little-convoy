namespace LittleConvoy
{
    internal interface ILittleConvoyConfiguration
    {
        int StartPercent { get; }

        int NumberOfChunks { get; }
    }
}