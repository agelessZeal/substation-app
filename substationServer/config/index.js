let config = {
    mode: 'local',
    port: 3000,
    //port: 8081,
    graphProfileAPI: "https://graph.microsoft.com/v1.0/me",
    apiBaseURL:"https://192.168.2.103:8080/substation/v1",
    //apiBaseURL:"https://locahost:8082/substation/v1",
    ts_mode:'hms',//'utc'
};
module.exports = config;
