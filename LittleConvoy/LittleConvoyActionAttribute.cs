using System;
using LittleConvoy.IO;
using LittleConvoy.Transports;
using LittleConvoy.Transports.HiddenFrame;
using System.Web.Mvc;

namespace LittleConvoy
{
    public class LittleConvoyActionAttribute : ActionFilterAttribute, ILittleConvoyConfiguration
    {
        private ITransport transport = new HiddenFrameTransport();
        private EventHandler<EventArgs> closeHandler;
        private int _numberOfChunks = 10;

        public LittleConvoyActionAttribute()
        {
            var binder = new ModelBinderProvider(transport, this);
            if (!ModelBinderProviders.BinderProviders.Contains(binder))
                ModelBinderProviders.BinderProviders.Add(binder);
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var context = filterContext.HttpContext;
            var originalHttpStream = context.Response.Filter;
            var replacementStream = new EventRaisingStream();


            closeHandler = (sender, args) =>
                           {
                               replacementStream.BeforeClose -= closeHandler;
                               
                               context.Response.Filter = originalHttpStream; // put back original stream
                               transport.Send(replacementStream, context, this);
                               //originalHttpStream.Close();
                           };

            replacementStream.BeforeClose += closeHandler;

            // replace with our new stream to intercept output
            context.Response.Filter = replacementStream;
        }

        public int StartPercent { get; set; }

        public int NumberOfChunks
        {
            get { return _numberOfChunks; }
            set
            {
                if (value <= 0 || value > 1000)
                    throw new ArgumentException("Must be between 0 and 1000", "value");

                _numberOfChunks = value;
            }
        }
    }
}
