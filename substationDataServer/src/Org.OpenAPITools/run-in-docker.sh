ip=$(docker-machine ip $(docker-machine active))
port=8079
url="https://$ip:$port/substation/v1/substations"
#create docker image
docker build -t api-gw-demo-aspnetcore .

if [ "$1" = "interactive" ]
then
	echo curl $url
	if [ "$OS" = "Windows_NT" ] 
	then
	start $url
	fi
	docker run -i --name api-gw-demo -p $port:8080 api-gw-demo-aspnetcore
	read -n1 -r -p "Press any key to terminate container..." key
	. cleanup.sh
else
	docker run -d --name api-gw-demo -p $port:8080 api-gw-demo-aspnetcore
fi
