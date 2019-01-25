set url=https://0.0.0.0:3000/
docker build -t ng-substation-server .
echo curl http://0.0.0.0:3000
docker run -t -i -p 3000:3000 ng-substation-server

