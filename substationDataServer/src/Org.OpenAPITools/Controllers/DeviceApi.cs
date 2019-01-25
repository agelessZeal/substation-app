/*
 * Public Substation API for the Smart Service Intelligent Autonomous Grid
 *
 * Public API for registered users to access the device data, production data on a device, bay or substation base.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: istvan.mudrak@smartservice.energy
 * Generated by: https://openapi-generator.tech
 */

using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.SwaggerGen;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using Org.OpenAPITools.Attributes;
using Org.OpenAPITools.Models;
using System.Linq;

namespace Org.OpenAPITools.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class DeviceApiController : ControllerBase
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="clientId">Id of client</param>
        /// <response code="200">List of all device owned by a client</response>
        /// <response code="0">Invalid status</response>
        [HttpGet]
        [Route("/substation/v1/devices")]
        [ValidateModelState]
        [SwaggerOperation("FindDeviceAll")]
        [SwaggerResponse(statusCode: 200, type: typeof(List<Device>), description: "List of all device owned by a client")]
        [SwaggerResponse(statusCode: 0, type: typeof(Error), description: "Invalid status")]
        public virtual IActionResult FindDeviceAll([FromQuery]string clientId)
        {
            return Helper.Result(this, Data.Devices.Select(d => d.Mrid));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="bayId">Id of a given bay</param>
        /// <param name="clientId">Id of client</param>
        /// <response code="200">All device data idetified by {bayId}</response>
        /// <response code="0">Invalid status</response>
        [HttpGet]
        [Route("/substation/v1/bays/{bayId}/devices")]
        [ValidateModelState]
        [SwaggerOperation("FindDeviceByBayId")]
        [SwaggerResponse(statusCode: 200, type: typeof(List<Device>), description: "All device data idetified by {bayId}")]
        [SwaggerResponse(statusCode: 0, type: typeof(Error), description: "Invalid status")]
        public virtual IActionResult FindDeviceByBayId([FromRoute][Required]string bayId, [FromQuery]string clientId)
        {
            return Helper.Result(this, Data.Devices.Where(d => d.Mrid.StartsWith(bayId)).Select(d => d.Mrid));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="deviceId">Id of a given device</param>
        /// <param name="clientId">Id of client</param>
        /// <response code="200">Device data idetified by {deviceId}</response>
        /// <response code="0">Invalid status</response>
        [HttpGet]
        [Route("/substation/v1/devices/{deviceId}")]
        [ValidateModelState]
        [SwaggerOperation("FindDeviceByDeviceId")]
        [SwaggerResponse(statusCode: 200, type: typeof(Device), description: "Device data idetified by {deviceId}")]
        [SwaggerResponse(statusCode: 0, type: typeof(Error), description: "Invalid status")]
        public virtual IActionResult FindDeviceByDeviceId([FromRoute][Required]string deviceId, [FromQuery]string clientId)
        {
            return Helper.Result(this, Data.Devices.FirstOrDefault(d => d.Mrid == deviceId));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="substationId">Id of a given substation</param>
        /// <param name="clientId">Id of client</param>
        /// <response code="200">All device data idetified by {substationId}</response>
        /// <response code="0">Invalid status</response>
        [HttpGet]
        [Route("/substation/v1/substations/{substationId}/devices")]
        [ValidateModelState]
        [SwaggerOperation("FindDeviceBySubstationId")]
        [SwaggerResponse(statusCode: 200, type: typeof(List<Device>), description: "All device data idetified by {substationId}")]
        [SwaggerResponse(statusCode: 0, type: typeof(Error), description: "Invalid status")]
        public virtual IActionResult FindDeviceBySubstationId([FromRoute][Required]string substationId, [FromQuery]string clientId)
        {
            return Helper.Result(this, Data.Devices.Where(d => d.Mrid.StartsWith(substationId)).Select(d => d.Mrid));
        }
    }
}
