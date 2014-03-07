using System;
using System.IO;
using System.Text;

namespace LittleConvoy.IO
{
    internal class EventRaisingStream : MemoryStream
    {
        public event EventHandler<EventArgs> BeforeClose;

        protected virtual void OnBeforeClose()
        {
            var handler = BeforeClose;
            if (handler != null) handler(this, EventArgs.Empty);
        }

        public override void Close()
        {
            OnBeforeClose();
            base.Close();
        }
    }
}
