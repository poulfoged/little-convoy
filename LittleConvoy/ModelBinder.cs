using System;
using System.IO;
using System.Web;
using System.Web.Mvc;
using LittleConvoy.Transports;
using Newtonsoft.Json;

namespace LittleConvoy
{
    internal class ModelBinder : IModelBinder
    {
        private readonly ITransport transport;
        private readonly ILittleConvoyConfiguration configuration;

        public ModelBinder(ITransport transport, ILittleConvoyConfiguration configuration)
        {
            this.transport = transport;
            this.configuration = configuration;
        }

        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var defaultBound = new Func<object>(() => new DefaultModelBinder().BindModel(controllerContext, bindingContext));

            if (HttpContext.Current == null)
                return defaultBound();

            using (var stream = transport.Recieve(controllerContext.HttpContext, configuration))
            using (var textReader = new StreamReader(stream))
            using (var reader = new JsonTextReader(textReader))
                return JsonSerializer.Create().Deserialize(reader, bindingContext.ModelType);
        }
    }
}