docker build . -t eds-onepager
docker tag eds-onepager:latest edscontainers.azurecr.io/eds-onepager
docker push edscontainers.azurecr.io/eds-onepager