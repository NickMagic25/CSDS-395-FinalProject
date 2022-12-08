Docker Compose and Kubernetes functionality
Must have Docker installed for both

For best use case use Docker Compose

For both:
    build an image in root folder: "docker build .-t insta-jacked"
    build image in server/email_notifications: "docker build . -t ij-sendgrid"

For Docker Compose:
    install Docker compose for respective platform
    run "docker compose up" (v2) or "docker-compose up" (v1)
    connect to it through local machine
    no changes needed in code

For local kubernetes installation I recommend minikube:
    Make sure kubectl is installed
    Install minikube for platform
    run "minikube start"
    After it starts "cd /Compose-Kubernetes"
    Run "kubectl apply -f insta-jacked.yaml"
    Confirm its running with "kubectl get pod -o wide"
    Get URL from minikube "minikube service insta-jacked --url"
    Change url from localhost:5000 to first url in all client files
    Change mailAPIURL in db.js to second url in db.js
