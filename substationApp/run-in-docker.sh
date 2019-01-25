set url=https://0.0.0.0:4200/
docker build -t ng-substation-app .
echo curl https://0.0.0.0:4200
docker run -t -i -p 4200:4200 ng-substation-app

