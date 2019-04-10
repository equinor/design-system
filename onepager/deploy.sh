az account set --subscription "Omnia Application Workspace - Non-Production - 02"
az acr login --name edscontainers
docker build . -t eds-onepager
docker tag eds-onepager:latest edscontainers.azurecr.io/eds-onepager
docker push edscontainers.azurecr.io/eds-onepager
