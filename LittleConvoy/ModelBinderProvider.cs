using System;
using System.Web;
using System.Web.Mvc;
using LittleConvoy.Transports;

namespace LittleConvoy
{
    internal class ModelBinderProvider : IModelBinderProvider
    {
        private readonly ITransport transport;
        private readonly ILittleConvoyConfiguration configuration;

        public ModelBinderProvider(ITransport transport, ILittleConvoyConfiguration configuration)
        {
            this.transport = transport;
            this.configuration = configuration;
        }

        public IModelBinder GetBinder(Type modelType)
        {
            if (HttpContext.Current == null)
                return null;

            if (transport.ShouldProcess(new HttpContextWrapper(HttpContext.Current), configuration))
                return new ModelBinder(transport, configuration);

            return null;
        }
    }
}