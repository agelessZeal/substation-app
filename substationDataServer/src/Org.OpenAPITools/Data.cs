using Org.OpenAPITools.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Org.OpenAPITools
{
    public class Data
    {
        public static List<Substation> Substations = new List<Substation>();
        public static List<Bay> Bays = new List<Bay>();
        public static List<Device> Devices = new List<Device>();

        public static List<MeasurementType> MeasurementTypes = new List<MeasurementType>();
        public static List<MeasurementType> MeteringTypes = new List<MeasurementType>();

        static Data()
        {
            //device structure
            for (int si = 0; si < 3; si++)
            {
                Substation substation = new Substation() { Mrid = $"sub{si}", Description = $"Substation #{si}" };
                Substations.Add(substation);
                for (int bi = 0; bi < 2; bi++)
                {
                    Bay bay = new Bay() { Mrid = $"{substation.Mrid}_bay{bi}", Description = $"Bay #{bi} in {substation.Description}" };
                    Bays.Add(bay);
                    for (int di = 0; di < 3; di++)
                    {
                        Device device = new Device() { Mrid = $"{bay.Mrid}_device{di}", Description = $"Device #{di} in {bay.Description}" };
                        Devices.Add(device);
                    }
                }
            }
            //measurements 
            MeasurementTypes.Add(new MeasurementType() { Id = "power", Description = "Electric power", Multiplier = "1", Unit = "kW", Name = "power" });
            MeasurementTypes.Add(new MeasurementType() { Id = "VAR", Description = "VA reactive", Multiplier = "1", Unit = "VAr", Name = "VAR" });
            //meterings
            MeteringTypes.Add(new MeasurementType() { Id = "energy", Description = "Electric energy", Multiplier = "1", Unit = "kWh", Name = "energy" });
            MeteringTypes.Add(new MeasurementType() { Id = "metering1", Description = "metering1", Multiplier = "100", Unit = "unit1", Name = "metering1" });
        }

        public static decimal GetFloatAt(DateTime time, int version)
        {
            return (decimal)((1 + Math.Sin(2 * Math.PI * time.TimeOfDay.TotalMinutes / (60 * 24) * (version + 1))) * 50);
        }

        public static DateTime StartDate => DateTime.Now.Subtract(TimeSpan.FromDays(1));

        public static TimeSeries GetValues(string measurementId, string mrid, int? numberOf, TimeSpan? timespan, DateTime? fromDate, DateTime? toDate)
        {
            Device[] devices = Devices.Where(d => mrid == null || d.Mrid.StartsWith(mrid)).ToArray();
            DateTime d0 = fromDate.HasValue ? fromDate.Value : StartDate;
            DateTime d1 = toDate.HasValue ? toDate.Value : DateTime.Now;
            TimeSpan total = d1.Subtract(d0);
            int number = numberOf.HasValue ? numberOf.Value : (int)Math.Ceiling(total.Divide(timespan.Value));
            TimeSpan diff = total.Divide(number);
            TimeSeriesElement[] elements = new TimeSeriesElement[number];
            DateTime di = d0;
            for (int i = 0; i < elements.Length; i++, di += diff)
            {
                elements[i] = new TimeSeriesElement { Date = di, Value = 0 };
            }
            foreach (Device device in devices)
            {
                for (int i = 0; i < elements.Length; i++)
                {
                    elements[i].Value += GetFloatAt(elements[i].Date.Value, Devices.IndexOf(device));
                }
            }
            return new TimeSeries() { Data = new List<TimeSeriesElement>(elements), Typeid = measurementId };

        }

        public static TimeSeries Actual(string measurementId, string mrid)
        {
            //FIXME: return one-element timeseries
            DateTime d = DateTime.Now;
            return GetValues(measurementId, mrid, 1, null, d, d);
        }

        public static TimeSeries HistoricalMeasurement(string measurmeentId, string mrid, DateTime? fromDate, DateTime? toDate)
        {
            //FIXME: return multi-element timeseries
            return GetValues(measurmeentId, mrid, null, new TimeSpan(0, 15, 0), fromDate, toDate);
        }

        public static TimeSeries HistoricalMetering(string meteringId, string mrid, string numberOf, TimeSpan? timeSpan, DateTime? startDate, DateTime? endDate)
        {
            //FIXME: return multi-element timeseries
            Int32? number = Int32.TryParse(numberOf, out int n) ? n : (Int32?)null;
            return GetValues(meteringId, mrid, number, timeSpan.HasValue ? timeSpan.Value : (TimeSpan?)null, startDate, endDate);
        }

    }
}
