using Microsoft.AspNetCore.Mvc;

namespace Org.OpenAPITools
{
    public class Helper
    {
        public static IActionResult Result(ControllerBase c, object data)
        {
            return data == null ? (IActionResult)c.NotFound() : new ObjectResult(data);
        }
    }
}
