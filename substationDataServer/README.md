Public API for registered users to access the device data, production data on a device, bay or substation base.

Demo version for development.

Contains: 
- 3 substations, each with 2 bays and 3 devices in each bay.
- measurement types: power and VAr
- metering types: energy and a dummy
- each measurement on each device is a sinusoid between 0 and 100, frequency is related to device index 
- bay, substation and 'all' levels are aggregated

Run:
- Docker:
See src\Org.OpenAPITools\run-in-docker.cmd 
