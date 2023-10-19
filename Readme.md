# Skaffold.yaml

https://skaffold.dev
The skaffold.dev will help us run all services and it will detect changes in all files and rebuild the docker and deploy in k8s cluster
Command to run is "skaffold dev"

## Common dependencies in all services

npm i ../common_modules dotenv express mongoose chai chai-http mocha --save

For intsalling ingress-nginx , use the following command

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

#Access rabbitmq through http://localktzdev.com:15672/
