GKE 編

cloudshell launch-tutorial tutorial.md

```bash
git clone https://github.com/GoogleCloudPlatform/gcp-getting-started-lab-jp.git
cd gcp-getting-started-lab-jp/fundamental/gke
```

----------
```bash
sudo gcloud components update kubectl
```

----------
```bash
export PROJECT_ID="$(gcloud config get-value project -q)"
```

```bash
gcloud config set project ${PROJECT_ID} 
gcloud config set compute/zone asia-northeast1-a
gcloud config set container/cluster cluster-1
```

```bash
gcloud container clusters get-credentials cluster-1
```

----------
```bash
mkdir helloNode
cd helloNode
```

----------
```bash
cloudshell edit server.js
```

----------
```bash
node server.js
```

----------
```bash
cloudshell edit Dockerfile 
```

----------
```bash
docker build -t asia.gcr.io/${PROJECT_ID}/hello-node:v1 .
```

----------
```bash
docker push asia.gcr.io/${PROJECT_ID}/hello-node:v1
gcloud container images list-tags asia.gcr.io/${PROJECT_ID}/hello-node
```

----------
```bash
docker images 
docker run -d -p 8080:8080 asia.gcr.io/${PROJECT_ID}/hello-node:v1 
curl localhost:8080
docker ps 
docker kill <container id> 
docker rm <container id> 
```

----------
```bash
gcloud config list core/project
```

----------
```bash
cloudshell edit hello-node-deployment.yaml
```

----------
```bash
kubectl apply -f hello-node-deployment.yaml
```

----------
```bash
kubectl get deployment
kubectl get pods -o wide
```

----------
```bash
kubectl create -f hello-node-service.yaml
kubectl get svc
```

----------
```bash
kubectl get svc
curl <EXTERNAL IP>:8080
```


----------
```bash
kubectl scale deployment/hello-node --replicas=3
kubectl get pods -o wide
```

----------
```bash
kubectl delete deployment/hello-node
kubectl delete svc/hello-node
```
